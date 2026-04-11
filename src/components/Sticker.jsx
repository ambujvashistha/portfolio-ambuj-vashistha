import { useState } from 'react'
import './Sticker.css'

export default function Sticker({ text, rotation = '0deg', color = '#ffd200', x, y, className = '' }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`mew-sticker-wrapper ${className}`}
      style={{ left: x, top: y, position: 'absolute', zIndex: 50, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <div
        className="mew-sticker"
        style={{
          transform: `rotate(${isHovered ? '0deg' : rotation}) scale(${isHovered ? 1.08 : 1})`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="mew-sticker-content"
          style={{ background: color }}
        >
          {text}
        </div>
      </div>
    </div>
  )
}
