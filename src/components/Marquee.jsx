import './Marquee.css'

export default function Marquee({ items }) {
  const loop = [...items, ...items]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {loop.map((item, idx) => (
          <span className="marquee-chip" key={`${item}-${idx}`}>
            <span className="marquee-dot" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
