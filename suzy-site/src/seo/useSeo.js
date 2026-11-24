import { createContext, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { urlForImage } from '../utils/image'
import { extractPlainText, truncateAtWord } from '../utils/text'

export const SITE_URL = 'https://maybespecial.com'
const SITE_NAME = 'maybespecial'
const DESCRIPTION_LIMIT = 154 // + "…" stays within the ~155–160 characters search results show

/** Site-wide fallbacks (description and share image), provided by AppShell from Site Settings. */
export const SeoDefaults = createContext({ description: '', image: null })

/** Plain-text description from Portable Text or a string, trimmed at a word. */
export function describe(...parts) {
  const text = parts
    .map((p) => (Array.isArray(p) ? extractPlainText(p) : p))
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
  return truncateAtWord(text, DESCRIPTION_LIMIT) || ''
}

/**
 * Sets the page's <head> tags: title ("Page — maybespecial"; home is
 * "maybespecial — Suzy Johnson"), meta description, canonical URL, Open Graph
 * and Twitter card tags. Existing tags are updated in place, so the tags in
 * prerendered HTML are reused, never duplicated.
 */
export function useSeo({ title, description, image, type = 'website', noindex = false } = {}) {
  const { pathname } = useLocation()
  const defaults = useContext(SeoDefaults)

  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Suzy Johnson`
  const desc = description || defaults.description || ''
  const shareImage = image || defaults.image
  const imageUrl = shareImage ? urlForImage(shareImage, { width: 1200 }) : ''
  const url = SITE_URL + (pathname === '/' ? '/' : pathname.replace(/\/$/, ''))

  useEffect(() => {
    document.title = fullTitle
    setMeta('name', 'description', desc)
    setLink('canonical', noindex ? '' : url)
    setMeta('name', 'robots', noindex ? 'noindex' : '')
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', imageUrl)
    setMeta('property', 'og:image:alt', imageUrl ? shareImage?.alt || '' : '')
    setMeta('name', 'twitter:card', imageUrl ? 'summary' : '')
  }, [fullTitle, desc, url, imageUrl, type, noindex, shareImage])
}

// Create, update or (with an empty value) remove one tag.
function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!value) return el?.remove()
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!href) return el?.remove()
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}
