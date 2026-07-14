import Stars from './Stars'
import StockBadge from './StockBadge'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product, onView, index }) {
  const { addItem } = useCart()
  const isOutOfStock = product.status === 'out_of_stock'
  const defaultVariant = product.variants?.[0]

  function quickAdd(e) {
    e.stopPropagation()
    if (!defaultVariant) return
    addItem({
      productId: product.id,
      name: product.name,
      variantName: defaultVariant.name,
      image: product.image,
    })
  }

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
          <StockBadge status={product.status} />
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5">
        <h3 className="text-[15px] font-extrabold truncate">{product.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-1 text-xs font-semibold mt-2">
          {product.reviewCount > 0 ? (
            <>
              <Stars rating={product.rating} size={12} />
              <span>{product.rating}</span>
            </>
          ) : (
            <span className="text-gray-400">New</span>
          )}
        </div>

        <div className="flex gap-2 mt-2.5">
          <button className="flex-1 bg-primary text-white rounded-2xl py-2.5 text-sm font-bold hover:bg-primary-light active:scale-[0.97] transition-all">
            View Details →
          </button>
          <button
            onClick={quickAdd}
            disabled={isOutOfStock || !defaultVariant}
            title="Quick add to cart"
            className="w-10 flex-shrink-0 bg-gray-50 text-primary rounded-2xl text-base font-bold hover:bg-gray-100 active:scale-90 transition-all border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            🛒
          </button>
        </div>
      </div>
    </div>
  )
}
