// Editable content for the video-editor portfolio. Real channel data comes from the YT API.
export const editorProfile = {
  name: 'Ambuj Vashistha',
  role: 'Anime Editor / AMV',
  channelUrl: 'https://youtube.com/@ambujvashistha',
  handle: '@ambujvashistha',
  tagline: 'I cut anime to the beat — frame-timed edits, motion, and color that hit on the drop.',
  blurb:
    'Self-taught editor with 250+ watch hours of finished work. I obsess over beat-sync, transitions that carry energy, and grades that make a frame feel like a poster.',
}

// timeline "clips" laid on tracks — the real toolchain, mobile-first → desktop
export const timeline = [
  {
    track: 'Cut',
    color: 'cool',
    clips: [
      { label: 'KineMaster', start: 0, len: 5 },
      { label: 'Beat-sync', start: 5, len: 3 },
      { label: 'Transitions', start: 8, len: 4 },
    ],
  },
  {
    track: 'Color',
    color: 'warm',
    clips: [
      { label: 'DaVinci Resolve', start: 1, len: 5 },
      { label: 'LUTs', start: 6, len: 2 },
      { label: 'Glow', start: 8, len: 4 },
    ],
  },
  {
    track: 'Graphics',
    color: 'cool',
    clips: [
      { label: 'PicsArt', start: 0, len: 3 },
      { label: 'PixelLab', start: 3, len: 4 },
      { label: 'Overlays', start: 8, len: 3 },
    ],
  },
  {
    track: 'Sound',
    color: 'warm',
    clips: [
      { label: 'Audio sync', start: 1, len: 4 },
      { label: 'SFX', start: 5, len: 3 },
      { label: 'Mix', start: 9, len: 3 },
    ],
  },
]

export const craftNotes = [
  { k: 'Beat-sync', v: 'Cuts land on transients, not bars. The edit breathes with the track.' },
  { k: 'Mobile-first', v: 'Built thumb-to-screen in KineMaster, PicsArt and PixelLab — fast, scrappy, shipped.' },
  { k: 'Now grading', v: 'Leveling up in DaVinci Resolve for color that makes a frame read like key art.' },
  { k: 'Story', v: 'Even a 30-second short has a build, a drop, and a landing.' },
]
