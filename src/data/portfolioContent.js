export const navItems = ['About', 'Projects', 'Journey', 'Notes', 'Contact']

export const heroBullets = [
  'Frontend development focused on interaction and usability',
  'Projects shaped with structure, clarity, and visual taste',
  'Open to meaningful products, freelance work, and collaborations',
]

export const sections = [
  {
    id: 'about',
    className: 'section-about',
    tag: 'About',
    title: 'Building products with clarity, personality, and care.',
    body: 'I enjoy turning ideas into interfaces that feel intuitive at first glance and rewarding on a second look. My focus is on frontend work that balances structure, visual rhythm, and strong user experience.',
  },
  {
    id: 'projects',
    className: 'section-projects',
    tag: 'Projects',
    title: 'Selected work',
    projects: [
      {
        index: '01',
        title: 'Immersive portfolio system',
        body: 'A personal portfolio designed around visual storytelling, motion, and strong interaction design.',
      },
      {
        index: '02',
        title: 'Frontend product build',
        body: 'Responsive UI work focused on clean flows, refined layouts, and readable code structure.',
      },
      {
        index: '03',
        title: 'Creative web experiments',
        body: 'Visual concepts, interaction studies, and pieces that explore how interfaces can feel more alive.',
      },
    ],
  },
  {
    id: 'journey',
    className: 'section-journey',
    tag: 'Journey',
    title: 'What I bring',
    list: [
      'Frontend development with React and JavaScript',
      'Strong interest in motion-led interface design',
      'Visual thinking shaped by editing and storytelling',
      'Comfortable blending product logic with aesthetics',
    ],
  },
  {
    id: 'notes',
    className: 'section-notes',
    tag: 'Notes',
    title: 'Things I care about',
    list: [
      'Interfaces should feel calm before they feel impressive.',
      'Motion should guide attention, not compete with content.',
      'Details are what make digital work feel human.',
    ],
  },
  {
    id: 'contact',
    className: 'section-contact',
    tag: 'Contact',
    title: "Let's build something thoughtful.",
    body: "If you're working on a product, experience, or idea that needs strong frontend execution and taste, I'd love to hear about it.",
    cta: {
      href: 'mailto:ambuj@example.com',
      label: 'Say Hello',
    },
  },
]

export const reelItems = [
  {
    index: '01',
    tag: 'Notebook Reel',
    title: 'Immersive portfolio system',
    body: 'A cinematic notebook interface built around scroll choreography, tactile layering, and stronger visual identity.',
    accent: 'reel-card-blue',
  },
  {
    index: '02',
    tag: 'UI Build',
    title: 'Frontend product build',
    body: 'Responsive product UI work focused on clarity, interaction rhythm, and making complex layouts feel easy to read.',
    accent: 'reel-card-red',
  },
  {
    index: '03',
    tag: 'Experiments',
    title: 'Creative web experiments',
    body: 'Small interaction studies exploring motion, reveal systems, and calmer ways to make the web feel alive.',
    accent: 'reel-card-ink',
  },
  {
    index: '04',
    tag: 'Next World',
    title: 'Editor side, coming later',
    body: 'A future mirrored experience where the visual rhythm shifts into storyboards, reels, and motion-first composition.',
    accent: 'reel-card-blue',
  },
]
