import { useSanityQuery } from '../data/sanityQuery'
import { BLOG_PAGE_QUERY } from '../queries'

/** The blog page: all published entries (newest first) and its heading and intro. */
export function useBlogPage() {
  const { data, loading, error } = useSanityQuery(BLOG_PAGE_QUERY)
  return { entries: data?.entries || [], settings: data?.settings, loading, error }
}
