import { useEntries } from '../hooks/useEntries'
import { usePageTitle } from '../hooks/usePageTitle'
import EntryCard from '../components/entries/EntryCard'
import LoadingScreen from '../components/shared/LoadingScreen'
import ErrorScreen from '../components/shared/ErrorScreen'

function EntriesFeed() {
  const { entries, loading, error } = useEntries()
  usePageTitle('Entries')

  if (loading) return <LoadingScreen />

  if (error) {
    return (
      <ErrorScreen
        message="We couldn't load the entries. Please try again."
        backTo="/"
        backLabel="← Go home"
      />
    )
  }

  return (
    <div className="container-page pb-space-11 pt-space-12">
      <h1 className="mb-space-10 text-type-display-page text-ink">Entries</h1>

      {entries.length === 0 ? (
        <p className="text-type-body text-muted">No entries yet.</p>
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
