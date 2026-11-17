import { useAboutData } from '../hooks/useAboutData'
import { usePageTitle } from '../hooks/usePageTitle'
import { urlForImage } from '../utils/image'
import { PortableText } from '../components/shared/PortableText'
import LoadingScreen from '../components/shared/LoadingScreen'
import ErrorScreen from '../components/shared/ErrorScreen'
import ToothDoodles from '../components/brand/ToothDoodles'
import { SidebarFacts } from '../components/brand/Facts'
import LetsConnect from '../components/brand/LetsConnect'

// Two teeth beside the portrait (below the heading, which can run wide) on wide
// screens; one in the top padding on phones.
const OPENER_DOODLES = [
  { className: 'hidden lg:block right-[6%] top-[52%] h-[96px]', duration: 21 },
  { className: 'hidden lg:block right-[22%] bottom-[12%] h-[72px]', duration: 24, delay: 4 },
  { className: 'lg:hidden right-space-9 top-space-3 h-[72px]', still: true },
]

function About() {
  const { page, loading, error } = useAboutData()
  usePageTitle('About')

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

  // The opener line comes from the About page's Hero Text in Sanity
  // (the brand's example is "Hi, I'm Suzy."); until it's set, the page title.
  const opener = page?.heroText || page?.title || 'About'

  return (
    <>
      <section className="relative pb-space-11 pt-space-12">
        <ToothDoodles placements={OPENER_DOODLES} />
        <div className="container-page relative">
          <h1 className="max-w-[12em] text-type-display-page text-ink">{opener}</h1>
          {page?.heroImage && (
            <img
              src={urlForImage(page.heroImage, { width: 640 })}
              alt={page.heroImage.alt || ''}
              className="mt-space-10 h-64 w-64 rounded-full object-cover md:h-80 md:w-80 dark:ring-1 dark:ring-border"
            />
          )}
        </div>
      </section>

      <section aria-label="Bio" className="border-t border-border py-space-11">
        <div className="container-page grid gap-space-10 lg:grid-cols-[minmax(0,680px)_minmax(0,1fr)]">
          <div className="max-w-reading">
            {page?.body && <PortableText value={page.body} paragraphClassName="mb-space-6 text-type-body text-body" />}
          </div>
          <SidebarFacts facts={page?.facts} />
        </div>
      </section>

      <LetsConnect />
    </>
  )
}

export default About
