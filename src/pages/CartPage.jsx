import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { buildWhatsAppOrderLink } from '../lib/whatsapp'

function QtyStepper({ qty, onChange }) {
  return (
    <div className="flex items-center gap-2.5 bg-gray-50 rounded-full px-2 py-1">
      <button
        onClick={() => onChange(qty - 1)}
        className="w-7 h-7 rounded-full bg-white shadow-soft text-primary font-bold text-base flex items-center justify-center border-none cursor-pointer active:scale-90 transition-transform"
      >
        −
      </button>
      <span className="text-sm font-bold w-5 text-center">{qty}</span>
      <button
        onClick={() => onChange(qty + 1)}
        className="w-7 h-7 rounded-full bg-white shadow-soft text-primary font-bold text-base flex items-center justify-center border-none cursor-pointer active:scale-90 transition-transform"
      >
        +
      </button>
    </div>
  )
}

export default function CartPage({ onBack, onNav }) {
  const { cart, updateQty, removeItem, clearCart, subtotal } = useCart()
  const [name, setName] = useState('')
  const [note, setNote] = useState('')

  function sendOrder() {
    const link = buildWhatsAppOrderLink({ cart, subtotal, customerName: name, note })
    window.open(link, '_blank')
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-10 sm:py-16 text-center animate-fade-in">
        <p className="text-5xl mb-3">🛒</p>
        <h1 className="text-xl font-black mb-1.5">Your cart is empty</h1>
        <p className="text-sm text-gray-400 mb-6">Add something tasty from the menu first!</p>
        <button
          onClick={() => onNav('menu')}
          className="bg-primary text-white rounded-2xl px-6 py-3 text-sm font-bold hover:bg-primary-light active:scale-[0.97] transition-all border-none cursor-pointer"
        >
          Browse Menu
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-6 sm:py-10 animate-fade-in">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-gray-700 bg-transparent border-none cursor-pointer mb-5"
      >
        ← Back
      </button>

      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Checkout</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black">Your Cart</h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-gray-400 hover:text-red-500 bg-transparent border-none cursor-pointer"
        >
          Clear all
        </button>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-3 mb-6">
        {cart.map((item) => (
          <div key={item.key} className="bg-white rounded-3xl p-3.5 shadow-soft flex gap-3 items-center">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-extrabold truncate">{item.name}</p>
              <p className="text-xs text-gray-400">{item.variantName} · ₹{item.price}</p>
              <p className="text-sm font-bold text-primary mt-0.5">₹{item.price * item.qty}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <QtyStepper qty={item.qty} onChange={(q) => updateQty(item.key, q)} />
              <button
                onClick={() => removeItem(item.key)}
                className="text-[11px] text-gray-400 hover:text-red-500 bg-transparent border-none cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Customer details */}
      <div className="bg-white rounded-3xl p-5 shadow-soft mb-5">
        <h2 className="text-sm font-bold mb-3">Your details (optional)</h2>
        <input
          className="w-full border border-gray-200 rounded-2xl py-2.5 px-4 text-sm outline-none bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          maxLength={60}
        />
        <textarea
          className="w-full border border-gray-200 rounded-2xl py-2.5 px-4 text-sm outline-none bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition resize-none min-h-[70px]"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Delivery address / special note (optional)"
          maxLength={300}
        />
      </div>

      {/* Total + checkout */}
      <div className="bg-white rounded-3xl p-5 shadow-card sticky bottom-24 sm:bottom-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-gray-500">Total</span>
          <span className="text-2xl font-black text-primary">₹{subtotal}</span>
        </div>
        <button
          onClick={sendOrder}
          className="w-full bg-[#25D366] text-white rounded-2xl py-3.5 text-sm font-bold hover:brightness-95 active:scale-[0.97] transition-all border-none cursor-pointer flex items-center justify-center gap-2"
        >
          🟢 Order on WhatsApp
        </button>
        <p className="text-[11px] text-gray-400 text-center mt-2.5">
          Order details will be sent to us on WhatsApp. We'll confirm and share the total with delivery/pickup info.
        </p>
      </div>
    </div>
  )
}
