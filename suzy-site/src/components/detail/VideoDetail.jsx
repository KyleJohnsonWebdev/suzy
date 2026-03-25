import { Link } from 'react-router-dom'
import { getYouTubeEmbedUrl } from '../../utils/youtube'
import { TagList } from '../shared/Tag'
import EntryMeta from '../shared/EntryMeta'
import { ENTRY_TYPES } from '../../constants/entryTypes'

/**
 * Full-page detail layout for video entries.
 * Fixes:
 * - Back link standardised: top-left matching all other detail types
 * - Removed the border-4 border-lavender/20 decorative frame (decorative, not purposeful)
 * - Replaced with a clean shadow treatment
 * - getYouTubeEmbedUrl now imported from utils (not defined inside render)
 */
function VideoDetail({ entry }) {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">

        {/* Consistent back link */}
        <Link
          to="/entries"
          className="text-warm-black/60 hover:text-lavender text-sm mb-10 inline-block transition-colors focus:outline-none focus:ring-2 focus:ring-lavender focus:ring-offset-2"
        >
          ← Back to entries
        </Link>

        <header className="mb-8">
          <EntryMeta
            publishedAt={entry.publishedAt}
            entryType={ENTRY_TYPES.VIDEO}
            className="mb-2"
          />
          {entry.title && (
            <h1 className="text-4xl font-normal">{entry.title}</h1>
          )}
        </header>

        {/* Video embed — clean shadow, no decorative border */}
        <div className="aspect-video mb-8 shadow-lg overflow-hidden">
          <iframe
            src={getYouTubeEmbedUrl(entry.videoUrl)}
            title={entry.title || 'Video'}
            className="w-full h-full"
            allowFullScreen
          />
        </div>

        {entry.caption && (
          <p className="text-lg text-warm-black/80 mb-8 max-w-3xl leading-relaxed">
            {entry.caption}
          </p>
        )}

        <TagList tags={entry.tags} />
      </div>
    </div>
  )
}

export default VideoDetail
