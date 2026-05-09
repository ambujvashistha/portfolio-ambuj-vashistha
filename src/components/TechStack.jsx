import { motion } from 'framer-motion'
import './TechStack.css'

export default function TechStack({ groups }) {
  if (!groups?.length) return null

  return (
    <div className="tech-stack">
      <div className="tech-stack-head">
        <span className="tech-stack-eyebrow">Stack</span>
        <span className="tech-stack-rule" aria-hidden="true" />
        <span className="tech-stack-meta">{groups.reduce((acc, g) => acc + g.items.length, 0)} tools</span>
      </div>

      {groups.map((group, gi) => (
        <motion.div
          key={group.label}
          className="tech-row"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: gi * 0.06 }}
        >
          <span className="tech-row-label">{group.label}</span>
          <div className="tech-row-chips">
            {group.items.map((item, ii) => (
              <motion.span
                key={item}
                className="tech-chip"
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.32, delay: gi * 0.06 + ii * 0.022 }}
                whileHover={{ y: -2, scale: 1.04 }}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
