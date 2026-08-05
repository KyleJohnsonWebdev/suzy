import ImageEntryCard from './ImageEntryCard'
import VideoEntryCard from './VideoEntryCard'
import StatementEntryCard from './StatementEntryCard'
import { ENTRY_TYPES } from '../../constants/entryTypes'

/**
 * Dispatch component — maps entry type to the correct card component.
 *
 * Replaces the chained if (entry.entryType === 'image') blocks
 * in EntriesFeed.jsx and the featured grid in Home.jsx.
 *
 * Adding a new entry type = add one component + one line here.
 * No existing files need to change.
 */
const ENTRY_CARD_MAP = {
  [ENTRY_TYPES.IMAGE]: ImageEntryCard,
  [ENTRY_TYPES.VIDEO]: VideoEntryCard,
  [ENTRY_TYPES.STATEMENT]: StatementEntryCard,
}

function EntryCard({ entry }) {
  if (!entry) return null

  const Component = ENTRY_CARD_MAP[entry.entryType]
  if (!Component) return null

  // Skip image entries with no image (guard that was inline in V1)
  if (entry.entryType === ENTRY_TYPES.IMAGE && !entry.image) return null

  return <Component entry={entry} />
}

export default EntryCard
