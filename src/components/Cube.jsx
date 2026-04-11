import './Cube.css'

export default function Cube({ className = '', style = {} }) {
  return (
    <div className={`mew-scene ${className}`} style={style} aria-hidden="true">
      <div className="mew-cube">
        <div className="cube-face cube-front"><span role="img" aria-label="sparkles">✨</span></div>
        <div className="cube-face cube-back"></div>
        <div className="cube-face cube-right"></div>
        <div className="cube-face cube-left"></div>
        <div className="cube-face cube-top"><span role="img" aria-label="pencil">✏️</span></div>
        <div className="cube-face cube-bottom"></div>
      </div>
    </div>
  )
}
