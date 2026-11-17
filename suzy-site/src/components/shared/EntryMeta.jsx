import { formatDate } from '../../utils/date'
import { capitalize } from '../../utils/text'

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
      {capitalize(entryType)}
    </p>
  )
}

export default EntryMeta
