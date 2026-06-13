import { useEffect } from 'react'
import { useAnimate } from 'framer-motion'
import './PageFlip.css'

/*
 * Full-screen notebook page-turn. Swings a paper sheet on its left spine:
 * 92deg (edge-on) -> 0 (covers screen) -> swap the world -> -92deg (edge-on) -> reveal.
 */
export default function PageFlip({ active, target, reduced, onCover, onDone }) {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    if (!active) return
    let alive = true

    async function run() {
      if (reduced) {
        onCover?.()
        await new Promise((r) => setTimeout(r, 30))
        onDone?.()
        return
      }
      await animate('.flip-sheet', { rotateY: [92, 0] }, { duration: 0.5, ease: [0.66, 0, 0.34, 1] })
      if (!alive) return
      onCover?.()
      // let the incoming world paint behind the cover
      await new Promise((r) => setTimeout(r, 110))
      if (!alive) return
      await animate('.flip-sheet', { rotateY: [0, -92] }, { duration: 0.56, ease: [0.34, 0, 0.3, 1] })
      if (!alive) return
      onDone?.()
    }
    run()
    return () => {
      alive = false
    }
  }, [active])

  if (!active) return null

  const toEditor = target === 'editor'

  return (
    <div ref={scope} className="page-flip">
      <div className="flip-sheet">
        <span className="flip-spiral" aria-hidden="true" />
        <span className="flip-margin" aria-hidden="true" />
        <div className="flip-label">
          <span className="flip-label-kicker handwritten-line">
            {toEditor ? 'flipping to' : 'flipping back to'}
          </span>
          <span className="flip-label-main">
            {toEditor ? 'the editing suite' : 'the notebook'}
          </span>
        </div>
        <span className="flip-shade" aria-hidden="true" />
      </div>
    </div>
  )
}
