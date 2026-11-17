import { useEffect, useState } from 'react'
import { client } from '../sanityClient'

/**
 * Sanity data with a prerender cache.
 *
 * Every query result is kept in window.__SANITY_DATA__, keyed by query and
 * params. The build's prerender step (scripts/prerender.mjs) saves that object
 * into each page's HTML, so on a visitor's first render the hooks already have
 * the data the HTML was built from: React hydrates the prerendered markup
 * without a loading flash. Each hook still refetches in the background, so
 * visitors always end up with live content.
 */
const cache =
  typeof window !== 'undefined' ? (window.__SANITY_DATA__ ||= {}) : {}

const keyFor = (query, params) => `${query}|${JSON.stringify(params ?? {})}`

export function useSanityQuery(query, params, { enabled = true } = {}) {
  const key = keyFor(query, params)
  const hasCached = Object.prototype.hasOwnProperty.call(cache, key)
  const [state, setState] = useState(() => ({
    key,
    data: hasCached ? cache[key] : null,
    loading: !hasCached,
    error: null,
  }))

  // A new key (e.g. a different entry slug) starts from its own cache entry.
  if (state.key !== key) {
    setState({ key, data: hasCached ? cache[key] : null, loading: !hasCached, error: null })
  }

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    client
      .fetch(query, params ?? {})
      .then((data) => {
        const value = data ?? null
        cache[key] = value
        if (cancelled) return
        setState((prev) =>
          prev.key === key && !prev.loading && JSON.stringify(prev.data) === JSON.stringify(value)
            ? prev
            : { key, data: value, loading: false, error: null }
        )
      })
      .catch((error) => {
        console.error('Sanity query failed:', error)
        if (!cancelled) setState((prev) => (prev.key === key ? { ...prev, loading: false, error } : prev))
      })
    return () => {
      cancelled = true
    }
    // key captures query and params
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled])

  return { data: state.data, loading: state.loading, error: state.error }
}
