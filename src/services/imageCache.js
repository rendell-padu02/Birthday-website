// Image caching service using localStorage and browser cache

const CACHE_KEY = 'birthday_photos_cache'
const CACHE_TIMESTAMP_KEY = 'birthday_photos_cache_timestamp'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes cache

// Get cached photos
export function getCachedPhotos() {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY)
    
    if (!cached || !timestamp) {
      return null
    }
    
    // Check if cache is still valid
    const cacheAge = Date.now() - parseInt(timestamp)
    if (cacheAge > CACHE_DURATION) {
      // Cache expired
      localStorage.removeItem(CACHE_KEY)
      localStorage.removeItem(CACHE_TIMESTAMP_KEY)
      return null
    }
    
    return JSON.parse(cached)
  } catch (error) {
    console.error('Error reading cache:', error)
    return null
  }
}

// Save photos to cache
export function cachePhotos(photos) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(photos))
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString())
  } catch (error) {
    console.error('Error caching photos:', error)
  }
}

// Preload and cache images in browser
export function preloadImage(url) {
  return new Promise((resolve, reject) => {
    // Check if image is already cached by browser
    const img = new Image()
    
    img.onload = () => {
      resolve(img)
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    // Set cache headers via fetch if possible
    img.src = url + (url.includes('?') ? '&' : '?') + 'cache=' + Date.now()
    
    // Actually, use the original URL to leverage browser cache
    img.src = url
  })
}

// Preload multiple images
export async function preloadImages(urls) {
  const promises = urls.map(url => 
    preloadImage(url).catch(err => {
      console.warn('Failed to preload:', url, err)
      return null
    })
  )
  
  return Promise.all(promises)
}

// Clear cache
export function clearCache() {
  try {
    localStorage.removeItem(CACHE_KEY)
    localStorage.removeItem(CACHE_TIMESTAMP_KEY)
    console.log('🗑️ Cache cleared')
  } catch (error) {
    console.error('Error clearing cache:', error)
  }
}

// Get cache info for debugging
export function getCacheInfo() {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY)
    
    if (!cached || !timestamp) {
      return { exists: false, count: 0, age: null }
    }
    
    const photos = JSON.parse(cached)
    const cacheAge = Date.now() - parseInt(timestamp)
    
    return {
      exists: true,
      count: photos.length,
      age: cacheAge,
      ageMinutes: Math.floor(cacheAge / 60000),
      isValid: cacheAge < CACHE_DURATION
    }
  } catch (error) {
    console.error('Error reading cache info:', error)
    return { exists: false, count: 0, age: null, error: error.message }
  }
}
