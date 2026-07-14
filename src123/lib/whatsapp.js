import { bakery } from './data'

export function buildWhatsAppOrderLink({ cart, customerName, note }) {
  const lines = []
  lines.push(`🛒 *New Order - ${bakery.name}*`)
  lines.push('')

  cart.forEach((item, i) => {
    lines.push(`${i + 1}. ${item.name} (${item.variantName}) x${item.qty}`)
  })

  if (customerName && customerName.trim()) {
    lines.push('')
    lines.push(`Customer Name: ${customerName.trim()}`)
  }

  if (note && note.trim()) {
    lines.push(`Note: ${note.trim()}`)
  }

  lines.push('')
  lines.push('Please confirm availability and price. Thank you! 🙏')

  const text = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${bakery.whatsapp}?text=${text}`
}
