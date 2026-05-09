import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './Terminal.css'

const COMMANDS = {
  help: () => [
    'available commands:',
    '  help        — this menu',
    '  whoami      — quick intro',
    '  skills      — what I work with',
    '  projects    — selected work',
    '  contact     — say hello',
    '  resume      — open resume',
    '  socials     — github / leetcode / cf',
    '  play        — open tic-tac-toe',
    '  music       — toggle music player',
    '  book        — schedule a 15-min chat',
    '  clear       — wipe screen',
    '  exit        — close terminal',
  ],
  whoami: () => [
    'Ambuj Vashistha — full-stack dev',
    'B.Tech AI/ML · Newton School of Technology · GPA 8.98',
    'React · React Native · Node · Python',
  ],
  skills: () => [
    'languages   : TS, JS, Python, SQL, NoSQL',
    'frontend    : React, React Native, Vite, Tailwind',
    'backend     : Node, Express, Prisma, MySQL, MongoDB',
    'ml + ops    : Pandas, Scikit-learn, AWS, Docker, GH Actions',
  ],
  projects: () => [
    '01  BrainStorm Builder — JSON layout editor · 60 FPS',
    '02  Churn Retention    — RF + LLM agent · SHAP',
    '03  Worddle            — RN deep-link Wordle',
    '04  Job Sync           — 100+ listings unified',
  ],
  contact: () => [
    'email   : ambujva123@gmail.com',
    'phone   : +91 86195 03855',
    'github  : github.com/ambujvashistha',
  ],
  socials: () => [
    'github     : github.com/ambujvashistha',
    'leetcode   : leetcode.com/ambuj_vashistha',
    'codeforces : codeforces.com/profile/ambuj_vashistha',
    'linkedin   : linkedin.com/in/ambuj_vashistha',
  ],
  resume: () => {
    window.dispatchEvent(new CustomEvent('open-resume'))
    return ['opening resume...']
  },
  play: () => {
    window.dispatchEvent(new CustomEvent('open-tictactoe'))
    return ['launching tic-tac-toe...']
  },
  music: () => {
    window.dispatchEvent(new CustomEvent('toggle-music'))
    return ['toggling music player...']
  },
  book: () => {
    window.open('https://calendly.com/ambujva123/30min', '_blank', 'noopener,noreferrer')
    return ['opening calendly...']
  },
  clear: () => 'CLEAR',
  exit: () => 'EXIT',
}

const BANNER = [
  '┌─ ambuj@portfolio:~ ─┐',
  'welcome. type "help" for commands.',
  '',
]

export default function Terminal() {
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState(BANNER.map((line) => ({ kind: 'line', text: line })))
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState([])
  const [cmdIndex, setCmdIndex] = useState(-1)
  const inputRef = useRef(null)
  const bodyRef = useRef(null)

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
      requestAnimationFrame(() => {
        if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
      })
    }
  }, [open, history])

  const run = (raw) => {
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return
    const next = [...history, { kind: 'prompt', text: raw }]
    const fn = COMMANDS[cmd]
    if (!fn) {
      next.push({ kind: 'error', text: `command not found: ${cmd}. try "help".` })
      setHistory(next)
    } else {
      const out = fn()
      if (out === 'CLEAR') {
        setHistory([])
      } else if (out === 'EXIT') {
        setOpen(false)
      } else if (Array.isArray(out)) {
        out.forEach((line) => next.push({ kind: 'line', text: line }))
        setHistory(next)
      }
    }
    setCmdHistory((h) => [...h, raw])
    setCmdIndex(-1)
    setInput('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      run(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (cmdHistory.length === 0) return
      const idx = cmdIndex < 0 ? cmdHistory.length - 1 : Math.max(0, cmdIndex - 1)
      setCmdIndex(idx)
      setInput(cmdHistory[idx])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (cmdIndex < 0) return
      const idx = cmdIndex + 1
      if (idx >= cmdHistory.length) {
        setCmdIndex(-1)
        setInput('')
      } else {
        setCmdIndex(idx)
        setInput(cmdHistory[idx])
      }
    }
  }

  return (
    <>
      <motion.button
        className="term-trigger"
        onClick={() => setOpen((v) => !v)}
        data-cursor="link"
        aria-label="Open terminal"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <span className="term-trigger-prompt">{'>'}_</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="term-window"
            role="region"
            aria-label="Interactive terminal"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          >
            <div className="term-bar">
              <span className="term-dot term-dot-red" onClick={() => setOpen(false)} />
              <span className="term-dot term-dot-amber" />
              <span className="term-dot term-dot-green" />
              <span className="term-title">ambuj@portfolio — zsh</span>
            </div>
            <div className="term-body" ref={bodyRef}>
              {history.map((entry, idx) => (
                <div className={`term-line term-${entry.kind}`} key={idx}>
                  {entry.kind === 'prompt' ? (
                    <>
                      <span className="term-prompt-prefix">➜</span>
                      <span className="term-prompt-cmd">{entry.text}</span>
                    </>
                  ) : (
                    <span>{entry.text}</span>
                  )}
                </div>
              ))}
              <div className="term-line term-input-line">
                <span className="term-prompt-prefix">➜</span>
                <input
                  ref={inputRef}
                  className="term-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck={false}
                  autoComplete="off"
                  aria-label="Terminal input"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
