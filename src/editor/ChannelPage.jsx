import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import RevealText from '../components/RevealText'
import { editorProfile } from './editorData'
import { SpiderWeb } from './Doodles'
import './ChannelPage.css'

/* ---- hand-drawn action icons ---- */
const ThumbUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 10v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3z" />
    <path d="M7 10l3.5-7c1.3-.2 2.2.6 2 2L12 9h5.6c1.1 0 1.9 1 1.6 2l-1.6 6c-.2.8-.9 1.3-1.7 1.3H7" />
  </svg>
)
const CommentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
    <path d="M7.5 9.5h9M7.5 12.5h6" />
  </svg>
)
const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 13c4-6 9-7 13-7" /><path d="M13 2l4 4-4 4" /><path d="M4 13v5a2 2 0 0 0 2 2h12" />
  </svg>
)
const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2z" /><path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
)

function ago(iso) {
  if (!iso) return ''
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000)
  const units = [['yr', 31536000], ['mo', 2592000], ['wk', 604800], ['day', 86400], ['hr', 3600], ['min', 60]]
  for (const [u, sec] of units) { const n = Math.floor(s / sec); if (n >= 1) return `${n} ${u}${n > 1 ? 's' : ''} ago` }
  return 'just now'
}
const isNew = (iso) => iso && Date.now() - new Date(iso).getTime() < 7 * 86400 * 1000
function fmt(n) {
  if (n == null) return '—'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1).replace(/\.0$/, '') + 'K'
  return String(n)
}
function fmtDur(s) {
  if (!s) return ''
  const m = Math.floor(s / 60), ss = s % 60
  return `${m}:${String(ss).padStart(2, '0')}`
}
function joinDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

/* ---- real YouTube IFrame-API player (inline, with end detection) ---- */
let apiPromise
function loadAPI() {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.YT && window.YT.Player) return Promise.resolve()
  if (apiPromise) return apiPromise
  apiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => { if (prev) prev(); resolve() }
    if (!document.querySelector('script[data-yt-api]')) {
      const s = document.createElement('script')
      s.src = 'https://www.youtube.com/iframe_api'
      s.async = true
      s.dataset.ytApi = '1'
      document.head.appendChild(s)
    }
  })
  return apiPromise
}

function YTPlayer({ videoId, autoplay, onEnded }) {
  const hostRef = useRef(null)
  const playerRef = useRef(null)
  const endedRef = useRef(onEnded)
  endedRef.current = onEnded

  useEffect(() => {
    let cancelled = false
    loadAPI().then(() => {
      if (cancelled || !hostRef.current) return
      playerRef.current = new window.YT.Player(hostRef.current, {
        width: '100%',
        height: '100%',
        videoId,
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1, autoplay: 0 },
        events: {
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.ENDED) endedRef.current?.()
          },
        },
      })
    })
    return () => { cancelled = true; try { playerRef.current?.destroy() } catch { /* noop */ } playerRef.current = null }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const pl = playerRef.current
    if (!pl || !pl.loadVideoById) return
    if (autoplay) pl.loadVideoById(videoId)
    else pl.cueVideoById(videoId)
  }, [videoId, autoplay])

  return <div className="ch-stage"><div ref={hostRef} className="ch-yt" /></div>
}

