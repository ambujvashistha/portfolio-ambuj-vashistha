import { motion } from 'framer-motion'
import './OpenSourceCallout.css'

export default function OpenSourceCallout() {
  return (
    <motion.aside
      className="oss-callout"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Open source contribution"
    >
      <div className="oss-head">
        <span className="oss-badge">
          <span className="oss-dot" />
          MERGED
        </span>
        <p className="oss-eyebrow">Open Source · Shiki</p>
      </div>

      <h3 className="oss-title">
        Fixed unhandled promise rejections in lazy language loading
      </h3>

      <pre className="oss-diff" aria-hidden="true">
        <span className="oss-line oss-line-meta">shiki/src/core/registry.ts</span>
        <span className="oss-line oss-line-old">{`-  return loader().then((mod) => mod.default ?? mod)`}</span>
        <span className="oss-line oss-line-new">{`+  return loader()`}</span>
        <span className="oss-line oss-line-new">{`+    .then((mod) => mod.default ?? mod)`}</span>
        <span className="oss-line oss-line-new">{`+    .catch((err) => { handleLazyLoadError(err); throw err })`}</span>
      </pre>

      <div className="oss-foot">
        <span className="oss-meta">improved error handling · production stability</span>
        <a
          className="oss-link"
          href="https://github.com/shikijs/shiki/pull/1221"
          target="_blank"
          rel="noreferrer"
          data-cursor="link"
        >
          PR #1221 ↗
        </a>
      </div>
    </motion.aside>
  )
}
