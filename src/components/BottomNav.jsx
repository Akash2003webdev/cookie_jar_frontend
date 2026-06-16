import { bakery } from '../lib/data'

const HomeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)
const MenuIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
)
const StarIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)
const PhoneIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 7.79a2 2 0 012-2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.91 12a16 16 0 006.29 6.29l.62-.62a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
)

export default function BottomNav({ page, onNav }) {
  const base = 'flex flex-col items-center gap-0.5 py-1.5 px-2 text-[11px] font-medium flex-1 transition-colors border-none bg-transparent cursor-pointer'
  const active = 'text-primary'
  const inactive = 'text-gray-400 hover:text-gray-600'

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[rgba(248,247,244,0.97)] backdrop-blur-xl border-t border-gray-200 z-40">
      <div className="flex max-w-sm mx-auto px-3 pb-safe">
        <button className={`${base} ${page === 'home' ? active : inactive}`} onClick={() => onNav('home')}>
          <HomeIcon />Home
        </button>
        <button className={`${base} ${page === 'menu' ? active : inactive}`} onClick={() => onNav('menu')}>
          <MenuIcon />Menu
        </button>
        <button className={`${base} ${page === 'reviews' ? active : inactive}`} onClick={() => onNav('reviews')}>
          <StarIcon />Reviews
        </button>
        <a href={`tel:${bakery.phoneRaw}`} className={`${base} ${inactive} no-underline`}>
          <PhoneIcon />Call
        </a>
      </div>
    </div>
  )
}
