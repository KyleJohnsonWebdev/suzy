import { useState, useEffect } from 'react'
import { client } from '../sanityClient'
import {
  HOME_PAGE_QUERY,
  FEATURED_ENTRIES_QUERY,
  PROJECTS_QUERY,
} from '../queries'

/**
 * Fetches all homepage data in parallel using Promise.all.
 * Fixes the sequential fetch bug in Home.jsx that awaited
 * three round-trips one after another.
 */
export function useHomeData() {
  const [page, setPage] = useState(null)
  const [featuredEntries, setFeaturedEntries] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      client.fetch(HOME_PAGE_QUERY),
      client.fetch(FEATURED_ENTRIES_QUERY),
      client.fetch(PROJECTS_QUERY),
    ])
      .then(([pageData, entriesData, projectsData]) => {
        setPage(pageData || null)
        setFeaturedEntries(entriesData || [])
        setProjects(projectsData || [])
      })
      .catch((err) => {
        console.error('useHomeData error:', err)
        setError(err)
      })
      .finally(() => setLoading(false))
  }, [])

  return { page, featuredEntries, projects, loading, error }
}
