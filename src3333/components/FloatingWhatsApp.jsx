import { useCart } from '../context/CartContext'
import { buildWhatsAppOrderLink } from '../lib/whatsapp'
import { bakery } from '../lib/data'

const WhatsAppIcon = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8" fill="currentColor">
    <path d="M16.004 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.27.6 4.4 1.64 6.24L3.2 28.8l6.75-1.6a12.7 12.7 0 006.05 1.54h.004c7.07 0 12.8-5.73 12.8-12.8s-5.73-12.74-12.805-12.74zm0 23.16h-.003a10.6 10.6 0 01-5.4-1.48l-.387-.23-4 .95.96-3.9-.253-.4a10.62 10.62 0 01-1.62-5.66c0-5.87 4.78-10.65 10.65-10.65 2.85 0 5.52 1.11 7.53 3.13a10.58 10.58 0 013.12 7.53c0 5.87-4.78 10.72-10.6 10.72zm5.83-7.98c-.32-.16-1.9-.94-2.2-1.04-.29-.11-.5-.16-.72.16-.21.31-.82 1.04-1 1.25-.19.21-.37.24-.68.08-.32-.16-1.34-.5-2.55-1.58-.94-.84-1.58-1.87-1.76-2.19-.19-.31-.02-.48.14-.64.15-.15.32-.38.48-.58.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.63-.53-.55-.72-.56-.19-.01-.4-.01-.61-.01-.21 0-.55.08-.85.4-.29.32-1.12 1.1-1.12 2.67 0 1.58 1.15 3.1 1.31 3.31.16.21 2.2 3.36 5.34 4.58 3.13 1.22 3.13.82 3.7.76.56-.05 1.9-.77 2.16-1.52.27-.74.27-1.38.19-1.52-.08-.13-.29-.21-.61-.37z" />
  </svg>
)

export default function FloatingWhatsApp() {
  const { cart } = useCart()
  const hasItems = cart.length > 0

  function handleClick() {
    let link
    if (hasItems) {
      link = buildWhatsAppOrderLink({ cart, customerName: '', note: '' })
    } else {
      const text = encodeURIComponent(
        `Hi ${bakery.name}! 👋 I'd like to know more about your menu.`
      )
      link = `https://wa.me/${bakery.whatsapp}?text=${text}`
    }
    window.open(link, '_blank')
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Chat on WhatsApp"
      className="fixed z-50 right-4 bottom-24 sm:bottom-6 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_6px_20px_rgba(0,0,0,0.25)] flex items-center justify-center border-none cursor-pointer hover:scale-105 active:scale-95 transition-transform animate-fade-up"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none" style={{ animationDuration: '2.5s' }} />
      <WhatsAppIcon />
      {hasItems && (
        <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
          {cart.reduce((s, i) => s + i.qty, 0)}
        </span>
      )}
    </button>
  )
}