export default function ChannelPage({ channel, videos }) {
  const longs = videos.filter((v) => !v.isShort)
  const shorts = videos.filter((v) => v.isShort)
  const playlist = longs.length ? longs : videos

  const [activeId, setActiveId] = useState(playlist[0]?.id)
  const [autoplay, setAutoplay] = useState(false)
  const [theater, setTheater] = useState(false)
  const [autoNext, setAutoNext] = useState(true)
  const [showAbout, setShowAbout] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shortModal, setShortModal] = useState(null)
  const playerWrapRef = useRef(null)

  useEffect(() => {
    if (!shortModal) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setShortModal(null)
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [shortModal])

  if (!videos.length) {
    return (
      <section className="ch" id="ed-channel">
        <div className="ed-section-head"><RevealText text="The channel." as="h2" className="ed-h2" /></div>
        <div className="ch-loading">loading the channel…</div>
      </section>
    )
  }

  const cur = videos.find((v) => v.id === activeId) || playlist[0]
  const watchUrl = `https://www.youtube.com/watch?v=${cur.id}`
  const subUrl = `${editorProfile.channelUrl}?sub_confirmation=1`
  const open = (url) => window.open(url, '_blank', 'noopener')

  const play = (id) => {
    setActiveId(id)
    setAutoplay(true)
    playerWrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const onEnded = () => {
    if (!autoNext) return
    const i = playlist.findIndex((v) => v.id === cur.id)
    const next = playlist[(i + 1) % playlist.length]
    if (next) { setActiveId(next.id); setAutoplay(true) }
  }
  const share = async () => {
    try { await navigator.clipboard.writeText(watchUrl); setCopied(true); setTimeout(() => setCopied(false), 1600) }
    catch { open(watchUrl) }
  }

  return (
    <section className="ch" id="ed-channel">
      <div className="ed-section-head">
        <RevealText text="The channel." as="h2" className="ed-h2" />
        <motion.p className="ed-section-sub" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          The whole channel, here in the notebook — videos below, shorts on the right. Watch without ever leaving.
        </motion.p>
      </div>

      <motion.div
        className="ch-card"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="ch-banner" style={channel.banner ? { backgroundImage: `url(${channel.banner}), linear-gradient(110deg, #0f9d8f, #e07b18)` } : undefined} />

        <div className="ch-head">
          <div className="ch-avatar" style={channel.thumb ? { backgroundImage: `url(${channel.thumb})` } : undefined}>
            {!channel.thumb && (channel.title?.[0] || 'A')}
          </div>
          <div className="ch-meta">
            <h3 className="ch-name">{channel.title}</h3>
            <p className="ch-stats">
              <span className="ch-handle">{editorProfile.handle}</span>
              <span>{fmt(channel.subs)} subscribers</span>
              <span>{channel.videoCount ?? '—'} videos</span>
              <span>{fmt(channel.views)} views</span>
            </p>
            <button className="ch-about-toggle" onClick={() => setShowAbout((s) => !s)}>
              {showAbout ? 'Hide about ▲' : 'About this channel ▾'}
            </button>
          </div>
          <button className="ch-subscribe" onClick={() => open(subUrl)}><BellIcon /> Subscribe</button>
        </div>

        <AnimatePresence initial={false}>
          {showAbout && (
            <motion.div className="ch-about" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
              <div className="ch-about-inner">
                <p className="ch-about-desc">{channel.description}</p>
                <div className="ch-about-facts">
                  <span><b>Joined</b> {joinDate(channel.publishedAt)}</span>
                  <span><b>{fmt(channel.views)}</b> total views</span>
                  <span><b>{channel.videoCount ?? '—'}</b> uploads</span>
                  <a href={editorProfile.channelUrl} target="_blank" rel="noreferrer">youtube.com/{editorProfile.handle} ↗</a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* player */}
        <div className={`ch-player ${theater ? 'is-theater' : ''}`} ref={playerWrapRef}>
          <YTPlayer videoId={cur.id} autoplay={autoplay} onEnded={onEnded} />
          <div className="ch-now">
            <div className="ch-now-head">
              <div>
                <h4 className="ch-now-title">{cur.title}</h4>
                <p className="ch-now-meta">
                  {cur.views != null ? `${fmt(cur.views)} views` : `${fmt(channel.views)} channel views`}
                  {cur.likes != null && ` · ${fmt(cur.likes)} likes`} · {ago(cur.publishedAt)}
                </p>
              </div>
              <div className="ch-player-ctrls">
                <button className="ch-ctrl" onClick={() => { const i = playlist.findIndex((v) => v.id === cur.id); play(playlist[(i - 1 + playlist.length) % playlist.length].id) }} title="Previous">‹ Prev</button>
                <button className="ch-ctrl" onClick={() => { const i = playlist.findIndex((v) => v.id === cur.id); play(playlist[(i + 1) % playlist.length].id) }} title="Next">Next ›</button>
                <button className={`ch-ctrl ${autoNext ? 'is-on' : ''}`} onClick={() => setAutoNext((a) => !a)} title="Autoplay next">⟳ Autoplay</button>
                <button className={`ch-ctrl ${theater ? 'is-on' : ''}`} onClick={() => setTheater((t) => !t)} title="Theater mode">▭ Theater</button>
              </div>
            </div>
            <div className="ch-actions">
              <button className="ch-act" onClick={() => open(watchUrl)} title="Like on YouTube"><ThumbUp /><span>Like</span></button>
              <button className="ch-act" onClick={() => open(watchUrl)} title="Comment on YouTube"><CommentIcon /><span>Comment</span></button>
              <button className={`ch-act ${copied ? 'is-copied' : ''}`} onClick={share} title="Copy link"><ShareIcon /><span>{copied ? 'Copied!' : 'Share'}</span></button>
              <button className="ch-act ch-act-sub" onClick={() => open(subUrl)} title="Subscribe on YouTube"><BellIcon /><span>Subscribe</span></button>
            </div>
            <p className="ch-note handwritten-line">like, comment & subscribe pop over to YouTube — the rest stays in the notebook ✦</p>
          </div>
        </div>

        {/* browse: videos (main) + shorts (rail) */}
        <div className="ch-browse">
          <div className="ch-videos-col">
            <h4 className="ch-col-title">Videos <span>{longs.length}</span></h4>
            <div className="ch-grid">
              {longs.map((v) => (
                <motion.button key={v.id} className={`ch-vid ${v.id === activeId ? 'is-playing' : ''}`} onClick={() => play(v.id)} whileHover={{ y: -4 }}>
                  <span className="ch-vid-thumb" style={{ backgroundImage: `url(${v.image})` }}>
                    <span className="ch-vid-play">▶</span>
                    {isNew(v.publishedAt) && <span className="ch-badge-new">NEW</span>}
                    {v.durationSec ? <span className="ch-vid-dur">{fmtDur(v.durationSec)}</span> : null}
                    {v.id === activeId && <span className="ch-vid-live">▶ now playing</span>}
                  </span>
                  <span className="ch-vid-title">{v.title}</span>
                  <span className="ch-vid-meta">{v.views != null ? `${fmt(v.views)} views · ` : ''}{ago(v.publishedAt)}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <aside className="ch-shorts-rail">
            <h4 className="ch-col-title">Shorts <span>{shorts.length}</span></h4>
            <div className="ch-shorts-scroll">
              {shorts.length === 0 && <p className="ch-shorts-empty">No shorts detected.</p>}
              {shorts.map((v) => (
                <motion.button key={v.id} className="ch-short" onClick={() => setShortModal(v.id)} whileHover={{ scale: 1.02 }}>
                  <span className="ch-short-thumb" style={{ backgroundImage: `url(${v.image})` }}>
                    <span className="ch-short-play">▶</span>
                    {isNew(v.publishedAt) && <span className="ch-badge-new">NEW</span>}
                  </span>
                  <span className="ch-short-title">{v.title}</span>
                  <span className="ch-short-meta">{v.views != null ? `${fmt(v.views)} views` : ago(v.publishedAt)}</span>
                </motion.button>
              ))}
            </div>
          </aside>
        </div>
      </motion.div>

      {/* vertical short player (stays on site) */}
      <AnimatePresence>
        {shortModal && (
          <motion.div className="ed-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShortModal(null)}>
            <SpiderWeb className="ed-full-web ed-full-web-tl" />
            <motion.div className="ed-full-phone" initial={{ scale: 0.82, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 24 }} onClick={(e) => e.stopPropagation()}>
              <iframe title="Short" src={`https://www.youtube.com/embed/${shortModal}?autoplay=1&playsinline=1&rel=0&modestbranding=1`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
            </motion.div>
            <button className="ed-full-close" onClick={() => setShortModal(null)} aria-label="Close">×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
