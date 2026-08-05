import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { urlForImage } from '../../utils/image'
import { TagList } from '../shared/Tag'

/**
 * Image detail — lightbox-style interaction.
 *
 * The case study and V1 memory both described this as a lightbox:
 * - Click anywhere outside the image OR press Escape → go back
 * - zoom-in cursor on hover to signal the image is interactive
 * - Full image visible with object-contain — no cropping
 * - Dark warm-black background — cinematic, on-brand
 * - Nav is hidden — the image is the full experience
 * - Caption and tags accessible by scrolling below
 *
 * Uses useNavigate(-1) so the user returns to wherever they came from
 * (feed, homepage featured grid) rather than always forcing /entries.
 * This preserves their scroll position context.
 */
function ImageDetail({ entry }) {
  const navigate = useNavigate()

  const handleClose = () => navigate(-1)

  // Escape key to close — matches lightbox convention
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Hide the global nav header while image detail is open
  // so nothing competes with the full-screen image
  useEffect(() => {
    const header = document.querySelector('header')
    if (header) header.style.display = 'none'
    return () => {
      if (header) header.style.display = ''
    }
  }, [])

  return (
    <div className="min-h-screen bg-warm-black">

      {/* Full-screen image area — clicking background closes */}
      <div
        className="relative h-screen w-full flex items-center justify-center cursor-zoom-out"
        onClick={handleClose}
        role="button"
        aria-label="Close image and go back"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClose()}
      >
        {/* Image — stops click propagation so only bg click closes */}
        <img
          src={urlForImage(entry.image, { width: 2400, quality: 92 })}
          alt={entry.image?.alt || entry.title || 'Entry image'}
          className="max-h-full max-w-full object-contain select-none"
          onClick={(e) => e.stopPropagation()}
          draggable={false}
        />

        {/* Close hint — top right, always visible */}
        <button
          onClick={handleClose}
          className="absolute top-8 right-8 text-neutral-white/60 hover:text-neutral-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-white focus:ring-offset-2 flex items-center gap-2"
          aria-label="Close"
        >
          <span>Esc to close</span>
          <span className="text-xl leading-none">×</span>
        </button>

        {/* Back link — top left as secondary affordance */}
        <button
          onClick={handleClose}
          className="absolute top-8 left-8 text-neutral-white/60 hover:text-neutral-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-white focus:ring-offset-2"
        >
          ← Back
        </button>

        {/* Title overlay — gradient at bottom so text is always legible */}
        {(entry.title || entry.publishedAt) && (
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-warm-black/90 to-transparent px-12 pt-24 pb-10"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-neutral-white/50 mb-2">
              {new Date(entry.publishedAt).toLocaleDateString()}
            </p>
            {entry.title && (
              <h1 className="text-3xl font-normal leading-tight text-neutral-white">
                {entry.title}
              </h1>
            )}
          </div>
        )}
      </div>

      {/* Caption and tags — scroll below the image to see */}
      {(entry.caption || (entry.tags && entry.tags.length > 0)) && (
        <div className="max-w-3xl mx-auto px-6 lg:px-12 py-16">
          {entry.caption && (
            <p className="text-xl leading-relaxed mb-8 text-neutral-white/70">
              {entry.caption}
            </p>
          )}
          <TagList tags={entry.tags} />
        </div>
      )}

    </div>
  )
}

export default ImageDetail
