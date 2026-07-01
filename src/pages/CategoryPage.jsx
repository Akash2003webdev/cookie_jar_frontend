import { useState, useEffect } from 'react'
import { fetchProductsByCategoryId } from '../lib/api'
import ProductCard from '../components/ProductCard'

export default function CategoryPage({ category, onBack, onViewProduct }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    fetchProductsByCategoryId(category.id)
      .then((data) => active && setItems(data))
      .catch((err) => {
        console.error(err)
        if (active) setError('Could not load items right now.')
      })
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [category.id])

  return (
    <section className="max-w-6xl mx-auto px-5 py-6 sm:py-10 animate-fade-in">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-gray-700 bg-transparent border-none cursor-pointer mb-5"
      >
        ← Back to Menu
      </button>

      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Menu</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black">{category.name}</h1>
        </div>
        {!loading && (
          <span className="text-xs text-gray-400 font-medium">
            {items.length} item{items.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-10 text-center text-sm text-gray-400 shadow-soft">
          Loading items...
        </div>
      ) : error ? (
        <div className="bg-white rounded-3xl p-10 text-center text-sm text-red-400 shadow-soft">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center text-sm text-gray-400 shadow-soft">
          No items in this category yet. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p, i) => (
            <ProductCard key={p.id} product={p} onView={onViewProduct} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}
