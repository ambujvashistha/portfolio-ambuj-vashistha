import './App.css'

function App() {
  return (
    <main className="app-shell">
      <div className="page-noise page-noise-left" aria-hidden="true" />
      <div className="page-noise page-noise-right" aria-hidden="true" />
      <section className="notebook-shell">
        <div className="paper-tear paper-tear-top" aria-hidden="true" />
        <div className="paper-tear paper-tear-bottom" aria-hidden="true" />

        <div className="notebook-spread">
          <div className="scribble-cluster scribble-cluster-left" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="starter-card">
            <p className="eyebrow">Notebook foundation</p>
            <h1>Ambuj Vashistha</h1>
            <p>
              We are building this portfolio like a lived-in sketchbook: warm,
              quiet, tactile, and ready for handwritten motion.
            </p>
          </div>

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
