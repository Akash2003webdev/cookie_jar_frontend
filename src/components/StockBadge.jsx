export default function StockBadge({ status }) {
  if (status === 'out_of_stock')
    return <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded-full">Out of Stock</span>
  if (status === 'low_stock')
    return <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-0.5 rounded-full">Low Stock</span>
  return <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded-full">In Stock</span>
}
