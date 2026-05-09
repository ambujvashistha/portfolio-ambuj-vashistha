import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { intro } from '../data/portfolioContent'
import './IntroLoader.css'

export default function IntroLoader() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const seen = sessionStorage.getItem('intro-seen')
    if (seen) {
      setShow(false)
      return
    }
    const timer = setTimeout(() => {
      setShow(false)
      sessionStorage.setItem('intro-seen', '1')
    }, intro?.durationMs || 2400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="intro-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            clipPath: 'inset(0 0 100% 0)',
            transition: { duration: 0.55, ease: [0.7, 0, 0.3, 1] },
          }}
        >
          <motion.div
            className="intro-paper"
            initial={{ y: 24, rotate: -1 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="intro-eyebrow">{intro?.eyebrow || 'portfolio'}</p>
            <h1 className="intro-name">{intro?.name || 'Ambuj Vashistha'}</h1>
            <motion.div
              className="intro-bar"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.9, ease: 'easeInOut' }}
            />
            <p className="intro-tag handwritten-line">{intro?.tag || 'just a moment...'}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
