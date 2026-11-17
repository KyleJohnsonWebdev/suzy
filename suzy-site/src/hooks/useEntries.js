import { useSanityQuery } from '../data/sanityQuery'
import { ENTRIES_QUERY } from '../queries'

/** All published entries, newest first. */
export function useEntries() {
  const { data, loading, error } = useSanityQuery(ENTRIES_QUERY)
  return { entries: data || [], loading, error }
}
