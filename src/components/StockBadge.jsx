export default function StockBadge({ stock }) {
  if (stock === 0)
    return <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded-full">Out of Stock</span>
  if (stock <= 8)
    return <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-0.5 rounded-full">Low Stock</span>
  return <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded-full">In Stock</span>
}
