import { Link } from 'react-router-dom'
import { PortableTextWithDropCap } from '../shared/PortableText'
import { TagList } from '../shared/Tag'
import EntryMeta from '../shared/EntryMeta'
import { ENTRY_TYPES } from '../../constants/entryTypes'

/**
 * Full-page detail layout for statement entries.
 * Fixes:
 * - Back link bug: was inline-block with mx-auto (had zero effect).
 *   Now lives inside the article container so it inherits centering correctly.
 * - Rich text rendered via PortableTextWithDropCap (marks no longer dropped)
 * - Back link style consistent with all other detail types
 */
function StatementDetail({ entry }) {
  return (
    <div className="min-h-screen py-20">
      <article className="max-w-2xl mx-auto px-6 lg:px-12">

        {/* Back link inside article — inherits the centering correctly */}
        <Link
          to="/entries"
          className="text-sm text-warm-black/60 hover:text-lavender mb-12 inline-block transition-colors focus:outline-none focus:ring-2 focus:ring-lavender focus:ring-offset-2"
        >
          ← Back to entries
        </Link>

        <header className="mb-12">
          <EntryMeta
            publishedAt={entry.publishedAt}
            entryType={ENTRY_TYPES.STATEMENT}
            className="mb-4"
          />
          {entry.title && (
            <h1 className="text-5xl font-normal leading-tight mb-4">
              {entry.title}
            </h1>
          )}
        </header>

        {/* PortableTextWithDropCap fixes the silent mark-dropping bug from V1 */}
        <PortableTextWithDropCap value={entry.body} />

        <TagList
          tags={entry.tags}
          className="mt-12 pt-12 border-t border-warm-black/10"
        />
      </article>
    </div>
  )
}

export default StatementDetail
