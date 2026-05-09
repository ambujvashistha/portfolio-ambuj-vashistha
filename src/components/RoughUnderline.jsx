import { useEffect, useRef } from 'react'
import rough from 'roughjs/bundled/rough.esm.js'

export default function RoughUnderline({
  width = 320,
  height = 28,
  primaryColor = '#d93d53',
  secondaryColor = '#3f7ef1',
  className = '',
}) {
  const svgRef = useRef(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    while (svg.firstChild) svg.removeChild(svg.firstChild)

    const rc = rough.svg(svg)

    const seedA = Math.floor(Math.random() * 9999)
    const seedB = Math.floor(Math.random() * 9999)

    const stroke1 = rc.line(8, height * 0.5, width - 12, height * 0.45, {
      stroke: primaryColor,
      strokeWidth: 3.2,
      roughness: 2.4,
      bowing: 1.6,
      seed: seedA,
    })

    const stroke2 = rc.line(width * 0.18, height * 0.85, width * 0.78, height * 0.78, {
      stroke: secondaryColor,
      strokeWidth: 2,
      roughness: 2.8,
      bowing: 2,
      seed: seedB,
    })

    svg.appendChild(stroke1)
    svg.appendChild(stroke2)
  }, [width, height, primaryColor, secondaryColor])

  return (
    <svg
      ref={svgRef}
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    />
  )
}
