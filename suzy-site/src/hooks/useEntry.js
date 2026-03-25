import { useState, useEffect } from 'react'
import { client } from '../sanityClient'
import { ENTRY_BY_SLUG_QUERY } from '../queries'

/**
 * Fetches a single entry by slug.
 * Replaces the inline useEffect in EntryDetail.jsx.
 */
export function useEntry(slug) {
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return

    setLoading(true)
    setError(null)

    client
      .fetch(ENTRY_BY_SLUG_QUERY, { slug })
      .then((data) => setEntry(data || null))
      .catch((err) => {
        console.error('useEntry error:', err)
        setError(err)
      })
      .finally(() => setLoading(false))
  }, [slug])

  return { entry, loading, error }
}
