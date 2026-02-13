/**
 * Convert all images in a Google Drive folder to WebP and save locally.
 * (Service accounts cannot upload to a user's "My Drive" - so we save to a folder
 *  and you upload that folder to Drive yourself.)
 *
 * Setup:
 * 1. Service account + JSON key in scripts/service-account.json
 * 2. Share the SOURCE folder with the service account email as "Editor"
 * 3. .env: GOOGLE_DRIVE_SOURCE_FOLDER_ID, optionally GOOGLE_DRIVE_WEBP_FOLDER_ID (for the reminder link)
 *
 * Run: node scripts/convert-to-webp.js
 * Then upload the webp-output/ folder contents to your WebP folder in Drive.
 */

import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import sharp from 'sharp'
import heicConvert from 'heic-convert'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config({ path: path.join(__dirname, '..', '.env') })

const SOURCE_FOLDER_ID = process.env.GOOGLE_DRIVE_SOURCE_FOLDER_ID || '17eY5Le85RMmUbwH9rWKiC8LDYiVz3bpI'
const WEBP_FOLDER_ID = process.env.GOOGLE_DRIVE_WEBP_FOLDER_ID
const CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, 'service-account.json')
const OUTPUT_DIR = path.join(__dirname, '..', process.env.WEBP_OUTPUT_DIR || 'webp-output')

if (!fs.existsSync(CREDENTIALS_PATH)) {
  console.error('❌ Service account key not found at:', CREDENTIALS_PATH)
  console.error('')
  console.error('   Do this:')
  console.error('   1. Open https://console.cloud.google.com/ → your project')
  console.error('   2. APIs & Services → Credentials → Create credentials → Service account')
  console.error('   3. Name it (e.g. "Drive WebP") → Create → Done')
  console.error('   4. Click the new service account → Keys → Add key → Create new key → JSON → Download')
  console.error('   5. Save the downloaded JSON as: scripts/service-account.json')
  console.error('      (Or save elsewhere and set GOOGLE_APPLICATION_CREDENTIALS in .env to its path)')
  console.error('   6. Share BOTH Drive folders with the service account email as Editor')
  console.error('')
  process.exit(1)
}

const auth = new google.auth.GoogleAuth({
  keyFile: CREDENTIALS_PATH,
  scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file']
})

const drive = google.drive({ version: 'v3', auth })

function isHeic(name, mimeType) {
  const n = (name || '').toLowerCase()
  const m = (mimeType || '').toLowerCase()
  return n.endsWith('.heic') || n.endsWith('.heif') || m.includes('heic') || m.includes('heif')
}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
    stream.on('error', reject)
  })
}

async function downloadFile(fileId) {
  const res = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' }
  )
  return streamToBuffer(res.data)
}

async function convertToWebP(buffer, isHeicFile) {
  let inputBuffer = buffer
  if (isHeicFile) {
    try {
      const converted = await heicConvert({ buffer, format: 'JPEG', quality: 0.9 })
      inputBuffer = Buffer.isBuffer(converted) ? converted : Buffer.from(converted)
    } catch (err) {
      console.warn('  heic-convert failed:', err.message)
      throw err
    }
  }
  return sharp(inputBuffer)
    .webp({ quality: 85 })
    .toBuffer()
}

function saveWebPLocally(buffer, baseName) {
  const fileName = baseName.replace(/\.[^.]+$/, '') + '.webp'
  const filePath = path.join(OUTPUT_DIR, fileName)
  fs.writeFileSync(filePath, buffer)
  return filePath
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  console.log('📂 Source folder (Drive):', SOURCE_FOLDER_ID)
  console.log('📂 Saving WebP files to:', OUTPUT_DIR)
  console.log('')

  let pageToken = null
  let total = 0
  let converted = 0

  do {
    const res = await drive.files.list({
      q: `'${SOURCE_FOLDER_ID}' in parents and (mimeType contains 'image/' or name contains '.heic' or name contains '.HEIC')`,
      fields: 'nextPageToken, files(id, name, mimeType, createdTime)',
      pageSize: 100,
      pageToken
    })

    const files = res.data.files || []
    total += files.length

    for (const file of files) {
      const ext = path.extname(file.name).toLowerCase()
      const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif']
      if (!imageExts.includes(ext) && !file.mimeType?.startsWith('image/')) continue

      try {
        console.log('  Downloading:', file.name)
        const buffer = await downloadFile(file.id)
        const heicFile = isHeic(file.name, file.mimeType)
        console.log('  Converting to WebP...')
        const webpBuffer = await convertToWebP(buffer, heicFile)
        saveWebPLocally(webpBuffer, file.name)
        converted++
        console.log('  ✅', file.name, '->', file.name.replace(/\.[^.]+$/, '') + '.webp')
      } catch (err) {
        console.error('  ❌', file.name, err.message)
      }
    }

    pageToken = res.data.nextPageToken
  } while (pageToken)

  console.log('')
  console.log('✅ Done. Converted', converted, 'of', total, 'images to WebP.')
  console.log('')
  console.log('Next steps:')
  console.log('  1. Upload the contents of', path.basename(OUTPUT_DIR) + '/', 'to your WebP folder in Google Drive')
  if (WEBP_FOLDER_ID) {
    console.log('     → https://drive.google.com/drive/folders/' + WEBP_FOLDER_ID)
    console.log('  2. Set VITE_GOOGLE_DRIVE_FOLDER_ID in .env to', WEBP_FOLDER_ID)
  } else {
    console.log('  2. Set VITE_GOOGLE_DRIVE_FOLDER_ID in .env to your WebP folder ID')
  }
  console.log('')
}

main().catch((err) => {
  const msg = err?.cause?.message || err?.message || ''
  if (msg.includes('Drive API') && (msg.includes('disabled') || msg.includes('has not been used'))) {
    console.error('')
    console.error('❌ Google Drive API is not enabled for the project used by your service account.')
    console.error('')
    console.error('   Fix: Open this link and click "Enable":')
    const match = msg.match(/https:\/\/[^\s]+/)
    if (match) {
      console.error('   ' + match[0])
    } else {
      console.error('   https://console.cloud.google.com/apis/library/drive.googleapis.com')
    }
    console.error('')
    console.error('   (Use the same Google Cloud project where you created the service account.)')
    console.error('')
  } else {
    console.error(err)
  }
  process.exit(1)
})
