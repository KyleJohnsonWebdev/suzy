import { useState, useEffect } from 'react'
import FlowerSVG from '../assets/flower.svg?react'

function InstagramFlower({ instagramUrl }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Sample Instagram images - replace with real data from Sanity later
  const instagramImages = [
    'https://picsum.photos/seed/ig1/400/400',
    'https://picsum.photos/seed/ig2/400/400',
    'https://picsum.photos/seed/ig3/400/400',
    'https://picsum.photos/seed/ig4/400/400',
  ]

  // Cycle through images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % instagramImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [instagramImages.length])

  // Floating flower positions - more spread out and varied movement
  const flowers = [
    { top: '10%', left: '65%', delay: 0, duration: 18, size: 'w-16 h-16' },
    { top: '25%', left: '85%', delay: 3, duration: 22, size: 'w-20 h-20' },
    { top: '40%', left: '72%', delay: 7, duration: 20, size: 'w-14 h-14' },
    { top: '55%', left: '80%', delay: 2, duration: 25, size: 'w-18 h-18' },
    { top: '15%', left: '90%', delay: 5, duration: 19, size: 'w-12 h-12' },
  ]

  return (
    <>
      {/* Floating flowers in background - behind hero text */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Define clip path once */}
        <svg className="absolute w-0 h-0">
          <defs>
            <clipPath id="flowerClipPath" clipPathUnits="objectBoundingBox">
              <FlowerSVG 
                preserveAspectRatio="none"
                style={{ transform: 'scale(0.01, 0.01)' }}
              />
            </clipPath>
          </defs>
        </svg>

        {flowers.map((flower, i) => (
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
              className="group focus:outline-none focus:ring-2 focus:ring-lavender focus:ring-offset-2 relative instagram-cursor"
              aria-label="View Instagram feed"
            >
              <div className={`relative ${flower.size}`}>
                {/* Just the flower shape - no images */}
                <FlowerSVG 
                  className="w-full h-full group-hover:scale-110 transition-transform duration-300"
                  fill="#C0BEF5"
                  opacity="0.4"
                />
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* CSS for floating animation and cursor */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          20% {
            transform: translate(-20px, -25px) rotate(8deg);
          }
          40% {
            transform: translate(15px, -15px) rotate(-5deg);
          }
          60% {
            transform: translate(-10px, 20px) rotate(6deg);
          }
          80% {
            transform: translate(20px, 10px) rotate(-8deg);
          }
        }

        .instagram-cursor {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="18" cy="6" r="1" fill="black"/></svg>') 12 12, pointer;
        }
      `}</style>

      {/* Side panel for Instagram feed */}
      {isPanelOpen && (
        <>
          {/* Overlay backdrop */}
          <div
            className="fixed inset-0 bg-warm-black/40 z-40 transition-opacity"
            onClick={() => setIsPanelOpen(false)}
          />

          {/* Side panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-neutral-white z-50 shadow-2xl overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-normal">From Instagram</h2>
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="text-warm-black/60 hover:text-warm-black text-4xl leading-none"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {/* Instagram grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {instagramImages.map((img, idx) => (
                  <div key={idx} className="aspect-square overflow-hidden bg-light-lavender relative group">
                    <img 
                      src={img} 
                      alt={`Instagram post ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-lavender/0 group-hover:bg-lavender/20 transition-colors" />
                  </div>
                ))}
              </div>
              
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-4 border-2 border-lavender text-lavender hover:bg-lavender hover:text-warm-black transition-colors font-normal"
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