import { useSanityQuery } from '../data/sanityQuery'
import { ENTRY_BY_SLUG_QUERY } from '../queries'

/** One entry by slug. */
export function useEntry(slug) {
  const { data, loading, error } = useSanityQuery(ENTRY_BY_SLUG_QUERY, { slug }, { enabled: Boolean(slug) })
  return { entry: data, loading, error }
}
