# Birthday Website 🎂

A beautiful, password-protected birthday website built with React and Vite.

## Features

- 🔐 Password protection (Password: VIBGYOR)
- 🎨 Elegant, aesthetic design perfect for a 25th birthday
- 🎵 Background music integration (YouTube)
- ✨ Sophisticated animations and particle effects
- 📱 Fully responsive design
- 📸 **Live Photo Slideshow** - Displays photos from Google Drive folder
- 🔄 **Auto-Refresh** - Checks for new photos every 10 seconds
- 📱 **QR Code Upload** - Scan QR code to upload photos directly to Google Drive

## Tech Stack

- React 18
- Vite
- Google Drive API (for photo storage and retrieval)
- CSS3 Animations

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment

This project is configured for deployment on Vercel. See `DEPLOY.md` for deployment instructions.

## Password

The password to access the birthday page is: **VIBGYOR**

## Setup Photo Slideshow Feature

To enable the photo slideshow feature, you need to set up Google Drive API:

1. Follow the instructions in `GOOGLE_DRIVE_SETUP.md`
2. Get your Google Drive API key from Google Cloud Console
3. Create a `.env` file with your API key: `VITE_GOOGLE_API_KEY=your_key_here`
4. Make sure your Google Drive folder is set to "Anyone with the link can view"

See `GOOGLE_DRIVE_SETUP.md` for detailed step-by-step instructions.

**Google Drive Folder:** https://drive.google.com/drive/folders/17eY5Le85RMmUbwH9rWKiC8LDYiVz3bpI?usp=sharing

## License

Private project
