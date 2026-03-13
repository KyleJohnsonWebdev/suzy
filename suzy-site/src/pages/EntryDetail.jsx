import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { client, urlFor } from '../sanityClient'

function EntryDetail() {
  const { slug } = useParams()
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "entry" && slug.current == $slug][0]{
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
          }`,
          { slug }
        )
        setEntry(data)
      } catch (error) {
        console.error('Error fetching entry:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEntry()
  }, [slug])

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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-warm-black/50">Loading...</p>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20">
        <p className="text-warm-black/70 mb-4">Entry not found</p>
        <Link to="/entries" className="text-lavender hover:text-warm-black underline">
          ← Back to entries
        </Link>
      </div>
    )
  }

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url
  }

  // IMAGE ENTRY LAYOUT - Square crop + lightbox
  if (entry.entryType === 'image') {
    return (
      <div className="min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <Link
            to="/entries"
            className="text-warm-black/60 hover:text-lavender text-sm mb-8 inline-block"
          >
            ← Back to entries
          </Link>

          <header className="mb-8">
            <p className="text-sm text-warm-black/60 mb-2">
              {new Date(entry.publishedAt).toLocaleDateString()}
            </p>
            {entry.title && (
              <h1 className="text-4xl font-normal">{entry.title}</h1>
            )}
          </header>

          {/* Square crop, half-width, clickable to expand */}
          <div className="mb-10">
            <button
              onClick={() => setLightboxOpen(true)}
              className="block w-1/2 group focus:outline-none"
              aria-label="Expand photo"
              style={{ cursor: 'zoom-in' }}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={urlFor(entry.image)}
                  alt={entry.image.alt || entry.title || 'Entry image'}
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

          {entry.caption && (
            <p className="text-xl leading-relaxed mb-8 max-w-2xl">{entry.caption}</p>
          )}

          {entry.tags && entry.tags.length > 0 && (
            <div className="flex gap-2">
              {entry.tags.map((tag, i) => (
                <span key={i} className="text-xs px-3 py-1 bg-light-lavender text-warm-black rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Lightbox */}
        {lightboxOpen && (
          <>
            <div
              className="fixed inset-0 bg-warm-black/80 z-50"
              onClick={() => setLightboxOpen(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-8 pointer-events-none">
              <div className="relative max-w-4xl w-full pointer-events-auto">
                <img
                  src={urlFor(entry.image)}
                  alt={entry.image.alt || entry.title || 'Entry image'}
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

  // VIDEO ENTRY LAYOUT - Video-first, clean presentation
  if (entry.entryType === 'video') {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-5xl mx-auto px-6">
          <Link
            to="/entries"
            className="text-warm-black/60 hover:text-lavender text-sm mb-8 inline-block"
          >
            ← Back to entries
          </Link>

          <header className="mb-8">
            <p className="text-sm text-warm-black/60 mb-2">
              {new Date(entry.publishedAt).toLocaleDateString()}
            </p>
            {entry.title && (
              <h1 className="text-4xl font-normal">{entry.title}</h1>
            )}
          </header>

          <div className="aspect-video mb-8 border-4 border-lavender/20">
            <iframe
              src={getYouTubeEmbedUrl(entry.videoUrl)}
              title={entry.title || 'Video'}
              className="w-full h-full"
              allowFullScreen
            />
          </div>

          {entry.caption && (
            <p className="text-lg text-warm-black/80 mb-8 max-w-3xl">{entry.caption}</p>
          )}

          {entry.tags && entry.tags.length > 0 && (
            <div className="flex gap-2">
              {entry.tags.map((tag, i) => (
                <span key={i} className="text-xs px-3 py-1 bg-light-lavender text-warm-black rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // STATEMENT ENTRY LAYOUT - Editorial, reading-focused
  if (entry.entryType === 'statement') {
    return (
      <div className="min-h-screen py-20">
        <Link
          to="/entries"
          className="text-sm text-warm-black/60 hover:text-lavender mb-12 inline-block max-w-2xl mx-auto px-6"
        >
          ← Back to entries
        </Link>

        <article className="max-w-2xl mx-auto px-6">
          <header className="mb-12">
            <p className="text-sm text-warm-black/60 mb-4">
              {new Date(entry.publishedAt).toLocaleDateString()}
            </p>
            {entry.title && (
              <h1 className="text-5xl font-normal leading-tight mb-4">{entry.title}</h1>
            )}
          </header>

          {entry.body && (
            <div className="prose-custom text-xl leading-relaxed">
              {entry.body.map((block, index) => {
                if (block._type === 'block') {
                  const text = block.children?.map(child => child.text).join('')

                  if (index === 0) {
                    return (
                      <p key={index} className="first-letter:text-7xl first-letter:font-normal first-letter:float-left first-letter:mr-2 first-letter:leading-none first-letter:text-lavender mb-6">
                        {text}
                      </p>
                    )
                  }

                  return (
                    <p key={index} className="mb-6">
                      {text}
                    </p>
                  )
                }
                return null
              })}
            </div>
          )}

          {entry.tags && entry.tags.length > 0 && (
            <div className="flex gap-2 mt-12 pt-12 border-t border-warm-black/10">
              {entry.tags.map((tag, i) => (
                <span key={i} className="text-xs px-3 py-1 bg-light-lavender text-warm-black rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </div>
    )
  }

  return null
}

export default EntryDetail