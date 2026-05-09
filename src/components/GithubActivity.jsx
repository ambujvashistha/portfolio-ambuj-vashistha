import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import './GithubActivity.css'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function buildSampleYear(seed = 1) {
  let s = seed
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
  const days = []
  const today = new Date()
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const r = rand()
    let level = 0
    if (r > 0.55) level = 1
    if (r > 0.75) level = 2
    if (r > 0.88) level = 3
    if (r > 0.96) level = 4
    days.push({ date: d.toISOString().slice(0, 10), level, count: level * 2 })
  }
  return days
}

function groupIntoWeeks(days) {
  if (!days.length) return []
  const weeks = []
  const first = new Date(days[0].date)
  const padStart = first.getDay()
  let week = Array(padStart).fill(null)
  for (const d of days) {
    week.push(d)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }
  return weeks
}

function monthSpans(weeks) {
  const spans = []
  let lastMonth = -1
  weeks.forEach((week, i) => {
    const first = week.find((d) => d)
    if (!first) return
    const m = new Date(first.date).getMonth()
    if (m !== lastMonth) {
      spans.push({ month: MONTHS[m], col: i })
      lastMonth = m
    }
  })
  return spans
}

export default function GithubActivity({ username = 'ambujvashistha' }) {
  const [days, setDays] = useState(() => buildSampleYear(7))
  const [total, setTotal] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.contributions) return
        const last = data.contributions.slice(-365)
        setDays(last)
        setTotal(last.reduce((acc, d) => acc + (d.count || 0), 0))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [username])

  const weeks = groupIntoWeeks(days)
  const months = monthSpans(weeks)

  return (
    <motion.section
      className="gh-activity"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      aria-label="GitHub contributions"
    >
      <header className="gh-card-head">
        <span className="gh-card-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.35.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.17.91-.25 1.89-.38 2.86-.38s1.95.13 2.86.38c2.18-1.48 3.14-1.17 3.14-1.17.62 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.07 0 4.41-2.69 5.36-5.25 5.65.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
          </svg>
        </span>
        <div>
          <p className="gh-eyebrow">GitHub Activity</p>
          <p className="gh-card-handle">github.com/{username}</p>
        </div>
      </header>

      <div className="gh-chart">
        <div className="gh-months">
          {months.map((m) => (
            <span
              key={`${m.month}-${m.col}`}
              className="gh-month-label"
              style={{ gridColumn: m.col + 1 }}
            >
              {m.month}
            </span>
          ))}
        </div>

        <div
          className="gh-grid"
          role="img"
          aria-label={
            total != null
              ? `${total} contributions in the last year`
              : 'GitHub contribution heatmap'
          }
        >
          {weeks.map((week, wi) => (
            <div className="gh-col" key={wi}>
              {week.map((day, di) => (
                <span
                  key={di}
                  className={`gh-cell ${day ? `gh-level-${day.level}` : 'gh-empty'}`}
                  title={day ? `${day.count} on ${day.date}` : ''}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="gh-footer">
        <span className="gh-total">
          {total != null ? `${total} contributions in the last year` : ' '}
        </span>
        <a
          className="gh-username"
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noreferrer"
        >
          @{username}
        </a>
        <div className="gh-legend">
          <span>Less</span>
          <span className="gh-cell gh-level-0" />
          <span className="gh-cell gh-level-1" />
          <span className="gh-cell gh-level-2" />
          <span className="gh-cell gh-level-3" />
          <span className="gh-cell gh-level-4" />
          <span>More</span>
        </div>
      </div>
    </motion.section>
  )
}
