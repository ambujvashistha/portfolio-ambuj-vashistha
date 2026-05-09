import { Fragment } from 'react'

const PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g

export default function linkify(text) {
  if (!text || typeof text !== 'string') return text
  const parts = []
  let last = 0
  let match
  let key = 0
  PATTERN.lastIndex = 0
  while ((match = PATTERN.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    const [, label, href] = match
    parts.push(
      <a
        key={`lnk-${key++}`}
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noreferrer' : undefined}
        data-cursor="link"
        className="inline-link"
      >
        {label}
      </a>
    )
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts.length ? parts.map((p, i) => <Fragment key={i}>{p}</Fragment>) : text
}
