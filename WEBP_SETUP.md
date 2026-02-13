# WebP Folder Setup Guide

The slideshow reads images from a **WebP-only folder** in Google Drive. Guests still upload to your **upload folder** (QR code). You run a script to convert those images to WebP and copy them into the WebP folder.

## Workflow

1. **Guests** scan the QR code and upload photos (any format, including HEIC) to the **upload folder**.
2. **You** run the conversion script. It downloads from the upload folder, converts to WebP, and **saves files into the `webp-output/` folder** on your computer.
3. **You** upload the contents of `webp-output/` to your **WebP folder** in Google Drive (drag & drop).
4. **The website** reads only from the **WebP folder**, so the slideshow always gets browser-friendly images (no HEIC/CORS issues).

*(Service accounts cannot upload into a user's "My Drive", so the script saves locally and you upload once.)*

## Step 1: Create two folders in Google Drive

1. **Upload folder** – where the QR code sends people. You can keep using your existing folder.
2. **WebP folder** (e.g. "Birthday Photos - WebP") – where you will upload the converted WebP files.

Note the folder IDs from the URL when you open each folder:
- `https://drive.google.com/drive/folders/XXXXXXXX` → folder ID is `XXXXXXXX`

## Step 2: Service account (for the conversion script)

The script needs a **service account** only to **read** from the upload folder (it does not upload to Drive).

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → your project.
2. **APIs & Services** → **Credentials** → **Create credentials** → **Service account**.
3. Give it a name (e.g. "Drive WebP Converter") → **Create and continue** → **Done**.
4. Open the new service account → **Keys** → **Add key** → **Create new key** → **JSON** → download.
5. Save the JSON as `scripts/service-account.json` in this project (or set `GOOGLE_APPLICATION_CREDENTIALS` to its path).
6. Share **only the upload folder** with the **service account email** as **Editor** (so the script can read and download images).

## Step 3: Configure .env

Add or update in your `.env`:

```env
# API key for the website (listing files in the WebP folder)
VITE_GOOGLE_API_KEY=your_api_key

# Folder the slideshow reads from (WebP folder)
VITE_GOOGLE_DRIVE_FOLDER_ID=your_webp_folder_id

# Folder where guests upload (for QR code). Optional if same as upload folder below.
VITE_GOOGLE_DRIVE_UPLOAD_FOLDER_ID=your_upload_folder_id

# Used only by the conversion script (Node)
GOOGLE_DRIVE_SOURCE_FOLDER_ID=your_upload_folder_id
GOOGLE_DRIVE_WEBP_FOLDER_ID=your_webp_folder_id
```

- **VITE_GOOGLE_DRIVE_FOLDER_ID** = WebP folder (slideshow source).
- **VITE_GOOGLE_DRIVE_UPLOAD_FOLDER_ID** = folder shown in the QR code (guests upload here).
- **GOOGLE_DRIVE_SOURCE_FOLDER_ID** = same as upload folder (script reads from here).
- **GOOGLE_DRIVE_WEBP_FOLDER_ID** = same as WebP folder (script writes here).

## Step 4: Run the conversion script

Whenever you have new photos in the upload folder:

```bash
npm run convert-to-webp
```

This creates a **`webp-output/`** folder in your project with all images converted to WebP. Then:

1. Open your **WebP folder** in Google Drive.
2. Drag and drop the contents of `webp-output/` (or the whole folder) into that Drive folder.
3. Set **VITE_GOOGLE_DRIVE_FOLDER_ID** in `.env` to your WebP folder ID so the website reads from it.

The script will:

- List all images in the source folder (JPEG, PNG, HEIC, etc.).
- Download each, convert to WebP, and upload to the WebP folder.

## Step 5: Website

- The site uses **VITE_GOOGLE_DRIVE_FOLDER_ID** (WebP folder) to list and show photos.
- No HEIC handling in the browser; no CORS or 403 issues from Drive for HEIC.

## Optional: Skip script, use WebP folder only

If you prefer to **manually** convert and upload:

1. Convert photos to WebP on your computer (e.g. with an image tool or batch converter).
2. Upload the WebP files into the WebP folder.
3. Set **VITE_GOOGLE_DRIVE_FOLDER_ID** to that folder and use the same **VITE_GOOGLE_API_KEY**.
4. You can leave the conversion script and service account unused.

The QR code can still point to a separate upload folder so you can collect originals there and convert in bulk when you like.
