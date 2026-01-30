import { useState, useEffect } from 'react'
import FlowerSVG from '../assets/flower.svg?react'

// Import Instagram images
import ig1 from '../assets/7D20BD51-5942-4380-BC65-B4E405F529B3.jpeg'
import ig2 from '../assets/9E1EA210-114D-4BF3-9433-2579AC9152B9.jpeg'
import ig3 from '../assets/B6DB96E9-9289-4170-8993-F1E4793C1896.jpeg'
import ig4 from '../assets/B8800814-6683-48EE-AFA1-A99560A667C7.jpeg'
import ig5 from '../assets/C8B58FB1-F90C-443F-9A76-8189DBE81698.jpeg'

function InstagramFlower({ instagramUrl }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  // Real Instagram images
  const instagramImages = [ig1, ig2, ig3, ig4, ig5]

  // Floating flower positions - each gets a random image
  const flowers = [
    { top: '10%', left: '65%', delay: 0, duration: 18, size: 'w-16 h-16', imageIndex: 0 },
    { top: '25%', left: '85%', delay: 3, duration: 22, size: 'w-20 h-20', imageIndex: 1 },
    { top: '40%', left: '72%', delay: 7, duration: 20, size: 'w-14 h-14', imageIndex: 2 },
    { top: '55%', left: '80%', delay: 2, duration: 25, size: 'w-18 h-18', imageIndex: 3 },
    { top: '15%', left: '90%', delay: 5, duration: 19, size: 'w-12 h-12', imageIndex: 4 },
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

              {/* Instagram grid - all 5 images */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {instagramImages.map((img, idx) => (
                  <a
                    key={idx}
                    href={instagramUrl || 'https://www.instagram.com/maybespecial/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`aspect-square overflow-hidden bg-light-lavender relative group block ${idx === 4 ? 'col-span-2' : ''}`}
                  >
                    <img 
                      src={img} 
                      alt={`Instagram post ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-lavender/0 group-hover:bg-lavender/20 transition-colors" />
                  </a>
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