import './App.css'
import pencilDivider from './assets/pencil-divider.svg'
import ContentSections from './components/ContentSections'
import HeroSection from './components/HeroSection'
import ReelSection from './components/ReelSection'
import SiteNav from './components/SiteNav'
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
          <SiteNav items={navItems} />

          <div className="scribble-cluster scribble-cluster-left" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <HeroSection bullets={heroBullets} />

          <div className="divider-wrap" aria-hidden="true">
            <img className="pencil-divider" src={pencilDivider} alt="" />
          </div>

          <ReelSection items={reelItems} />

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
