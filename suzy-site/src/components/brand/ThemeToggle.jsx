import { useSyncExternalStore } from 'react'
import { getActiveTheme, setTheme, subscribeTheme } from '../../theme'

// The prerendered HTML can't know a visitor's theme, so it's built (and first
// hydrated) with no theme; the real one applies right after. The icon never
// waits: CSS shows the moon in light and the sun in dark from first paint.
const getSnapshot = () => (window.__PRERENDER__ ? null : getActiveTheme())
const getServerSnapshot = () => null

/**
 * Theme toggle (brand book, Components › Theme toggle).
 * 44px circle, surface fill, border outline. Moon in light, sun in dark.
 * The label says what it switches to; aria-pressed reflects dark mode.
 * Defaults to the system setting; a click saves the visitor's choice.
 */
function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getSnapshot, getServerSnapshot)
  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={theme ? `Switch to ${next} theme` : 'Switch theme'}
      aria-pressed={theme ? theme === 'dark' : undefined}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-ink transition-colors hover:text-accent"
    >
      <MoonIcon className="dark:hidden" />
      <SunIcon className="hidden dark:block" />
    </button>
  )
}

function MoonIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
    </svg>
  )
}

function SunIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </svg>
  )
}

export default ThemeToggle
