import { Link } from 'react-router-dom'
import { useHomeData } from '../hooks/useHomeData'
import { urlForImage } from '../utils/image'
import { getYouTubeThumbnail } from '../utils/youtube'
import { extractPlainText, truncateAtWord } from '../utils/text'
import { ENTRY_TYPES } from '../constants/entryTypes'
import InstagramFlower from '../components/InstagramFlower'
import LoadingScreen from '../components/shared/LoadingScreen'
 import { PortableText } from '../components/shared/PortableText'
import ErrorScreen from '../components/shared/ErrorScreen'

function Home() {
  const { page, featuredEntries, instagramUrl, loading, error } = useHomeData()

  if (loading) return <LoadingScreen />

  if (error) {
    return (
      <ErrorScreen
        message="We couldn't load the page. Please try again."
        backTo="/"
        backLabel="Refresh"
      />
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12 py-12 relative">

      <InstagramFlower instagramUrl={instagramUrl} />

      {page?.heroText && (
        <div className="min-h-[60vh] flex flex-col justify-center mb-20 relative z-10">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-normal leading-[0.95] max-w-5xl text-balance">
            {page.heroText}
          </h1>
          <div className="mt-10">
            <Link
              to="/entries"
              className="text-sm text-warm-black/50 hover:text-lavender transition-colors focus:outline-none focus:ring-2 focus:ring-lavender focus:ring-offset-2"
            >
              View entries ↓
            </Link>
          </div>
        </div>
      )}

      {page?.body && page.body.length > 0 && (
        <div className="max-w-2xl mb-16">
          <PortableText value={page.body} />
        </div>
      )}

      {page?.showFeaturedEntries && featuredEntries.length > 0 && (
        <div className="mt-20 relative z-10">
          <h2 className="text-3xl font-normal mb-12">
            {page.featuredEntriesHeading || 'Featured'}
          </h2>

          <div className="grid grid-cols-12 gap-6 lg:gap-8">
            {featuredEntries.map((entry, index) => {
              const isLarge = index % 3 === 0
              const colSpan = isLarge
                ? 'col-span-12 lg:col-span-8'
                : 'col-span-12 lg:col-span-4'

              return (
                <Link
                  key={entry._id}
                  to={`/entry/${entry.slug.current}`}
                  className={`group ${colSpan}`}
                >
                  {entry.entryType === ENTRY_TYPES.IMAGE && entry.image && (
                    <div className={`${isLarge ? 'aspect-[16/9]' : 'aspect-[3/4]'} bg-light-lavender mb-3 overflow-hidden`}>
                      <img
                        src={urlForImage(entry.image, { width: isLarge ? 1200 : 600 })}
                        alt={entry.image?.alt || entry.title || 'Entry image'}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {entry.entryType === ENTRY_TYPES.STATEMENT && (
                    <div className={`${isLarge ? 'aspect-[16/9]' : 'aspect-[3/4]'} bg-light-lavender p-6 lg:p-8 flex items-center justify-center mb-3 group-hover:bg-lavender transition-colors`}>
                      <p className="text-center text-lg lg:text-xl leading-relaxed">
                        {truncateAtWord(extractPlainText(entry.body), 120)}
                      </p>
                    </div>
                  )}

                  {entry.entryType === ENTRY_TYPES.VIDEO && (
                    <div className={`${isLarge ? 'aspect-[16/9]' : 'aspect-[3/4]'} bg-light-lavender mb-3 relative overflow-hidden`}>
                      {getYouTubeThumbnail(entry.videoUrl) && (
                        <img
                          src={getYouTubeThumbnail(entry.videoUrl)}
                          alt={entry.title || 'Video thumbnail'}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-lavender/30 group-hover:bg-lavender/40 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-warm-black flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-5 h-5 text-neutral-white ml-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    {entry.title && (
                      <h3 className={`${isLarge ? 'text-2xl' : 'text-lg'} font-normal group-hover:text-lavender transition-colors mb-1`}>
                        {entry.title}
                      </h3>
                    )}
                    <p className="text-sm text-warm-black/70">
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
