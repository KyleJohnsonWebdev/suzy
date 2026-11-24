import { useBlogPage } from '../hooks/useBlogPage'
import { useSeo } from '../seo/useSeo'
import EntryCard from '../components/entries/EntryCard'
import LoadingScreen from '../components/shared/LoadingScreen'
import ErrorScreen from '../components/shared/ErrorScreen'

const DEFAULT_HEADING = "Recent Things I've Thought or Done"

function EntriesFeed() {
  const { entries, settings, loading, error } = useBlogPage()
  useSeo({ title: 'Blog', description: settings?.blogIntro })

  if (loading) return <LoadingScreen />

  if (error) {
    return (
      <ErrorScreen
        message="We couldn't load the blog. Please try again."
        backTo="/"
        backLabel="← Go home"
      />
    )
  }

  return (
    <div className="container-page pb-space-11 pt-space-12">
      {/* Heading and intro are editable in Studio (Site Settings › Blog page). */}
      <header className="mb-space-10">
        <h1 className="text-type-display-page text-ink">{settings?.blogHeading || DEFAULT_HEADING}</h1>
        {settings?.blogIntro && <p className="mt-space-5 max-w-lead text-type-lead text-body">{settings.blogIntro}</p>}
      </header>

      {entries.length === 0 ? (
        <p className="text-type-body text-muted">Nothing here yet.</p>
      ) : (
        <ul className="space-y-space-8">
          {entries.map((entry, index) => (
            <li
              key={entry._id}
              className="animate-fadeIn opacity-0"
              style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'forwards' }}
            >
              <EntryCard entry={entry} headingLevel={2} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default EntriesFeed
