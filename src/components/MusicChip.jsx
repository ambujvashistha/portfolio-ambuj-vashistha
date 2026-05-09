import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { music } from '../data/portfolioContent'
import './MusicChip.css'

const PLAYLIST = music?.playlist?.length ? music.playlist : []

export default function MusicChip() {
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    const a = new Audio()
    a.preload = 'metadata'
    a.volume = 0.32
    audioRef.current = a
    const onEnded = () => setIdx((i) => (i + 1) % PLAYLIST.length)
    const onError = () => setPlaying(false)
    a.addEventListener('ended', onEnded)
    a.addEventListener('error', onError)
    return () => {
      a.removeEventListener('ended', onEnded)
      a.removeEventListener('error', onError)
      a.pause()
      a.src = ''
    }
  }, [])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const expected = PLAYLIST[idx].src
    if (a.src !== expected) {
      a.src = expected
      a.load()
    }
    if (playing) {
      a.play().catch(() => setPlaying(false))
    } else {
      a.pause()
    }
  }, [idx, playing])

  useEffect(() => {
    const onToggle = () => setExpanded((v) => !v)
    window.addEventListener('toggle-music', onToggle)
    return () => window.removeEventListener('toggle-music', onToggle)
  }, [])

  const track = PLAYLIST[idx]

  const next = () => setIdx((i) => (i + 1) % PLAYLIST.length)
  const prev = () => setIdx((i) => (i - 1 + PLAYLIST.length) % PLAYLIST.length)

  return (
    <motion.div
      className={`music-chip ${expanded ? 'music-chip-expanded' : ''}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.5 }}
      data-cursor="link"
    >
      <button
        className="music-toggle"
        onClick={() => setPlaying((v) => !v)}
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? (
          <span className="music-bars" aria-hidden="true">
            <span /><span /><span />
          </span>
        ) : (
          <svg width="11" height="13" viewBox="0 0 11 13" fill="currentColor" aria-hidden="true">
            <path d="M0 0L11 6.5L0 13V0Z" />
          </svg>
        )}
      </button>

      <div className="music-info" onClick={() => setExpanded((v) => !v)}>
        <span className="music-title">{track.title}</span>
        <span className="music-artist">{track.artist}</span>
      </div>

      {expanded && (
        <div className="music-controls">
          <button onClick={prev} aria-label="Previous">‹</button>
          <button onClick={next} aria-label="Next">›</button>
        </div>
      )}
    </motion.div>
  )
}
