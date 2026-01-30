import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { client, urlFor } from '../sanityClient'

// Extract YouTube video ID for thumbnail
const getYouTubeThumbnail = (url) => {
  if (!url) return null
  const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)
  return videoId ? `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg` : null
}

function EntriesFeed() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await client.fetch(`
          *[_type == "entry" && defined(publishedAt)] | order(publishedAt desc){
            _id,
            title,
            slug,
            entryType,
            image,
            body,
            videoUrl,
            caption,
            tags,
            publishedAt
          }
        `)
        setEntries(data)
      } catch (error) {
        console.error('Error fetching entries:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEntries()
  }, [])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-warm-black/50">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-normal mb-16">Entries</h1>

      <div className="space-y-20">
        {entries.map((entry) => {
          // IMAGE ENTRY - Image-first, large
          if (entry.entryType === 'image' && entry.image) {
            return (
              <article key={entry._id} className="group">
                <Link to={`/entry/${entry.slug.current}`} className="block">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="aspect-[4/3] lg:aspect-[3/4] overflow-hidden bg-light-lavender">
                      <img
                        src={urlFor(entry.image)}
                        alt={entry.image.alt || entry.title || 'Entry image'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    
                    <div>
                      <p className="text-sm text-warm-black/60 mb-3">
                        {new Date(entry.publishedAt).toLocaleDateString()} · image
                      </p>
                      {entry.title && (
                        <h2 className="text-3xl font-normal mb-4 group-hover:text-lavender transition-colors">
                          {entry.title}
                        </h2>
                      )}
                      {entry.caption && (
                        <p className="text-warm-black/70 leading-relaxed">{entry.caption}</p>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            )
          }

          // VIDEO ENTRY - Thumbnail with play overlay
          if (entry.entryType === 'video') {
            const thumbnail = getYouTubeThumbnail(entry.videoUrl)

            return (
              <article key={entry._id} className="group">
                <Link to={`/entry/${entry.slug.current}`} className="block">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="relative aspect-video overflow-hidden bg-light-lavender">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={entry.title || 'Video thumbnail'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-light-lavender" />
                      )}
                      {/* Lavender overlay with play button */}
                      <div className="absolute inset-0 bg-lavender/20 group-hover:bg-lavender/30 transition-colors flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-lavender flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6 text-warm-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-warm-black/60 mb-3">
                        {new Date(entry.publishedAt).toLocaleDateString()} · video
                      </p>
                      {entry.title && (
                        <h2 className="text-3xl font-normal mb-4 group-hover:text-lavender transition-colors">
                          {entry.title}
                        </h2>
                      )}
                      {entry.caption && (
                        <p className="text-warm-black/70 leading-relaxed">{entry.caption}</p>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            )
          }

          // STATEMENT ENTRY - Text-focused, minimal
          if (entry.entryType === 'statement') {
            return (
              <article key={entry._id} className="group max-w-3xl">
                <Link to={`/entry/${entry.slug.current}`} className="block">
                  <p className="text-sm text-warm-black/60 mb-3">
                    {new Date(entry.publishedAt).toLocaleDateString()} · statement
                  </p>
                  {entry.title && (
                    <h2 className="text-3xl font-normal mb-4 group-hover:text-lavender transition-colors">
                      {entry.title}
                    </h2>
                  )}
                  {entry.body && entry.body[0] && (
                    <div className="text-lg text-warm-black/80 leading-relaxed">
                      <p>
                        {entry.body[0].children?.map(child => child.text).join('').substring(0, 280)}
                        {entry.body[0].children?.map(child => child.text).join('').length > 280 && '...'}
                      </p>
                    </div>
                  )}
                  
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      {entry.tags.map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-light-lavender text-warm-black rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </article>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}

export default EntriesFeed