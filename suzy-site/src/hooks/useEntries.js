import { useState, useEffect } from 'react'
import { client } from '../sanityClient'
import { ENTRIES_QUERY } from '../queries'

/**
 * Fetches all published entries ordered newest first.
 * Replaces the inline useEffect in EntriesFeed.jsx.
 */
export function useEntries() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    client
      .fetch(ENTRIES_QUERY)
      .then((data) => setEntries(data || []))
      .catch((err) => {
        console.error('useEntries error:', err)
        setError(err)
      })
      .finally(() => setLoading(false))
  }, [])

  return { entries, loading, error }
}
