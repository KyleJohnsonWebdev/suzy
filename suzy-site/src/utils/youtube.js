// YouTube utility functions.
// Previously defined separately in Home.jsx, EntriesFeed.jsx, and EntryDetail.jsx.
// Single source of truth — import from here everywhere.

const VIDEO_ID_REGEX =
  /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/

/**
 * Returns a maxresdefault YouTube thumbnail URL for a given video URL.
 * Returns null if the URL is not a recognisable YouTube URL.
 */
export function getYouTubeThumbnail(url) {
  if (!url) return null
  const match = url.match(VIDEO_ID_REGEX)
  return match
    ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`
    : null
}

const VIMEO_ID_REGEX = /vimeo\.com\/(?:video\/)?(\d+)/

/**
 * Returns a player URL for a YouTube or Vimeo link, or null for anything
 * else (those show as a link card in posts instead).
 */
export function getVideoEmbedUrl(url) {
  if (!url) return null
  const yt = url.match(VIDEO_ID_REGEX)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vimeo = url.match(VIMEO_ID_REGEX)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return null
}

/**
 * Returns a YouTube embed URL for a given video URL.
 * Falls back to the original URL if not a recognisable YouTube URL.
 */
export function getYouTubeEmbedUrl(url) {
  if (!url) return null
  const match = url.match(VIDEO_ID_REGEX)
  return match ? `https://www.youtube.com/embed/${match[1]}` : url
}
