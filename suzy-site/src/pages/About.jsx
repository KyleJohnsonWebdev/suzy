/**
 * About page — new in V2.
 *
 * Provides the trust anchor that was entirely missing from V1.
 * Without it, first-time visitors had no way to understand who
 * is behind the work before contacting or browsing entries.
 *
 * Content is static for now. To make it CMS-driven, add an
 * aboutPage document type in Sanity and wire it up with a
 * useAboutPage hook following the same pattern as useHomeData.
 *
 * IMPORTANT: Replace the placeholder text below with Suzy's
 * actual bio before going live. The layout and structure are final.
 */
function About() {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12 py-20">

      {/* Name as hero — echoes homepage scale */}
      <div className="mb-20 max-w-4xl">
        <h1 className="text-6xl md:text-7xl font-normal leading-[0.95]">
          Maybe Special
        </h1>
      </div>

      {/* Bio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl">
        <div className="space-y-6 text-xl leading-relaxed text-warm-black/80">
          <p>
            {/* Replace this with Suzy's actual bio */}
            Maybe Special is the creative practice of Suzy Johnson —
            a space for images, ideas, and things worth paying attention to.
          </p>
          <p>
            {/* Replace this paragraph with more of Suzy's voice */}
            Based in [location]. Available for [work type].
          </p>
        </div>

        {/* Contact column */}
        <div className="space-y-4 text-warm-black/60">
          <div>
            <p className="text-sm mb-1">Instagram</p>
            <a
              href="https://www.instagram.com/maybespecial/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lavender hover:text-warm-black transition-colors"
            >
              @maybespecial
            </a>
          </div>
          <div>
            <p className="text-sm mb-1">Get in touch</p>
            <a
              href="/contact"
              className="text-lavender hover:text-warm-black transition-colors"
            >
              Contact →
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}

export default About
