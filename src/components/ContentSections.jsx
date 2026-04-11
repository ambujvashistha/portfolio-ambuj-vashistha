import React, { useEffect, useRef, useState } from 'react'

function ProjectList({ projects }) {
  return (
    <div className="project-list">
      {projects.map((project) => (
        <section className="project-item" key={project.index}>
          <p className="project-index">{project.index}</p>
          <div>
            <h3>{project.title}</h3>
            <p>{project.body}</p>
          </div>
        </section>
      ))}
    </div>
  )
}

function BulletList({ items, className }) {
  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export default function ContentSections({ sections }) {
  const containerRef = useRef(null)
  const [activeIds, setActiveIds] = useState([])

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const items = Array.from(node.querySelectorAll('.content-card'))
    const observer = new IntersectionObserver(
      (entries) => {
        setActiveIds((current) => {
          const next = new Set(current)

          entries.forEach((entry) => {
            const id = entry.target.getAttribute('id')
            if (!id) return

            if (entry.isIntersecting) {
              next.add(id)
            } else {
              next.delete(id)
            }
          })

          return Array.from(next)
        })
      },
      {
        threshold: [0.16, 0.24, 0.38],
        rootMargin: '0px 0px -12% 0px',
      }
    )

    items.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  return (
    <section className="content-grid" aria-label="Portfolio sections" ref={containerRef}>
      {sections.map((section) => (
        <React.Fragment key={section.id}>
        <article
          className={`content-card ${section.className} ${activeIds.includes(section.id) ? 'content-card-active' : ''
            }`}
          id={section.id}
          key={section.id}
          style={{
            '--boundary-delay': `${120 + sections.indexOf(section) * 55}ms`,
            '--boundary-duration': `${520 + (sections.indexOf(section) % 3) * 110}ms`,
          }}
        >
          <div className="content-card-boundary" aria-hidden="true">
            <span className="boundary-stroke boundary-stroke-top" />
            <span className="boundary-stroke boundary-stroke-side" />
            <span className="boundary-scribble boundary-scribble-red" />
            <span className="boundary-scribble boundary-scribble-blue" />
          </div>
          <p className="section-tag">{section.tag}</p>
          <h2>{section.title}</h2>

          {section.body ? <p>{section.body}</p> : null}
          {section.projects ? <ProjectList projects={section.projects} /> : null}
          {section.list ? (
            <BulletList
              items={section.list}
              className={section.id === 'notes' ? 'principle-list' : 'note-list'}
            />
          ) : null}
          {section.cta ? (
            <a className="primary-action contact-action" href={section.cta.href}>
              {section.cta.label}
            </a>
          ) : null}
        </article>
      </React.Fragment>
      ))}
    </section>
  )
}
