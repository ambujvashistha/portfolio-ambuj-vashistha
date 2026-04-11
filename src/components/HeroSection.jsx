import tapeStrip from '../assets/tape-strip.svg'
import underlineBlue from '../assets/underline-blue.svg'
import underlineRed from '../assets/underline-red.svg'
import Magnetic from './Magnetic'

export default function HeroSection({ bullets }) {
  return (
    <section className="hero-grid" id="top">
      <div className="hero-copy">
        <p className="eyebrow">Developer</p>
        <p className="hero-kicker handwritten-line">
          thoughts, sketches, and shipped interfaces
        </p>
        <h1>
          <span className="hero-name-first">Ambuj</span>
          <span className="hero-name-pencil-wrap">
            <span className="hero-name-pencil">Vashistha</span>
          </span>
        </h1>
        <div className="hero-underline" aria-hidden="true">
          <img className="hero-stroke hero-stroke-red" src={underlineRed} alt="" />
          <img className="hero-stroke hero-stroke-blue" src={underlineBlue} alt="" />
        </div>
        <p className="hero-summary">
          I design and build interfaces that feel clear, personal, and
          memorable, with an eye for motion, rhythm, and detail.
        </p>

        <div className="hero-actions">
          <Magnetic strength={0.4}>
            <a className="primary-action" href="#projects">
              View Projects
            </a>
          </Magnetic>
          <Magnetic strength={0.2}>
            <a className="secondary-action" href="#about">
              Read Notes
            </a>
          </Magnetic>
        </div>

        <ul className="hero-bullets">
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>

      <aside className="portrait-card" aria-label="Headshot concept placeholder">
        <div className="portrait-paper">
          <img
            className="tape-strip tape-strip-portrait"
            src={tapeStrip}
            alt=""
            aria-hidden="true"
          />
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
  )
}
