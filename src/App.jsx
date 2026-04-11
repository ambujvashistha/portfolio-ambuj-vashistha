import './App.css'
import pencilDivider from './assets/pencil-divider.svg'
import tapeStrip from './assets/tape-strip.svg'

function App() {
  const navItems = ['About', 'Projects', 'Journey', 'Notes', 'Contact']

  return (
    <main className="app-shell">
      <div className="page-noise page-noise-left" aria-hidden="true" />
      <div className="page-noise page-noise-right" aria-hidden="true" />
      <section className="notebook-shell">
        <div className="paper-tear paper-tear-top" aria-hidden="true" />
        <div className="paper-tear paper-tear-bottom" aria-hidden="true" />

        <div className="notebook-spread">
          <header className="site-nav">
            <a className="brand-mark" href="#top">
              Ambuj Vashistha
            </a>

            <nav className="nav-links" aria-label="Primary">
              {navItems.map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`}>
                  {item}
                </a>
              ))}
            </nav>

            <a className="profile-chip" href="#contact">
              Dev Profile
            </a>
          </header>

          <div className="scribble-cluster scribble-cluster-left" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <section className="hero-grid" id="top">
            <div className="hero-copy starter-card">
              <img className="tape-strip tape-strip-copy" src={tapeStrip} alt="" aria-hidden="true" />
              <p className="eyebrow">Developer</p>
              <p className="hero-kicker">Frontend developer crafting thoughtful digital experiences.</p>
              <h1>
                Ambuj
                <span>Vashistha</span>
              </h1>
              <p className="hero-summary">
                I design and build interfaces that feel clear, personal, and
                memorable, with an eye for motion, rhythm, and detail.
              </p>

              <div className="hero-actions">
                <a className="primary-action" href="#projects">
                  View Projects
                </a>
                <a className="secondary-action" href="#about">
                  Read Notes
                </a>
              </div>

              <ul className="hero-bullets">
                <li>Frontend development focused on interaction and usability</li>
                <li>Projects shaped with structure, clarity, and visual taste</li>
                <li>Open to meaningful products, freelance work, and collaborations</li>
              </ul>
            </div>

            <aside className="portrait-card" aria-label="Headshot concept placeholder">
              <div className="portrait-paper">
                <img className="tape-strip tape-strip-portrait" src={tapeStrip} alt="" aria-hidden="true" />
                <div className="portrait-frame">
                  <div className="portrait-sketch" aria-hidden="true">
                    <span className="sketch halo" />
                    <span className="sketch head" />
                    <span className="sketch jaw" />
                    <span className="sketch shoulder-left" />
                    <span className="sketch shoulder-right" />
                  </div>
                  <p className="portrait-note">Ambuj Vashistha</p>
                </div>
              </div>
            </aside>
          </section>

          <div className="divider-wrap" aria-hidden="true">
            <img className="pencil-divider" src={pencilDivider} alt="" />
          </div>

          <section className="content-grid" aria-label="Portfolio sections">
            <article className="content-card section-about" id="about">
              <p className="section-tag">About</p>
              <h2>Building products with clarity, personality, and care.</h2>
              <p>
                I enjoy turning ideas into interfaces that feel intuitive at
                first glance and rewarding on a second look. My focus is on
                frontend work that balances structure, visual rhythm, and strong
                user experience.
              </p>
            </article>

            <article className="content-card section-projects" id="projects">
              <p className="section-tag">Projects</p>
              <h2>Selected work</h2>

              <div className="project-list">
                <section className="project-item">
                  <p className="project-index">01</p>
                  <div>
                    <h3>Immersive portfolio system</h3>
                    <p>
                      A personal portfolio designed around visual storytelling,
                      motion, and strong interaction design.
                    </p>
                  </div>
                </section>

                <section className="project-item">
                  <p className="project-index">02</p>
                  <div>
                    <h3>Frontend product build</h3>
                    <p>
                      Responsive UI work focused on clean flows, refined
                      layouts, and readable code structure.
                    </p>
                  </div>
                </section>

                <section className="project-item">
                  <p className="project-index">03</p>
                  <div>
                    <h3>Creative web experiments</h3>
                    <p>
                      Visual concepts, interaction studies, and pieces that
                      explore how interfaces can feel more alive.
                    </p>
                  </div>
                </section>
              </div>
            </article>

            <article className="content-card section-journey" id="journey">
              <p className="section-tag">Journey</p>
              <h2>What I bring</h2>
              <ul className="note-list">
                <li>Frontend development with React and JavaScript</li>
                <li>Strong interest in motion-led interface design</li>
                <li>Visual thinking shaped by editing and storytelling</li>
                <li>Comfortable blending product logic with aesthetics</li>
              </ul>
            </article>

            <article className="content-card section-notes" id="notes">
              <p className="section-tag">Notes</p>
              <h2>Things I care about</h2>
              <ul className="principle-list">
                <li>Interfaces should feel calm before they feel impressive.</li>
                <li>Motion should guide attention, not compete with content.</li>
                <li>Details are what make digital work feel human.</li>
              </ul>
            </article>

            <article className="content-card section-contact" id="contact">
              <p className="section-tag">Contact</p>
              <h2>Let&apos;s build something thoughtful.</h2>
              <p>
                If you&apos;re working on a product, experience, or idea that
                needs strong frontend execution and taste, I&apos;d love to hear
                about it.
              </p>
              <a className="primary-action contact-action" href="mailto:ambuj@example.com">
                Say Hello
              </a>
            </article>
          </section>

          <div className="scribble-cluster scribble-cluster-right" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
