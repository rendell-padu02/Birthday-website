import { useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { storage, db } from '../firebase'
import './PhotoUpload.css'

function PhotoUpload() {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploaderName, setUploaderName] = useState('')
  const [showUploadForm, setShowUploadForm] = useState(false)

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    await uploadPhoto(file)
  }

  const uploadPhoto = async (file) => {
    if (!uploaderName.trim()) {
      alert('Please enter your name')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // Create a unique filename
      const timestamp = Date.now()
      const filename = `${timestamp}_${file.name}`
      const storageRef = ref(storage, `photos/${filename}`)

      // Upload file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, file)
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref)

      // Save photo metadata to Firestore
      await addDoc(collection(db, 'photos'), {
        url: downloadURL,
        uploadedBy: uploaderName.trim(),
        timestamp: serverTimestamp(),
        filename: filename
      })

      setUploadProgress(100)
      setUploaderName('')
      setShowUploadForm(false)
      
      // Reset file input
      const fileInput = document.getElementById('photo-input')
      if (fileInput) fileInput.value = ''

      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
      }, 1000)

    } catch (error) {
      console.error('Error uploading photo:', error)
      alert('Failed to upload photo. Please try again.')
      setUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="photo-upload-container">
      <button 
        className="upload-toggle-btn"
        onClick={() => setShowUploadForm(!showUploadForm)}
        disabled={uploading}
      >
        {showUploadForm ? '✕ Close' : '+ Add Photo'}
      </button>

      {showUploadForm && (
        <div className="upload-form">
          <input
            type="text"
            placeholder="Your name"
            value={uploaderName}
            onChange={(e) => setUploaderName(e.target.value)}
            className="uploader-name-input"
            disabled={uploading}
          />
          
          <label className="file-upload-label" htmlFor="photo-input">
            {uploading ? 'Uploading...' : 'Choose Photo'}
            <input
              id="photo-input"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </label>

          {uploading && (
            <div className="upload-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${uploadProgress}%` }}
              />
              <span>{uploadProgress}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PhotoUpload
