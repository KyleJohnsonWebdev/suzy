/**
 * Scrolls to a section by id and moves keyboard focus there, so the next Tab
 * continues from the section instead of the link that was clicked.
 * Content arrives from Sanity after the route renders, so this waits (up to
 * `timeout` ms) for the element to exist.
 */
export function scrollToSection(id, { timeout = 3000 } = {}) {
  const start = performance.now()
  let frame

  const attempt = () => {
    const el = document.getElementById(id)
    if (el) {
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
      el.scrollIntoView({ block: 'start' })
      el.focus({ preventScroll: true })
      return
    }
    if (performance.now() - start < timeout) frame = requestAnimationFrame(attempt)
  }

  attempt()
  return () => cancelAnimationFrame(frame)
}
