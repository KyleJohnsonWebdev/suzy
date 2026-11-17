import { useSanityQuery } from '../data/sanityQuery'
import { SITE_SETTINGS_QUERY } from '../queries'

/** Site-wide settings for shell-level UI (header, footer, SEO defaults). */
export function useSiteSettings() {
  const { data, loading, error } = useSanityQuery(SITE_SETTINGS_QUERY)
  return { settings: data, loading, error }
}
