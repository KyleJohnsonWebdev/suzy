/**
 * Footer (brand book, Components › Footer).
 * © line in muted on the left; Instagram, LinkedIn, Threads on the right.
 * This is the only place the social links appear. URLs come from Sanity
 * (Site Settings), so Suzy can change them herself.
 */
function Footer({ settings }) {
  const links = [
    ['Instagram', settings?.instagramUrl],
    ['LinkedIn', settings?.linkedinUrl],
    ['Threads', settings?.threadsUrl],
  ].filter(([, href]) => href)

  return (
    <footer className="border-t border-border">
      <div className="container-page flex flex-wrap items-center justify-between gap-x-space-6 py-space-6">
        <p className="py-3 text-type-meta text-muted">© {new Date().getFullYear()} Maybe Special</p>
        {links.length > 0 && (
          <ul className="flex gap-space-6">
            {links.map(([label, href]) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-3 text-type-meta text-ink transition-colors hover:text-accent"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  )
}

export default Footer
