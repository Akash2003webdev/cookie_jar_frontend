import { useState, useMemo, useEffect } from 'react'
import HeroSection from '../components/HeroSection'
import SearchBar from '../components/SearchBar'
import CategoryShowcase from '../components/CategoryShowcase'
import ProductCard from '../components/ProductCard'
import ReviewCard from '../components/ReviewCard'
import Footer from '../components/Footer'
import { fetchProducts, fetchOverallReviews, fetchCategories } from '../lib/api'

// Default category shown on the home page's "Popular Bakes" section.
// Change this text if you want a different default category (must match
// the category_name in your product_category table, case-insensitive).
const DEFAULT_CATEGORY_MATCH = 'brownie'

export default function HomePage({ onViewProduct, onNav }) {
  const [query, setQuery]           = useState('')
  const [category, setCategory]     = useState(null)
  const [isDefaultView, setIsDefaultView] = useState(true)
  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [reviews, setReviews]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    Promise.all([fetchProducts(), fetchOverallReviews(), fetchCategories()])
      .then(([p, r, c]) => {
        if (!active) return
        setProducts(p)
        setReviews(r.slice(0, 3))
        setCategories(c)

        const defaultCat = c.find((cat) =>
          cat.name.toLowerCase().includes(DEFAULT_CATEGORY_MATCH)
        )
        if (defaultCat) setCategory(defaultCat.name)
      })
      .catch((err) => {
        console.error(err)
        if (active) setError('Could not load products right now.')
      })
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  function handleCategoryChange(catName) {
    setCategory(catName)
    setIsDefaultView(false)
  }

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
  }, [products, query, category])

  const sectionTitle = isDefaultView ? 'Popular Bakes' : (category || 'All Items')

  return (
    <>
      <HeroSection />

      {/* Search */}
      <section className="max-w-6xl mx-auto px-5 -mt-6 sm:-mt-8">
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-card">
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </section>

      {/* Shop by Category */}
      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 pt-6">
          <CategoryShowcase
            categories={categories}
            active={category}
            onCategory={handleCategoryChange}
            onViewAll={() => onNav('menu')}
          />
        </section>
      )}

      {/* Products */}
      <section className="max-w-6xl mx-auto px-5 py-8 sm:py-12">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Our Menu</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black">{sectionTitle}</h2>
          </div>
          {!loading && (
            <span className="text-xs text-gray-400 font-medium">
              {filtered.length} item{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {loading ? (
          <div className="mt-6 bg-white rounded-3xl p-10 text-center text-sm text-gray-400 shadow-soft">
            Loading menu...
          </div>
        ) : error ? (
          <div className="mt-6 bg-white rounded-3xl p-10 text-center text-sm text-red-400 shadow-soft">
            {error}
          </div>
        ) : filtered.length === 0 ? (
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
        {reviews.length > 0 && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {reviews.map((r, i) => (
              <ReviewCard key={r.id} review={r} index={i} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  )
}
