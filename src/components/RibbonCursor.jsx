import { useEffect, useRef } from 'react'

export default function RibbonCursor() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    let points = []
    let mouse = { x: width / 2, y: height / 2 }
    let cursorState = 'default'

    const stateColors = {
      default: { primary: 'rgba(63, 126, 241, 0.45)', secondary: 'rgba(217, 73, 89, 0.35)', primaryWidth: 2, secondaryWidth: 1.5 },
      link: { primary: 'rgba(217, 73, 89, 0.7)', secondary: 'rgba(217, 73, 89, 0.4)', primaryWidth: 3, secondaryWidth: 2 },
      play: { primary: 'rgba(56, 193, 114, 0.7)', secondary: 'rgba(63, 126, 241, 0.4)', primaryWidth: 2.5, secondaryWidth: 1.8 },
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      const target = e.target?.closest?.('[data-cursor]')
      cursorState = target?.dataset?.cursor || 'default'
    }

    // Touch support for mobile doodles
    const handleTouchMove = (e) => {
      mouse.x = e.touches[0].clientX
      mouse.y = e.touches[0].clientY
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    window.addEventListener('resize', handleResize)

    let animationFrameId

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      
      points.push({ 
        x: mouse.x, 
        y: mouse.y, 
        age: 0,
        offsetX: Math.random() * 4 - 2,
        offsetY: Math.random() * 4 - 2
      })

      // Update points
      for (let i = 0; i < points.length; i++) {
        points[i].age++
      }

      // Filter out old points
      points = points.filter((p) => p.age < 30)

      const colors = stateColors[cursorState] || stateColors.default

      if (points.length > 2) {
        // Draw blue pen
        ctx.beginPath()
        ctx.strokeStyle = colors.primary
        ctx.lineWidth = colors.primaryWidth
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'

        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length - 1; i++) {
          const p = points[i]
          const next = points[i + 1]
          const midX = (p.x + next.x) / 2
          const midY = (p.y + next.y) / 2
          ctx.quadraticCurveTo(p.x, p.y, midX, midY)
        }
        ctx.stroke()

        // Draw secondary pen doodle slightly offset
        ctx.beginPath()
        ctx.strokeStyle = colors.secondary
        ctx.lineWidth = colors.secondaryWidth
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'
        
        ctx.moveTo(points[0].x + points[0].offsetX, points[0].y + points[0].offsetY)
        for (let i = 1; i < points.length - 1; i++) {
          const p = points[i]
          const next = points[i + 1]
          const midX = (p.x + p.offsetX + next.x + next.offsetX) / 2
          const midY = (p.y + p.offsetY + next.y + next.offsetY) / 2
          ctx.quadraticCurveTo(p.x + p.offsetX, p.y + p.offsetY, midX, midY)
        }
        ctx.stroke()
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
      aria-hidden="true"
    />
  )
}
