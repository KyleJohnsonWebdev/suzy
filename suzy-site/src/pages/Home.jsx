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

        // Fetch site settings for Instagram
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-warm-black/50">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 relative">
      {/* Instagram Flower - floats behind content */}
      <InstagramFlower instagramUrl={settings?.instagramUrl} />

      {page?.heroText && (
        <div className="min-h-[60vh] flex items-center mb-20 relative z-10">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-normal leading-[0.95] max-w-5xl">
            {page.heroText}
          </h1>
        </div>
      )}

      {/* Hero Image - between hero text and body */}
      {page?.heroImage && (
        <div className="mb-20 relative z-10">
          <img
            src={urlFor(page.heroImage)}
            alt={page.heroImage.alt || ''}
            className="w-full object-cover"
          />
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
          
          {/* Broken grid layout - asymmetric sizes */}
          <div className="grid grid-cols-12 gap-6 lg:gap-8">
            {featuredEntries.map((entry, index) => {
              // Alternate between large and small cards
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
                      {/* Lavender tinted overlay with play button */}
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
    </div>
  )
}

export default Home