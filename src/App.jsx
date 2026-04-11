import './App.css'
import pencilDivider from './assets/pencil-divider.svg'
import ContentSections from './components/ContentSections'
import Cube from './components/Cube'
import HeroSection from './components/HeroSection'
import ReelSection from './components/ReelSection'
import RibbonCursor from './components/RibbonCursor'
import SiteNav from './components/SiteNav'
import Sticker from './components/Sticker'
import TicTacToe from './components/TicTacToe'
import { heroBullets, navItems, reelItems, sections } from './data/portfolioContent'


function App() {
  return (
    <main className="app-shell">
      <div className="page-noise page-noise-left" aria-hidden="true" />
      <div className="page-noise page-noise-right" aria-hidden="true" />

      <section className="notebook-shell">
        <div className="paper-tear paper-tear-top" aria-hidden="true" />
        <div className="paper-tear paper-tear-bottom" aria-hidden="true" />

        <div className="notebook-spread">
          <RibbonCursor />
          <SiteNav items={navItems} />

          <div className="scribble-cluster scribble-cluster-left" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <Sticker text="Hey!" color="#ffdede" rotation="-12deg" x="15%" y="4%" />
          <Sticker text="WIP 🚀" color="#e3eeff" rotation="8deg" x="85%" y="22%" />

          <HeroSection bullets={heroBullets} />

          <div className="divider-wrap" aria-hidden="true">
            <img className="pencil-divider" src={pencilDivider} alt="" />
          </div>

          <div style={{ position: 'relative' }}>
            <Cube className="hero-cube" style={{ right: '10%', top: '-2rem' }} />
            <ReelSection items={reelItems} />
          </div>

          <TicTacToe />

          <ContentSections sections={sections} />

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
