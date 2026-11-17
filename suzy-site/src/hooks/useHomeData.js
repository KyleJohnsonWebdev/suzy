import { useSanityQuery } from '../data/sanityQuery'
import { HOME_PAGE_QUERY, FEATURED_ENTRIES_QUERY, PROJECTS_QUERY } from '../queries'

/** Home page, featured entries and projects (fetched in parallel). */
export function useHomeData() {
  const page = useSanityQuery(HOME_PAGE_QUERY)
  const featured = useSanityQuery(FEATURED_ENTRIES_QUERY)
  const projects = useSanityQuery(PROJECTS_QUERY)
  return {
    page: page.data,
    featuredEntries: featured.data || [],
    projects: projects.data || [],
    loading: page.loading || featured.loading || projects.loading,
    error: page.error || featured.error || projects.error,
  }
}
