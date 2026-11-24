import { useAboutData } from '../hooks/useAboutData'
import { useSeo, describe } from '../seo/useSeo'
import { urlForImage } from '../utils/image'
import { PortableText } from '../components/shared/PortableText'
import LoadingScreen from '../components/shared/LoadingScreen'
import ErrorScreen from '../components/shared/ErrorScreen'
import ToothDoodles from '../components/brand/ToothDoodles'
import { SidebarFacts } from '../components/brand/Facts'
import LetsConnect from '../components/brand/LetsConnect'

// Two teeth in the band right of the opener's text on wide screens. None
// below that: phones show the tooth beside the wordmark instead.
const OPENER_DOODLES = [
  { className: 'hidden xl:block right-[3%] top-[16%] h-[96px]', duration: 21 },
  { className: 'hidden xl:block right-[11%] bottom-[16%] h-[72px]', duration: 24, delay: 4 },
]

function About() {
  const { page, loading, error } = useAboutData()
  useSeo({ title: 'About', description: page?.metaDescription || describe(page?.body), image: page?.heroImage })

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
        {/* Portrait beside the opener text (Redesign Directions › Refresh — About);
            they stack on narrow screens. */}
        <div className="container-page relative flex flex-wrap items-center gap-space-10">
          {page?.heroImage && (
            <img
              src={urlForImage(page.heroImage, { width: 640 })}
              srcSet={[320, 480, 640].map((w) => `${urlForImage(page.heroImage, { width: w })} ${w}w`).join(', ')}
              sizes="(min-width: 768px) 300px, 256px"
              alt={page.heroImage.alt || ''}
              fetchPriority="high"
              className="h-64 w-64 flex-none rounded-full object-cover md:h-[300px] md:w-[300px] dark:ring-1 dark:ring-border"
            />
          )}
          <div className="min-w-0 max-w-[640px] flex-1 basis-[480px]">
            <p className="text-type-ui font-normal text-muted">About</p>
            <h1 className="mt-space-4 text-type-display-page text-ink">{opener}</h1>
            {page?.intro && <p className="mt-space-5 max-w-lead text-type-lead text-body">{page.intro}</p>}
          </div>
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
