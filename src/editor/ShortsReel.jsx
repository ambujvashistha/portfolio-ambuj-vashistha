import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import RevealText from '../components/RevealText'
import { SpiderWeb, Pokeball, Lightning } from './Doodles'

/* A draggable 3D phone that plays the channel's shorts, with a fullscreen lightbox. */
export default function ShortsReel({ videos }) {
  const shorts = videos.slice(0, 8)
  const [active, setActive] = useState(0)
  const [full, setFull] = useState(null)
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()

  const rx = useMotionValue(-6)
  const ry = useMotionValue(16)
  const srx = useSpring(rx, { stiffness: 120, damping: 14 })
  const sry = useSpring(ry, { stiffness: 120, damping: 14 })
  const drag = useRef(null)

  // auto-advance the reel
  useEffect(() => {
    if (paused || full != null || shorts.length < 2) return
    const t = setInterval(() => setActive((a) => (a + 1) % shorts.length), 3800)
    return () => clearInterval(t)
  }, [paused, full, shorts.length])

  // lock scroll while fullscreen
  useEffect(() => {
    if (full == null) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setFull(null)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [full])

  const onDown = (e) => {
    if (reduced) return
    drag.current = { x: e.clientX, y: e.clientY, rx: rx.get(), ry: ry.get() }
    setPaused(true)
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onMove = (e) => {
    if (!drag.current) return
    const dx = e.clientX - drag.current.x
    const dy = e.clientY - drag.current.y
    ry.set(clamp(drag.current.ry + dx * 0.45, -55, 55))
    rx.set(clamp(drag.current.rx - dy * 0.4, -38, 38))
  }
  const onUp = () => {
    drag.current = null
    setPaused(false)
  }

  if (shorts.length === 0) {
    return (
      <section className="ed-shorts" id="ed-reel">
        <div className="ed-section-head">
          <RevealText text="Shorts, in your hand." as="h2" className="ed-h2" />
        </div>
        <div className="ed-shorts-loading">loading shorts…</div>
      </section>
    )
  }

  const current = shorts[active]

  return (
    <section className="ed-shorts" id="ed-reel">
      <SpiderWeb className="ed-doodle ed-doodle-web" />
      <Pokeball className="ed-doodle ed-doodle-ball" />
      <Lightning className="ed-doodle ed-doodle-bolt" />

      <div className="ed-section-head">
        <RevealText text="Shorts, in your hand." as="h2" className="ed-h2" />
        <motion.p
          className="ed-section-sub"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Spin the phone around. Tap fullscreen to watch the real thing.
        </motion.p>
      </div>

      <div className="ed-shorts-stage">
        <motion.div
          className="ed-phone"
          style={{ rotateX: srx, rotateY: sry }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          initial={{ opacity: 0, y: 40, rotateY: 60 }}
          whileInView={{ opacity: 1, y: 0, rotateY: 16 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 70, damping: 16 }}
        >
          <div className={`ed-phone-float ${reduced ? 'is-still' : ''}`}>
            <div className="ed-phone-body">
              <span className="ed-phone-notch" />
              <span className="ed-phone-btn ed-phone-btn-power" />
              <span className="ed-phone-btn ed-phone-btn-vol" />
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={current.id}
                  className="ed-phone-screen"
                  style={{ backgroundImage: `url(${current.image})` }}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="ed-phone-glare" />
                  <span className="ed-phone-badge">SHORT · {active + 1}/{shorts.length}</span>
                  <button className="ed-phone-play" onClick={() => setFull(current.id)} aria-label="Play fullscreen">
                    ▶
                  </button>
                  <p className="ed-phone-caption">{current.title}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <p className="ed-shorts-hint handwritten-line">grab + spin me ↺</p>
      </div>

      <div className="ed-shorts-controls">
        <button className="ed-chip" onClick={() => setActive((a) => (a - 1 + shorts.length) % shorts.length)} aria-label="Previous short">‹</button>
        <div className="ed-shorts-dots">
          {shorts.map((s, i) => (
            <button
              key={s.id}
              className={`ed-dot ${i === active ? 'is-on' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`Short ${i + 1}`}
            />
          ))}
        </div>
        <button className="ed-chip" onClick={() => setActive((a) => (a + 1) % shorts.length)} aria-label="Next short">›</button>
        <button className="ed-fs-btn" onClick={() => setFull(current.id)}>⛶ Fullscreen</button>
      </div>

      <div className="ed-shorts-rail">
        {shorts.map((s, i) => (
          <motion.button
            key={s.id}
            className={`ed-rail-thumb ${i === active ? 'is-active' : ''}`}
            style={{ backgroundImage: `url(${s.image})` }}
            onClick={() => setActive(i)}
            whileHover={{ y: -5 }}
            aria-label={s.title}
          />
        ))}
      </div>

      <AnimatePresence>
        {full != null && (
          <motion.div
            className="ed-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFull(null)}
          >
            <SpiderWeb className="ed-full-web ed-full-web-tl" />
            <SpiderWeb className="ed-full-web ed-full-web-br" />
            <motion.div
              className="ed-full-phone"
              initial={{ scale: 0.82, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                title="Short"
                src={`https://www.youtube.com/embed/${full}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </motion.div>
            <button className="ed-full-close" onClick={() => setFull(null)} aria-label="Close">×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v))
}
