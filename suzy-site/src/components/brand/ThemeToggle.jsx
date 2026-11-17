import { useEffect, useState } from 'react'
import { getActiveTheme, getSavedTheme, setTheme } from '../../theme'

/**
 * Theme toggle (brand book, Components › Theme toggle).
 * 44px circle, surface fill, border outline. Moon in light, sun in dark.
 * The label says what it switches to; aria-pressed reflects dark mode.
 * Defaults to the system setting; a click saves the visitor's choice.
 */
function ThemeToggle() {
  const [theme, setThemeState] = useState(getActiveTheme)

  // With no saved choice, follow live changes to the system setting.
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mq) return
    const onChange = () => {
      if (!getSavedTheme()) setThemeState(mq.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={() => {
        setTheme(next)
        setThemeState(next)
      }}
      aria-label={`Switch to ${next} theme`}
      aria-pressed={theme === 'dark'}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-ink transition-colors hover:text-accent"
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </svg>
  )
}

export default ThemeToggle
