const categories = ['Cake', 'Brownie', 'Pastry', 'Dessert', 'Cookies', 'Birthday Cake']

export default function SearchBar({ value, onChange, active, onCategory }) {
  return (
    <div>
      {/* Search input */}
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search cakes, brownies, pastries..."
          className="w-full border border-gray-200 rounded-2xl py-3 pl-10 pr-4 text-sm outline-none bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition"
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pt-3">
        <button
          onClick={() => onCategory(null)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            active === null ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => onCategory(c === active ? null : c)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              active === c ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}
