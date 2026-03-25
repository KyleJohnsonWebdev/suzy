import { useState, useEffect } from 'react'
import { client } from '../sanityClient'
import {
  HOME_PAGE_QUERY,
  FEATURED_ENTRIES_QUERY,
  INSTAGRAM_SETTINGS_QUERY,
} from '../queries'

/**
 * Fetches all homepage data in parallel using Promise.all.
 * Fixes the sequential fetch bug in Home.jsx that awaited
 * three round-trips one after another.
 */
export function useHomeData() {
  const [page, setPage] = useState(null)
  const [featuredEntries, setFeaturedEntries] = useState([])
  const [instagramUrl, setInstagramUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      client.fetch(HOME_PAGE_QUERY),
      client.fetch(FEATURED_ENTRIES_QUERY),
      client.fetch(INSTAGRAM_SETTINGS_QUERY),
    ])
      .then(([pageData, entriesData, settingsData]) => {
        setPage(pageData || null)
        setFeaturedEntries(entriesData || [])
        setInstagramUrl(settingsData?.instagramUrl || null)
      })
      .catch((err) => {
        console.error('useHomeData error:', err)
        setError(err)
      })
      .finally(() => setLoading(false))
  }, [])

  return { page, featuredEntries, instagramUrl, loading, error }
}
