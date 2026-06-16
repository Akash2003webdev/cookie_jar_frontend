import Stars from './Stars'
import StockBadge from './StockBadge'

export default function ProductCard({ product, onView, index }) {
  return (
    <div
      className="bg-white rounded-3xl overflow-hidden shadow-soft hover:-translate-y-1 hover:shadow-card transition-all duration-250 cursor-pointer animate-fade-up"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={() => onView(product)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-2.5 left-2.5">
          <StockBadge stock={product.stock} />
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5">
        <h3 className="text-[15px] font-extrabold truncate">{product.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-xs font-semibold">
            <Stars rating={product.rating} size={12} />
            <span>{product.rating}</span>
          </div>
          <span className="text-base font-black text-primary">₹{product.price}</span>
        </div>

        <button className="w-full mt-2.5 bg-primary text-white rounded-2xl py-2.5 text-sm font-bold hover:bg-primary-light active:scale-[0.97] transition-all">
          View Details →
        </button>
      </div>
    </div>
  )
}
