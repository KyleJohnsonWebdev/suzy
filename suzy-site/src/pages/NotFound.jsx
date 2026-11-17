import { Link } from 'react-router-dom'
import { useSeo } from '../seo/useSeo'

/** Any address that isn't a page. Marked noindex so search engines skip it. */
function NotFound() {
  useSeo({ title: 'Page not found', noindex: true })
  return (
    <div className="container-page pb-space-11 pt-space-12">
      <h1 className="text-type-display-page text-ink">Page not found</h1>
      <p className="mt-space-6 text-type-lead text-body">That page doesn&rsquo;t exist, or it moved.</p>
      <Link to="/" className="mt-space-6 inline-block py-3 text-type-ui text-accent hover:text-ink">
        Go to the home page →
      </Link>
    </div>
  )
}

export default NotFound
