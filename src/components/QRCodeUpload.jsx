import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import './QRCodeUpload.css'

function QRCodeUpload() {
  // Folder where guests upload (run convert-to-webp to copy to WebP folder for slideshow)
  const uploadFolderId = import.meta.env.VITE_GOOGLE_DRIVE_UPLOAD_FOLDER_ID || import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID || '17eY5Le85RMmUbwH9rWKiC8LDYiVz3bpI'
  const driveFolderUrl = `https://drive.google.com/drive/folders/${uploadFolderId}?usp=sharing`

  return (
    <div className="qr-upload-container">
      <div className="qr-section">
        <p className="qr-label">📱 Scan to Upload</p>
        <div className="qr-code-wrapper">
          <QRCodeSVG
            value={driveFolderUrl}
            size={120}
            level="H"
            includeMargin={true}
            fgColor="#000000"
            bgColor="#ffffff"
          />
        </div>
      </div>
    </div>
  )
}

export default QRCodeUpload
