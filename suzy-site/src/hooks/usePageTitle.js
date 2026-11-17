import { useEffect } from 'react'

/**
 * Sets the tab title in the brand's pattern (brand book, Brand at a glance):
 * "Page — Maybe Special", and "Maybe Special — Suzy Johnson" for home.
 */
export function usePageTitle(page) {
  useEffect(() => {
    document.title = page ? `${page} — Maybe Special` : 'Maybe Special — Suzy Johnson'
  }, [page])
}
