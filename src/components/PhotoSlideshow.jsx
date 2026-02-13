import { useState, useEffect, useRef } from 'react'
import { fetchPhotosFromDrive, startPhotoPolling } from '../services/googleDrive'
import './PhotoSlideshow.css'

function PhotoSlideshow() {
  const [photos, setPhotos] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [loading, setLoading] = useState(true)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const imageCacheRef = useRef(new Map())

  useEffect(() => {
    fetchPhotosFromDrive().then((fetchedPhotos) => {
      console.log('📸 Photos loaded:', fetchedPhotos.length)
      setPhotos(fetchedPhotos)
      setLoading(false)
    }).catch((error) => {
      console.error('Failed to load photos:', error)
      setLoading(false)
    })

    const stopPolling = startPhotoPolling((newPhotos) => {
      if (newPhotos.length !== photos.length) {
        console.log('🔄 New photos detected:', newPhotos.length)
        setPhotos(newPhotos)
      }
    }, 10000)

    return () => stopPolling()
  }, [])

  // Preload next/previous images (all are WebP or browser-supported)
  useEffect(() => {
    if (photos.length === 0) return

    for (let i = 1; i <= 3; i++) {
      const nextIndex = (currentIndex + i) % photos.length
      const nextPhoto = photos[nextIndex]
      if (nextPhoto && !imageCacheRef.current.has(nextPhoto.id)) {
        const thumbImg = new Image()
        thumbImg.src = nextPhoto.thumbnailUrl
        thumbImg.onload = () => {
          const medImg = new Image()
          medImg.src = nextPhoto.mediumUrl
          medImg.onload = () => {
            const fullImg = new Image()
            fullImg.src = nextPhoto.url
            imageCacheRef.current.set(nextPhoto.id, fullImg)
          }
          medImg.onerror = () => {
            const fullImg = new Image()
            fullImg.src = nextPhoto.url
            imageCacheRef.current.set(nextPhoto.id, fullImg)
          }
        }
      }
    }

    for (let i = 1; i <= 2; i++) {
      const prevIndex = currentIndex - i < 0 ? photos.length - i : currentIndex - i
      const prevPhoto = photos[prevIndex]
      if (prevPhoto && !imageCacheRef.current.has(prevPhoto.id)) {
        const prevImg = new Image()
        prevImg.src = prevPhoto.mediumUrl || prevPhoto.url
        imageCacheRef.current.set(prevPhoto.id, prevImg)
      }
    }

    for (let i = 4; i < photos.length; i++) {
      const lazyIndex = (currentIndex + i) % photos.length
      const lazyPhoto = photos[lazyIndex]
      if (lazyPhoto && !imageCacheRef.current.has(lazyPhoto.id + '_thumb')) {
        const lazyImg = new Image()
        lazyImg.loading = 'lazy'
        lazyImg.src = lazyPhoto.thumbnailUrl
        imageCacheRef.current.set(lazyPhoto.id + '_thumb', lazyImg)
      }
    }
  }, [currentIndex, photos])

  useEffect(() => {
    const currentPhoto = photos[currentIndex]
    if (!currentPhoto) {
      setImageLoading(true)
      setImageError(false)
      return
    }

    const cachedImg = imageCacheRef.current.get(currentPhoto.id)
    if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
      setImageLoading(false)
      setImageError(false)
      return
    }

    setImageLoading(true)
    setImageError(false)
  }, [currentIndex, photos])

  useEffect(() => {
    if (!isPlaying || photos.length === 0) return
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isPlaying, photos.length])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  if (loading) {
    return (
      <div className="slideshow-container empty">
        <p className="empty-message">Loading photos... 📸</p>
      </div>
    )
  }

  if (photos.length === 0 && !loading) {
    return (
      <div className="slideshow-container empty">
        <p className="empty-message">No photos found.</p>
        <p className="empty-message" style={{ fontSize: '14px', marginTop: '10px', opacity: 0.7 }}>
          Run <code>npm run convert-to-webp</code> to convert uploads to WebP, then set VITE_GOOGLE_DRIVE_FOLDER_ID to the WebP folder.
        </p>
      </div>
    )
  }

  const currentPhoto = photos[currentIndex]

  return (
    <div className="slideshow-container">
      <div className="slideshow-header">
        <h3>Memories with Today's Celebrity</h3>
        <button
          className="play-pause-btn"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>

      <div className="slideshow-wrapper">
        <button className="slideshow-nav prev" onClick={goToPrevious}>‹</button>

        <div className="slide-content">
          {imageLoading && (
            <div className="image-loading">
              <div className="loading-spinner"></div>
              <p>Loading photo...</p>
            </div>
          )}
          {imageError && (
            <div className="image-error">
              <p>⚠️ Image failed to load</p>
            </div>
          )}
          <img
            src={currentPhoto.thumbnailUrl}
            alt={currentPhoto.name || `Photo ${currentIndex + 1}`}
            className={`slide-image-thumb ${imageLoading ? '' : 'hidden'}`}
            style={{ filter: 'blur(5px)' }}
            loading="eager"
            decoding="async"
          />
          <img
            src={currentPhoto.mediumUrl || currentPhoto.url}
            alt={currentPhoto.name || `Photo ${currentIndex + 1}`}
            className={`slide-image ${imageLoading ? 'hidden' : ''}`}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            onLoad={(e) => {
              setImageLoading(false)
              setImageError(false)
              if (currentPhoto) imageCacheRef.current.set(currentPhoto.id, e.target)
              if (currentPhoto?.url && e.target.src !== currentPhoto.url && e.target.src.includes('thumbnail')) {
                setTimeout(() => { e.target.src = currentPhoto.url }, 100)
              }
            }}
            onError={(e) => {
              if (!currentPhoto) {
                setImageError(true)
                setImageLoading(false)
                return
              }
              const tried = (e.target.dataset.triedUrls || '').split(',')
              const src = e.target.src.split('?')[0]
              if (tried.includes(src)) {
                setImageError(true)
                setImageLoading(false)
                return
              }
              e.target.dataset.triedUrls = [...tried, src].join(',')
              if (e.target.src.includes('thumbnail') && currentPhoto.url) {
                e.target.src = currentPhoto.url
              } else if (currentPhoto.url2) {
                e.target.src = currentPhoto.url2
              } else {
                setImageError(true)
                setImageLoading(false)
              }
            }}
          />
          {currentPhoto?.name && !imageLoading && (
            <p className="photo-credit">📷 {currentPhoto.name}</p>
          )}
        </div>

        <button className="slideshow-nav next" onClick={goToNext}>›</button>
      </div>

      <div className="slideshow-indicators">
        {photos.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      <div className="photo-count">
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  )
}

export default PhotoSlideshow
