import { motion } from 'framer-motion'

export default function RevealText({
  text,
  as = 'h2',
  className = '',
  stagger = 0.018,
  delay = 0,
  duration = 0.55,
}) {
  const Tag = motion[as] || motion.span
  const words = text.split(' ')

  let charIndex = 0
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, wi) => (
        <span
          key={wi}
          className="reveal-word"
          style={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            marginRight: '0.28em',
            overflow: 'hidden',
            paddingBottom: '0.06em',
            verticalAlign: 'top',
          }}
        >
          {Array.from(word).map((char) => {
            const i = charIndex++
            return (
              <motion.span
                key={i}
                className="reveal-char"
                style={{ display: 'inline-block' }}
                variants={{
                  hidden: { y: '110%', opacity: 0 },
                  show: { y: 0, opacity: 1 },
                }}
                transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
              >
                {char}
              </motion.span>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}
