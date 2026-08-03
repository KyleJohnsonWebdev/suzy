import { useState, useEffect } from 'react'
import { client } from '../sanityClient'
import { SITE_SETTINGS_QUERY } from '../queries'

/**
 * Fetches site-wide settings from Sanity.
 * Used by shell-level UI (e.g. the footer) that isn't tied to a single page.
 */
export function useSiteSettings() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    client
      .fetch(SITE_SETTINGS_QUERY)
      .then((data) => setSettings(data || null))
      .catch((err) => {
        console.error('useSiteSettings error:', err)
        setError(err)
      })
      .finally(() => setLoading(false))
  }, [])

  return { settings, loading, error }
}
