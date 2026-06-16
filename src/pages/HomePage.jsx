import { useState, useMemo } from 'react'
import HeroSection from '../components/HeroSection'
import SearchBar from '../components/SearchBar'
import ProductCard from '../components/ProductCard'
import ReviewCard from '../components/ReviewCard'
import Footer from '../components/Footer'
import { products, initialReviews } from '../lib/data'

export default function HomePage({ onViewProduct, onNav }) {
  const [query, setQuery]       = useState('')
  const [category, setCategory] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      const mq =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      const mc = !category || p.category === category
      return mq && mc
    })
  }, [query, category])

  return (
    <>
      <HeroSection />

      {/* Search */}
      <section className="max-w-6xl mx-auto px-5 -mt-6 sm:-mt-8">
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-card">
          <SearchBar value={query} onChange={setQuery} active={category} onCategory={setCategory} />
        </div>
      </section>

      {/* Products */}
      <section className="max-w-6xl mx-auto px-5 py-8 sm:py-12">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Our Menu</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black">
              {category || 'Popular Bakes'}
            </h2>
          </div>
          <span className="text-xs text-gray-400 font-medium">
            {filtered.length} item{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-6 bg-white rounded-3xl p-10 text-center text-sm text-gray-400 shadow-soft">
            No products match your search. Try a different keyword.
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} onView={onViewProduct} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Reviews preview */}
      <section className="max-w-6xl mx-auto px-5 pb-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Customer Love</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black">What people are saying</h2>
          </div>
          <button
            onClick={() => onNav('reviews')}
            className="text-sm font-bold text-primary hover:underline bg-transparent border-none cursor-pointer"
          >
            View all →
          </button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {initialReviews.map((r, i) => (
            <ReviewCard key={r.id} review={r} index={i} />
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}
