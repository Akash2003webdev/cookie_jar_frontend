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
    <section className="max-w-6xl mx-auto px-5 py-10 sm:py-14">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Explore
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Our Menu
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            Pick a category to see what's freshly baked.
          </p>
        </div>
        {!loading && !error && (
          <p className="text-xs font-semibold text-gray-400">
            {categories.length} categories
          </p>
        )}
      </div>

      {/* Loading skeleton */}
      {loading ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl overflow-hidden bg-white shadow-soft animate-pulse"
            >
              <div className="aspect-square bg-gray-100" />
              <div className="p-3.5 space-y-2">
                <div className="h-3.5 w-2/3 bg-gray-100 rounded-full" />
                <div className="h-2.5 w-1/3 bg-gray-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-8 bg-white rounded-3xl p-12 text-center shadow-soft border border-red-50">
          <p className="text-sm font-medium text-red-400">{error}</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c, i) => {
            const count = counts[c.name] || 0
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onViewCategory(c)}
                className="group text-left bg-white rounded-3xl overflow-hidden shadow-soft
                           ring-1 ring-black/[0.03]
                           hover:-translate-y-1.5 hover:shadow-card hover:ring-primary/20
                           active:scale-[0.98]
                           transition-all duration-300 ease-out
                           animate-fade-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="w-full h-full object-cover
                               group-hover:scale-110
                               transition-transform duration-700 ease-out"
                  />
                  {/* premium gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* floating count pill on image */}
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2.5 py-1
                                    rounded-full bg-white/90 backdrop-blur-sm text-gray-700
                                    shadow-sm">
                    {count} item{count !== 1 ? 's' : ''}
                  </span>

                  {/* arrow cue on hover */}
                  <span className="absolute bottom-2.5 right-2.5 h-7 w-7 rounded-full
                                    bg-white/90 backdrop-blur-sm flex items-center justify-center
                                    text-gray-700 text-xs font-bold
                                    translate-y-2 opacity-0
                                    group-hover:translate-y-0 group-hover:opacity-100
                                    transition-all duration-300">
                    →
                  </span>
                </div>

                <div className="p-3.5">
                  <h3 className="text-sm font-extrabold text-gray-900 group-hover:text-primary transition-colors duration-200">
                    {c.name}
                  </h3>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}