import { motion } from 'framer-motion'
import './ProcessStrip.css'

export default function ProcessStrip({ steps = [] }) {
  const STEPS = steps.length ? steps : []
  return (
    <section className="process-strip" aria-label="How I work">
      <p className="process-eyebrow">How I work</p>
      <div className="process-grid">
        {STEPS.map((s, idx) => (
          <motion.article
            className="process-step"
            key={s.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="process-num">{s.n}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
