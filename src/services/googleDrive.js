// Google Drive API service
// Note: You'll need to set up a Google Cloud project and enable Drive API
// Get API key from: https://console.cloud.google.com/

import { getCachedPhotos, cachePhotos, getCacheInfo } from './imageCache'

// Folder the slideshow reads from (should be the WebP-only folder after running convert-to-webp script)
const GOOGLE_DRIVE_FOLDER_ID = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID || '17eY5Le85RMmUbwH9rWKiC8LDYiVz3bpI'
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || 'YOUR_API_KEY_HERE'

// Fetch photos from Google Drive folder with caching
export async function fetchPhotosFromDrive(forceRefresh = false) {
  try {
    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cacheInfo = getCacheInfo()
      console.log('📦 Cache info:', cacheInfo)
      
      const cachedPhotos = getCachedPhotos()
      if (cachedPhotos && cachedPhotos.length > 0) {
        console.log('📦 Using cached photos:', cachedPhotos.length)
        return cachedPhotos
      }
    } else {
      console.log('🔄 Force refresh - skipping cache')
    }
    
    // Check if API key is configured
    if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'YOUR_API_KEY_HERE') {
      console.error('❌ Google Drive API key not configured!')
      console.error('Please create a .env file with: VITE_GOOGLE_API_KEY=your_api_key')
      return []
    }

    // Fetch all files with pagination support
    let allFiles = []
    let nextPageToken = null
    let pageCount = 0
    
    console.log('🔍 Fetching photos from Google Drive...')
    
    do {
      // Build URL with pagination
      let folderUrl = `https://www.googleapis.com/drive/v3/files?q='${GOOGLE_DRIVE_FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name,thumbnailLink,webViewLink,createdTime,mimeType),nextPageToken&pageSize=100&key=${GOOGLE_API_KEY}`
      
      if (nextPageToken) {
        folderUrl += `&pageToken=${nextPageToken}`
      }
      
      const response = await fetch(folderUrl)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ Google Drive API Error:', response.status, errorData)
        
        if (response.status === 403) {
          console.error('⚠️ API key might be invalid or Drive API not enabled')
        } else if (response.status === 404) {
          console.error('⚠️ Folder not found or not accessible')
        }
        
        throw new Error(`Failed to fetch photos: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      pageCount++
      
      if (data.files && data.files.length > 0) {
        allFiles = allFiles.concat(data.files)
        console.log(`📄 Page ${pageCount}: Found ${data.files.length} photos (Total so far: ${allFiles.length})`)
      }
      
      nextPageToken = data.nextPageToken || null
    } while (nextPageToken)
    
    console.log(`✅ Found ${allFiles.length} total photos in Drive folder`)
    
    if (allFiles.length === 0) {
      console.warn('⚠️ No photos found in the Drive folder')
      return []
    }
    
    const data = { files: allFiles }
    
    // Convert to our photo format (all images in this folder are WebP/browser-supported)
    const photos = data.files.map((file) => {
      const thumbnailUrl = file.thumbnailLink 
        ? file.thumbnailLink.replace(/=s\d+/, '=s400')
        : `https://drive.google.com/thumbnail?id=${file.id}&sz=w400-h300`
      
      const mediumUrl = file.thumbnailLink
        ? file.thumbnailLink.replace(/=s\d+/, '=w800')
        : `https://drive.google.com/thumbnail?id=${file.id}&sz=w800-h600`
      
      const fullUrl = `https://drive.google.com/uc?export=view&id=${file.id}`
      
      return {
        id: file.id,
        thumbnailUrl,
        mediumUrl,
        url: fullUrl,
        url2: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1920-h1080`,
        name: file.name,
        uploadedBy: 'Guest',
        timestamp: file.createdTime,
        webViewLink: file.webViewLink,
        mimeType: file.mimeType
      }
    })
    
    // Sort by creation time (newest first)
    photos.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    
    // Cache the photos
    cachePhotos(photos)
    console.log('💾 Photos cached for faster loading')
    
    return photos
  } catch (error) {
    console.error('❌ Error fetching photos from Google Drive:', error)
    
    // Try to return cached photos even if API fails
    const cachedPhotos = getCachedPhotos()
    if (cachedPhotos && cachedPhotos.length > 0) {
      console.log('⚠️ Using cached photos due to API error')
      return cachedPhotos
    }
    
    return []
  }
}

// Poll for new photos (check every 10 seconds)
export function startPhotoPolling(callback, interval = 10000) {
  let lastPhotoCount = 0
  
  const poll = async () => {
    // Force refresh when polling to check for new photos
    const photos = await fetchPhotosFromDrive(true)
    
    // Only update if photos changed
    if (photos.length !== lastPhotoCount) {
      lastPhotoCount = photos.length
      callback(photos)
    }
  }
  
  // Initial fetch (use cache)
  fetchPhotosFromDrive(false).then(photos => {
    lastPhotoCount = photos.length
    callback(photos)
  })
  
  // Set up polling (force refresh)
  const pollInterval = setInterval(poll, interval)
  
  return () => clearInterval(pollInterval)
}
