import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Edges, Float } from '@react-three/drei'
import * as THREE from 'three'
import './SketchScene.css'

const PAPER = '#f4eede'
const INK = '#1b212c'
const RED = '#d93d53'
const BLUE = '#3f7ef1'
const AMBER = '#f0a500'

/* The hand-drawn gem: faceted paper fill + ink contour edges. */
function Gem({ input, reduced }) {
  const group = useRef(null)
  const drawn = useRef(0) // 0 -> 1 mount draw-in

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return

    // draw-in: scale + settle on first appearance
    drawn.current = Math.min(1, drawn.current + delta * 1.4)
    const d = reduced ? 1 : easeOutCubic(drawn.current)

    const scroll = input.current.scroll
    const px = input.current.px
    const py = input.current.py
    const t = state.clock.elapsedTime

    // base spin + scroll-scrubbed rotation + gentle idle wobble
    const idle = reduced ? 0 : Math.sin(t * 0.4) * 0.12
    g.rotation.y = (reduced ? 0.6 : t * 0.18) + scroll * Math.PI * 2.2 + px * 0.5
    g.rotation.x = -0.15 + idle + scroll * 0.6 - py * 0.4
    g.scale.setScalar(d * (1 - scroll * 0.18))
    g.position.y = (reduced ? 0 : Math.sin(t * 0.6) * 0.05) - scroll * 0.4
  })

  return (
    <group ref={group}>
      {/* Core faceted gem */}
      <mesh castShadow>
        <icosahedronGeometry args={[1.35, 0]} />
        <meshStandardMaterial
          color={PAPER}
          roughness={0.72}
          metalness={0}
          flatShading
          emissive={PAPER}
          emissiveIntensity={0.18}
        />
        <Edges threshold={1} color={INK} lineWidth={1.8} />
      </mesh>

      {/* Inner sketch core, slightly rotated for a "double exposure" pencil feel */}
      <mesh rotation={[0.6, 0.4, 0]} scale={0.62}>
        <icosahedronGeometry args={[1.35, 0]} />
        <meshBasicMaterial visible={false} />
        <Edges threshold={1} color={BLUE} lineWidth={1} />
      </mesh>

      {/* Doodled orbit ring */}
      <mesh rotation={[Math.PI / 2.1, 0.2, 0]}>
        <torusGeometry args={[2.05, 0.018, 8, 80]} />
        <meshBasicMaterial color={INK} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

/* Small accent doodles that orbit the gem like scribbled planets. */
function Doodles({ input, reduced }) {
  const ref = useRef(null)
  const seeds = useMemo(
    () => [
      { r: 2.5, y: 0.8, speed: 0.5, size: 0.16, color: RED, shape: 'tetra', phase: 0 },
      { r: 2.8, y: -0.6, speed: -0.35, size: 0.13, color: BLUE, shape: 'octa', phase: 2 },
      { r: 2.3, y: -1.1, speed: 0.42, size: 0.1, color: AMBER, shape: 'sphere', phase: 4 },
    ],
    [],
  )

  useFrame((state, delta) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const scroll = input.current.scroll
    ref.current.children.forEach((child, i) => {
      const s = seeds[i]
      const a = (reduced ? s.phase : t * s.speed + s.phase) + scroll * Math.PI * 1.5
      child.position.set(Math.cos(a) * s.r, s.y + Math.sin(a * 1.3) * 0.25, Math.sin(a) * s.r)
      if (!reduced) child.rotation.x = child.rotation.y += delta * 0.8
    })
  })

  return (
    <group ref={ref}>
      {seeds.map((s, i) => (
        <mesh key={i}>
          {s.shape === 'tetra' && <tetrahedronGeometry args={[s.size, 0]} />}
          {s.shape === 'octa' && <octahedronGeometry args={[s.size, 0]} />}
          {s.shape === 'sphere' && <sphereGeometry args={[s.size, 12, 12]} />}
          <meshStandardMaterial color={s.color} roughness={0.6} flatShading />
          <Edges threshold={1} color={INK} lineWidth={1} />
        </mesh>
      ))}
    </group>
  )
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3)
}

export default function SketchScene() {
  // shared, render-free input read inside useFrame
  const input = useRef({ scroll: 0, px: 0, py: 0 })
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      input.current.scroll = max > 0 ? Math.min(1, window.scrollY / max) : 0
    }
    const onMove = (e) => {
      input.current.px = e.clientX / window.innerWidth - 0.5
      input.current.py = e.clientY / window.innerHeight - 0.5
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <div className="sketch-scene" aria-hidden="true">
      <Canvas
        className="sketch-canvas"
        camera={{ position: [0, 0, 6.2], fov: 42 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
        frameloop={reduced ? 'demand' : 'always'}
      >
        <ambientLight intensity={1.05} />
        <directionalLight position={[3, 5, 4]} intensity={1.1} color="#fff6e8" />
        <directionalLight position={[-4, 1, 2]} intensity={0.45} color="#eaf1ff" />
        <Suspense fallback={null}>
          <Float
            speed={reduced ? 0 : 1.1}
            rotationIntensity={reduced ? 0 : 0.35}
            floatIntensity={reduced ? 0 : 0.5}
          >
            <Gem input={input} reduced={reduced} />
          </Float>
          <Doodles input={input} reduced={reduced} />
        </Suspense>
      </Canvas>
    </div>
  )
}
