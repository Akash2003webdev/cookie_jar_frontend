import { useState } from 'react'
import Stars from '../components/Stars'
import StockBadge from '../components/StockBadge'
import ReviewCard from '../components/ReviewCard'
import Toast from '../components/Toast'
import { bakery } from '../lib/data'
import { submitProductReview } from '../lib/api'

export default function ProductDetailPage({ product, onBack }) {
  const [reviews, setReviews] = useState(product.reviews)
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [message, setMessage] = useState('')
  const [toast, setToast] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (name.trim().length < 2) { setToast('Name must be at least 2 characters'); return }
    if (rating === 0) { setToast('Please select a rating'); return }
    if (message.trim().length < 5) { setToast('Please write a longer review'); return }

    setSubmitting(true)
    try {
      await submitProductReview({
        productId: product.id,
        name: name.trim(),
        rating,
        message: message.trim(),
      })
      setReviews((prev) => [
        { id: Date.now() + '', name: name.trim(), rating, message: message.trim(), date: 'Just now' },
        ...prev,
      ])
      setName(''); setRating(0); setMessage('')
      setToast('🎉 Thank you! Your review has been added.')
    } catch (err) {
      console.error(err)
      setToast('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-6 sm:py-10 animate-fade-in">
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

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
            <StockBadge status={product.status} />
          </div>

          <h1 className="text-3xl font-black leading-tight">{product.name}</h1>

          {product.reviewCount > 0 && (
            <div className="flex items-center gap-2">
              <Stars rating={product.rating} size={16} />
              <span className="text-sm font-bold">{product.rating}</span>
              <span className="text-xs text-gray-400">
                · {product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* Variant pricing */}
          <div className="flex flex-wrap gap-2">
            {product.variants.length > 0 ? (
              product.variants.map((v) => (
                <div key={v.id || v.name} className="bg-gray-50 rounded-2xl px-4 py-2">
                  <span className="text-lg font-black text-primary">₹{v.price}</span>
                  <span className="text-xs text-gray-400 ml-1.5">/ {v.name}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">Pricing not available yet</p>
            )}
          </div>

          {product.description && (
            <div>
              <h2 className="text-sm font-bold mb-1.5">About</h2>
              <p className="text-sm leading-relaxed text-gray-600">{product.longDescription}</p>
            </div>
          )}

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

        {/* Add review form */}
        <div className="bg-white rounded-3xl p-5 shadow-soft mb-6">
          <h3 className="text-base font-extrabold mb-3">Reviewed this product? Share it</h3>
          <form onSubmit={submit} className="flex flex-col gap-3">
            <input
              className="w-full border border-gray-200 rounded-2xl py-2.5 px-4 text-sm outline-none bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={60}
            />
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(n)}
                  style={{ color: (hover || rating) >= n ? '#f4a261' : '#ddd' }}
                  className="bg-transparent border-none cursor-pointer text-2xl p-0.5 transition-colors"
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              className="w-full border border-gray-200 rounded-2xl py-2.5 px-4 text-sm outline-none bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition resize-none min-h-[80px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How was this product?"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-white rounded-2xl py-2.5 text-sm font-bold hover:bg-primary-light active:scale-[0.97] transition-all disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>

        {reviews.length === 0 ? (
          <p className="text-sm text-gray-400">No reviews yet for this product. Be the first!</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {reviews.map((r, i) => (
              <ReviewCard key={r.id} review={r} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
