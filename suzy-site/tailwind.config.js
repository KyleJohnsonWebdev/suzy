import fs from 'node:fs'

// Brand tokens are the single source of truth (src/styles/tokens.json).
// Colors point at the CSS variables in tokens.css, so they switch with the theme.
const tokens = JSON.parse(fs.readFileSync(new URL('./src/styles/tokens.json', import.meta.url), 'utf8'))

const colors = Object.fromEntries(
  tokens.color.tokens.map((t) => [t.name, `rgb(var(--color-${t.name}-rgb) / <alpha-value>)`])
)

// Type styles become text-type-<name> (e.g. text-type-lead), each with its size,
// line height, tracking and weight. Prefixed so `body` doesn't clash with the body color.
// Fluid sizes: display-hero per the brand book, display-page per the
// Refresh mockups (Redesign Directions).
const fluid = {
  'display-hero': 'clamp(52px, 6.4vw, 92px)',
  'display-page': 'clamp(48px, 5.6vw, 80px)',
}
const fontSize = Object.fromEntries(
  tokens.type.groups.flatMap((g) =>
    g.styles.map((s) => [
      `type-${s.name}`,
      [
        fluid[s.name] ?? s.fontSize,
        {
          lineHeight: String(s.lineHeight),
          fontWeight: String(s.fontWeight),
          ...(s.letterSpacing && { letterSpacing: s.letterSpacing }),
        },
      ],
    ])
  )
)

/** @type {import('tailwindcss').Config} */
export default {
  // dark: matches a saved dark choice, or the system setting when nothing is saved.
  darkMode: [
    'variant',
    [
      '@media (prefers-color-scheme: dark) { &:not([data-theme=light] *) }',
      '&:is([data-theme=dark] *)',
    ],
  ],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors,
      fontSize,
      // Brand spacing and radius scales: p-space-9, gap-space-6, rounded-sm (6px)…
      spacing: Object.fromEntries(tokens.spacing.tokens.map((t) => [t.name, `var(--${t.name})`])),
      borderRadius: { sm: 'var(--radius-sm)' },
      maxWidth: { page: '1280px', lead: '620px', reading: '680px' },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      ringOffsetColor: {
        DEFAULT: 'rgb(var(--color-bg-rgb))',
      },

      // Animation utilities — wire up all new keyframes defined in index.css
      animation: {
        // Page route transition — used on <main> in App.jsx
        'pageFade': 'pageFade 0.25s ease-out both',

        // Entry feed staggered reveal — used in EntriesFeed.jsx
        // animationDelay is applied inline per-item
        'fadeIn': 'fadeIn 0.4s ease-out both',

        // Loading dots — used in LoadingScreen.jsx
        'loadingPulse': 'loadingPulse 1.2s ease-in-out infinite',
      },

      keyframes: {
        pageFade: {
          'from': { opacity: '0', transform: 'translateY(6px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        loadingPulse: {
          '0%, 80%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '40%': { opacity: '1', transform: 'scale(1)' },
        },
      },

    },
  },
  plugins: [],
}
