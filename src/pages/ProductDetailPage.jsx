import Stars from '../components/Stars'
import StockBadge from '../components/StockBadge'
import ReviewCard from '../components/ReviewCard'
import { initialReviews, bakery } from '../lib/data'

export default function ProductDetailPage({ product, onBack }) {
  return (
    <div className="max-w-6xl mx-auto px-5 py-6 sm:py-10 animate-fade-in">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-gray-700 bg-transparent border-none cursor-pointer mb-6"
      >
        ← Back
      </button>

      {/* Detail grid */}
      <div className="grid gap-7 md:grid-cols-2">
        {/* Image */}
        <div className="rounded-3xl overflow-hidden aspect-square bg-gray-50 shadow-card">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-3.5">
          <div className="flex gap-2 flex-wrap">
            <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
              {product.category}
            </span>
            <StockBadge stock={product.stock} />
          </div>

          <h1 className="text-3xl font-black leading-tight">{product.name}</h1>

          <div className="flex items-center gap-2">
            <Stars rating={product.rating} size={16} />
            <span className="text-sm font-bold">{product.rating}</span>
            <span className="text-xs text-gray-400">· {product.stock} in stock</span>
          </div>

          <div>
            <span className="text-3xl font-black text-primary">₹{product.price}</span>
            <span className="text-xs text-gray-400 ml-2">per piece</span>
          </div>

          <div>
            <h2 className="text-sm font-bold mb-1.5">About</h2>
            <p className="text-sm leading-relaxed text-gray-600">{product.longDescription}</p>
          </div>

          <div>
            <h2 className="text-sm font-bold mb-2">Features</h2>
            <div className="grid grid-cols-2 gap-2">
              {product.features.map((f) => (
                <div key={f} className="flex items-center gap-2 bg-gray-50 rounded-2xl px-3 py-2 text-xs font-semibold">
                  <span className="text-primary-light font-black">✓</span> {f}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-3xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-sm text-gray-500 flex gap-1.5 items-center">🕙 Closes {bakery.closes}</p>
            <a
              href={`tel:${bakery.phoneRaw}`}
              className="bg-primary text-white rounded-2xl px-5 py-2.5 text-sm font-bold hover:bg-primary-light transition-colors no-underline"
            >
              📞 Call to Order
            </a>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <h2 className="text-xl font-black mb-4">Customer Reviews</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {initialReviews.map((r, i) => (
            <ReviewCard key={r.id} review={r} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
