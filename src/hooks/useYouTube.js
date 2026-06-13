import { useEffect, useState } from 'react'

const API_KEY = import.meta.env.VITE_YT_API_KEY
const CHANNEL_ID = import.meta.env.VITE_YT_CHANNEL_ID || 'UCGIxGFeB6jbl5CEDqyU2axg'
const CACHE_KEY = `yt-cache-v2-${CHANNEL_ID}`
const TTL = 1000 * 60 * 30 // 30 min

// Shown if the API key is missing or quota is exhausted, so the UI never reads empty.
const FALLBACK = {
  channel: {
    title: 'Ambuj Vashistha',
    subs: null,
    views: 37000,
    videoCount: null,
    thumb: null,
    banner: null,
    description: 'Anime edits, AMVs, and edits that hit on the drop.',
    publishedAt: null,
  },
  videos: [],
}

// ISO-8601 (PT#H#M#S) -> seconds
function parseDuration(iso) {
  if (!iso) return 0
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return 0
  return (Number(m[1]) || 0) * 3600 + (Number(m[2]) || 0) * 60 + (Number(m[3]) || 0)
}

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Date.now() - parsed.t > TTL) return null
    return parsed.d
  } catch {
    return null
  }
}

function writeCache(d) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), d }))
  } catch {
    /* ignore quota / private mode */
  }
}

export default function useYouTube() {
  const [data, setData] = useState(() => readCache() || { ...FALLBACK, loading: true })
  const [status, setStatus] = useState(() => (readCache() ? 'ready' : 'loading'))

  useEffect(() => {
    const cached = readCache()
    if (cached) {
      setData(cached)
      setStatus('ready')
      return
    }
    if (!API_KEY) {
      setData({ ...FALLBACK })
      setStatus('fallback')
      return
    }

    let cancelled = false
    async function load() {
      try {
        const [chRes, vidRes] = await Promise.all([
          fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet,brandingSettings&id=${CHANNEL_ID}&key=${API_KEY}`,
          ),
          fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=24&type=video`,
          ),
        ])
        const ch = await chRes.json()
        const vd = await vidRes.json()
        if (cancelled) return
        if (ch.error || vd.error) throw new Error(ch.error?.message || vd.error?.message)

        const c = ch.items?.[0]
        const channel = c
          ? {
              title: c.snippet?.title || FALLBACK.channel.title,
              subs: Number(c.statistics?.subscriberCount) || null,
              views: Number(c.statistics?.viewCount) || FALLBACK.channel.views,
              videoCount: Number(c.statistics?.videoCount) || null,
              thumb: c.snippet?.thumbnails?.high?.url || null,
              banner: c.brandingSettings?.image?.bannerExternalUrl
                ? `${c.brandingSettings.image.bannerExternalUrl}=w2120`
                : null,
              description: c.snippet?.description || FALLBACK.channel.description,
              publishedAt: c.snippet?.publishedAt || null,
            }
          : FALLBACK.channel

        let videos = (vd.items || [])
          .filter((i) => i.id?.videoId)
          .map((i) => ({
            id: i.id.videoId,
            title: decodeEntities(i.snippet.title),
            description: i.snippet.description || '',
            image:
              i.snippet.thumbnails?.high?.url || i.snippet.thumbnails?.medium?.url || '',
            link: `https://www.youtube.com/watch?v=${i.id.videoId}`,
            publishedAt: i.snippet.publishedAt,
            views: null,
            likes: null,
            durationSec: null,
            isShort: false,
          }))

        // Enrich with statistics + duration (one call), and classify Shorts (<= 60s).
        try {
          const ids = videos.map((v) => v.id).join(',')
          if (ids) {
            const sRes = await fetch(
              `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${ids}&key=${API_KEY}`,
            )
            const sd = await sRes.json()
            if (!cancelled && !sd.error) {
              const byId = {}
              for (const it of sd.items || []) byId[it.id] = it
              videos = videos.map((v) => {
                const it = byId[v.id]
                if (!it) return v
                const dur = parseDuration(it.contentDetails?.duration)
                const isShort = dur > 0 && dur <= 60
                return {
                  ...v,
                  views: Number(it.statistics?.viewCount) || null,
                  likes: Number(it.statistics?.likeCount) || null,
                  durationSec: dur,
                  isShort: isShort || /#shorts?/i.test(v.title),
                }
              })
            }
          }
        } catch {
          /* stats are a bonus; keep base videos on failure */
        }

        const next = { channel, videos }
        writeCache(next)
        setData(next)
        setStatus('ready')
      } catch (err) {
        if (cancelled) return
        setData({ ...FALLBACK })
        setStatus('error')
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { ...data, status }
}

function decodeEntities(str = '') {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}
