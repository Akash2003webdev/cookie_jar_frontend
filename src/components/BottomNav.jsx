import { useCart } from '../context/CartContext'

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
const CartIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
  </svg>
)

export default function BottomNav({ page, onNav }) {
  const { count } = useCart()
  const base = 'relative flex flex-col items-center gap-0.5 py-1.5 px-1 text-[10px] sm:text-[11px] font-medium flex-1 transition-colors border-none bg-transparent cursor-pointer'
  const active = 'text-primary'
  const inactive = 'text-gray-400 hover:text-gray-600'

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[rgba(248,247,244,0.97)] backdrop-blur-xl border-t border-gray-200 z-40">
      <div className="flex max-w-md mx-auto px-2 pb-safe">
        <button className={`${base} ${page === 'home' ? active : inactive}`} onClick={() => onNav('home')}>
          <HomeIcon />Home
        </button>
        <button className={`${base} ${page === 'menu' ? active : inactive}`} onClick={() => onNav('menu')}>
          <MenuIcon />Menu
        </button>
        <button className={`${base} ${page === 'birthday' ? active : inactive}`} onClick={() => onNav('birthday')}>
          <span className="text-base leading-none">🎂</span>Birthday
        </button>
        <button className={`${base} ${page === 'reviews' ? active : inactive}`} onClick={() => onNav('reviews')}>
          <StarIcon />Reviews
        </button>
        <button className={`${base} ${page === 'cart' ? active : inactive}`} onClick={() => onNav('cart')}>
          <span className="relative">
            <CartIcon />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </span>
          Cart
        </button>
      </div>
    </div>
  )
}
