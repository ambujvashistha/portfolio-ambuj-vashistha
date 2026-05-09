import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import tapeStrip from '../assets/tape-strip.svg'
import { hero, profile } from '../data/portfolioContent'
import linkify from '../utils/linkify'
import Magnetic from './Magnetic'
import RoughUnderline from './RoughUnderline'

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
}

export default function HeroSection({ bullets }) {
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const rotateX = useSpring(useTransform(tiltY, [-0.5, 0.5], [10, -10]), {
    stiffness: 220,
    damping: 18,
  })
  const rotateY = useSpring(useTransform(tiltX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 220,
    damping: 18,
  })

  const onPortraitMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    tiltX.set((event.clientX - rect.left) / rect.width - 0.5)
    tiltY.set((event.clientY - rect.top) / rect.height - 0.5)
  }
  const onPortraitLeave = () => {
    tiltX.set(0)
    tiltY.set(0)
  }

  return (
    <section className="hero-grid" id="top">
      <motion.div
        className="hero-copy"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.08, delayChildren: 0.05 }}
      >
        <motion.p className="eyebrow" variants={fadeUp} transition={{ duration: 0.5 }}>
          {hero?.eyebrow || 'Developer'}
        </motion.p>
        <motion.p
          className="hero-kicker handwritten-line"
          variants={fadeUp}
          transition={{ duration: 0.55 }}
        >
          {hero?.kicker}
        </motion.p>
        <motion.h1 variants={fadeUp} transition={{ duration: 0.6 }}>
          <span className="hero-name-first">{profile?.firstName || 'Ambuj'}</span>
          <span className="hero-name-pencil-wrap">
            <span className="hero-name-pencil">{profile?.lastName || 'Vashistha'}</span>
          </span>
        </motion.h1>
        <motion.div
          className="hero-underline"
          aria-hidden="true"
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          <RoughUnderline width={420} height={36} className="hero-rough-stroke" />
        </motion.div>
        <motion.p
          className="hero-summary"
          variants={fadeUp}
          transition={{ duration: 0.55 }}
        >
          {hero?.summary}
        </motion.p>

        <motion.div className="hero-actions" variants={fadeUp} transition={{ duration: 0.5 }}>
          <Magnetic strength={0.4}>
            <motion.a
              className="primary-action"
              href={hero?.primaryCta?.href || '#projects'}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            >
              {hero?.primaryCta?.label || 'View Projects'}
            </motion.a>
          </Magnetic>
          <Magnetic strength={0.2}>
            <motion.a
              className="secondary-action"
              href={hero?.secondaryCta?.href || '#about'}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            >
              {hero?.secondaryCta?.label || 'Read Notes'}
            </motion.a>
          </Magnetic>
        </motion.div>

        <motion.ul
          className="hero-bullets"
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          {bullets.map((bullet, idx) => (
            <motion.li
              key={bullet}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + idx * 0.06 }}
            >
              {linkify(bullet)}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.aside
        className="portrait-card"
        aria-label="Portrait"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 22, delay: 0.25 }}
        onMouseMove={onPortraitMove}
        onMouseLeave={onPortraitLeave}
        style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: 'preserve-3d' }}
      >
        <div className="portrait-paper" style={{ transform: 'translateZ(20px)' }}>
          <img
            className="tape-strip tape-strip-portrait"
            src={tapeStrip}
            alt=""
            aria-hidden="true"
            decoding="async"
            loading="lazy"
          />
          <div className="portrait-frame">
            <div className="portrait-sketch" aria-hidden="true">
              <span className="sketch halo" />
              <span className="sketch head" />
              <span className="sketch jaw" />
              <span className="sketch shoulder-left" />
              <span className="sketch shoulder-right" />
            </div>
            <p className="portrait-note">{profile?.name || 'Ambuj Vashistha'}</p>
          </div>
        </div>
      </motion.aside>
    </section>
  )
}
