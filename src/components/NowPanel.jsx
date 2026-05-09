import { motion } from 'framer-motion'
import linkify from '../utils/linkify'
import './NowPanel.css'

export default function NowPanel({ items }) {
  if (!items?.length) return null

  return (
    <div className="now-panel">
      <div className="now-head">
        <span className="now-pulse" aria-hidden="true">
          <span className="now-pulse-dot" />
        </span>
        <span className="now-eyebrow">Currently</span>
        <span className="now-stamp">{new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
      </div>
      <ul className="now-list">
        {items.map((it, idx) => (
          <motion.li
            key={it.label}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
          >
            <span className="now-label">{it.label}</span>
            <span className="now-value">{linkify(it.value)}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
