import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import './GithubPins.css'

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  Shell: '#89e051',
  C: '#555555',
  'C++': '#f34b7d',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  'Jupyter Notebook': '#DA5B0B',
}

export default function GithubPins({ username = 'ambujvashistha', slugs = [] }) {
  const [pins, setPins] = useState(null)

  useEffect(() => {
    if (!slugs.length) return
    let cancelled = false

    Promise.all(
      slugs.map((slug) =>
        fetch(`https://api.github.com/repos/${slug}`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    ).then((results) => {
      if (cancelled) return
      const list = results
        .filter(Boolean)
        .map((r) => ({
          repo: r.name,
          owner: r.owner?.login,
          description: r.description,
          language: r.language,
          stars: r.stargazers_count,
          forks: r.forks_count,
          link: r.html_url,
        }))
      setPins(list)
    })

    return () => {
      cancelled = true
    }
  }, [slugs.join('|')])

  if (!pins || pins.length === 0) return null

  return (
    <motion.section
      className="gh-pins"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Pinned GitHub repositories"
    >
      <header className="gh-pins-head">
        <p className="gh-pins-eyebrow">Pinned on GitHub</p>
        <a
          className="gh-pins-link"
          href={`https://github.com/${username}?tab=repositories`}
          target="_blank"
          rel="noreferrer"
          data-cursor="link"
        >
          all repos ↗
        </a>
      </header>

      <div className="gh-pins-grid">
        {pins.slice(0, 6).map((p, idx) => (
          <motion.a
            key={p.link}
            className="gh-pin"
            href={p.link}
            target="_blank"
            rel="noreferrer"
            data-cursor="link"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: idx * 0.05 }}
            whileHover={{ y: -3 }}
          >
            <div className="gh-pin-top">
              <svg className="gh-pin-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
              </svg>
              <span className="gh-pin-name">
                {p.owner && p.owner !== username ? (
                  <span className="gh-pin-owner">{p.owner}/</span>
                ) : null}
                {p.repo}
              </span>
            </div>
            {p.description ? <p className="gh-pin-desc">{p.description}</p> : null}
            <div className="gh-pin-meta">
              {p.language && (
                <span className="gh-pin-lang">
                  <span
                    className="gh-pin-dot"
                    style={{ background: LANG_COLORS[p.language] || '#a3a3a3' }}
                  />
                  {p.language}
                </span>
              )}
              {p.stars > 0 && (
                <span className="gh-pin-stat">
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                  </svg>
                  {p.stars}
                </span>
              )}
              {p.forks > 0 && (
                <span className="gh-pin-stat">
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
                  </svg>
                  {p.forks}
                </span>
              )}
            </div>
          </motion.a>
        ))}
      </div>
    </motion.section>
  )
}
