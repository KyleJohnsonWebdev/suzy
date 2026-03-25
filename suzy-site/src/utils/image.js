// Image URL utility — wraps the project's existing urlFor which returns
// a plain CDN string (not a builder object with .width()/.quality()/.url()).
//
// Appends Sanity's image transformation query params directly to the URL
// so we get resizing and quality control without needing @sanity/image-url.

import { urlFor } from '../sanityClient'

/**
 * Returns a Sanity CDN image URL with optional width and quality params.
 *
 * @param {object} source       - Sanity image object with asset._ref
 * @param {object} opts
 * @param {number} [opts.width]   - pixel width
 * @param {number} [opts.quality] - quality 0–100 (default 80)
 * @returns {string}
 */
export function urlForImage(source, { width, quality = 80 } = {}) {
  if (!source) return ''

  const base = urlFor(source)
  if (!base) return ''

  // urlFor returns a plain string — append Sanity CDN transform params
  const params = new URLSearchParams()
  if (width) params.set('w', String(width))
  params.set('q', String(quality))
  params.set('fit', 'max')
  params.set('auto', 'format')

  return `${base}?${params.toString()}`
}
