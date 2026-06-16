import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import RevealText from '../components/RevealText'
import { SpiderWeb, Pokeball, Lightning } from './Doodles'

/* A draggable 3D phone that *plays* the channel's shorts inline, fling it around
   the stage, and tap fullscreen for sound. */
export default function ShortsReel({ videos }) {
  const shorts = videos.filter((v) => v.isShort).slice(0, 8)
  const [active, setActive] = useState(0)
  const [full, setFull] = useState(null)
  const [paused, setPaused] = useState(false)
  const [muted, setMuted] = useState(true)
  const reduced = useReducedMotion()

  const stageRef = useRef(null)
  const frameRef = useRef(null)

  // Drag moves the phone; its tilt is coupled to where it sits, so a fling
  // banks it like a real object. At rest (0,0) it keeps the angled hero pose.
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateY = useSpring(useTransform(x, [-260, 260], [-28, 60]), { stiffness: 120, damping: 14 })
  const rotateX = useSpring(useTransform(y, [-260, 260], [34, -34]), { stiffness: 120, damping: 14 })

  // auto-advance the reel (paused while hovered, dragging, fullscreen, or unmuted)
  useEffect(() => {
    if (paused || full != null || !muted || shorts.length < 2) return
    const t = setInterval(() => setActive((a) => (a + 1) % shorts.length), 5000)
    return () => clearInterval(t)
  }, [paused, full, muted, shorts.length])

  // each new short starts muted (its iframe src autostarts muted)
  useEffect(() => setMuted(true), [active])

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

  const ytCommand = (func) =>
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args: [] }),
      '*',
    )
  const toggleMute = (e) => {
    e.stopPropagation()
    ytCommand(muted ? 'unMute' : 'mute')
    setMuted((m) => !m)
  }
  const stopDrag = (e) => e.stopPropagation()

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
          They play right on the phone — grab it, fling it around. Tap 🔊 for sound or ⛶ for fullscreen.
        </motion.p>
      </div>

      <div className="ed-shorts-stage" ref={stageRef}>
        <motion.div
          className="ed-phone"
          drag={!reduced}
          dragConstraints={stageRef}
          dragElastic={0.16}
          dragMomentum
          whileDrag={{ scale: 1.03, cursor: 'grabbing' }}
          style={reduced ? undefined : { x, y, rotateX, rotateY }}
          onDragStart={() => setPaused(true)}
          onDragEnd={() => setPaused(false)}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 80, damping: 16 }}
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
                  {!reduced && (
                    <iframe
                      ref={frameRef}
                      className="ed-phone-video"
                      src={`https://www.youtube.com/embed/${current.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${current.id}&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`}
                      title={current.title}
                      allow="autoplay; encrypted-media; picture-in-picture"
                    />
                  )}
                  <span className="ed-phone-glare" />
                  <span className="ed-phone-badge">SHORT · {active + 1}/{shorts.length}</span>
                  {reduced ? (
                    <button className="ed-phone-play" onClick={() => setFull(current.id)} aria-label="Play fullscreen">
                      ▶
                    </button>
                  ) : (
                    <>
                      <button
                        className="ed-phone-ctl ed-phone-mute"
                        onClick={toggleMute}
                        onPointerDownCapture={stopDrag}
                        aria-pressed={!muted}
                        aria-label={muted ? 'Unmute' : 'Mute'}
                      >
                        {muted ? '🔇' : '🔊'}
                      </button>
                      <button
                        className="ed-phone-ctl ed-phone-fs"
                        onClick={() => setFull(current.id)}
                        onPointerDownCapture={stopDrag}
                        aria-label="Fullscreen"
                      >
                        ⛶
                      </button>
                    </>
                  )}
                  <p className="ed-phone-caption">{current.title}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <p className="ed-shorts-hint handwritten-line">grab + fling me ✦</p>
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
