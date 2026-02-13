# HEIC Conversion Troubleshooting Guide

If you're seeing **403 Forbidden** errors when converting HEIC files, follow these steps:

## Step 1: Verify API Key Setup

1. **Check your `.env` file** - Make sure it contains:
   ```
   VITE_GOOGLE_API_KEY=your_actual_api_key_here
   ```

2. **Restart your dev server** after changing `.env`:
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

## Step 2: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. **Enable Google Drive API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"

## Step 3: API Key Restrictions

Your API key might have restrictions that prevent it from working:

### Option A: Unrestricted (Easier for development)
1. Go to "APIs & Services" > "Credentials"
2. Click on your API key
3. Under "API restrictions", select **"Don't restrict key"**
4. Under "Application restrictions", select **"None"**
5. Click "Save"

### Option B: Restricted (More secure)
If you want to keep restrictions:
1. Under "API restrictions", select **"Restrict key"**
2. Add **"Google Drive API"** to the allowed APIs list
3. Under "Application restrictions", you can leave it as "None" for development
4. Click "Save"

## Step 4: Google Drive Folder Permissions

1. Open your Google Drive folder
2. Right-click the folder > "Share"
3. Click "Change to anyone with the link"
4. Set permission to **"Viewer"**
5. Click "Done"

## Step 5: Verify Files Are Accessible

Test if a file is accessible by opening this URL in your browser (replace `FILE_ID` with an actual file ID):
```
https://www.googleapis.com/drive/v3/files/FILE_ID?alt=media&key=YOUR_API_KEY
```

If you see a 403 error, the issue is with API key permissions or folder sharing.

## Step 6: Check Console Logs

After restarting your dev server, check:
- Look for `[Proxy] Forwarding:` messages - confirms proxy is working
- Look for `📥 Fetching HEIC via proxy:` messages - confirms requests are going through proxy
- Check for detailed 403 error messages with troubleshooting info

## Common Issues

### "API key not found" warning
- Make sure `.env` file is in the root directory (same level as `package.json`)
- Make sure the variable name is exactly `VITE_GOOGLE_API_KEY`
- Restart dev server after changing `.env`

### Still getting 403 after all steps
- Wait a few minutes after changing API key settings (Google may cache)
- Try creating a new API key
- Verify the folder is actually set to "Anyone with the link can view"
- Check that Drive API is enabled (not just created, but enabled)
