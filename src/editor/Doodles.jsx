import { motion } from 'framer-motion'

const INK = 'rgba(28,23,16,0.5)'
const BLUE = 'rgba(15,157,143,0.75)' // editor "cool" = teal
const RED = 'rgba(224,123,24,0.8)' // editor "warm" = amber

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1, delay: 0.05 * i, ease: 'easeInOut' }, opacity: { duration: 0.2, delay: 0.05 * i } },
  }),
}

/* Corner spider web, anchored at top-left of its viewBox. */
export function SpiderWeb({ className = '' }) {
  const O = 5
  const angles = [2, 22, 44, 66, 88]
  const rings = [40, 72, 104]
  const pt = (r, deg) => {
    const a = (deg * Math.PI) / 180
    return [O + r * Math.cos(a), O + r * Math.sin(a)]
  }
  const threads = angles.map((deg) => {
    const [x, y] = pt(120, deg)
    return `M${O} ${O} L${x.toFixed(1)} ${y.toFixed(1)}`
  })
  const arcs = []
  rings.forEach((r) => {
    for (let i = 0; i < angles.length - 1; i++) {
      const [x1, y1] = pt(r, angles[i])
      const [x2, y2] = pt(r, angles[i + 1])
      const [cx, cy] = pt(r * 0.8, (angles[i] + angles[i + 1]) / 2)
      arcs.push(`M${x1.toFixed(1)} ${y1.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`)
    }
  })
  return (
    <motion.svg
      className={className}
      viewBox="0 0 130 130"
      fill="none"
      aria-hidden="true"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      {threads.map((d, i) => (
        <motion.path key={`t${i}`} d={d} stroke={INK} strokeWidth="1.4" strokeLinecap="round" variants={draw} custom={i} />
      ))}
      {arcs.map((d, i) => (
        <motion.path key={`a${i}`} d={d} stroke={i % 2 ? BLUE : INK} strokeWidth="1.2" strokeLinecap="round" variants={draw} custom={i * 0.4 + 2} />
      ))}
    </motion.svg>
  )
}

/* Sketchy pokeball. */
export function Pokeball({ className = '' }) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
    >
      <motion.circle cx="50" cy="50" r="40" stroke={INK} strokeWidth="2.4" variants={draw} custom={0} />
      <motion.path d="M11 52 H89" stroke={RED} strokeWidth="2.4" strokeLinecap="round" variants={draw} custom={1} />
      <motion.circle cx="50" cy="52" r="11" stroke={INK} strokeWidth="2.4" fill="#fffdf8" variants={draw} custom={2} />
      <motion.circle cx="50" cy="52" r="4.5" stroke={BLUE} strokeWidth="2" variants={draw} custom={2.6} />
    </motion.svg>
  )
}

/* Energy bolt. */
export function Lightning({ className = '' }) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 60 100"
      fill="none"
      aria-hidden="true"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
    >
      <motion.path
        d="M34 4 L14 50 L30 50 L20 96 L50 40 L32 40 Z"
        stroke={RED}
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        variants={draw}
      />
    </motion.svg>
  )
}
