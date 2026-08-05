/**
 * Renders the standardised entry metadata line: "{date} · {type}"
 * Extracted to a shared component so the format is consistent everywhere.
 */
function EntryMeta({ publishedAt, entryType, className = '' }) {
  const date = publishedAt
    ? new Date(publishedAt).toLocaleDateString()
    : ''

  return (
    <p className={`text-sm text-warm-black/70 ${className}`}>
      {date}
      {date && entryType && ' · '}
      {entryType}
    </p>
  )
}

export default EntryMeta
