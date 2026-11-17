import { Link } from 'react-router-dom'
import { ButtonLink } from '../components/brand/Button'
import { useHomeData } from '../hooks/useHomeData'
import { useSeo, describe } from '../seo/useSeo'
import { PortableText } from '../components/shared/PortableText'
import LoadingScreen from '../components/shared/LoadingScreen'
import ErrorScreen from '../components/shared/ErrorScreen'
import ToothDoodles from '../components/brand/ToothDoodles'
import { FactsStrip } from '../components/brand/Facts'
import SelectedWork from '../components/brand/SelectedWork'
import EntryCard from '../components/entries/EntryCard'
import LetsConnect from '../components/brand/LetsConnect'

// Three teeth in the band right of the headline on wide screens; one in the
// top padding on phones, where there's no free band beside the text.
const HERO_DOODLES = [
  { className: 'hidden lg:block right-[2%] top-[14%] h-[112px]', duration: 22 },
  { className: 'hidden lg:block right-[12%] top-[46%] h-[72px]', duration: 18, delay: 3 },
  { className: 'hidden lg:block right-[3%] bottom-[10%] h-[88px]', duration: 25, delay: 6 },
  { className: 'lg:hidden right-space-9 top-space-3 h-[72px]', still: true },
]

function Home() {
  const { page, featuredEntries, projects, loading, error } = useHomeData()
  useSeo({ description: page?.metaDescription || describe(page?.heroText, page?.body) })

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
    <>
      <section className="relative pb-space-11 pt-space-12">
        <ToothDoodles placements={HERO_DOODLES} />
        <div className="container-page relative">
          {page?.heroText && (
            <h1 className="max-w-[11em] text-balance text-type-display-hero text-ink">{page.heroText}</h1>
          )}
          {page?.body?.length > 0 && (
            <div className="mt-space-8 max-w-lead">
              <PortableText value={page.body} paragraphClassName="mb-space-4 text-type-lead text-body" />
            </div>
          )}
          {/* Two actions under the intro (Redesign Directions › Refresh). Until
              there's work to show, the primary one points to her entries. */}
          <div className="mt-space-9 flex flex-wrap gap-space-3">
            {projects.length > 0 ? (
              <ButtonLink to={{ pathname: '/', hash: '#work' }}>See my work</ButtonLink>
            ) : (
              <ButtonLink to="/entries">Read entries</ButtonLink>
            )}
            <ButtonLink to="/about" variant="secondary">
              More about me
            </ButtonLink>
          </div>
        </div>
      </section>

      <FactsStrip facts={page?.facts} />

      <SelectedWork projects={projects} />

      {page?.showFeaturedEntries && featuredEntries.length > 0 && (
        <section aria-labelledby="recent-heading" className="border-t border-border py-space-11">
          <div className="container-page">
            <div className="mb-space-8 flex flex-wrap items-baseline justify-between gap-space-3">
              <h2 id="recent-heading" className="text-type-heading-section text-ink">
                {page.featuredEntriesHeading || 'Recent Things'}
              </h2>
              <Link to="/entries" className="py-3 text-type-ui text-accent hover:text-ink">
                All entries →
              </Link>
            </div>
            <ul className="space-y-space-8">
              {featuredEntries.map((entry) => (
                <li key={entry._id}>
                  <EntryCard entry={entry} headingLevel={3} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <LetsConnect />
    </>
  )
}

export default Home
