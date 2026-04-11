import { useEffect, useRef, useState } from 'react'

function ReelCard({ item }) {
  return (
    <article className={`reel-card ${item.accent}`}>
      <div className="reel-card-halftone" aria-hidden="true" />
      <p className="reel-index">{item.index}</p>
      <p className="reel-tag handwritten-line">{item.tag}</p>
      <h3>{item.title}</h3>
      <p>{item.body}</p>
      <div className="reel-scribble" aria-hidden="true">
        <span />
        <span />
      </div>
    </article>
  )
}

export default function ReelSection({ items }) {
  const sectionRef = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const node = sectionRef.current
      if (!node) return

      const rect = node.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const total = rect.height - viewportHeight
      const traveled = Math.min(Math.max(-rect.top, 0), total > 0 ? total : 0)
      const next = total > 0 ? traveled / total : 0

      setProgress(next)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  const translate = `${progress * -58}%`
  const rotation = `${-2 + progress * 3.5}deg`
  const reelActive = progress > 0.03 && progress <= 1

  return (
    <section
      className={`reel-section ${reelActive ? 'reel-section-active' : ''}`}
      ref={sectionRef}
      aria-label="Project reel"
    >
      <div className="reel-stage">
        <div className="reel-copy">
          <p className="section-tag">Reel</p>
          <h2>Projects drift through the notebook as you scroll.</h2>
          <p>
            This is our calmer version of that on-scroll marquee moment: cards
            slide across the spread, then reverse naturally when you move back up.
          </p>
        </div>

        <div className="reel-window">
          <div className="reel-window-top" aria-hidden="true" />
          <div className="reel-window-boundary" aria-hidden="true">
            <span className="reel-boundary reel-boundary-left" />
            <span className="reel-boundary reel-boundary-bottom" />
            <span className="reel-boundary-scribble reel-boundary-scribble-red" />
            <span className="reel-boundary-scribble reel-boundary-scribble-blue" />
          </div>
          <div
            className="reel-track"
            style={{ transform: `translate3d(${translate}, 0, 0) rotate(${rotation})` }}
          >
            {items.map((item) => (
              <ReelCard item={item} key={item.index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
