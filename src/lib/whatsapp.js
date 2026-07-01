import { bakery } from './data'

export function buildWhatsAppOrderLink({ cart, subtotal, customerName, note }) {
  const lines = []
  lines.push(`🛒 *New Order - ${bakery.name}*`)
  lines.push('')

  cart.forEach((item, i) => {
    const lineTotal = item.qty * item.price
    lines.push(
      `${i + 1}. ${item.name} (${item.variantName}) x${item.qty} - ₹${lineTotal}`
    )
  })

  lines.push('')
  lines.push(`*Total: ₹${subtotal}*`)

  if (customerName && customerName.trim()) {
    lines.push('')
    lines.push(`Customer Name: ${customerName.trim()}`)
  }

  if (note && note.trim()) {
    lines.push(`Note: ${note.trim()}`)
  }

  const text = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${bakery.whatsapp}?text=${text}`
}
