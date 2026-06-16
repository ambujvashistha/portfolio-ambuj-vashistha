import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import Magnetic from '../components/Magnetic'
import RevealText from '../components/RevealText'
import RoughUnderline from '../components/RoughUnderline'
import useYouTube from '../hooks/useYouTube'
import { useNav } from '../nav'
import { craftNotes, editorProfile, timeline } from './editorData'
import ShortsReel from './ShortsReel'
import ChannelPage from './ChannelPage'
import DaResolve from './DaResolve'
import { Lightning, Pokeball, SpiderWeb } from './Doodles'
import './EditorPortfolio.css'

const EditingRoom = lazy(() => import('./EditingRoom'))

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }
const ease = [0.22, 1, 0.36, 1]

/* ---------- helpers ---------- */
function formatCount(n) {
  if (n == null) return '—'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1).replace(/\.0$/, '') + 'K'
  return String(n)
}

function CountUp({ value, format = (v) => Math.round(v).toLocaleString() }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(value == null ? null : 0)
  useEffect(() => {
    if (value == null) return
    if (!inView || reduced) {
      setDisplay(value)
      return
    }
    let raf
    const start = performance.now()
    const dur = 1200
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur)
      setDisplay(value * (1 - Math.pow(1 - t, 3)))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, reduced])
  return <span ref={ref}>{display == null ? '—' : format(display)}</span>
}

/* ---------- nav ---------- */
function EditorNav() {
  const { go } = useNav()
  return (
    <motion.header
      className="ed-nav"
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
    >
      <Magnetic strength={0.25}>
        <button className="ed-back" onClick={() => go('dev')}>
          <span aria-hidden="true">←</span> back to the notebook
        </button>
      </Magnetic>
      <div className="ed-nav-id">
        <span className="ed-nav-name">{editorProfile.name}</span>
        <span className="ed-nav-role handwritten-line">{editorProfile.role}</span>
      </div>
      <Magnetic strength={0.3}>
        <motion.a
          className="ed-subscribe"
          href={editorProfile.channelUrl}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          Subscribe
        </motion.a>
      </Magnetic>
    </motion.header>
  )
}

