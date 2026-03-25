import { useState, useEffect } from 'react'
import { client } from '../sanityClient'
import { CONTACT_SETTINGS_QUERY } from '../queries'

/**
 * Fetches contact page settings from Sanity.
 * Replaces the inline useEffect in Contact.jsx.
 */
export function useContactSettings() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    client
      .fetch(CONTACT_SETTINGS_QUERY)
      .then((data) => setSettings(data || null))
      .catch((err) => {
        console.error('useContactSettings error:', err)
        setError(err)
      })
      .finally(() => setLoading(false))
  }, [])

  return { settings, loading, error }
}
