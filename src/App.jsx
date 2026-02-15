import { useState } from 'react'
import './App.css'
import PhotoSlideshow from './components/PhotoSlideshow'
import QRCodeUpload from './components/QRCodeUpload'

function App() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState('')

  const correctPassword = 'DEST1NY'

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    if (password.trim() === correctPassword) {
      setIsAuthenticated(true)
    } else {
      setError('Incorrect password. Try again.')
      setPassword('')
    }
  }

  if (isAuthenticated) {
    return (
      <div className="birthday-container">
        {/* Hidden YouTube player for background music */}
        <iframe
          className="bg-music-player"
          src="https://www.youtube.com/embed/FLYpSp9PC4E?autoplay=1&loop=1&playlist=FLYpSp9PC4E"
          title="Birthday music"
          frameBorder="0"
          allow="autoplay; encrypted-media"
        />
        <div className="particles">
          {[...Array(50)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>
        <div className="geometric-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
        <div className="card birthday-card">
          <div className="card-silver-decorations">
            <div className="silver-star star-1">✦</div>
            <div className="silver-star star-2">✦</div>
            <div className="silver-star star-3">✦</div>
            <div className="silver-star star-4">✦</div>
            <div className="silver-sparkle sparkle-1">✨</div>
            <div className="silver-sparkle sparkle-2">✨</div>
            <div className="silver-sparkle sparkle-3">✨</div>
            <div className="silver-sparkle sparkle-4">✨</div>
          </div>
          <div className="age-number">25</div>
          <h1 className="birthday-title">Happy Birthday Nidhi</h1>
          <p className="birthday-subtitle">Celebrating a new chapter</p>
          <div className="elegant-line"></div>
          <p className="birthday-message">May this year bring you endless possibilities and beautiful moments</p>
        </div>
        
        <PhotoSlideshow />
        <QRCodeUpload />
        <div className="light-beams">
          <div className="beam beam-1"></div>
          <div className="beam beam-2"></div>
          <div className="beam beam-3"></div>
        </div>
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`confetti confetti-${i + 1}`}
              style={{
                '--delay': `${i * 0.4}s`,
                '--x': `${(i * 7) % 100}%`,
                '--duration': `${28 + (i % 12)}s`,
              }}
            />
          ))}
        </div>
        <div className="silver-shimmers">
          {[...Array(30)].map((_, i) => (
            <div key={i} className={`shimmer shimmer-${i + 1}`}></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="password-container">
      <div className="card password-card">
        <h1>Enter Password</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="password-input"
            autoComplete="off"
            autoFocus
          />
          <button type="submit" className="submit-button">
            Submit
          </button>
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  )
}

export default App
