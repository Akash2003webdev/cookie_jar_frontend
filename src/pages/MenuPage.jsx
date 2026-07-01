import { useState, useEffect } from 'react'
import { fetchCategories, fetchProducts } from '../lib/api'

export default function MenuPage({ onViewCategory }) {
  const [categories, setCategories] = useState([])
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    Promise.all([fetchCategories(), fetchProducts()])
      .then(([cats, products]) => {
        if (!active) return
        const map = {}
        products.forEach((p) => {
          map[p.category] = (map[p.category] || 0) + 1
        })
        setCategories(cats)
        setCounts(map)
      })
      .catch((err) => {
        console.error(err)
        if (active) setError('Could not load categories right now.')
      })
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-5 py-8 sm:py-12">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">Explore</p>
      <h1 className="mt-1 text-2xl sm:text-3xl font-black">Our Menu</h1>
      <p className="mt-1 text-sm text-gray-500">Pick a category to see what's freshly baked.</p>

      {loading ? (
        <div className="mt-6 bg-white rounded-3xl p-10 text-center text-sm text-gray-400 shadow-soft">
          Loading categories...
        </div>
      ) : error ? (
        <div className="mt-6 bg-white rounded-3xl p-10 text-center text-sm text-red-400 shadow-soft">
          {error}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c, i) => {
            const count = counts[c.name] || 0
            return (
              <div
                key={c.id}
                className="bg-white rounded-3xl overflow-hidden shadow-soft cursor-pointer hover:-translate-y-1 hover:shadow-card transition-all duration-200 animate-fade-up"
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => onViewCategory(c)}
              >
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-extrabold">{c.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {count} item{count !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
