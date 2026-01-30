import {createClient} from '@sanity/client'

export const client = createClient({
  projectId: 'ygagsfm8',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})

// Helper function to build Sanity image URLs
export function urlFor(source) {
  if (!source?.asset?._ref) return ''
  
  const ref = source.asset._ref
  const [, id, dimensions, format] = ref.match(/image-([a-f\d]+)-(\d+x\d+)-(\w+)/)
  
  return `https://cdn.sanity.io/images/ygagsfm8/production/${id}-${dimensions}.${format}`
}