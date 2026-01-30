// Import SVG as React component using vite-plugin-svgr
import FlowerSVG from '../../assets/flower.svg?react'

// FlowerIcon component - displays the flower shape with custom styling
export const FlowerIcon = ({ className, fill = "#C0BEF5", fillOpacity = 0.3 }) => {
  return (
    <div className={className}>
      <FlowerSVG 
        className="w-full h-full"
        style={{ fill: fill, opacity: fillOpacity }}
      />
    </div>
  )
}

// FlowerMask component - applies the flower shape as a mask to child content
export const FlowerMask = ({ children, className }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Content (will be masked) */}
      <div className="w-full h-full">
        {children}
      </div>
      
      {/* SVG mask overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage: 'url(#flowerShape)',
          WebkitMaskImage: 'url(#flowerShape)',
        }}
      >
        <div className="w-full h-full bg-white" />
      </div>

      {/* Hidden SVG for mask reference */}
      <svg className="absolute w-full h-full top-0 left-0" style={{ visibility: 'hidden' }}>
        <defs>
          <g id="flowerShape">
            <FlowerSVG />
          </g>
        </defs>
      </svg>
    </div>
  )
}