import { useRef, useState } from 'react'
import bakeryLogo from '../assets/logo.png'
import AdminLoginModal from './AdminLoginModal'

const LONG_PRESS_MS = 600

export default function Header({ page, onNav }) {
  const [showLogin, setShowLogin] = useState(false)
  const pressTimer = useRef(null)
  const longPressTriggered = useRef(false)

  function startPress() {
    longPressTriggered.current = false
    pressTimer.current = setTimeout(() => {
      longPressTriggered.current = true
      setShowLogin(true)
    }, LONG_PRESS_MS)
  }

  function cancelPress() {
    clearTimeout(pressTimer.current)
  }

  function handleLogoClick() {
    // Suppress normal "go home" navigation if this click followed a long-press
    if (longPressTriggered.current) {
      longPressTriggered.current = false
      return
    }
    onNav('home')
  }

  function handleLoginSuccess() {
    setShowLogin(false)
    onNav('admin')
  }

  return (
    <header className="sticky top-0 z-50 px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between bg-white/88 backdrop-blur-xl rounded-full px-4 py-2 shadow-soft border border-white/60">

        {/* Logo - long press (600ms) opens hidden admin login */}
        <button
          onClick={handleLogoClick}
          onMouseDown={startPress}
          onMouseUp={cancelPress}
          onMouseLeave={cancelPress}
          onTouchStart={startPress}
          onTouchEnd={cancelPress}
          onTouchCancel={cancelPress}
          className="flex items-center gap-2.5 cursor-pointer select-none"
          style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
        >
          <div className="w-12 h-12 rounded-full bg-white/15 border-2 border-white/30 flex items-center justify-center overflow-hidden">
            <img
              src={bakeryLogo}
              alt="Bakery Logo"
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
          </div>
          <span className="font-display text-2xl bg-gradient-to-br from-primary-dark to-primary-light bg-clip-text text-transparent">
            Cookie Jar
          </span>
        </button>

      </div>

      {showLogin && (
        <AdminLoginModal onSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} />
      )}
    </header>
  )
}
