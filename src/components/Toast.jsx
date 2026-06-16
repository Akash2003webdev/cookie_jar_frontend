import { useEffect } from 'react'

export default function Toast({ msg, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className="fixed top-5 right-5 z-50 bg-primary-dark text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-card animate-fade-in">
      {msg}
    </div>
  )
}
