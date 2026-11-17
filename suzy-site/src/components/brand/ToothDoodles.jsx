import ToothSVG from '../../assets/tooth.svg?react'

/**
 * Tooth doodles (brand book, Motif): hand-drawn outlines floating in the
 * background of the home hero and About opener.
 * - `doodle` color, decorative only (aria-hidden, no pointer events)
 * - at most three per screen, never behind body text: callers place them in
 *   space the text doesn't use (the right-hand band on wide screens, the top
 *   padding on phones)
 * - sizes 72–112px tall keep the drawn line at about 2.5–4px
 *
 * Each placement: { className, duration?, delay?, still? }.
 */
function ToothDoodles({ placements }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {placements.map((p, i) => (
        <div
          key={i}
          className={`absolute ${p.still ? '' : 'doodle-float'} ${p.className}`}
          style={{ '--doodle-duration': `${p.duration ?? 20}s`, '--doodle-delay': `${p.delay ?? 0}s` }}
        >
          <ToothSVG className="h-full w-auto text-doodle" style={{ fill: 'currentColor' }} focusable="false" />
        </div>
      ))}
    </div>
  )
}

export default ToothDoodles
