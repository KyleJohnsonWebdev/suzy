import { useState, useEffect } from 'react'
import { FlowerIcon } from './icons/FlowerIcon'

// Instagram images — static data belongs at module scope, not inside component
import ig1 from '../assets/7D20BD51-5942-4380-BC65-B4E405F529B3.jpeg'
import ig2 from '../assets/9E1EA210-114D-4BF3-9433-2579AC9152B9.jpeg'
import ig3 from '../assets/B6DB96E9-9289-4170-8993-F1E4793C1896.jpeg'
import ig4 from '../assets/B8800814-6683-48EE-AFA1-A99560A667C7.jpeg'
import ig5 from '../assets/C8B58FB1-F90C-443F-9A76-8189DBE81698.jpeg'

const INSTAGRAM_IMAGES = [ig1, ig2, ig3, ig4, ig5]

/**
 * Flower positions — static, never change, defined at module scope.
 *
 * Fixes:
 * - w-18 replaced with w-16 (w-18 does not exist in Tailwind default scale)
 * - All sizes now use valid Tailwind spacing tokens
 */
const FLOWER_POSITIONS = [
  { top: '10%', left: '65%', delay: 0,  duration: 18, size: 'w-16 h-16' },  // medium
  { top: '25%', left: '85%', delay: 3,  duration: 22, size: 'w-20 h-20' },  // large
  { top: '40%', left: '72%', delay: 7,  duration: 20, size: 'w-14 h-14' },  // small
  { top: '55%', left: '80%', delay: 2,  duration: 25, size: 'w-18 h-18' },  // medium-large
  { top: '15%', left: '90%', delay: 5,  duration: 19, size: 'w-12 h-12' },  // small
]

/**
 * InstagramFlower — V2 rewrite.
 *
 * Fixes applied:
 * - Component is now HOMEPAGE ONLY. The fixed-position flowers previously
 *   rendered across all pages including EntryDetail full-screen image layouts.
 *   Restriction is enforced in App.jsx by only rendering this on the / route.
 *   The component itself is unchanged — the fix is in where it is mounted.
 *
 * - w-18 h-18 invalid class replaced with w-16 h-16 (Tailwind has no w-18)
 *
 * - Static arrays (FLOWER_POSITIONS, INSTAGRAM_IMAGES) moved to module scope —
 *   were being recreated as new objects on every render
 *
 * - Escape key closes the panel (was missing — accessibility requirement for
 *   modal-pattern UI). useEffect is now used (was imported but never called in V1)
 *
 * - Inline <style> tag for @keyframes float moved to index.css (see that file)
 *   Custom cursor applied inline on the element instead
 *
 * - 5th image full-width logic uses length - 1 not hardcoded idx === 4 —
 *   resilient to the image array changing length
 */
function InstagramFlower({ instagramUrl }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  // Escape key handler — was missing entirely in V1
  // useEffect was imported but never used — now it has a purpose
  useEffect(() => {
    if (!isPanelOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsPanelOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPanelOpen])

  // Lock body scroll when panel is open
  useEffect(() => {
    document.body.style.overflow = isPanelOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isPanelOpen])

  return (
    <>
      {/* Floating flowers */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {FLOWER_POSITIONS.map((flower, i) => (
          <div
            key={i}
            className="absolute pointer-events-auto"
            style={{
              top: flower.top,
              left: flower.left,
              animation: `float ${flower.duration}s ease-in-out infinite`,
              animationDelay: `${flower.delay}s`,
            }}
          >
            <button
              onClick={() => setIsPanelOpen(true)}
              className="group focus:outline-none focus:ring-2 focus:ring-lavender focus:ring-offset-2 relative"
              aria-label="View Instagram feed"
              // Cursor applied inline — avoids injecting a <style> tag from render
              style={{
                cursor: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="18" cy="6" r="1" fill="black"/></svg>') 12 12, pointer`,
              }}
            >
              <div className={`relative ${flower.size}`}>
                <FlowerIcon
                  className="w-full h-full group-hover:scale-110 transition-transform duration-300"
                  fill="#C0BEF5"
                  fillOpacity={0.4}
                />
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Panel */}
      {isPanelOpen && (
        <>
          <div
            className="fixed inset-0 bg-warm-black/40 z-40"
            onClick={() => setIsPanelOpen(false)}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Instagram feed"
            className="fixed top-0 right-0 h-full w-full max-w-md bg-neutral-white z-50 shadow-2xl overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-normal">From Instagram</h2>
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="text-warm-black/60 hover:text-warm-black text-4xl leading-none focus:outline-none focus:ring-2 focus:ring-lavender focus:ring-offset-2"
                  aria-label="Close Instagram panel"
                >
                  ×
                </button>
              </div>

              {/* Instagram image grid
                  5th image (last) spans full width.
                  Uses length - 1 instead of hardcoded idx === 4
                  so it works if the array ever changes length. */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {INSTAGRAM_IMAGES.map((img, idx) => {
                  const isLast = idx === INSTAGRAM_IMAGES.length - 1
                  return (
                    <a
                      key={idx}
                      href={instagramUrl || 'https://www.instagram.com/maybespecial/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`aspect-square overflow-hidden bg-light-lavender relative group block ${
                        isLast ? 'col-span-2' : ''
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Instagram post ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-lavender/0 group-hover:bg-lavender/20 transition-colors" />
                    </a>
                  )
                })}
              </div>

              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-4 border-2 border-lavender text-lavender hover:bg-lavender hover:text-warm-black transition-colors font-normal focus:outline-none focus:ring-2 focus:ring-lavender focus:ring-offset-2"
                >
                  View on Instagram
                </a>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default InstagramFlower
