/**
 * Entry dates, e.g. "7/23/2026" (the site's existing format).
 * Fixed to US format in Suzy's time zone (Orlando), so the prerendered HTML,
 * built on a server in UTC, shows the same date a visitor's browser does.
 */
export function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', { timeZone: 'America/New_York' })
}
