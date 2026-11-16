// Theme preference. The visitor's choice is saved in localStorage under "theme".
// With no saved choice, the site follows the system setting (handled in CSS).
// The inline script in index.html applies a saved choice before first paint.

const KEY = 'theme'

export function getSavedTheme() {
  try {
    const t = localStorage.getItem(KEY)
    return t === 'light' || t === 'dark' ? t : null
  } catch {
    return null
  }
}

/** The theme currently showing: the saved choice, else the system setting. */
export function getActiveTheme() {
  return (
    getSavedTheme() ??
    (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  )
}

/** Apply and save a choice ('light' or 'dark'). */
export function setTheme(theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    // Storage blocked (private mode): the choice still applies for this visit.
  }
}
