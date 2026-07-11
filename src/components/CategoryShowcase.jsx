export default function CategoryShowcase({ categories, active, onCategory, onViewAll }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-black">Shop by Category</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-red-500 hover:underline bg-transparent border-none cursor-pointer"
        >
          View all
        </button>
      </div>

      <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-1">
        {categories.map((c) => {
          const isActive = active === c.name
          return (
            <button
              key={c.id}
              onClick={() => onCategory(c.name === active ? null : c.name)}
              className="flex-shrink-0 flex flex-col items-center gap-2 bg-transparent border-none cursor-pointer w-20 sm:w-24"
            >
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-50 transition-all ${
                  isActive ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
              >
                <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
              </div>
              <span className={`text-xs font-semibold truncate w-full text-center ${isActive ? 'text-primary' : 'text-gray-600'}`}>
                {c.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
