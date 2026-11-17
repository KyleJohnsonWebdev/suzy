import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/date'
import { urlForImage } from '../../utils/image'
import { getYouTubeThumbnail } from '../../utils/youtube'
import { capitalize, extractPlainText, splitLead, truncateAtWord } from '../../utils/text'
import { ENTRY_TYPES } from '../../constants/entryTypes'

/**
 * Entry card (brand book, Components › Entry card).
 * Full width: a lavender quote panel beside a surface text panel with meta,
 * title, excerpt and "Read entry →" in accent. Square corners.
 *
 * The quote panel holds what the entry is: a pull quote for statements (its
 * opening sentences; the next ones become the excerpt), the image for image
 * entries, the video thumbnail for videos. Matches the Refresh mockups.
 *
 * The whole card is clickable through the title link (stretched over the
 * card), so screen readers hear one link named by the title.
 */
function EntryCard({ entry, headingLevel = 2 }) {
  if (!entry?.slug?.current) return null
  if (entry.entryType === ENTRY_TYPES.IMAGE && !entry.image) return null

  const Heading = `h${headingLevel}`
  const date = formatDate(entry.publishedAt)
  const meta = [date, capitalize(entry.entryType)].filter(Boolean).join(' · ')
  const isStatement = entry.entryType === ENTRY_TYPES.STATEMENT
  const statement = isStatement ? splitLead(extractPlainText(entry.body)) : null
  const excerpt = truncateAtWord(isStatement ? statement.rest : entry.caption, 200)

  return (
    <article className="group relative grid border border-border bg-surface focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent md:grid-cols-[5fr_7fr]">
      <div className="relative flex min-h-[220px] items-center bg-lavender">
        <QuotePanel entry={entry} quote={statement?.lead} />
      </div>

      <div className="flex flex-col justify-center p-space-8 md:p-space-9">
        {meta && <p className="text-type-meta text-muted">{meta}</p>}
        {entry.title && (
          <Heading className="mt-space-3 text-type-heading-card text-ink">
            <Link
              to={`/entry/${entry.slug.current}`}
              className="transition-colors after:absolute after:inset-0 focus:outline-none group-hover:text-accent"
            >
              {entry.title}
            </Link>
          </Heading>
        )}
        {excerpt && <p className="mt-space-4 max-w-reading text-type-body text-body">{excerpt}</p>}
        <p className="mt-space-6 text-type-ui text-accent" aria-hidden="true">
          Read entry →
        </p>
      </div>
    </article>
  )
}

function QuotePanel({ entry, quote }) {
  if (entry.entryType === ENTRY_TYPES.STATEMENT) {
    return quote ? (
      <blockquote className="p-space-8 text-type-pull-quote text-ink md:p-space-9">
        &ldquo;{quote}&rdquo;
      </blockquote>
    ) : null
  }

  if (entry.entryType === ENTRY_TYPES.IMAGE) {
    return (
      <img
        src={urlForImage(entry.image, { width: 900 })}
        alt={entry.image?.alt || ''}
        loading="lazy"
        className="aspect-[4/3] h-full w-full object-cover"
      />
    )
  }

  if (entry.entryType === ENTRY_TYPES.VIDEO) {
    const thumb = getYouTubeThumbnail(entry.videoUrl)
    return (
      <div className="relative aspect-[4/3] w-full">
        {thumb && <img src={thumb} alt="" loading="lazy" className="h-full w-full object-cover" />}
        <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-on-accent">
            <svg className="ml-0.5 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </div>
    )
  }

  return null
}

export default EntryCard
