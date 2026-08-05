import { Link } from 'react-router-dom'
import { getYouTubeThumbnail } from '../../utils/youtube'
import EntryMeta from '../shared/EntryMeta'
import { ENTRY_TYPES } from '../../constants/entryTypes'

/**
 * Feed card for video-type entries.
 * Fixes:
 * - items-center → items-start
 * - gap-8 → gap-12
 * - aspect-[4/3] to match image entries (was aspect-video/16:9 — height mismatch)
 * - loading="lazy" on thumbnail image
 * - hover transition 300ms
 */
function VideoEntryCard({ entry }) {
  const thumbnail = getYouTubeThumbnail(entry.videoUrl)

  return (
    <article className="group">
      <Link to={`/entry/${entry.slug.current}`} className="block">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="relative aspect-[4/3] overflow-hidden bg-light-lavender">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={entry.title || 'Video thumbnail'}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-light-lavender" />
            )}

            {/* Play button overlay */}
            <div className="absolute inset-0 bg-lavender/20 group-hover:bg-lavender/30 transition-colors flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-lavender flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-warm-black ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="pt-1">
            <EntryMeta
              publishedAt={entry.publishedAt}
              entryType={ENTRY_TYPES.VIDEO}
              className="mb-3"
            />
            {entry.title && (
              <h2 className="text-3xl font-normal mb-4 group-hover:text-lavender transition-colors">
                {entry.title}
              </h2>
            )}
            {entry.caption && (
              <p className="text-warm-black/70 leading-relaxed">{entry.caption}</p>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}

export default VideoEntryCard
