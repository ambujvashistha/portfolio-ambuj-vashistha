import { useRef, useState } from 'react'

export default function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2
    
    // Calculate distance and max distance for a realistic magnetic field
    const distX = clientX - centerX
    const distY = clientY - centerY
    
    // Create the pull proportional to strength
    const x = distX * strength
    const y = distY * strength
    
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: position.x === 0 && position.y === 0 
          ? 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' 
          : 'transform 0.1s linear',
        willChange: 'transform',
        display: 'inline-block'
      }}
    >
      {children}
    </div>
  )
}
