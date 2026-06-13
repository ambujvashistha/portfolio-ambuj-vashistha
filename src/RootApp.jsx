import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import App from './App.jsx'
import PageFlip from './components/PageFlip'
import { NavContext } from './nav'

const EditorPortfolio = lazy(() => import('./editor/EditorPortfolio'))

const modeFromHash = () =>
  (typeof window !== 'undefined' && window.location.hash.replace('#', '') === 'editor')
    ? 'editor'
    : 'dev'

export default function RootApp() {
  const [mode, setMode] = useState(modeFromHash)
  const [target, setTarget] = useState(mode)
  const [flipping, setFlipping] = useState(false)
  const reduced = useReducedMotion()
  const flippingRef = useRef(false)

  const go = useCallback(
    (to) => {
      if (to === mode || flippingRef.current) return
      setTarget(to)
      flippingRef.current = true
      setFlipping(true)
    },
    [mode],
  )

  // browser back/forward or manual hash edits: sync without a flip
  useEffect(() => {
    const onHash = () => {
      const next = modeFromHash()
      if (!flippingRef.current) setMode(next)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const handleCover = useCallback(() => {
    setMode(target)
    window.location.hash = target === 'editor' ? 'editor' : ''
    window.scrollTo(0, 0)
  }, [target])

  const handleDone = useCallback(() => {
    flippingRef.current = false
    setFlipping(false)
  }, [])

  return (
    <NavContext.Provider value={{ mode, go, flipping }}>
      {mode === 'dev' ? (
        <App />
      ) : (
        <Suspense fallback={<div className="editor-boot" />}>
          <EditorPortfolio />
        </Suspense>
      )}
      <PageFlip
        active={flipping}
        target={target}
        reduced={reduced}
        onCover={handleCover}
        onDone={handleDone}
      />
    </NavContext.Provider>
  )
}
