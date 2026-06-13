import { Component, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Edges, Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import './EditingRoom.css'

/*
 * Drop-in 3D model support.
 * 1) Put your downloaded room as a single .glb file at:  public/models/room.glb
 * 2) Set ROOM_MODEL_URL below to '/models/room.glb'
 * 3) Tune MODEL_SCALE / MODEL_POSITION / MODEL_ROTATION to fit, and move the <TV/>
 *    to wherever the model's screen is (or tell me and I'll dial it in).
 * If the URL is null or the file fails to load, it falls back to the hand-built room.
 */
const ROOM_MODEL_URL = null // e.g. '/models/room.glb'
const MODEL_SCALE = 1
const MODEL_POSITION = [0, 0, 0]
const MODEL_ROTATION = [0, 0, 0]

function RoomModel({ url }) {
  const { scene } = useGLTF(url)
  const cloned = useMemo(() => scene.clone(true), [scene])
  return <primitive object={cloned} scale={MODEL_SCALE} position={MODEL_POSITION} rotation={MODEL_ROTATION} />
}

// Falls back to the primitive room if the model URL is missing or fails to load.
class ModelBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err) {
    console.warn('Room model failed to load, using the built-in room.', err?.message)
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/* ---- a sketch-styled box: paper fill + hand-drawn ink edges ---- */
function Box({ args, position, rotation, color = '#f1e9d6', edge = '#1b212c', emissive, ...rest }) {
  return (
    <mesh position={position} rotation={rotation} {...rest}>
      <boxGeometry args={args} />
      <meshStandardMaterial
        color={color}
        roughness={0.92}
        metalness={0}
        flatShading
        emissive={emissive || '#000000'}
        emissiveIntensity={emissive ? 0.6 : 0}
      />
      <Edges threshold={18} color={edge} />
    </mesh>
  )
}

function Plant({ position }) {
  return (
    <group position={position}>
      <Box args={[0.34, 0.34, 0.34]} position={[0, 0.17, 0]} color="#c96b4a" />
      <Box args={[0.06, 0.5, 0.06]} position={[0, 0.55, 0]} color="#3f7a3a" />
      <Box args={[0.4, 0.3, 0.08]} position={[-0.12, 0.78, 0]} rotation={[0, 0, 0.5]} color="#4f9a45" />
      <Box args={[0.4, 0.3, 0.08]} position={[0.12, 0.82, 0.04]} rotation={[0, 0, -0.6]} color="#447f3d" />
      <Box args={[0.34, 0.34, 0.06]} position={[0, 1.0, -0.04]} rotation={[0, 0, 0.2]} color="#56a84a" />
    </group>
  )
}

function Lamp({ position }) {
  return (
    <group position={position}>
      <Box args={[0.4, 0.05, 0.4]} position={[0, 0.02, 0]} color="#2a2a2e" />
      <Box args={[0.06, 1.5, 0.06]} position={[0, 0.78, 0]} color="#3a3a40" />
      <mesh position={[0, 1.6, 0]}>
        <coneGeometry args={[0.32, 0.4, 14, 1, true]} />
        <meshStandardMaterial color="#ffcf8a" emissive="#ffb24c" emissiveIntensity={0.9} side={THREE.DoubleSide} flatShading />
        <Edges threshold={18} color="#a8702a" />
      </mesh>
      <pointLight position={[0, 1.5, 0]} intensity={6} distance={7} decay={2} color="#ffd9a0" />
    </group>
  )
}

/* ---- the TV: bezel + glowing screen + live edit ---- */
function TV({ videoId, title, onWatch }) {
  const [hover, setHover] = useState(false)
  useEffect(() => {
    document.body.style.cursor = hover ? 'pointer' : ''
    return () => { document.body.style.cursor = '' }
  }, [hover])
  return (
    <group position={[0, 1.55, -2.62]}>
      {/* stand */}
      <Box args={[2.6, 0.12, 0.5]} position={[0, -1.18, 0.18]} color="#7c5a3a" />
      <Box args={[0.5, 0.5, 0.4]} position={[0, -0.9, 0.18]} color="#8a6440" />
      {/* bezel */}
      <Box args={[2.5, 1.5, 0.16]} color="#15171c" edge="#000000" />
      {/* screen */}
      <mesh
        position={[0, 0, 0.1]}
        onClick={(e) => { e.stopPropagation(); onWatch?.() }}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true) }}
        onPointerOut={() => setHover(false)}
      >
        <planeGeometry args={[2.26, 1.26]} />
        <meshStandardMaterial color="#0a1622" emissive="#1f4e6b" emissiveIntensity={hover ? 1.1 : 0.8} />
      </mesh>
      {/* the live edit, rendered in-world on the screen */}
      <Html
        transform
        position={[0, 0, 0.11]}
        distanceFactor={1.34}
        className="room-tv-html"
        pointerEvents="none"
        zIndexRange={[30, 0]}
      >
        <div className="room-tv-screen">
          {videoId ? (
            <iframe
              title={title || 'Edit'}
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&rel=0&playsinline=1`}
              allow="autoplay; encrypted-media; picture-in-picture"
              frameBorder="0"
            />
          ) : (
            <div className="room-tv-noise">no signal</div>
          )}
        </div>
      </Html>
      {/* soft glow into the room */}
      <pointLight position={[0, 0, 1.2]} intensity={3.5} distance={6} decay={2} color="#79b6ff" />
    </group>
  )
}

function Room() {
  const wall = '#efe7d4'
  const ink = '#23272f'
  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color="#d8c3a0" roughness={1} flatShading />
      </mesh>
      {/* rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -0.4]}>
        <planeGeometry args={[3.4, 2.4]} />
        <meshStandardMaterial color="#b6485a" roughness={1} />
      </mesh>
      {/* walls */}
      <Box args={[8, 3.2, 0.1]} position={[0, 1.6, -3]} color={wall} edge={ink} />
      <Box args={[0.1, 3.2, 6]} position={[-4, 1.6, 0]} color={wall} edge={ink} />
      <Box args={[0.1, 3.2, 6]} position={[4, 1.6, 0]} color={wall} edge={ink} />
      {/* ceiling */}
      <Box args={[8, 0.1, 6]} position={[0, 3.2, 0]} color="#f5efe0" edge={ink} />
      {/* skirting baseboard accents */}
      <Box args={[8, 0.16, 0.04]} position={[0, 0.08, -2.95]} color="#cdbfa3" />
    </group>
  )
}

function Furniture() {
  return (
    <group>
      {/* couch facing the TV */}
      <group position={[0, 0, 1.4]}>
        <Box args={[2.6, 0.5, 1.0]} position={[0, 0.4, 0]} color="#d98a4c" />
        <Box args={[2.6, 0.7, 0.3]} position={[0, 0.75, 0.45]} color="#c97a3e" />
        <Box args={[0.3, 0.7, 1.0]} position={[-1.3, 0.6, 0]} color="#c97a3e" />
        <Box args={[0.3, 0.7, 1.0]} position={[1.3, 0.6, 0]} color="#c97a3e" />
        <Box args={[0.5, 0.4, 0.5]} position={[-0.7, 0.78, -0.1]} rotation={[0, 0, 0.2]} color="#4f7ea8" />
        <Box args={[0.5, 0.4, 0.5]} position={[0.7, 0.78, -0.1]} rotation={[0, 0, -0.2]} color="#5aa0c0" />
      </group>

      {/* coffee table */}
      <Box args={[1.2, 0.1, 0.6]} position={[0, 0.42, 0.2]} color="#8a6440" />
      <Box args={[0.08, 0.4, 0.08]} position={[-0.5, 0.2, 0.4]} color="#6f4f30" />
      <Box args={[0.08, 0.4, 0.08]} position={[0.5, 0.2, 0.4]} color="#6f4f30" />

      {/* desk + PC in the left corner */}
      <group position={[-3.0, 0, -1.6]} rotation={[0, 0.5, 0]}>
        <Box args={[1.6, 0.1, 0.7]} position={[0, 0.95, 0]} color="#9a7048" />
        <Box args={[0.1, 0.95, 0.6]} position={[-0.7, 0.47, 0]} color="#7c5a3a" />
        <Box args={[0.1, 0.95, 0.6]} position={[0.7, 0.47, 0]} color="#7c5a3a" />
        {/* monitor */}
        <Box args={[0.9, 0.55, 0.06]} position={[0, 1.45, -0.2]} color="#15171c" emissive="#2a6f8f" />
        <Box args={[0.1, 0.18, 0.1]} position={[0, 1.12, -0.2]} color="#222" />
        {/* keyboard */}
        <Box args={[0.6, 0.04, 0.2]} position={[0, 1.02, 0.12]} color="#2a2a30" />
        {/* chair */}
        <Box args={[0.55, 0.08, 0.55]} position={[0, 0.55, 0.7]} color="#3a3a42" />
        <Box args={[0.55, 0.6, 0.08]} position={[0, 0.9, 0.95]} color="#3a3a42" />
      </group>

      {/* bookshelf right wall */}
      <group position={[3.4, 0, -1.4]} rotation={[0, -0.4, 0]}>
        <Box args={[1.4, 2.2, 0.4]} position={[0, 1.1, 0]} color="#8a6440" />
        <Box args={[1.2, 0.06, 0.36]} position={[0, 0.8, 0.02]} color="#6f4f30" />
        <Box args={[1.2, 0.06, 0.36]} position={[0, 1.4, 0.02]} color="#6f4f30" />
        {[-0.4, -0.15, 0.1, 0.35].map((x, i) => (
          <Box key={i} args={[0.12, 0.4, 0.28]} position={[x, 1.02, 0.04]} color={['#d96b6b', '#6b9bd9', '#e0b14c', '#6bbf8a'][i]} />
        ))}
        {[-0.35, -0.05, 0.25].map((x, i) => (
          <Box key={`b${i}`} args={[0.12, 0.4, 0.28]} position={[x, 1.62, 0.04]} color={['#7b6bd9', '#d98a4c', '#6bbf8a'][i]} />
        ))}
      </group>

      <Lamp position={[3.2, 0, 1.7]} />
      <Plant position={[-3.4, 0, 1.8]} />
      <Plant position={[-3.5, 0, -2.4]} />

      {/* posters (Spidey / Pokemon nods) */}
      <Box args={[0.9, 1.2, 0.03]} position={[-3.94, 1.9, 0.6]} rotation={[0, Math.PI / 2, 0]} color="#c0364a" edge="#1b212c" />
      <Box args={[0.9, 1.2, 0.03]} position={[3.94, 1.9, 0.4]} rotation={[0, -Math.PI / 2, 0]} color="#e8b53a" edge="#1b212c" />
      {/* window with warm dusk light on back wall */}
      <Box args={[1.6, 1.3, 0.04]} position={[2.4, 1.9, -2.94]} color="#ffd9a0" emissive="#ffb24c" edge="#7c5a3a" />
    </group>
  )
}

/* ---- WASD walk + drag-to-look, clamped to the room ---- */
function Controls({ onMoved }) {
  const { camera, gl } = useThree()
  const keys = useRef({})
  const look = useRef({ yaw: 0, pitch: -0.02, dragging: false, px: 0, py: 0 })
  const eye = 1.5

  useEffect(() => {
    camera.position.set(0, eye, 2.1)
    camera.rotation.order = 'YXZ'

    const dom = gl.domElement
    const down = (e) => {
      look.current.dragging = true
      look.current.px = e.clientX
      look.current.py = e.clientY
    }
    const move = (e) => {
      if (!look.current.dragging) return
      const dx = e.clientX - look.current.px
      const dy = e.clientY - look.current.py
      look.current.px = e.clientX
      look.current.py = e.clientY
      look.current.yaw -= dx * 0.005
      look.current.pitch = THREE.MathUtils.clamp(look.current.pitch - dy * 0.005, -0.7, 0.55)
    }
    const up = () => { look.current.dragging = false }
    const kd = (e) => { keys.current[e.key.toLowerCase()] = true; if (['arrowup','arrowdown','arrowleft','arrowright'].includes(e.key.toLowerCase())) e.preventDefault() }
    const ku = (e) => { keys.current[e.key.toLowerCase()] = false }

    dom.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('keydown', kd)
    window.addEventListener('keyup', ku)
    return () => {
      dom.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('keydown', kd)
      window.removeEventListener('keyup', ku)
    }
  }, [camera, gl])

  useFrame((_, dt) => {
    const k = keys.current
    const fwd = (k['w'] || k['arrowup'] ? 1 : 0) - (k['s'] || k['arrowdown'] ? 1 : 0)
    const str = (k['d'] || k['arrowright'] ? 1 : 0) - (k['a'] || k['arrowleft'] ? 1 : 0)
    const yaw = look.current.yaw
    const speed = 2.6 * Math.min(dt, 0.05)
    if (fwd || str) {
      camera.position.x += (-Math.sin(yaw) * fwd + Math.cos(yaw) * str) * speed
      camera.position.z += (-Math.cos(yaw) * fwd - Math.sin(yaw) * str) * speed
      camera.position.x = THREE.MathUtils.clamp(camera.position.x, -3.5, 3.5)
      camera.position.z = THREE.MathUtils.clamp(camera.position.z, -2.3, 2.6)
      onMoved?.()
    }
    camera.position.y = eye
    camera.rotation.y = yaw
    camera.rotation.x = look.current.pitch
  })
  return null
}

export default function EditingRoom({ videoId, title, onWatch }) {
  const [moved, setMoved] = useState(false)
  const dpr = useMemo(() => [1, 1.6], [])
  return (
    <div className="room-canvas-wrap">
      <Canvas dpr={dpr} camera={{ fov: 70, near: 0.1, far: 60 }} gl={{ antialias: true }} shadows={false}>
        <color attach="background" args={['#efe7d4']} />
        <fog attach="fog" args={['#e7dcc4', 7, 16]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 5, 3]} intensity={0.5} color="#fff3e0" />
        {ROOM_MODEL_URL ? (
          <ModelBoundary fallback={<><Room /><Furniture /></>}>
            <RoomModel url={ROOM_MODEL_URL} />
          </ModelBoundary>
        ) : (
          <>
            <Room />
            <Furniture />
          </>
        )}
        <TV videoId={videoId} title={title} onWatch={onWatch} />
        <Controls onMoved={() => !moved && setMoved(true)} />
      </Canvas>
      <div className={`room-hud ${moved ? 'is-faded' : ''}`}>
        <span className="room-hud-keys"><b>W A S D</b> / arrows to walk</span>
        <span className="room-hud-keys">drag to look around</span>
        <span className="room-hud-keys">click the TV to watch</span>
      </div>
    </div>
  )
}
