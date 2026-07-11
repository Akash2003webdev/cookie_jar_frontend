export default function SearchBar({ value, onChange }) {
  return (
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
  )
}
