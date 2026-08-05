import { useEntries } from '../hooks/useEntries'
import EntryCard from '../components/entries/EntryCard'
import LoadingScreen from '../components/shared/LoadingScreen'
import ErrorScreen from '../components/shared/ErrorScreen'

function EntriesFeed() {
  const { entries, loading, error } = useEntries()

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
    <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12 py-16">
      <h1 className="text-4xl font-normal mb-16">Entries</h1>

      {entries.length === 0 ? (
        <p className="text-warm-black/50">No entries yet.</p>
      ) : (
        <div className="space-y-20">
          {entries.map((entry, index) => (
            <div
              key={entry._id}
              className="opacity-0 animate-fadeIn"
              style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'forwards' }}
            >
              <EntryCard entry={entry} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EntriesFeed
