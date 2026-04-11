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
  return (
    <section className="content-grid" aria-label="Portfolio sections">
      {sections.map((section) => (
        <article className={`content-card ${section.className}`} id={section.id} key={section.id}>
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
      ))}
    </section>
  )
}
