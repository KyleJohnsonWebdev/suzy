import { useSanityQuery } from '../data/sanityQuery'
import { CONTACT_SETTINGS_QUERY } from '../queries'

/** Settings for the Let's Connect band. */
export function useContactSettings() {
  const { data, loading, error } = useSanityQuery(CONTACT_SETTINGS_QUERY)
  return { settings: data, loading, error }
}
