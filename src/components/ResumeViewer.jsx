import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { assets, profile } from '../data/portfolioContent'
import './ResumeViewer.css'

const RESUME_URL = assets?.resumePdf || '/ambuj-vashistha-resume.pdf'
const DOWNLOAD_NAME = assets?.resumeDownloadName || 'Ambuj-Vashistha-Resume.pdf'

export default function ResumeViewer() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const openHandler = () => setOpen(true)
    window.addEventListener('open-resume', openHandler)
    return () => window.removeEventListener('open-resume', openHandler)
  }, [])

  return (
    <>
      <motion.button
        className="resume-trigger"
        onClick={() => setOpen(true)}
        data-cursor="link"
        aria-label="View resume"
        whileHover={{ y: -2, scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 320, damping: 18 }}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M9 13h6M9 17h6M9 9h2" />
        </svg>
        Resume
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="resume-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="resume-shell"
              role="dialog"
              aria-modal="true"
              aria-label="Resume"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <header className="resume-head">
                <div>
                  <p className="resume-eyebrow">Resume</p>
                  <h3 className="resume-title">{profile?.name || 'Ambuj Vashistha'}</h3>
                </div>
                <div className="resume-actions">
                  <a
                    className="resume-btn resume-btn-primary"
                    href={RESUME_URL}
                    download={DOWNLOAD_NAME}
                    data-cursor="link"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <path d="M7 10l5 5 5-5" />
                      <path d="M12 15V3" />
                    </svg>
                    Download PDF
                  </a>
                  <a
                    className="resume-btn resume-btn-ghost"
                    href={RESUME_URL}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="link"
                  >
                    Open ↗
                  </a>
                  <button
                    className="resume-close"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
              </header>

              <div className="resume-frame">
                <iframe
                  src={`${RESUME_URL}#toolbar=0&navpanes=0&view=FitH`}
                  title="Ambuj Vashistha Resume"
                  className="resume-iframe"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
