// Verifies every text and control pairing from the brand book's color table, in both themes.
// WCAG 2.2: text needs 4.5:1; control borders and focus indicators need 3:1.
// Run with `npm run check:contrast`. Exits non-zero if any pair fails.
import fs from 'node:fs'

const tokens = JSON.parse(fs.readFileSync(new URL('../src/styles/tokens.json', import.meta.url), 'utf8'))
const color = Object.fromEntries(tokens.color.tokens.map((t) => [t.name, t.value]))

const luminance = (hex) => {
  const h = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const grounds = ['bg', 'surface', 'lavender']
const pairs = [
  // Text: ink, body and muted pass on bg, surface and lavender (brand book, Color).
  ...['ink', 'body', 'muted'].flatMap((fg) => grounds.map((bg) => [fg, bg, 4.5, 'text'])),
  // Links and actions in accent on every ground.
  ...grounds.map((bg) => ['accent', bg, 4.5, 'link text']),
  ['on-accent', 'accent', 4.5, 'primary button text'],
  ['lavender-ink', 'lavender', 4.5, 'brand text on lavender'],
  // Form fields: typed text and placeholder, then the outline.
  ['ink', 'field', 4.5, 'field text'],
  ['muted', 'field', 4.5, 'field placeholder'],
  ['field-border', 'field', 3, 'field outline'],
  ['field-border', 'lavender', 3, 'field outline on Let’s Connect band'],
  // Focus rings are drawn in accent.
  ...grounds.map((bg) => ['accent', bg, 3, 'focus ring']),
]

let failed = 0
for (const theme of tokens.color.themes.map((t) => t.id)) {
  console.log(`\n${theme}`)
  for (const [fg, bg, min, use] of pairs) {
    const r = ratio(color[fg][theme], color[bg][theme])
    const ok = r >= min
    if (!ok) failed++
    console.log(`  ${ok ? 'pass' : 'FAIL'}  ${r.toFixed(2).padStart(5)}:1  (needs ${min}:1)  ${fg} on ${bg}  — ${use}`)
  }
}
console.log(failed ? `\n${failed} pair(s) fail.` : '\nAll pairs pass in both themes.')
process.exit(failed ? 1 : 0)
