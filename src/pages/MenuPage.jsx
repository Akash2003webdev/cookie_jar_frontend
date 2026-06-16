import { categoryMeta, products } from '../lib/data'

export default function MenuPage({ onViewCategory }) {
  return (
    <section className="max-w-6xl mx-auto px-5 py-8 sm:py-12">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">Explore</p>
      <h1 className="mt-1 text-2xl sm:text-3xl font-black">Our Menu</h1>
      <p className="mt-1 text-sm text-gray-500">Pick a category to see what's freshly baked.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categoryMeta.map((c, i) => {
          const count = products.filter((p) => p.category === c.name).length
          return (
            <div
              key={c.slug}
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
    </section>
  )
}
