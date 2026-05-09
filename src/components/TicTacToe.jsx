import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { tictactoe } from '../data/portfolioContent'
import TicTacToePanel from './TicTacToePanel'
import './TicTacToe.css'

export default function TicTacToe() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    const openHandler = () => setOpen(true)
    window.addEventListener('open-tictactoe', openHandler)
    return () => window.removeEventListener('open-tictactoe', openHandler)
  }, [])

  return (
    <>
      <motion.button
        className="ttt-fab handwritten-line"
        data-cursor="play"
        onClick={() => setOpen(true)}
        aria-label="Play tic-tac-toe"
        initial={{ opacity: 0, y: 24, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ scale: 1.06, rotate: -3 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22, delay: 0.6 }}
      >
        <span className="ttt-fab-mark">{tictactoe?.fabMark || '✕○'}</span>
        <span className="ttt-fab-label">{tictactoe?.fabLabel || 'Bored? Play'}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="ttt-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="ttt-modal"
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="ttt-close"
                onClick={() => setOpen(false)}
                aria-label="Close game"
              >
                ×
              </button>
              <TicTacToePanel />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
