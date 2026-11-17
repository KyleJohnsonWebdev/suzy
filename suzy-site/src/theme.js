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
    (['light', 'dark'].includes(document.documentElement.dataset.theme) ? document.documentElement.dataset.theme : null) ??
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
  window.dispatchEvent(new Event('themechange'))
}

/** Subscribe to theme changes: a saved choice, or the system setting. */
export function subscribeTheme(callback) {
  const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
  mq?.addEventListener('change', callback)
  window.addEventListener('themechange', callback)
  return () => {
    mq?.removeEventListener('change', callback)
    window.removeEventListener('themechange', callback)
  }
}
