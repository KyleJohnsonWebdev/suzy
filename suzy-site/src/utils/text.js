/**
 * Truncates text at a word boundary near the given character limit.
 * Fixes the substring(0, N) mid-word cut bug throughout the feed.
 *
 * @param {string} text
 * @param {number} limit - max characters (default 280)
 * @returns {string}
 */
export function truncateAtWord(text, limit = 280) {
  if (!text || text.length <= limit) return text
  const cut = text.lastIndexOf(' ', limit)
  return (cut > 0 ? text.substring(0, cut) : text.substring(0, limit)) + '…'
}

/**
 * Extracts plain text from a Sanity portable text body array.
 * Used for preview excerpts only — full rendering uses PortableText component.
 *
 * @param {Array} body - Sanity portable text blocks
 * @returns {string}
 */
export function extractPlainText(body) {
  if (!body || !Array.isArray(body)) return ''
  return body
    .filter((block) => block._type === 'block')
    .map((block) =>
      (block.children || []).map((child) => child.text || '').join('')
    )
    .join(' ')
}
