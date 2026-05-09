import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './Sticker.css'

export default function Sticker({
  text,
  rotation = '0deg',
  color = '#ffd200',
  x,
  y,
  className = '',
}) {
  const stickerRef = useRef(null)

  useEffect(() => {
    const node = stickerRef.current
    if (!node) return

    gsap.fromTo(
      node,
      { opacity: 0, y: -16, rotate: parseFloat(rotation) - 6, scale: 0.6 },
      {
        opacity: 1,
        y: 0,
        rotate: parseFloat(rotation),
        scale: 1,
        duration: 0.9,
        delay: 0.4,
        ease: 'elastic.out(1, 0.55)',
      }
    )

    const float = gsap.to(node, {
      y: '+=6',
      rotate: `+=${0.6}`,
      duration: 2.4,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      delay: 1.4,
    })

    const onMove = (event) => {
      const rect = node.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (event.clientX - cx) * 0.04
      const dy = (event.clientY - cy) * 0.04
      gsap.to(node, { x: dx, y: dy, duration: 0.6, ease: 'power2.out', overwrite: 'auto' })
    }
    window.addEventListener('mousemove', onMove)

    return () => {
      window.removeEventListener('mousemove', onMove)
      float.kill()
    }
  }, [rotation])

  return (
    <div
      className={`mew-sticker-wrapper ${className}`}
      style={{ left: x, top: y, position: 'absolute', zIndex: 50, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <div
        ref={stickerRef}
        className="mew-sticker"
        style={{ transform: `rotate(${rotation})` }}
      >
        <div className="mew-sticker-content" style={{ background: color }}>
          {text}
        </div>
      </div>
    </div>
  )
}
