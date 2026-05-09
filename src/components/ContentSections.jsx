import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Magnetic from './Magnetic'
import ContactLinks from './ContactLinks'
import NowPanel from './NowPanel'
import RevealText from './RevealText'
import TechStack from './TechStack'
import TicTacToePanel from './TicTacToePanel'
import { contactLinks as defaultContactLinks } from '../data/portfolioContent'
import linkify from '../utils/linkify'

function ProjectList({ projects }) {
  return (
    <div className="project-list">
      {projects.map((project, idx) => (
        <motion.section
          key={project.index}
          className="project-item"
          data-cursor="link"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="project-index">{project.index}</p>
          <div className="project-body">
            <div className="project-head">
              <h3>{project.title}</h3>
              {project.role ? <span className="project-role">{project.role}</span> : null}
            </div>
            <p>{project.body}</p>
            {project.stack || project.outcome ? (
              <div className="project-meta">
                {project.stack ? (
                  <div className="project-stack">
                    {project.stack.map((tech) => (
                      <span className="project-chip" key={tech}>
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : null}
                {project.outcome ? (
                  <span className="project-outcome handwritten-line">{project.outcome}</span>
                ) : null}
              </div>
            ) : null}
            {(project.github || project.demo) && (
              <div className="project-actions">
                {project.github && (
                  <motion.a
                    className="project-btn project-btn-code"
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="link"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.35.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.17.91-.25 1.89-.38 2.86-.38s1.95.13 2.86.38c2.18-1.48 3.14-1.17 3.14-1.17.62 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.07 0 4.41-2.69 5.36-5.25 5.65.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
                    </svg>
                    Code
                  </motion.a>
                )}
                {project.demo && (
                  <motion.a
                    className="project-btn project-btn-demo"
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="link"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M14 3h7v7" />
                      <path d="M10 14L21 3" />
                      <path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6" />
                    </svg>
                    Live Demo
                  </motion.a>
                )}
              </div>
            )}
          </div>
        </motion.section>
      ))}
    </div>
  )
}

function BulletList({ items, className }) {
  return (
    <ul className={className}>
      {items.map((item, idx) => (
        <motion.li
          key={item}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.4, delay: idx * 0.06 }}
        >
          {linkify(item)}
        </motion.li>
      ))}
    </ul>
  )
}

function JourneyCards({ cards }) {
  return (
    <div className="journey-grid">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          className={`journey-card journey-${card.accent}`}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="journey-icon" aria-hidden="true">{card.icon}</span>
          <p className="journey-title">{card.title}</p>
          <p className="journey-body">{linkify(card.body)}</p>
        </motion.div>
      ))}
    </div>
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
      {sections.map((section, sectionIdx) => (
        <React.Fragment key={section.id}>
          <motion.article
            className={`content-card ${section.className} ${
              activeIds.includes(section.id) ? 'content-card-active' : ''
            }`}
            id={section.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.65,
              delay: (sectionIdx % 2) * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              '--boundary-delay': `${120 + sectionIdx * 55}ms`,
              '--boundary-duration': `${520 + (sectionIdx % 3) * 110}ms`,
            }}
          >
            <div className="content-card-boundary" aria-hidden="true">
              <span className="boundary-stroke boundary-stroke-top" />
              <span className="boundary-stroke boundary-stroke-side" />
              <span className="boundary-scribble boundary-scribble-red" />
              <span className="boundary-scribble boundary-scribble-blue" />
            </div>
            <motion.p
              className="section-tag"
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              {section.tag}
            </motion.p>
            <RevealText text={section.title} as="h2" delay={0.12} />


            {section.body ? (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, delay: 0.22 }}
              >
                {linkify(section.body)}
              </motion.p>
            ) : null}
            {section.projects ? <ProjectList projects={section.projects} /> : null}
            {section.cards ? <JourneyCards cards={section.cards} /> : null}
            {section.stack ? <TechStack groups={section.stack} /> : null}
            {section.now ? <NowPanel items={section.now} /> : null}
            {section.list ? (
              <BulletList
                items={section.list}
                className={section.id === 'notes' ? 'principle-list' : 'note-list'}
              />
            ) : null}
            {section.id === 'contact' && (
              <ContactLinks links={section.contactLinks || defaultContactLinks} />
            )}
            {section.cta || section.secondaryCta ? (
              <div className="contact-actions">
                {section.cta && (
                  <motion.a
                    className="primary-action contact-action"
                    href={section.cta.href}
                    data-cursor="link"
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                  >
                    {section.cta.label}
                  </motion.a>
                )}
                {section.secondaryCta && (
                  <motion.a
                    className="secondary-action contact-action"
                    href={section.secondaryCta.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="link"
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                  >
                    {section.secondaryCta.label}
                  </motion.a>
                )}
              </div>
            ) : null}
          </motion.article>
          {section.id === 'about' && (
            <motion.article
              className="content-card section-play"
              initial={{ opacity: 0, y: 30, rotate: 0.8 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <TicTacToePanel />
            </motion.article>
          )}
        </React.Fragment>
      ))}
    </section>
  )
}
