import { createContext, useContext, useState, useEffect, useMemo } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'cookiejar_cart'

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // ignore storage errors (e.g. private mode)
    }
  }, [cart])

  function addItem({ productId, name, variantName, price, image }, qty = 1) {
    const key = `${productId}::${variantName}`
    setCart((prev) => {
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, { key, productId, name, variantName, price, image, qty }]
    })
  }

  function updateQty(key, qty) {
    if (qty <= 0) {
      removeItem(key)
      return
    }
    setCart((prev) => prev.map((i) => (i.key === key ? { ...i, qty } : i)))
  }

  function removeItem(key) {
    setCart((prev) => prev.filter((i) => i.key !== key))
  }

  function clearCart() {
    setCart([])
  }

  const count = useMemo(() => cart.reduce((sum, i) => sum + i.qty, 0), [cart])
  const subtotal = useMemo(() => cart.reduce((sum, i) => sum + i.qty * i.price, 0), [cart])

  const value = { cart, addItem, updateQty, removeItem, clearCart, count, subtotal }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
