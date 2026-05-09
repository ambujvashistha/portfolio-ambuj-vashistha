import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import './CodingStats.css'

function StatCard({ label, value, sub, accent, href, children, delay = 0 }) {
  const Wrapper = href ? motion.a : motion.div
  const props = href ? { href, target: '_blank', rel: 'noreferrer' } : {}
  return (
    <Wrapper
      className={`stat-card stat-${accent}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={href ? { y: -3 } : {}}
      {...props}
    >
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value ?? '—'}</p>
      {sub ? <p className="stat-sub">{sub}</p> : null}
      {children}
    </Wrapper>
  )
}

function DiffBar({ easy, medium, hard, easyTotal, mediumTotal, hardTotal }) {
  const row = [
    { label: 'E', val: easy, total: easyTotal, color: '#1cbabaff' },
    { label: 'M', val: medium, total: mediumTotal, color: '#ffb700' },
    { label: 'H', val: hard, total: hardTotal, color: '#ef4743' },
  ]
  return (
    <div className="stat-diff">
      {row.map((r) => (
        <div className="stat-diff-row" key={r.label}>
          <span className="stat-diff-label" style={{ color: r.color }}>
            {r.label}
          </span>
          <div className="stat-diff-track">
            <span
              className="stat-diff-fill"
              style={{
                width: r.total ? `${Math.min(100, (r.val / r.total) * 100)}%` : '0%',
                background: r.color,
              }}
            />
          </div>
          <span className="stat-diff-num">
            {r.val ?? 0}
            {r.total ? <span className="stat-diff-total"> / {r.total}</span> : null}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function CodingStats({
  leetcodeUser = 'ambujvashistha',
  codeforcesUser = 'tourist',
}) {
  const [lc, setLc] = useState(null)
  const [cf, setCf] = useState(null)
  const [cfContests, setCfContests] = useState(null)
  const [lcSubs, setLcSubs] = useState(null)

  useEffect(() => {
    let cancelled = false
    const endpoints = [
      `https://leetcode-stats-api.herokuapp.com/${leetcodeUser}`,
      `https://alfa-leetcode-api.onrender.com/${leetcodeUser}/solved`,
      `https://leetcode-api-faisalshohag.vercel.app/${leetcodeUser}`,
    ]

    const tryFetch = async () => {
      for (const url of endpoints) {
        try {
          const r = await fetch(url)
          if (!r.ok) continue
          const data = await r.json()
          if (cancelled) return
          if (url.includes('herokuapp') && data?.status !== 'error' && data?.totalSolved != null) {
            setLc(data)
            return
          }
          if (url.includes('alfa-leetcode-api')) {
            if (data?.solvedProblem != null) {
              const allSubs = data.totalSubmissionNum?.find?.((d) => d.difficulty === 'All')
              const allAc = data.acSubmissionNum?.find?.((d) => d.difficulty === 'All')
              const acceptance =
                allSubs?.submissions && allAc?.submissions
                  ? (allAc.submissions / allSubs.submissions) * 100
                  : null
              setLc({
                totalSolved: data.solvedProblem,
                easySolved: data.easySolved,
                mediumSolved: data.mediumSolved,
                hardSolved: data.hardSolved,
                totalEasy: 800,
                totalMedium: 1700,
                totalHard: 750,
                acceptanceRate: acceptance,
                ranking: null,
                reputation: null,
              })
              setLcSubs(allSubs?.submissions ?? null)
              return
            }
          }
          if (url.includes('faisalshohag')) {
            if (data?.totalSolved != null) {
              setLc({
                totalSolved: data.totalSolved,
                easySolved: data.easySolved,
                mediumSolved: data.mediumSolved,
                hardSolved: data.hardSolved,
                totalEasy: data.totalEasy,
                totalMedium: data.totalMedium,
                totalHard: data.totalHard,
                acceptanceRate: data.acceptanceRate ?? null,
                ranking: data.ranking ?? null,
                reputation: data.reputation ?? null,
              })
              return
            }
          }
        } catch (_) {
          // continue
        }
      }
    }
    tryFetch()
    return () => {
      cancelled = true
    }
  }, [leetcodeUser])

  useEffect(() => {
    let cancelled = false
    fetch(`https://codeforces.com/api/user.info?handles=${codeforcesUser}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || data?.status !== 'OK') return
        setCf(data.result?.[0] ?? null)
      })
      .catch(() => {})

    fetch(`https://codeforces.com/api/user.rating?handle=${codeforcesUser}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || data?.status !== 'OK') return
        setCfContests(data.result ?? [])
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [codeforcesUser])

  return (
    <section className="coding-stats" aria-label="Coding analytics">
      <p className="coding-stats-eyebrow">Coding Analytics</p>
      <div className="coding-stats-grid">
        <StatCard
          label="LeetCode Solved"
          value={lc?.totalSolved ?? '—'}
          sub={lc ? `Rank #${lc.ranking?.toLocaleString?.() ?? lc.ranking}` : 'Loading...'}
          accent="leet"
          href={`https://leetcode.com/${leetcodeUser}`}
          delay={0}
        >
          <DiffBar
            easy={lc?.easySolved}
            medium={lc?.mediumSolved}
            hard={lc?.hardSolved}
            easyTotal={lc?.totalEasy}
            mediumTotal={lc?.totalMedium}
            hardTotal={lc?.totalHard}
          />
        </StatCard>

        <StatCard
          label="Codeforces"
          value={cf?.rating ?? '—'}
          sub={
            cf
              ? `${cf.rank ?? 'unrated'} · max ${cf.maxRating ?? '—'}`
              : 'Loading...'
          }
          accent="cf"
          href={`https://codeforces.com/profile/${codeforcesUser}`}
          delay={0.08}
        >
          {cf?.maxRank ? (
            <p className="stat-extra handwritten-line">
              peak: <strong>{cf.maxRank}</strong>
            </p>
          ) : null}
        </StatCard>

        <StatCard
          label="LC Submissions"
          value={lcSubs ? lcSubs.toLocaleString() : '—'}
          sub={
            lc?.acceptanceRate != null
              ? `${lc.acceptanceRate.toFixed(1)}% acceptance`
              : 'Total submissions'
          }
          accent="acc"
          delay={0.16}
        />

        <StatCard
          label="CF Contests"
          value={cfContests ? cfContests.length : '—'}
          sub={
            cfContests?.length
              ? `Last: ${cfContests[cfContests.length - 1]?.contestName?.slice(0, 28) ?? '—'}`
              : 'Rated contests played'
          }
          accent="contests"
          delay={0.24}
        />
      </div>
    </section>
  )
}
