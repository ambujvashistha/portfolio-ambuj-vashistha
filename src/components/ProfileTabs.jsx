import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profileTabs } from '../data/portfolioContent'
import './ProfileTabs.css'

const ICONS = {
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.35.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.17.91-.25 1.89-.38 2.86-.38s1.95.13 2.86.38c2.18-1.48 3.14-1.17 3.14-1.17.62 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.07 0 4.41-2.69 5.36-5.25 5.65.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  ),
  leetcode: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  ),
  codeforces: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.672 21 0 20.328 0 19.5V9c0-.828.672-1.5 1.5-1.5zm15 3c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5zM12 3c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5H9c-.828 0-1.5-.672-1.5-1.5v-15C7.5 3.672 8.172 3 9 3z" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
}

const PROFILES = (profileTabs || []).map((p) => ({ ...p, icon: ICONS[p.id] || ICONS.link }))

const CACHE_PREFIX = 'profile-shot:'

function shotUrl(target) {
  const u = encodeURIComponent(target)
  return `https://api.microlink.io/?url=${u}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1280&viewport.height=720`
}

function getCachedShot(id) {
  try {
    return sessionStorage.getItem(CACHE_PREFIX + id)
  } catch (_) {
    return null
  }
}

function setCachedShot(id, dataUrl) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + id, dataUrl)
  } catch (_) {
    // quota or private mode; ignore
  }
}

async function prefetchShot(id, url) {
  if (getCachedShot(id)) return
  try {
    const res = await fetch(url)
    if (!res.ok) return
    const blob = await res.blob()
    if (blob.size > 800 * 1024) return // skip oversized to keep sessionStorage tame
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') setCachedShot(id, reader.result)
    }
    reader.readAsDataURL(blob)
  } catch (_) {
    // network or CORS issue; fall back to live URL on hover
  }
}

function PreviewImage({ profile }) {
  const [stage, setStage] = useState('live') // live -> static -> placeholder
  const cached = getCachedShot(profile.id)

  const onError = () => {
    if (stage === 'live') setStage('static')
    else if (stage === 'static') setStage('placeholder')
  }

  if (stage === 'placeholder') {
    return (
      <div className="profile-tab-placeholder" style={{ background: profile.accent + '22' }}>
        <span className="profile-tab-placeholder-icon" style={{ color: profile.accent }}>
          {profile.icon}
        </span>
        <span className="profile-tab-placeholder-text">{profile.label}</span>
        <span className="profile-tab-placeholder-handle">@{profile.handle}</span>
      </div>
    )
  }

  let src
  if (stage === 'live') {
    src = cached || shotUrl(profile.url)
  } else {
    src = profile.fallback
  }
  return (
    <img
      src={src}
      alt={`${profile.label} profile preview`}
      loading="lazy"
      decoding="async"
      onError={onError}
    />
  )
}

export default function ProfileTabs() {
  const [hover, setHover] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !PROFILES.length) return
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 800))
    const handle = idle(() => {
      PROFILES.forEach((p) => prefetchShot(p.id, shotUrl(p.url)))
    })
    return () => {
      if (window.cancelIdleCallback && typeof handle === 'number') {
        window.cancelIdleCallback(handle)
      }
    }
  }, [])

  return (
    <div className="profile-tabs" aria-label="Coding profile previews">
      {PROFILES.map((p) => (
        <a
          key={p.id}
          className="profile-tab"
          style={{ '--tab-accent': p.accent }}
          href={p.url}
          target="_blank"
          rel="noreferrer"
          data-cursor="link"
          onMouseEnter={() => setHover(p.id)}
          onMouseLeave={() => setHover((cur) => (cur === p.id ? null : cur))}
          onFocus={() => setHover(p.id)}
          onBlur={() => setHover((cur) => (cur === p.id ? null : cur))}
        >
          <span className="profile-tab-icon">{p.icon}</span>
          <span className="profile-tab-meta">
            <span className="profile-tab-label">{p.label}</span>
            <span className="profile-tab-handle">@{p.handle}</span>
          </span>

          <AnimatePresence>
            {hover === p.id && (
              <motion.span
                className="profile-tab-preview"
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="profile-tab-preview-bar">
                  <span className="profile-tab-dot" />
                  <span className="profile-tab-dot" />
                  <span className="profile-tab-dot" />
                  <span className="profile-tab-preview-url">{p.url.replace('https://', '')}</span>
                </span>
                <PreviewImage profile={p} />
              </motion.span>
            )}
          </AnimatePresence>
        </a>
      ))}
    </div>
  )
}
