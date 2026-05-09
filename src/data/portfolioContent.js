const defaults = {
  navItems: ['About', 'Projects', 'Journey', 'Notes', 'Contact'],

  assets: {
    resumePdf: '/ambuj-vashistha-resume.pdf',
    resumeDownloadName: 'Ambuj-Vashistha-Resume.pdf',
    ogImage: '/og-image.png',
    favicon: '/vite.svg',
  },

  intro: {
    eyebrow: 'portfolio',
    name: 'Ambuj Vashistha',
    tag: 'just a moment...',
    durationMs: 2400,
  },

  stickers: [
    { text: 'WIP 🚀', color: '#e3eeff', rotation: '8deg', x: '85%', y: '22%' },
  ],

  tictactoe: {
    fabMark: '✕○',
    fabLabel: 'Bored? Play',
    title: "Bored? Let's play.",
    chooserLabel: 'Pick your pencil:',
  },

  music: {
    label: 'Music',
    playlist: [
      { title: 'Track One', artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      { title: 'Track Two', artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
      { title: 'Track Three', artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
      { title: 'Track Four', artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' },
    ],
  },

  profileTabs: [
    {
      id: 'github',
      label: 'GitHub',
      handle: 'ambujvashistha',
      url: 'https://github.com/ambujvashistha',
      fallback: '/previews/github.png',
      accent: '#11151d',
    },
    {
      id: 'leetcode',
      label: 'LeetCode',
      handle: 'ambuj_vashistha',
      url: 'https://leetcode.com/u/ambuj_vashistha/',
      fallback: '/previews/leetcode.png',
      accent: '#ffa116',
    },
    {
      id: 'codeforces',
      label: 'Codeforces',
      handle: 'ambuj_vashistha',
      url: 'https://codeforces.com/profile/ambuj_vashistha',
      fallback: '/previews/codeforces.png',
      accent: '#1f8acb',
    },
  ],

  profile: {
    name: 'Ambuj Vashistha',
    firstName: 'Ambuj',
    lastName: 'Vashistha',
    email: 'ambujva123@gmail.com',
    phone: '+91 86195 03855',
    github: 'ambujvashistha',
    leetcode: 'ambuj_vashistha',
    codeforces: 'ambuj_vashistha',
    linkedin: 'ambuj-vashistha',
    youtube: '@ambujvashistha',
    location: 'Pune, India',
    school: 'B.Tech AI/ML — Newton School of Technology (ADYPU)',
    gpa: '8.98 / 10.0',
    cohort: '2024 – 2028',
    calendly: 'https://calendly.com/ambujva123/30min',
  },

  hero: {
    eyebrow: 'Developer',
    kicker: 'thoughts, sketches, and shipped interfaces',
    summary: 'I make things people actually use — calmer interfaces, sharper interactions, fewer dead clicks.',
    primaryCta: { label: 'View Projects', href: '#projects' },
    secondaryCta: { label: 'Read Notes', href: '#notes' },
  },

  contactLinks: [
    {
      kind: 'email',
      label: 'Email',
      value: 'ambujva123@gmail.com',
      href: 'mailto:ambujva123@gmail.com',
    },
    {
      kind: 'github',
      label: 'GitHub',
      value: '@ambujvashistha',
      href: 'https://github.com/ambujvashistha',
    },
    {
      kind: 'linkedin',
      label: 'LinkedIn',
      value: 'ambuj-vashistha',
      href: 'https://www.linkedin.com/in/ambuj-vashistha',
    },
    {
      kind: 'youtube',
      label: 'YouTube',
      value: '@ambujvashistha',
      href: 'https://youtube.com/@ambujvashistha',
    },
    {
      kind: 'calendly',
      label: 'Book a chat',
      value: 'calendly.com/ambujva123/30min',
      href: 'https://calendly.com/ambujva123/30min',
    },
  ],

  numbers: [
    { value: 250, suffix: '+', label: 'DSA solved', sub: 'LeetCode + Codeforces' },
    { value: 941, suffix: '', label: 'CF max rating', sub: 'Codeforces peak' },
    { value: 8.98, suffix: '/10', label: 'GPA', sub: 'B.Tech AI/ML, ADYPU' },
    { value: null, suffix: '+', label: 'GitHub contribs', sub: 'last 12 months', live: 'github' },
    { value: 37, suffix: 'K+', label: 'YouTube views', sub: '250+ watch hours' },
    { value: 100, suffix: '+', label: 'listings unified', sub: 'Job Sync aggregator' },
  ],

  process: [
    { n: '01', title: 'Discover', body: 'Read the problem twice. Talk to a user. Find the constraint nobody flagged.' },
    { n: '02', title: 'Sketch', body: 'Lo-fi grids in Figma + scribbles. Settle structure before pixels.' },
    { n: '03', title: 'Prototype', body: 'React + Vite, wire core flows fast, profile early. 10–12ms render budget.' },
    { n: '04', title: 'Ship', body: 'Tighten edges, write tests for the critical path, deploy. Watch the first user click.' },
  ],

  certifications: [
    {
      issuer: 'Deloitte',
      title: 'Technology Job Simulation',
      date: 'Apr 2026',
      body: 'Implemented data transformation logic with unit tests, drafted software development proposal for machine health.',
      link: 'https://www.theforage.com/completion-certificates/9PBTqmSxAf6zZTseP/udmxiyHeqYQLkTPvf_9PBTqmSxAf6zZTseP_TwXcWanrefSubgWQF_1775978107481_completion_certificate.pdf',
      accent: 'green',
      initials: 'D',
    },
    {
      issuer: 'McKinsey.org',
      title: 'Forward Program',
      date: 'Nov 2025',
      body: 'Structured problem solving, communication, and data-driven decision making through real-world scenarios.',
      link: 'https://www.credly.com/badges/d6a7b7c2-0cd7-4980-998a-24e1866fd030/public_url',
      accent: 'blue',
      initials: 'M',
    },
    {
      issuer: 'HackerRank',
      title: 'Software Engineer Intern',
      date: 'Sep 2025',
      body: 'Demonstrated proficiency in data structures, algorithms, and problem solving under timed assessments.',
      link: 'https://www.hackerrank.com/certificates/259d3e21c3c3',
      accent: 'amber',
      initials: 'HR',
    },
    {
      issuer: 'Postman',
      title: 'API Fundamentals Student Expert',
      date: 'Aug 2025',
      body: 'Designed and executed API requests (GET, POST, PUT, DELETE) using Postman.',
      link: 'https://badges.parchment.com/public/assertions/avz8gsSjQ7W3oy6I1IeASQ?identity__email=ambujva123@gmail.com',
      accent: 'red',
      initials: 'P',
    },
  ],

  githubPinSlugs: [
    'Vegapunk-debug/customer-churn-agentic-retention-system',
    'ambujvashistha/chronosapiens',
    'ambujvashistha/worddle',
    'madhurrathod/velocity-vortex-dva-capstone-project',
    'MOHITKOURAV01/Stock_Portfolio_Risk_Analyzer',
    'ambujvashistha/well-played',
  ],

  marqueeItems: [
    'React', 'React Native', 'TypeScript', 'JavaScript', 'Python',
    'Node.js', 'Express', 'Prisma', 'MySQL', 'MongoDB',
    'Vite', 'Expo', 'AWS', 'Docker', 'GitHub Actions', 'Pandas', 'Scikit-learn',
  ],

  heroBullets: [
    'Full-stack dev — React Native + React, scalable UI architecture',
    'Problem solver — 250+ DSA across [LeetCode](https://leetcode.com/u/ambuj_vashistha/) + [Codeforces](https://codeforces.com/profile/ambuj_vashistha) (max 941)',
    'YouTube — 37K+ views built through retention-driven editing',
  ],

  sections: [
    {
      id: 'about',
      className: 'section-about',
      tag: 'About',
      title: 'I sit on the design–engineering seam.',
      body: 'I care equally about how a product feels under thumb and how it ships under deadline. Right now that means cross-platform builds with [React Native](https://reactnative.dev/), performance-tuned web work, and small interaction studies in between. Less recital, more reps.',
    },
    {
      id: 'projects',
      className: 'section-projects',
      tag: 'Projects',
      title: 'Selected work',
      projects: [
        {
          index: '01',
          title: 'BrainStorm Builder',
          body: 'JSON-driven layout editor with import/export, file-based persistence, and real-time state sync. Event-driven interaction system handles drag, resize, keyboard, and constraint-based layouts.',
          role: 'Solo build',
          stack: ['React', 'Vite', 'JS', 'Pointer Events API'],
          outcome: '10–12ms per render · 60 FPS',
          date: 'Apr 2026',
          github: 'https://github.com/ambujvashistha/brainstorm-builder',
          demo: 'https://brainstorm-builder-pied.vercel.app/',
        },
        {
          index: '02',
          title: 'Customer Churn Agentic Retention',
          body: 'Trained a Random Forest churn model with cross-validation. Built a preprocessing pipeline (encoding, scaling, null handling) and integrated ML outputs into an LLM-based retention agent with SHAP explainability.',
          role: 'ML + Backend',
          stack: ['Python', 'Scikit-learn', 'SHAP', 'LLM Agent'],
          outcome: 'ROC-AUC validated retention pipeline',
          date: 'Mar 2026',
          github: 'https://github.com/Vegapunk-debug/customer-churn-agentic-retention-system',
          demo: 'https://customer-churn-agentic-retention-system.streamlit.app/',
        },
        {
          index: '03',
          title: 'Worddle Mobile Game',
          body: 'Cross-platform Wordle clone with accurate duplicate-letter evaluation, real-time feedback, and deep-linkable encoded game URLs for shareable custom challenges.',
          role: 'Mobile lead',
          stack: ['React Native', 'Expo', 'JS'],
          outcome: 'Deep-link share + full game lifecycle',
          date: 'Mar 2026',
          github: 'https://github.com/ambujvashistha/worddle',
          demo: 'https://www.youtube.com/shorts/-_y5qMtsZ1U',
        },
        {
          index: '04',
          title: 'Job Sync',
          body: 'Aggregated and normalized 100+ job listings from Internshala, Unstop, and others. Designed scraper workflows + clean API responses for scalable search.',
          role: 'Full-stack',
          stack: ['Express', 'JWT', 'MySQL', 'Prisma', 'React'],
          outcome: '100+ listings unified across platforms',
          date: 'Dec 2025',
          github: 'https://github.com/ambujvashistha/chronosapiens',
          demo: 'https://chronosapiens.vercel.app/',
        },
      ],
    },
    {
      id: 'journey',
      className: 'section-journey',
      tag: 'Journey',
      title: 'What I bring',
      cards: [
        { icon: '◆', title: 'B.Tech AI/ML', body: 'Newton School of Technology (ADYPU) · GPA 8.98', accent: 'blue' },
        { icon: '◇', title: 'Open Source', body: '[Shiki PR #1221](https://github.com/shikijs/shiki/pull/1221) — fixed lazy-language load promise rejections', accent: 'red' },
        { icon: '▲', title: '250+ DSA', body: 'Solved across LeetCode + Codeforces · max CF rating 941', accent: 'green' },
        { icon: '✦', title: 'YouTube', body: '37K+ views · 250+ watch hours via retention-led editing', accent: 'amber' },
        { icon: '☷', title: 'Mobile', body: 'React Native + Expo — deep linking, gestures, native bridges', accent: 'blue' },
        { icon: '⌬', title: 'Backend', body: 'Express + Prisma + MySQL · JWT auth · web scraping pipelines', accent: 'red' },
        { icon: '◐', title: 'ML', body: 'Pandas · Scikit-learn · SHAP · LLM agents w/ LangGraph', accent: 'green' },
        { icon: '✻', title: 'DevOps', body: 'AWS · Docker · GitHub Actions · CI/CD for shipped projects', accent: 'amber' },
      ],
      stack: [
        { label: 'Languages', items: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'NoSQL', 'HTML', 'CSS', 'Bash'] },
        { label: 'Frameworks', items: ['React', 'React Native', 'Express', 'Node.js', 'Vite', 'Expo'] },
        { label: 'Data + ML', items: ['Pandas', 'Scikit-learn', 'SHAP', 'LangGraph', 'MySQL', 'MongoDB', 'Prisma'] },
        { label: 'Ops + Tools', items: ['AWS', 'Docker', 'GitHub Actions', 'Git', 'Postman', 'Figma'] },
      ],
      now: [
        { label: 'Building', value: 'BrainStorm Builder · drag-resize JSON layout editor at 60 FPS' },
        { label: 'Making', value: 'YouTube edit series · retention-led storytelling' },
        { label: 'Learning', value: 'AWS · Docker · AI agents' },
        { label: 'Looking for', value: 'Full-stack · Mobile dev · AI internships' },
      ],
    },
    {
      id: 'notes',
      className: 'section-notes',
      tag: 'Notes',
      title: 'Things I care about',
      list: [
        "Coffee, lo-fi, and a working pc — that's the whole stack.",
        "I'd rather refactor for an hour than fix the same bug twice.",
        'Boring tech wins, unless shiny tech ships first.',
        'Ship something every week. Even a typo fix counts.',
        'YouTube taught me retention. React taught me state. Both punish boredom.',
      ],
    },
    {
      id: 'contact',
      className: 'section-contact',
      tag: 'Contact',
      title: "Let's build something thoughtful.",
      body: "If you're working on a product, experience, or idea that needs strong frontend execution and taste — mobile or web — I'd love to hear about it.",
      cta: { href: 'mailto:ambujva123@gmail.com', label: 'Say Hello' },
      secondaryCta: { href: 'https://calendly.com/ambujva123/30min', label: 'Book a 30-min chat ↗' },
    },
  ],

  reelItems: [
    { index: '01', tag: 'Editor', title: 'BrainStorm Builder', body: 'JSON-driven layout editor with drag, resize, keyboard, and constraint updates — profiled to 60 FPS.', accent: 'reel-card-blue' },
    { index: '02', tag: 'ML + Agent', title: 'Churn Retention System', body: 'Random Forest churn model wired into an LLM-based retention agent with SHAP explainability.', accent: 'reel-card-red' },
    { index: '03', tag: 'Mobile', title: 'Worddle', body: 'React Native Wordle with deep-link shareable URLs and accurate duplicate-letter logic.', accent: 'reel-card-ink' },
    { index: '04', tag: 'Backend', title: 'Job Sync', body: 'Express + Prisma + MySQL aggregator unifying 100+ listings from Internshala, Unstop, and more.', accent: 'reel-card-blue' },
  ],
}

export const navItems = defaults.navItems
export const profile = defaults.profile
export const hero = defaults.hero
export const assets = defaults.assets
export const intro = defaults.intro
export const stickers = defaults.stickers
export const tictactoe = defaults.tictactoe
export const music = defaults.music
export const profileTabs = defaults.profileTabs
export const contactLinks = defaults.contactLinks
export const numbers = defaults.numbers
export const process = defaults.process
export const certifications = defaults.certifications
export const githubPinSlugs = defaults.githubPinSlugs
export const marqueeItems = defaults.marqueeItems
export const heroBullets = defaults.heroBullets
export const sections = defaults.sections
export const reelItems = defaults.reelItems
