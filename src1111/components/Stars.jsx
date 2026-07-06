export default function Stars({ rating, size = 13 }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          style={{ fontSize: size, color: n <= Math.round(rating) ? '#f4a261' : '#ddd' }}
        >
          ★
        </span>
      ))}
    </span>
  )
}
