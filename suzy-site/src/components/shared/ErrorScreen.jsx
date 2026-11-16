import { Link } from 'react-router-dom'

/**
 * Shared error state component.
 * Was entirely absent from V1 — errors were caught and console.log'd only,
 * leaving users with a blank or frozen screen.
 */
function ErrorScreen({ message = 'Something went wrong.', backTo = '/', backLabel = '← Go home' }) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <p className="text-muted text-sm mb-2">Error</p>
      <p className="text-xl mb-8">{message}</p>
      <Link
        to={backTo}
        className="text-accent hover:text-ink underline transition-colors text-sm"
      >
        {backLabel}
      </Link>
    </div>
  )
}

export default ErrorScreen
