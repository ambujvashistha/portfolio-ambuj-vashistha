import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    this.setState({ info })
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: '#0b0e16',
            color: '#fffaf3',
            padding: '2rem',
            fontFamily: 'ui-monospace, Menlo, monospace',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
          }}
        >
          <h2 style={{ color: '#ff8a92', marginTop: 0 }}>Render error</h2>
          <p style={{ color: '#fffaf3' }}>{String(this.state.error)}</p>
          <pre style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
            {this.state.info?.componentStack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
