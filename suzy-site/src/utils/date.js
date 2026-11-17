/**
 * Entry dates, e.g. "July 23, 2026" (as in the Refresh mockups).
 * Fixed to US English in Suzy's time zone (Orlando), so the prerendered HTML,
 * built on a server in UTC, shows the same date a visitor's browser does.
 */
export function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/New_York',
  })
}
