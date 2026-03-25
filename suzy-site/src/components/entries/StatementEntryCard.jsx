import { Link } from 'react-router-dom'
import EntryMeta from '../shared/EntryMeta'
import { TagList } from '../shared/Tag'
import { extractPlainText, truncateAtWord } from '../../utils/text'
import { ENTRY_TYPES } from '../../constants/entryTypes'

/**
 * Feed card for statement-type entries.
 * Fixes:
 * - No longer constrained to 50/50 grid — takes full column width
 *   because text-only entries deserve horizontal space
 * - max-w-3xl removed in favour of a wider reading column
 * - Excerpt truncation uses truncateAtWord() — no more mid-word cuts
 * - TagList uses shared Tag component with consistent px-3 padding
 */
function StatementEntryCard({ entry }) {
  const plainText = extractPlainText(entry.body)
  const excerpt = truncateAtWord(plainText, 280)

  return (
    <article className="group">
      <Link to={`/entry/${entry.slug.current}`} className="block">
        <EntryMeta
          publishedAt={entry.publishedAt}
          entryType={ENTRY_TYPES.STATEMENT}
          className="mb-3"
        />

        {entry.title && (
          <h2 className="text-3xl font-normal mb-4 group-hover:text-lavender transition-colors">
            {entry.title}
          </h2>
        )}

        {excerpt && (
          <p className="text-lg text-warm-black/80 leading-relaxed mb-4 max-w-2xl">
            {excerpt}
          </p>
        )}

        <TagList tags={entry.tags} />
      </Link>
    </article>
  )
}

export default StatementEntryCard
