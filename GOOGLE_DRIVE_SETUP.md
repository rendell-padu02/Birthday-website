# Google Drive Setup Guide

## Overview
This website reads photos from a Google Drive folder and displays them in a slideshow. People can upload photos directly to the Drive folder, and they'll appear automatically on the website.

## Step 1: Set Up Google Drive Folder

✅ **Already Done!** Your folder is set up at:
`https://drive.google.com/drive/folders/17eY5Le85RMmUbwH9rWKiC8LDYiVz3bpI?usp=sharing`

**Important:** Make sure the folder is set to "Anyone with the link can view"

## Step 2: Get Google Drive API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Enter project name: `birthday-website` (or any name)
4. Click **"Create"**

5. **Enable Google Drive API:**
   - In the search bar, type "Google Drive API"
   - Click on **"Google Drive API"**
   - Click **"Enable"**

6. **Create API Key:**
   - Go to **"Credentials"** in the left menu
   - Click **"+ CREATE CREDENTIALS"** → **"API Key"**
   - Copy the API key that appears

7. **Restrict API Key (Recommended):**
   - Click on the API key you just created
   - Under **"API restrictions"**, select **"Restrict key"**
   - Choose **"Google Drive API"**
   - Click **"Save"**

## Step 3: Configure Environment Variable

1. Create a `.env` file in your project root (copy from `.env.example`)
2. Add your API key:

```
VITE_GOOGLE_API_KEY=your_actual_api_key_here
```

3. **For Production (Vercel):**
   - Go to your Vercel project settings
   - Navigate to **"Environment Variables"**
   - Add: `VITE_GOOGLE_API_KEY` = `your_api_key`
   - Redeploy your site

## Step 4: Test the Setup

1. Upload a test photo to your Google Drive folder
2. Run `npm run dev`
3. Enter password: `VIBGYOR`
4. Check if the photo appears in the slideshow
5. Upload another photo and wait ~10 seconds - it should appear automatically!

## How It Works

1. **QR Code:** Points to your Google Drive folder
2. **People scan QR code** → Opens Drive folder on their phone
3. **They upload photos** → Photos saved to Drive folder
4. **Website polls Drive** → Checks for new photos every 10 seconds
5. **Photos appear** → Automatically shown in slideshow

## Troubleshooting

### Photos not showing?
- ✅ Check API key is correct in `.env` file
- ✅ Verify Google Drive API is enabled
- ✅ Make sure folder is accessible (set to "Anyone with the link can view")
- ✅ Check browser console for errors
- ✅ Wait 10 seconds after uploading (polling interval)

### API Key errors?
- ✅ Make sure API key is not restricted to specific domains (for development)
- ✅ For production, add your Vercel domain to allowed domains
- ✅ Verify Google Drive API is enabled in your project

### Upload not working?
- ✅ Make sure Drive folder permissions allow uploads
- ✅ Check folder is set to "Anyone with the link can edit" or "Anyone with the link can view"
- ✅ For uploads, people need to be signed into Google Drive

## Security Notes

⚠️ **API Key Security:**
- The API key is exposed in the frontend (this is normal for public API keys)
- Restrict the API key to only Google Drive API
- Consider setting up domain restrictions for production
- The API key only allows reading public folders (read-only)

## Need Help?

- [Google Drive API Documentation](https://developers.google.com/drive/api)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
