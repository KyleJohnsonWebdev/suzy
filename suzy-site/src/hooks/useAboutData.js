import { useState, useEffect } from 'react'
import { client } from '../sanityClient'
import { ABOUT_PAGE_QUERY, SITE_SETTINGS_QUERY } from '../queries'

/**
 * Fetches the About page document and site settings in parallel,
 * following the same pattern as useHomeData.
 */
export function useAboutData() {
  const [page, setPage] = useState(null)
  const [siteSettings, setSiteSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      client.fetch(ABOUT_PAGE_QUERY),
      client.fetch(SITE_SETTINGS_QUERY),
    ])
      .then(([pageData, settingsData]) => {
        setPage(pageData || null)
        setSiteSettings(settingsData || null)
      })
      .catch((err) => {
        console.error('useAboutData error:', err)
        setError(err)
      })
      .finally(() => setLoading(false))
  }, [])

  return { page, siteSettings, loading, error }
}
