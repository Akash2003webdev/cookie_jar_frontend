import Stars from './Stars'

export default function ReviewCard({ review, index }) {
  return (
    <div
      className="bg-white rounded-[1.25rem] p-4 shadow-soft animate-fade-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-extrabold text-sm text-primary flex-shrink-0">
            {review.name[0]}
          </div>
          <div>
            <p className="text-sm font-bold">{review.name}</p>
            <p className="text-[11px] text-gray-400">{review.date}</p>
          </div>
        </div>
        <Stars rating={review.rating} size={14} />
      </div>
      <p className="text-[13px] mt-2.5 leading-relaxed text-gray-700">{review.message}</p>
    </div>
  )
}
