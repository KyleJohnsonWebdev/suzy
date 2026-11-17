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

/**
 * Splits text into an opening of whole sentences (up to `limit` characters,
 * at least one sentence, cut at a word if that one is longer) and the rest.
 * Used by entry cards: the opening becomes the pull quote, the rest the excerpt.
 *
 * @param {string} text
 * @param {number} limit
 * @returns {{ lead: string, rest: string }}
 */
export function splitLead(text, limit = 120) {
  const clean = (text || '').replace(/\s+/g, ' ').trim()
  const sentences = clean.match(/[^.!?]+[.!?]+["”’)]*\s*|[^.!?]+$/g) || []
  let lead = ''
  let i = 0
  while (i < sentences.length && (lead === '' || (lead + sentences[i]).trim().length <= limit)) {
    lead += sentences[i]
    i++
  }
  lead = lead.trim()
  if (lead.length > limit) return { lead: truncateAtWord(lead, limit), rest: '' }
  return { lead, rest: sentences.slice(i).join('').trim() }
}

/** "statement" → "Statement" */
export function capitalize(word) {
  return word ? word.charAt(0).toUpperCase() + word.slice(1) : ''
}
