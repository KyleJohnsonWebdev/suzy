/**
 * Footer (brand book, Components › Footer).
 * © line in muted on the left; Instagram, LinkedIn, Threads on the right.
 * This is the only place the social links appear. URLs come from Sanity
 * (Site Settings), so Suzy can change them herself. Under the © line, a
 * small designer credit links to Kyle Johnson's LinkedIn.
 */
const DESIGNER_URL = 'https://www.linkedin.com/in/kjohnson-dev/'

function Footer({ settings }) {
  const links = [
    ['Instagram', settings?.instagramUrl],
    ['LinkedIn', settings?.linkedinUrl],
    ['Threads', settings?.threadsUrl],
  ].filter(([, href]) => href)

  return (
    <footer className="border-t border-border">
      <div className="container-page flex flex-wrap items-center justify-between gap-x-space-6 py-space-6">
        <div className="py-3 text-type-meta text-muted">
          <p>© {new Date().getFullYear()} Suzy Johnson · maybespecial</p>
          {/* Designer credit: the site's builder, linked to his LinkedIn. */}
          <p className="mt-space-1">
            Site by{' '}
            <a
              href={DESIGNER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline underline-offset-2 transition-colors hover:text-accent"
            >
              Kyle Johnson
            </a>
          </p>
        </div>
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
