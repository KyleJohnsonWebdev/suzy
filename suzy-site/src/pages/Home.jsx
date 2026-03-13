import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { client, urlFor } from '../sanityClient'
import InstagramFlower from '../components/InstagramFlower'

// Extract YouTube video ID for thumbnail
const getYouTubeThumbnail = (url) => {
  if (!url) return null
  const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)
  return videoId ? `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg` : null
}

function Home() {
  const [page, setPage] = useState(null)
  const [featuredEntries, setFeaturedEntries] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageData = await client.fetch(`
          *[_type == "page" && slug.current == "home"][0]{
            title,
            heroText,
            heroImage,
            body,
            showFeaturedEntries,
            featuredEntriesHeading
          }
        `)
        setPage(pageData)

        const entries = await client.fetch(`
          *[_type == "entry" && featured == true && defined(publishedAt)] | order(publishedAt desc){
            _id,
            title,
            slug,
            entryType,
            image,
            body,
            videoUrl,
            publishedAt
          }
        `)
        setFeaturedEntries(entries)

        const siteSettings = await client.fetch(`
          *[_type == "siteSettings"][0]{
            instagramUrl
          }
        `)
        setSettings(siteSettings)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Close lightbox on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-warm-black/50">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 relative">
      <InstagramFlower instagramUrl={settings?.instagramUrl} />

      {page?.heroText && (
        <div className="min-h-[60vh] flex items-center mb-20 relative z-10">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-normal leading-[0.95] max-w-5xl">
            {page.heroText}
          </h1>
        </div>
      )}

      {/* Hero Image — square crop, half-width, clickable to expand */}
      {page?.heroImage && (
        <div className="mb-20 relative z-10">
          <button
            onClick={() => setLightboxOpen(true)}
            className="block w-1/2 group focus:outline-none"
            aria-label="Expand photo"
            style={{ cursor: 'zoom-in' }}
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={urlFor(page.heroImage)}
                alt={page.heroImage.alt || ''}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            {/* Subtle expand hint on hover */}
            <div className="mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
              <span className="text-xs tracking-wide">expand</span>
            </div>
          </button>
        </div>
      )}

      {page?.body && (
        <div className="prose-custom max-w-2xl mb-32">
          {page.body.map((block, index) => {
            if (block._type === 'block') {
              return (
                <p key={index} className="text-xl leading-relaxed mb-6">
                  {block.children?.map(child => child.text).join('')}
                </p>
              )
            }
            return null
          })}
        </div>
      )}

      {page?.showFeaturedEntries && featuredEntries.length > 0 && (
        <div className="mt-32 relative z-10">
          <h2 className="text-3xl font-normal mb-12">
            {page.featuredEntriesHeading || 'Featured'}
          </h2>
          
          <div className="grid grid-cols-12 gap-6 lg:gap-8">
            {featuredEntries.map((entry, index) => {
              const isLarge = index % 3 === 0
              const colSpan = isLarge ? 'col-span-12 lg:col-span-8' : 'col-span-12 lg:col-span-4'
              
              return (
                <Link
                  key={entry._id}
                  to={`/entry/${entry.slug.current}`}
                  className={`group ${colSpan}`}
                >
                  {entry.entryType === 'image' && entry.image && (
                    <div className={`${isLarge ? 'aspect-[16/9]' : 'aspect-[3/4]'} bg-light-lavender mb-3 overflow-hidden`}>
                      <img
                        src={urlFor(entry.image)}
                        alt={entry.image.alt || entry.title || 'Entry image'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  
                  {entry.entryType === 'statement' && (
                    <div className={`${isLarge ? 'aspect-[16/9]' : 'aspect-[3/4]'} bg-light-lavender p-6 lg:p-8 flex items-center justify-center mb-3 group-hover:bg-lavender transition-colors`}>
                      <p className="text-center text-lg lg:text-xl leading-relaxed">
                        {entry.body && entry.body[0] && 
                          entry.body[0].children?.map(child => child.text).join('').substring(0, 120) + '...'}
                      </p>
                    </div>
                  )}
                  
                  {entry.entryType === 'video' && (
                    <div className={`${isLarge ? 'aspect-[16/9]' : 'aspect-[3/4]'} bg-light-lavender mb-3 relative overflow-hidden`}>
                      {entry.videoUrl && getYouTubeThumbnail(entry.videoUrl) && (
                        <img
                          src={getYouTubeThumbnail(entry.videoUrl)}
                          alt={entry.title || 'Video thumbnail'}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-lavender/30 group-hover:bg-lavender/40 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-warm-black flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-5 h-5 text-neutral-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="px-2">
                    {entry.title && (
                      <h3 className={`${isLarge ? 'text-2xl' : 'text-lg'} font-normal group-hover:text-lavender transition-colors mb-1`}>
                        {entry.title}
                      </h3>
                    )}
                    <p className="text-sm text-warm-black/60">
                      {new Date(entry.publishedAt).toLocaleDateString()} · {entry.entryType}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && page?.heroImage && (
        <>
          <div
            className="fixed inset-0 bg-warm-black/80 z-50 transition-opacity"
            onClick={() => setLightboxOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-8 pointer-events-none">
            <div className="relative max-w-4xl w-full pointer-events-auto">
              <img
                src={urlFor(page.heroImage)}
                alt={page.heroImage.alt || ''}
                className="w-full h-auto max-h-[85vh] object-contain"
              />
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 text-neutral-white/80 hover:text-neutral-white text-4xl leading-none focus:outline-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Home