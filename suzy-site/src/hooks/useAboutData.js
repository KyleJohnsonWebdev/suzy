import { useSanityQuery } from '../data/sanityQuery'
import { ABOUT_PAGE_QUERY } from '../queries'

/** The About page document. */
export function useAboutData() {
  const { data, loading, error } = useSanityQuery(ABOUT_PAGE_QUERY)
  return { page: data, loading, error }
}
