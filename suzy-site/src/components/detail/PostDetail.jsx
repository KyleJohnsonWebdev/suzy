import { Link } from 'react-router-dom'
import { PostBody } from '../shared/PortableText'
import { TagList } from '../shared/Tag'
import EntryMeta from '../shared/EntryMeta'
import { ENTRY_TYPES } from '../../constants/entryTypes'

/**
 * Full-page layout for posts: long-form writing with headings, lists, quotes,
 * links, photos and embedded videos or link cards, in a reading-width column.
 */
function PostDetail({ entry }) {
  return (
    <div className="min-h-screen py-20">
      <article className="mx-auto max-w-2xl px-6 lg:px-12">
        <Link
          to="/entries"
          className="mb-12 inline-block text-sm text-muted transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          ← Back to entries
        </Link>

        <header className="mb-12">
          <EntryMeta publishedAt={entry.publishedAt} entryType={ENTRY_TYPES.POST} className="mb-4" />
          {entry.title && <h1 className="mb-4 text-5xl font-normal leading-tight">{entry.title}</h1>}
        </header>

        <PostBody value={entry.postBody} />

        <TagList tags={entry.tags} className="mt-12 border-t border-border pt-12" />
      </article>
    </div>
  )
}

export default PostDetail
