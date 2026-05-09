import { motion } from 'framer-motion'
import './Certifications.css'

export default function Certifications({ items }) {
  if (!items?.length) return null

  return (
    <motion.section
      className="certs"
      id="certs"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Certifications"
    >
      <header className="certs-head">
        <p className="certs-eyebrow">Certifications</p>
        <p className="certs-sub">verified, dated, link-ready</p>
      </header>

      <div className="certs-grid">
        {items.map((c, idx) => (
          <motion.a
            key={c.title}
            className={`cert cert-${c.accent}`}
            href={c.link || '#'}
            target={c.link ? '_blank' : undefined}
            rel={c.link ? 'noreferrer' : undefined}
            data-cursor="link"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: idx * 0.06 }}
            whileHover={{ y: -3 }}
          >
            <div className="cert-top">
              <span className="cert-badge" aria-hidden="true">
                {c.initials}
              </span>
              <div className="cert-headline">
                <p className="cert-issuer">{c.issuer}</p>
                <p className="cert-date">{c.date}</p>
              </div>
              <span className="cert-arrow" aria-hidden="true">↗</span>
            </div>
            <p className="cert-title">{c.title}</p>
            {c.body ? <p className="cert-body">{c.body}</p> : null}
          </motion.a>
        ))}
      </div>
    </motion.section>
  )
}
