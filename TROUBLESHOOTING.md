# Troubleshooting Guide

## Photos Not Showing in Slideshow?

### Step 1: Check Browser Console
1. Open your website in browser
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Look for error messages (they'll start with ❌ or ⚠️)

### Step 2: Verify API Key Setup

**Check if .env file exists:**
- Look in your project root folder
- File should be named `.env` (not `.env.txt`)

**If .env file doesn't exist:**
1. Create a new file named `.env` in project root
2. Add this line:
   ```
   VITE_GOOGLE_API_KEY=your_actual_api_key_here
   ```
3. Replace `your_actual_api_key_here` with your actual API key
4. **Restart your dev server** (`npm run dev`)

### Step 3: Verify Google Drive API Setup

**Check if API is enabled:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Enabled APIs**
4. Make sure **Google Drive API** is listed and enabled

**Check API Key:**
1. Go to **Credentials**
2. Click on your API key
3. Make sure **API restrictions** includes **Google Drive API**

### Step 4: Check Drive Folder Permissions

**Make sure folder is accessible:**
1. Open your Drive folder: https://drive.google.com/drive/folders/17eY5Le85RMmUbwH9rWKiC8LDYiVz3bpI
2. Click **Share** button
3. Set to **"Anyone with the link can view"**
4. Make sure the folder ID is correct: `17eY5Le85RMmUbwH9rWKiC8LDYiVz3bpI`

### Step 5: Verify Photos Are in Folder

**Check folder contents:**
1. Open the Drive folder
2. Make sure photos are directly in the folder (not in subfolders)
3. Photos should be image files (.jpg, .png, .gif, etc.)
4. Try uploading a test photo

### Step 6: Common Error Messages

**"API key not configured"**
- ✅ Create `.env` file with `VITE_GOOGLE_API_KEY=your_key`
- ✅ Restart dev server

**"403 Forbidden"**
- ✅ API key might be invalid
- ✅ Drive API might not be enabled
- ✅ API key restrictions might be blocking it

**"404 Not Found"**
- ✅ Folder ID might be wrong
- ✅ Folder might not be accessible
- ✅ Check folder permissions

**"No photos found"**
- ✅ Photos might be in a subfolder
- ✅ Photos might not be image files
- ✅ Folder might be empty

### Step 7: Test API Connection

Open browser console and run:
```javascript
fetch('https://www.googleapis.com/drive/v3/files?q=\'17eY5Le85RMmUbwH9rWKiC8LDYiVz3bpI\'+in+parents+and+mimeType+contains+\'image/\'&fields=files(id,name)&key=YOUR_API_KEY')
  .then(r => r.json())
  .then(console.log)
```

Replace `YOUR_API_KEY` with your actual key. This will show if the API is working.

### Step 8: For Production (Vercel)

**Add environment variable in Vercel:**
1. Go to Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add: `VITE_GOOGLE_API_KEY` = `your_api_key`
5. Redeploy your site

## Still Not Working?

1. Check browser console for specific error messages
2. Verify API key is correct
3. Make sure Drive API is enabled
4. Check folder permissions
5. Try uploading a test photo directly to the folder
6. Wait 10 seconds after uploading (polling interval)
