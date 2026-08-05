import { Link } from 'react-router-dom'
import { useAboutData } from '../hooks/useAboutData'
import { urlForImage } from '../utils/image'
import { PortableText } from '../components/shared/PortableText'
import LoadingScreen from '../components/shared/LoadingScreen'
import ErrorScreen from '../components/shared/ErrorScreen'

function About() {
  const { page, siteSettings, loading, error } = useAboutData()

  if (loading) return <LoadingScreen />

  if (error) {
    return (
      <ErrorScreen
        message="We couldn't load the page. Please try again."
        backTo="/"
        backLabel="Back home"
      />
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12 py-20">

      {/* Name as hero — echoes homepage scale */}
      <div className="mb-20 max-w-4xl">
        <h1 className="text-6xl md:text-7xl font-normal leading-[0.95]">
          {siteSettings?.siteTitle}
        </h1>
      </div>

      {page?.heroImage && (
        <div className="mb-20">
          <img
            src={urlForImage(page.heroImage, { width: 640 })}
            alt={page.heroImage.alt || page.title || 'About'}
            className="w-72 h-72 md:w-96 md:h-96 rounded-full object-cover"
          />
        </div>
      )}

      {/* Bio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl">
        <div className="space-y-6 text-xl leading-relaxed text-warm-black/80">
          {page?.body && <PortableText value={page.body} />}
        </div>

        {/* Contact column */}
        <div className="space-y-4 text-warm-black/60">
          {siteSettings?.instagramUrl && (
            <div>
              <p className="text-sm mb-1">Instagram</p>
              <a
                href={siteSettings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lavender hover:text-warm-black transition-colors"
              >
                {siteSettings.instagramHandle
                  ? `@${siteSettings.instagramHandle}`
                  : 'Instagram'}
              </a>
            </div>
          )}
          <div>
            <p className="text-sm mb-1">Get in touch</p>
            <Link
              to="/contact"
              className="text-lavender hover:text-warm-black transition-colors"
            >
              Contact →
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}

export default About
