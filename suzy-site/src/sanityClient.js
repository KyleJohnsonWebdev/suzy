// Read-only Sanity queries over the HTTP API (the API CDN, published content).
// The site only ever runs GROQ reads, so a plain fetch replaces @sanity/client
// and keeps about 30 KB of unused JavaScript out of every page load.
const QUERY_URL = 'https://ygagsfm8.apicdn.sanity.io/v2024-01-01/data/query/production'

export const client = {
  async fetch(query, params = {}) {
    const search = new URLSearchParams({ query })
    for (const [name, value] of Object.entries(params)) search.set(`$${name}`, JSON.stringify(value))
    const res = await fetch(`${QUERY_URL}?${search}`)
    const body = await res.json().catch(() => null)
    if (!res.ok) throw new Error(`Sanity query failed (${res.status}): ${body?.error?.description || body?.message || res.statusText}`)
    return body.result
  },
}

// Helper function to build Sanity image URLs
export function urlFor(source) {
  if (!source?.asset?._ref) return ''
  
  const ref = source.asset._ref
  const match = ref.match(/image-([a-f\d]+)-(\d+x\d+)-(\w+)/)
  if (!match) return ''

  const [, id, dimensions, format] = match

  return `https://cdn.sanity.io/images/ygagsfm8/production/${id}-${dimensions}.${format}`
}