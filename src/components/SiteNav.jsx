import { motion } from 'framer-motion'
import Magnetic from './Magnetic'
import ResumeViewer from './ResumeViewer'

export default function SiteNav({ items }) {
  return (
    <header className="site-nav">
      <a className="brand-mark" href="#top" data-cursor="link">
        Ambuj Vashistha
      </a>

      <nav className="nav-links" aria-label="Primary">
        {items.map((item, idx) => (
          <Magnetic key={item} strength={0.3}>
            <motion.a
              href={`#${item.toLowerCase()}`}
              data-cursor="link"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + idx * 0.05, duration: 0.4 }}
              whileHover={{ y: -2 }}
            >
              {item}
            </motion.a>
          </Magnetic>
        ))}
      </nav>

      <div className="nav-actions">
        <ResumeViewer />
      </div>
    </header>
  )
}
