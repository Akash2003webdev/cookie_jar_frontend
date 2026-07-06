import { useState, useEffect } from 'react'
import ReviewCard from '../components/ReviewCard'
import Toast from '../components/Toast'
import { fetchOverallReviews, submitOverallReview } from '../lib/api'

export default function ReviewsPage({ onBack }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName]       = useState('')
  const [rating, setRating]   = useState(0)
  const [hover, setHover]     = useState(0)
  const [message, setMessage] = useState('')
  const [toast, setToast]     = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true
    fetchOverallReviews()
      .then((data) => active && setReviews(data))
      .catch((err) => console.error(err))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  async function submit(e) {
    e.preventDefault()
    if (name.trim().length < 2)   { setToast('Name must be at least 2 characters'); return }
    if (rating === 0)              { setToast('Please select a rating'); return }
    if (message.trim().length < 5) { setToast('Please write a longer review'); return }

    setSubmitting(true)
    try {
      await submitOverallReview({ name: name.trim(), rating, message: message.trim() })
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
    <>
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      <div className="max-w-2xl mx-auto px-5 py-6 sm:py-10 animate-fade-in">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-gray-700 bg-transparent border-none cursor-pointer mb-5"
        >
          ← Back
        </button>

        <p className="text-xs font-bold uppercase tracking-widest text-primary">Customer Love</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-black mb-6">Reviews</h1>

        {/* Form */}
        <div className="bg-white rounded-3xl p-5 shadow-soft mb-7">
          <h2 className="text-lg font-extrabold mb-4">Share your experience</h2>
          <form onSubmit={submit}>
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-400 mb-1.5">Your Name</label>
              <input
                className="w-full border border-gray-200 rounded-2xl py-2.5 px-4 text-sm outline-none bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                maxLength={60}
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-400 mb-1.5">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(n)}
                    style={{ color: (hover || rating) >= n ? '#f4a261' : '#ddd' }}
                    className="bg-transparent border-none cursor-pointer text-3xl p-1 transition-colors"
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-400 mb-1.5">Your Review</label>
              <textarea
                className="w-full border border-gray-200 rounded-2xl py-2.5 px-4 text-sm outline-none bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition resize-none min-h-[90px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your experience..."
                maxLength={500}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white rounded-2xl py-3 text-sm font-bold hover:bg-primary-light active:scale-[0.97] transition-all disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>

        {/* Review list */}
        {loading ? (
          <p className="text-sm text-gray-400 text-center">Loading reviews...</p>
        ) : (
          <div className="flex flex-col gap-3">
            {reviews.map((r, i) => (
              <ReviewCard key={r.id} review={r} index={i} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
