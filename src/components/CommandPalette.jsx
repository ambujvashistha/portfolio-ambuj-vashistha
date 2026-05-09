import { useEffect, useState } from 'react'
import { Command } from 'cmdk'
import { AnimatePresence, motion } from 'framer-motion'
import './CommandPalette.css'

const ACTIONS = [
  { id: 'about', label: 'Jump to About', shortcut: 'A', kind: 'jump', target: '#about' },
  { id: 'projects', label: 'Jump to Projects', shortcut: 'P', kind: 'jump', target: '#projects' },
  { id: 'journey', label: 'Jump to Journey', shortcut: 'J', kind: 'jump', target: '#journey' },
  { id: 'notes', label: 'Jump to Notes', shortcut: 'N', kind: 'jump', target: '#notes' },
  { id: 'contact', label: 'Jump to Contact', shortcut: 'C', kind: 'jump', target: '#contact' },
  { id: 'top', label: 'Back to top', shortcut: 'T', kind: 'jump', target: '#top' },
  { id: 'resume', label: 'View / download resume', kind: 'event', event: 'open-resume' },
  { id: 'resume-dl', label: 'Download resume PDF', kind: 'link', target: '/ambuj-vashistha-resume.pdf' },
  { id: 'email', label: 'Copy email', kind: 'copy', value: 'ambujva123@gmail.com' },
  { id: 'github', label: 'Open GitHub', kind: 'link', target: 'https://github.com/ambujvashistha' },
  { id: 'linkedin', label: 'Open LinkedIn', kind: 'link', target: 'https://www.linkedin.com/in/ambuj-vashistha' },
  { id: 'leetcode', label: 'Open LeetCode', kind: 'link', target: 'https://leetcode.com/ambuj_vashistha' },
  { id: 'cf', label: 'Open Codeforces', kind: 'link', target: 'https://codeforces.com/profile/ambuj_vashistha' },
  { id: 'book', label: 'Book a 30-min chat', kind: 'link', target: 'https://calendly.com/ambujva123/30min' },
  { id: 'play', label: "Play tic-tac-toe", kind: 'event', event: 'open-tictactoe' },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const onKey = (e) => {
      const isToggle = (e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)
      if (isToggle) {
        e.preventDefault()
        setOpen((v) => !v)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const run = (action) => {
    if (action.kind === 'jump') {
      const el = document.querySelector(action.target)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else if (action.kind === 'copy') {
      navigator.clipboard?.writeText(action.value)
    } else if (action.kind === 'link') {
      window.open(action.target, '_blank', 'noopener,noreferrer')
    } else if (action.kind === 'event') {
      window.dispatchEvent(new CustomEvent(action.event))
    }
    setOpen(false)
    setSearch('')
  }

  return (
    <>
      <button
        className="cmdk-hint"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
      >
        <kbd>⌘</kbd>
        <kbd>K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="cmdk-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="cmdk-shell"
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Command label="Command Palette">
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search the notebook..."
                  autoFocus
                />
                <Command.List>
                  <Command.Empty>No results.</Command.Empty>
                  <Command.Group heading="Navigate">
                    {ACTIONS.filter((a) => a.kind === 'jump').map((a) => (
                      <Command.Item key={a.id} value={a.label} onSelect={() => run(a)}>
                        <span>{a.label}</span>
                        {a.shortcut && <kbd className="cmdk-kbd">{a.shortcut}</kbd>}
                      </Command.Item>
                    ))}
                  </Command.Group>
                  <Command.Group heading="Actions">
                    {ACTIONS.filter((a) => a.kind !== 'jump').map((a) => (
                      <Command.Item key={a.id} value={a.label} onSelect={() => run(a)}>
                        <span>{a.label}</span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                </Command.List>
              </Command>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
