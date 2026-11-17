import { formatDate } from '../../utils/date'

/**
 * Renders the standardised entry metadata line: "{date} · {type}"
 * Extracted to a shared component so the format is consistent everywhere.
 */
function EntryMeta({ publishedAt, entryType, className = '' }) {
  const date = formatDate(publishedAt)

  return (
    <p className={`text-sm text-body ${className}`}>
      {date}
      {date && entryType && ' · '}
      {entryType}
    </p>
  )
}

export default EntryMeta