/* ---------- hero ---------- */
function Hero({ channel, featured }) {
  const [playing, setPlaying] = useState(false)
  const reduced = useReducedMotion()
  const id = featured?.id
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const rotateX = useSpring(useTransform(tiltY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 18 })
  const rotateY = useSpring(useTransform(tiltX, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 18 })
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    tiltX.set((e.clientX - r.left) / r.width - 0.5)
    tiltY.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    tiltX.set(0)
    tiltY.set(0)
  }

  return (
    <section className="ed-hero">
      <SpiderWeb className="ed-doodle ed-doodle-hero-web" />
      <Pokeball className="ed-doodle ed-doodle-hero-ball" />
      <motion.div
        className="ed-hero-copy"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.09, delayChildren: 0.1 }}
      >
        <motion.p className="ed-eyebrow" variants={fadeUp} transition={{ duration: 0.5 }}>
          <span className="ed-rec" /> REC · {editorProfile.handle}
        </motion.p>
        <motion.p className="ed-hero-kicker handwritten-line" variants={fadeUp} transition={{ duration: 0.5 }}>
          press play on the notebook
        </motion.p>
        <RevealText text="Cuts that hit on the drop." as="h1" className="ed-title" delay={0.2} />
        <motion.div className="ed-title-underline" variants={fadeUp} transition={{ duration: 0.5 }}>
          <RoughUnderline width={360} height={32} primaryColor="#e07b18" secondaryColor="#0f9d8f" />
        </motion.div>
        <motion.p className="ed-lead" variants={fadeUp} transition={{ duration: 0.55 }}>
          {editorProfile.tagline}
        </motion.p>
        <motion.div className="ed-hero-actions" variants={fadeUp} transition={{ duration: 0.5 }}>
          <Magnetic strength={0.4}>
            <motion.a
              className="ed-btn ed-btn-primary"
              href={editorProfile.channelUrl}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              ▶ Watch on YouTube
            </motion.a>
          </Magnetic>
          <Magnetic strength={0.2}>
            <motion.a className="ed-btn ed-btn-ghost" href="#ed-reel" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              Spin the reel
            </motion.a>
          </Magnetic>
        </motion.div>
        <motion.ul className="ed-hero-bullets" variants={fadeUp} transition={{ duration: 0.5 }}>
          {[`${channel?.videoCount ?? '—'} uploads, all hand-cut`, 'Beat-synced to the frame', 'Teal & orange, but on paper'].map((b, i) => (
            <motion.li key={b} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.08 }}>
              {b}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.aside
        className="ed-monitor"
        initial={{ opacity: 0, y: 30, rotate: 1.5 }}
        animate={{ opacity: 1, y: 0, rotate: 2 }}
        transition={{ type: 'spring', stiffness: 160, damping: 20, delay: 0.3 }}
        onMouseMove={reduced ? undefined : onMove}
        onMouseLeave={onLeave}
        style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      >
        <span className="ed-tape ed-tape-1" aria-hidden="true" />
        <span className="ed-tape ed-tape-2" aria-hidden="true" />
        <div
          className="ed-monitor-frame"
          style={featured ? { backgroundImage: `url(${featured.image})` } : undefined}
        >
          {id && (playing || !reduced) ? (
            <iframe
              className="ed-monitor-video"
              src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&modestbranding=1&rel=0&playsinline=1`}
              title={featured?.title || 'Featured edit'}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          ) : featured ? (
            <button className="ed-monitor-poster" onClick={() => setPlaying(true)}>
              <span className="ed-play">▶</span>
            </button>
          ) : (
            <div className="ed-monitor-empty">no signal</div>
          )}
          <div className="ed-monitor-scan" aria-hidden="true" />
          <span className="ed-halftone" aria-hidden="true" />
        </div>
        <p className="ed-monitor-note handwritten-line">now showing ↑</p>
      </motion.aside>
    </section>
  )
}

/* ---------- film strip marquee ---------- */
function FilmStrip({ videos }) {
  if (videos.length < 2) return null
  const loop = [...videos, ...videos].slice(0, 24)
  return (
    <div className="ed-filmstrip" aria-hidden="true">
      <div className="ed-film-perf ed-film-perf-top" />
      <div className="ed-film-track">
        {loop.map((v, i) => (
          <span className="ed-film-frame" key={i} style={{ backgroundImage: `url(${v.image})` }} />
        ))}
      </div>
      <div className="ed-film-perf ed-film-perf-bottom" />
    </div>
  )
}

/* ---------- stats ---------- */
function StatsBand({ channel }) {
  const stats = [
    { label: 'subscribers', node: <CountUp value={channel?.subs} format={(v) => formatCount(Math.round(v))} /> },
    { label: 'total views', node: <CountUp value={channel?.views} format={(v) => formatCount(Math.round(v))} /> },
    { label: 'uploads', node: <CountUp value={channel?.videoCount} format={(v) => Math.round(v)} /> },
    { label: 'watch hours', node: <span>250+</span> },
  ]
  return (
    <motion.section
      className="ed-stats"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {stats.map((s) => (
        <motion.div className="ed-stat" key={s.label} variants={fadeUp} transition={{ duration: 0.5, ease }} whileHover={{ y: -4, rotate: -1 }}>
          <span className="ed-stat-num">{s.node}</span>
          <span className="ed-stat-rule" aria-hidden="true" />
          <span className="ed-stat-label">{s.label}</span>
        </motion.div>
      ))}
    </motion.section>
  )
}

/* ---------- editing timeline ---------- */
function EditTimeline() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const SPAN = 12
  return (
    <section className="ed-timeline-wrap" ref={ref}>
      <div className="ed-section-head">
        <RevealText text="How a cut comes together." as="h2" className="ed-h2" />
        <motion.p className="ed-section-sub" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          The stack, taped onto the timeline like the real thing.
        </motion.p>
      </div>
      <motion.div
        className={`ed-timeline ${inView ? 'is-live' : ''}`}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease }}
      >
        <div className="ed-ruler" aria-hidden="true">
          {Array.from({ length: SPAN + 1 }).map((_, i) => (
            <span key={i} style={{ left: `${(i / SPAN) * 100}%` }}>{String(i).padStart(2, '0')}</span>
          ))}
        </div>
        {timeline.map((row, ri) => (
          <div className="ed-track" key={row.track}>
            <span className="ed-track-name handwritten-line">{row.track}</span>
            <div className="ed-track-lane">
              {row.clips.map((c, ci) => (
                <div
                  key={c.label}
                  className={`ed-clip ed-clip-${row.color}`}
                  style={{
                    left: `${(c.start / SPAN) * 100}%`,
                    width: `${(c.len / SPAN) * 100}%`,
                    transitionDelay: `${(ri * 3 + ci) * 60}ms`,
                  }}
                >
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="ed-playhead" aria-hidden="true" />
      </motion.div>
      <motion.div
        className="ed-craft"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.09 }}
      >
        {craftNotes.map((n) => (
          <motion.div className="ed-craft-item" key={n.k} variants={fadeUp} transition={{ duration: 0.5, ease }} whileHover={{ y: -5, rotate: 0.6 }}>
            <span className="ed-craft-pin" aria-hidden="true" />
            <h3 className="handwritten-line">{n.k}</h3>
            <p>{n.v}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

/* ---------- latest uploads ---------- */
function LatestUploads({ videos }) {
  if (!videos.length) return null
  const rot = [-2.4, 1.6, -1.2, 2.2, -1.8, 1.1, -2, 1.4, -1.5, 2, -1, 1.8]
  return (
    <section className="ed-uploads">
      <div className="ed-section-head">
        <RevealText text="Latest cuts." as="h2" className="ed-h2" />
        <motion.p className="ed-section-sub" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          Fresh from the channel, taped straight in.
        </motion.p>
      </div>
      <div className="ed-strip">
        {videos.slice(0, 12).map((v, i) => (
          <motion.a
            key={v.id}
            className="ed-card"
            href={v.link}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 26, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: rot[i % rot.length] }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.05, ease }}
            whileHover={{ y: -8, rotate: 0, scale: 1.02 }}
          >
            <span className="ed-card-tape" aria-hidden="true" />
            <div className="ed-card-thumb" style={{ backgroundImage: `url(${v.image})` }}>
              <span className="ed-card-play">▶</span>
            </div>
            <p className="ed-card-title handwritten-line">{v.title}</p>
          </motion.a>
        ))}
      </div>
    </section>
  )
}

/* ---------- footer ---------- */
function EditorFooter() {
  const { go } = useNav()
  return (
    <footer className="ed-footer">
      <RevealText text="Need an editor who feels the beat?" as="h2" className="ed-footer-h" />
      <motion.p className="ed-footer-sub" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        {editorProfile.blurb}
      </motion.p>
      <motion.div
        className="ed-footer-actions"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Magnetic strength={0.4}>
          <motion.a className="ed-btn ed-btn-primary" href={editorProfile.channelUrl} target="_blank" rel="noreferrer" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }}>
            Subscribe on YouTube
          </motion.a>
        </Magnetic>
        <Magnetic strength={0.2}>
          <motion.button className="ed-btn ed-btn-ghost" onClick={() => go('dev')} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            ← flip back to the notebook
          </motion.button>
        </Magnetic>
      </motion.div>
      <p className="ed-footer-credit handwritten-line">same person. other side of the notebook.</p>
    </footer>
  )
}

/* ---------- the cozy 3D editing room ---------- */
function RoomSection({ featured }) {
  const [entered, setEntered] = useState(false)
  const [watch, setWatch] = useState(null)

  useEffect(() => {
    if (!watch) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setWatch(null)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [watch])

  return (
    <section className="ed-room" id="ed-room">
      <Pokeball className="ed-doodle ed-doodle-room-ball" />
      <div className="ed-section-head">
        <RevealText text="Step into the editing room." as="h2" className="ed-h2" />
        <motion.p
          className="ed-section-sub"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          A cozy little place, sketched in 3D. Walk around, find the TV, watch an edit.
        </motion.p>
      </div>

      <motion.div
        className="ed-room-frame"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease }}
      >
        {entered ? (
          <Suspense fallback={<div className="ed-room-loading">building the room…</div>}>
            <EditingRoom videoId={featured?.id} title={featured?.title} onWatch={() => setWatch(featured?.id)} />
            <button className="ed-room-exit" onClick={() => setEntered(false)}>✕ leave</button>
          </Suspense>
        ) : (
          <button className="ed-room-enter" onClick={() => setEntered(true)}>
            <span className="ed-room-enter-icon">🛋️</span>
            <span className="ed-room-enter-main">Enter the room</span>
            <span className="ed-room-enter-note handwritten-line">grab a seat →</span>
          </button>
        )}
      </motion.div>

      <AnimatePresence>
        {watch && (
          <motion.div className="ed-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setWatch(null)}>
            <SpiderWeb className="ed-full-web ed-full-web-tl" />
            <motion.div
              className="ed-full-wide"
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                title="Edit"
                src={`https://www.youtube.com/embed/${watch}?autoplay=1&rel=0&modestbranding=1`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </motion.div>
            <button className="ed-full-close" onClick={() => setWatch(null)} aria-label="Close">×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

/* ---------- playable mock DaVinci Resolve ---------- */
function ResolveSection({ videos }) {
  const [watch, setWatch] = useState(null)
  useEffect(() => {
    if (!watch) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setWatch(null)
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [watch])

  return (
    <section className="ed-resolve">
      <Lightning className="ed-doodle ed-doodle-resolve-bolt" />
      <div className="ed-section-head">
        <RevealText text="Sit in my color bay." as="h2" className="ed-h2" />
        <motion.p className="ed-section-sub" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          A working mock of DaVinci Resolve. Drag the wheels and sliders — grade a real frame.
        </motion.p>
      </div>
      <motion.div
        className="ed-resolve-frame"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease }}
      >
        <span className="ed-tape ed-tape-1" aria-hidden="true" />
        <span className="ed-tape ed-tape-2" aria-hidden="true" />
        <DaResolve videos={videos} onWatch={(id) => setWatch(id)} />
      </motion.div>
      <p className="ed-resolve-note handwritten-line">grab the wheels ↑ go nuts</p>

      <AnimatePresence>
        {watch && (
          <motion.div className="ed-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setWatch(null)}>
            <SpiderWeb className="ed-full-web ed-full-web-tl" />
            <motion.div className="ed-full-wide" initial={{ scale: 0.85, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.88, opacity: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 24 }} onClick={(e) => e.stopPropagation()}>
              <iframe title="Edit" src={`https://www.youtube.com/embed/${watch}?autoplay=1&rel=0&modestbranding=1`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
            </motion.div>
            <button className="ed-full-close" onClick={() => setWatch(null)} aria-label="Close">×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default function EditorPortfolio() {
  const { channel, videos } = useYouTube()
  const featured = videos[0]
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 22, mass: 0.4 })

  useEffect(() => {
    document.body.classList.add('editor-mode')
    return () => document.body.classList.remove('editor-mode')
  }, [])

  return (
    <main className="ed-root">
      <motion.div className="ed-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <EditorNav />
      <Hero channel={channel} featured={featured} />
      <FilmStrip videos={videos} />
      <ShortsReel videos={videos} />
      <StatsBand channel={channel} />
      <ChannelPage channel={channel} videos={videos} />
      {/* 3D cozy room — kept but hidden for now. Re-enable with <RoomSection featured={featured} />. */}
      <EditTimeline />
      {/* Mock DaVinci Resolve — kept but hidden for now; make it more Resolve-accurate later.
          Re-enable by rendering <ResolveSection videos={videos} /> here. */}
      <LatestUploads videos={videos} />
      <EditorFooter />
    </main>
  )
}
