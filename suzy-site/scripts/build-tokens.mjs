// Generates src/styles/tokens.css from src/styles/tokens.json (the brand's design tokens).
// Run with `npm run tokens` after changing tokens.json. Never edit tokens.css by hand.
import fs from 'node:fs'

const root = new URL('../', import.meta.url)
const tokens = JSON.parse(fs.readFileSync(new URL('src/styles/tokens.json', root), 'utf8'))

const hexToRgb = (hex) => {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)).join(' ')
}

// Each color gets a hex variable and an "r g b" variable (for Tailwind opacity modifiers).
const colorVars = (theme) =>
  tokens.color.tokens
    .map((t) => {
      const v = t.value[theme]
      return `  --color-${t.name}: ${v};\n  --color-${t.name}-rgb: ${hexToRgb(v)};`
    })
    .join('\n')

const scale = (family, prefix) =>
  tokens[family].tokens.map((t) => `  --${t.name.startsWith(prefix) ? t.name : prefix + t.name}: ${t.value};`).join('\n')

const css = `/* Maybe Special — generated from tokens.json by scripts/build-tokens.mjs. Do not edit by hand. */

/* Light is the default. A saved choice sets data-theme on <html> before first paint
   (see the inline script in index.html); without one, the system setting decides. */
:root,
[data-theme='light'] {
  color-scheme: light;
${colorVars('light')}
}

[data-theme='dark'] {
  color-scheme: dark;
${colorVars('dark')}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    color-scheme: dark;
${colorVars('dark').replace(/^/gm, '  ')}
  }
}

:root {
  --font-sans: ${tokens.type.families.sans.replace('Inter,', "Inter, 'Inter Fallback',")};
${scale('spacing', 'space-')}
${scale('radius', 'radius-')}
}
`

fs.writeFileSync(new URL('src/styles/tokens.css', root), css)
console.log('Wrote src/styles/tokens.css')
