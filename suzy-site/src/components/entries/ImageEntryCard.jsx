import { Link } from 'react-router-dom'
import { urlForImage } from '../../utils/image'
import EntryMeta from '../shared/EntryMeta'
import { ENTRY_TYPES } from '../../constants/entryTypes'

/**
 * Feed card for image-type entries.
 * Fixes:
 * - items-center → items-start (text no longer floats mid-image)
 * - gap-8 → gap-12 (tightens image-to-text visual grouping)
 * - aspect-[4/3] consistent on both breakpoints (no tall portrait flip)
 * - loading="lazy" on image
 * - hover transition 300ms (was 500ms — too slow)
 */
function ImageEntryCard({ entry }) {
  return (
    <article className="group">
      <Link to={`/entry/${entry.slug.current}`} className="block">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="aspect-[4/3] overflow-hidden bg-light-lavender">
            <img
              src={urlForImage(entry.image, { width: 900 })}
              alt={entry.image?.alt || entry.title || 'Entry image'}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="pt-1">
            <EntryMeta
              publishedAt={entry.publishedAt}
              entryType={ENTRY_TYPES.IMAGE}
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

export default ImageEntryCard
