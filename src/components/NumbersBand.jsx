import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import './NumbersBand.css'

function Counter({ value, suffix, duration = 1.4 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView || value == null) return
    const start = performance.now()
    const isFloat = !Number.isInteger(value)
    let raf
    const tick = (t) => {
      const p = Math.min(1, (t - start) / (duration * 1000))
      const eased = 1 - Math.pow(1 - p, 3)
      const cur = isFloat ? +(value * eased).toFixed(2) : Math.round(value * eased)
      setN(cur)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration])

  return (
    <span ref={ref} className="numbers-value">
      {value == null ? '—' : n}
      <span className="numbers-suffix">{suffix}</span>
    </span>
  )
}

export default function NumbersBand({ githubUser = 'ambujvashistha', items = [] }) {
  const [ghContribs, setGhContribs] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch(`https://github-contributions-api.jogruber.de/v4/${githubUser}?y=last`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.contributions) return
        const total = data.contributions.reduce((acc, d) => acc + (d.count || 0), 0)
        setGhContribs(total)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [githubUser])

  const numbers = items.map((n) => {
    if (n.live === 'github') {
      return {
        ...n,
        value: ghContribs,
        sub: ghContribs != null ? n.sub : 'fetching...',
      }
    }
    return n
  })

  return (
    <motion.section
      className="numbers-band"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Career numbers"
    >
      {numbers.map((n) => (
        <div className="numbers-item" key={n.label}>
          <Counter value={n.value} suffix={n.suffix} />
          <p className="numbers-label">{n.label}</p>
          <p className="numbers-sub">{n.sub}</p>
        </div>
      ))}
    </motion.section>
  )
}
