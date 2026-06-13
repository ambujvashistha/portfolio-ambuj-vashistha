import { useEffect, useRef, useState } from 'react'
import './DaResolve.css'

const PAGES = ['Media', 'Cut', 'Edit', 'Fusion', 'Color', 'Fairlight', 'Deliver']
const DURATION = 22 // seconds, matches a typical short

const DEFAULT_GRADE = {
  sat: 1,
  con: 1,
  bri: 1,
  temp: 0,
  lift: { x: 0, y: 0 },
  gamma: { x: 0, y: 0 },
  gain: { x: 0, y: 0 },
}

function tc(seconds) {
  const f = Math.floor((seconds % 1) * 24)
  const s = Math.floor(seconds) % 60
  const m = Math.floor(seconds / 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`
}

function wheelColor({ x, y }) {
  const r = Math.min(1, Math.hypot(x, y))
  const hue = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
  return { color: `hsl(${hue.toFixed(0)}, 75%, 55%)`, opacity: r * 0.45 }
}

/* A draggable color wheel (Lift / Gamma / Gain). */
function Wheel({ label, value, onChange }) {
  const ref = useRef(null)
  const dragging = useRef(false)
  const set = (e) => {
    const r = ref.current.getBoundingClientRect()
    let x = ((e.clientX - r.left) / r.width) * 2 - 1
    let y = ((e.clientY - r.top) / r.height) * 2 - 1
    const m = Math.hypot(x, y)
    if (m > 1) { x /= m; y /= m }
    onChange({ x, y })
  }
  return (
    <div className="da-wheel">
      <div
        ref={ref}
        className="da-wheel-disc"
        onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); set(e) }}
        onPointerMove={(e) => dragging.current && set(e)}
        onPointerUp={() => (dragging.current = false)}
        onDoubleClick={() => onChange({ x: 0, y: 0 })}
      >
        <span className="da-wheel-handle" style={{ left: `${(value.x + 1) * 50}%`, top: `${(value.y + 1) * 50}%` }} />
      </div>
      <span className="da-wheel-label">{label}</span>
    </div>
  )
}

function Slider({ label, min, max, step, value, onChange, fmt }) {
  return (
    <label className="da-slider">
      <span className="da-slider-row"><span>{label}</span><span className="da-slider-val">{fmt ? fmt(value) : value}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} />
    </label>
  )
}

export default function DaResolve({ videos, onWatch }) {
  const clips = videos.slice(0, 8)
  const [active, setActive] = useState(0)
  const [page, setPage] = useState('Color')
  const [grade, setGrade] = useState(DEFAULT_GRADE)
  const [playing, setPlaying] = useState(false)
  const [head, setHead] = useState(0) // 0..1
  const raf = useRef(0)
  const last = useRef(0)

  useEffect(() => {
    if (!playing) return
    const tick = (now) => {
      if (!last.current) last.current = now
      const dt = (now - last.current) / 1000
      last.current = now
      setHead((h) => (h + dt / DURATION) % 1)
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf.current); last.current = 0 }
  }, [playing])

  const clip = clips[active]
  const filter = `saturate(${grade.sat}) contrast(${grade.con}) brightness(${grade.bri})`
  const warm = grade.temp >= 0
  const tempColor = warm ? '255, 150, 70' : '70, 150, 255'
  const tempOpacity = (Math.abs(grade.temp) / 100) * 0.4

  const scrub = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setHead(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)))
  }

  if (!clip) return <div className="da-loading">loading project…</div>

  return (
    <div className="da">
      {/* title bar + page tabs */}
      <div className="da-top">
        <div className="da-brand"><span className="da-logo">◧</span> DaVinci Resolve <span className="da-proj">· ambuj_edits.drp</span></div>
        <div className="da-pages">
          {PAGES.map((pp) => (
            <button key={pp} className={`da-page ${pp === page ? 'is-on' : ''}`} onClick={() => setPage(pp)}>{pp}</button>
          ))}
        </div>
      </div>

      <div className="da-body">
        {/* media pool */}
        <div className="da-pool">
          <div className="da-panel-title">Media Pool</div>
          <div className="da-pool-grid">
            {clips.map((c, i) => (
              <button
                key={c.id}
                className={`da-pool-clip ${i === active ? 'is-active' : ''}`}
                style={{ backgroundImage: `url(${c.image})` }}
                onClick={() => { setActive(i); setHead(0) }}
                title={c.title}
              >
                <span className="da-pool-dur">0:{String(10 + i).padStart(2, '0')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* viewer */}
        <div className="da-viewer-wrap">
          <div className="da-viewer">
            <div className="da-viewer-img" style={{ backgroundImage: `url(${clip.image})`, filter }} />
            <div className="da-grade-layer" style={{ background: `rgba(${tempColor}, ${tempOpacity})`, mixBlendMode: 'soft-light' }} />
            <div className="da-grade-layer" style={{ ...wheelLayer(grade.lift, 'multiply') }} />
            <div className="da-grade-layer" style={{ ...wheelLayer(grade.gamma, 'soft-light') }} />
            <div className="da-grade-layer" style={{ ...wheelLayer(grade.gain, 'screen') }} />
            <div className="da-viewer-safe" />
            <button className="da-viewer-expand" onClick={() => onWatch?.(clip.id)} title="Watch full">⛶</button>
            <div className="da-viewer-title">{clip.title}</div>
          </div>
          {/* transport */}
          <div className="da-transport">
            <span className="da-tc">{tc(head * DURATION)}</span>
            <div className="da-jog" onPointerDown={scrub} onPointerMove={(e) => e.buttons === 1 && scrub(e)}>
              <span className="da-jog-fill" style={{ width: `${head * 100}%` }} />
              <span className="da-jog-head" style={{ left: `${head * 100}%` }} />
            </div>
            <button className="da-btn" onClick={() => setHead(0)}>⏮</button>
            <button className="da-btn da-btn-play" onClick={() => setPlaying((p) => !p)}>{playing ? '⏸' : '▶'}</button>
            <span className="da-tc da-tc-dim">{tc(DURATION)}</span>
          </div>
        </div>

        {/* color panel */}
        <div className="da-color">
          <div className="da-panel-title">Color — Primaries</div>
          <div className="da-wheels">
            <Wheel label="Lift" value={grade.lift} onChange={(v) => setGrade((g) => ({ ...g, lift: v }))} />
            <Wheel label="Gamma" value={grade.gamma} onChange={(v) => setGrade((g) => ({ ...g, gamma: v }))} />
            <Wheel label="Gain" value={grade.gain} onChange={(v) => setGrade((g) => ({ ...g, gain: v }))} />
          </div>
          <Slider label="Saturation" min={0} max={2} step={0.01} value={grade.sat} onChange={(v) => setGrade((g) => ({ ...g, sat: v }))} fmt={(v) => Math.round(v * 50)} />
          <Slider label="Contrast" min={0.5} max={1.8} step={0.01} value={grade.con} onChange={(v) => setGrade((g) => ({ ...g, con: v }))} fmt={(v) => v.toFixed(2)} />
          <Slider label="Brightness" min={0.5} max={1.6} step={0.01} value={grade.bri} onChange={(v) => setGrade((g) => ({ ...g, bri: v }))} fmt={(v) => v.toFixed(2)} />
          <Slider label="Temperature" min={-100} max={100} step={1} value={grade.temp} onChange={(v) => setGrade((g) => ({ ...g, temp: v }))} fmt={(v) => (v > 0 ? `+${v}` : v)} />
          <button className="da-reset" onClick={() => setGrade(DEFAULT_GRADE)}>Reset grade</button>
        </div>
      </div>

      {/* timeline */}
      <div className="da-timeline">
        <div className="da-tl-ruler" onPointerDown={scrub} onPointerMove={(e) => e.buttons === 1 && scrub(e)}>
          {Array.from({ length: 11 }).map((_, i) => (
            <span key={i} className="da-tl-tick" style={{ left: `${i * 10}%` }}>{tc((i / 10) * DURATION).slice(0, 5)}</span>
          ))}
          <span className="da-playhead" style={{ left: `${head * 100}%` }} />
        </div>
        <div className="da-track da-track-v">
          <span className="da-track-tag">V1</span>
          <div className="da-clip-block" style={{ backgroundImage: `url(${clip.image})` }}>
            <span className="da-clip-name">{clip.title}</span>
          </div>
        </div>
        <div className="da-track da-track-a">
          <span className="da-track-tag">A1</span>
          <div className="da-audio">
            {Array.from({ length: 60 }).map((_, i) => (
              <span key={i} style={{ height: `${20 + Math.abs(Math.sin(i * 1.7) * 70)}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function wheelLayer(v, blend) {
  const { color, opacity } = wheelColor(v)
  return {
    background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 75%)`,
    opacity,
    mixBlendMode: blend,
  }
}
