import Stars from './Stars'
import { bakery } from '../lib/data'

export default function Footer() {
  return (
    <footer className="mt-4 border-t border-gray-200 bg-white px-5 pt-10 pb-24 sm:pb-10">
      <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-3">
        {/* Brand */}
        <div>
          <h3 className="text-lg font-black">{bakery.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{bakery.tagline}</p>
          <div className="flex items-center gap-1.5 mt-3">
            <Stars rating={bakery.rating} size={14} />
            <span className="text-sm font-bold">{bakery.rating}</span>
            <span className="text-xs text-gray-400">({bakery.reviewCount} reviews)</span>
          </div>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            Freshly baked cakes, brownies and pastries — crafted daily with premium ingredients.
          </p>
        </div>

        {/* Location */}
        <div>
          <h4 className="text-sm font-bold mb-2.5">Visit Us</h4>
          <p className="text-sm text-gray-500 flex gap-1.5 mb-2">📍 {bakery.address}</p>
          <p className="text-sm text-gray-500 flex gap-1.5 mb-3">🕙 Closes {bakery.closes}</p>
          <div className="rounded-2xl overflow-hidden border border-gray-200">
            <iframe
              title="Location"
              src={`https://www.google.com/maps?q=${encodeURIComponent(bakery.address)}&output=embed`}
              width="100%"
              height="150"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-bold mb-2.5">Contact</h4>
          <a
            href={`tel:${bakery.phoneRaw}`}
            className="flex items-center gap-1.5 text-sm text-primary font-bold hover:underline"
          >
            📞 {bakery.phone}
          </a>
          <a
            href={bakery.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-primary font-bold mt-2 hover:underline"
          >
            🗺 Get Directions
          </a>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-8 pt-5 border-t border-gray-100">
        © {new Date().getFullYear()} Cookie Jar Bakery. All rights reserved.
      </p>
    </footer>
  )
}
