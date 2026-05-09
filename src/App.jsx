import { lazy, Suspense, useEffect, useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './App.css'
import pencilDivider from './assets/pencil-divider.svg'
import Certifications from './components/Certifications'
import CodingStats from './components/CodingStats'
import CommandPalette from './components/CommandPalette'
import ContentSections from './components/ContentSections'
import GithubActivity from './components/GithubActivity'
import GithubPins from './components/GithubPins'
import HeroSection from './components/HeroSection'
import IntroLoader from './components/IntroLoader'
import Marquee from './components/Marquee'
import MusicChip from './components/MusicChip'
import NumbersBand from './components/NumbersBand'
import OpenSourceCallout from './components/OpenSourceCallout'
import ProcessStrip from './components/ProcessStrip'
import ProfileTabs from './components/ProfileTabs'
import ReelSection from './components/ReelSection'
import RibbonCursor from './components/RibbonCursor'
import SiteNav from './components/SiteNav'
import Sticker from './components/Sticker'
import Terminal from './components/Terminal'
import TicTacToe from './components/TicTacToe'

const Cube = lazy(() => import('./components/Cube'))
import { certifications, githubPinSlugs, heroBullets, marqueeItems, navItems, numbers, process as processSteps, profile, reelItems, sections, stickers as stickerData } from './data/portfolioContent'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const { scrollYProgress } = useScroll()
  const progressBar = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 22,
    mass: 0.4,
  })

  const noiseLeftY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const noiseRightY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const scribbleLeftY = useTransform(scrollYProgress, [0, 1], [0, -160])
  const scribbleRightY = useTransform(scrollYProgress, [0, 1], [0, -120])

  const dividerRef = useRef(null)
  const cubeWrapRef = useRef(null)

  useEffect(() => {
    const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
    let i = 0
    const onKey = (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (key === seq[i]) {
        i++
        if (i === seq.length) {
          document.body.classList.toggle('theme-lab')
          i = 0
        }
      } else {
        i = key === seq[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    })
    let rafId
    const raf = (time) => {
      lenis.raf(time)
      ScrollTrigger.update()
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (dividerRef.current) {
        gsap.fromTo(
          dividerRef.current,
          { clipPath: 'inset(0 100% 0 0)', opacity: 0.4 },
          {
            clipPath: 'inset(0 0% 0 0)',
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: dividerRef.current,
              start: 'top 90%',
              end: 'top 40%',
              scrub: true,
            },
          }
        )
      }

      if (cubeWrapRef.current) {
        gsap.to(cubeWrapRef.current, {
          rotate: 360,
          y: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: cubeWrapRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        })
      }

      gsap.utils.toArray('.content-card h2').forEach((heading) => {
        gsap.fromTo(
          heading,
          { backgroundSize: '0% 0.4em' },
          {
            backgroundSize: '100% 0.4em',
            ease: 'power2.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 85%',
              end: 'top 55%',
              scrub: true,
            },
          }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <>
    <IntroLoader />
    <main className="app-shell">
      <RibbonCursor />
      <div className="paper-grain" aria-hidden="true" />
      <motion.div className="scroll-progress" style={{ scaleX: progressBar }} aria-hidden="true" />
      <motion.div
        className="page-noise page-noise-left"
        aria-hidden="true"
        style={{ y: noiseLeftY }}
      />
      <motion.div
        className="page-noise page-noise-right"
        aria-hidden="true"
        style={{ y: noiseRightY }}
      />

      <section className="notebook-shell">
        <div className="paper-tear paper-tear-top" aria-hidden="true" />
        <div className="paper-tear paper-tear-bottom" aria-hidden="true" />

        <div className="notebook-spread">
          <SiteNav items={navItems} />

          <motion.div
            className="scribble-cluster scribble-cluster-left"
            aria-hidden="true"
            style={{ y: scribbleLeftY }}
          >
            <span />
            <span />
            <span />
          </motion.div>

          {stickerData.map((s, i) => (
            <Sticker key={`${s.text}-${i}`} text={s.text} color={s.color} rotation={s.rotation} x={s.x} y={s.y} />
          ))}

          <HeroSection bullets={heroBullets} />

          <NumbersBand githubUser={profile.github} items={numbers} />

          <Marquee items={marqueeItems} />

          <div className="divider-wrap" aria-hidden="true">
            <img
              ref={dividerRef}
              className="pencil-divider"
              src={pencilDivider}
              alt=""
            />
          </div>

          <div style={{ position: 'relative' }}>
            <div ref={cubeWrapRef} style={{ position: 'absolute', right: '10%', top: '-2rem', zIndex: 2 }}>
              <Suspense fallback={null}>
                <Cube className="hero-cube" />
              </Suspense>
            </div>
            <ReelSection items={reelItems} />
          </div>

          <section className="profiles-strip" aria-label="Coding profiles">
            <p className="profiles-strip-eyebrow">Coding Profiles</p>
            <ProfileTabs />
          </section>

          <GithubActivity username={profile.github} />
          <CodingStats leetcodeUser={profile.leetcode} codeforcesUser={profile.codeforces} />
          <GithubPins username={profile.github} slugs={githubPinSlugs} />

          <Certifications items={certifications} />

          <OpenSourceCallout />

          <ProcessStrip steps={processSteps} />

          <ContentSections sections={sections} />

          <motion.div
            className="scribble-cluster scribble-cluster-right"
            aria-hidden="true"
            style={{ y: scribbleRightY }}
          >
            <span />
            <span />
            <span />
          </motion.div>
        </div>
      </section>

      <TicTacToe />
      <CommandPalette />
      <Terminal />
      <MusicChip />
    </main>
    </>
  )
}

export default App
