import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import EntriesFeed from './pages/EntriesFeed'
import EntryDetail from './pages/EntryDetail'
import Contact from './pages/Contact'
import About from './pages/About'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/**
 * AppShell — separated from Router so useLocation() is available.
 *
 * Key fix: <main key={location.pathname}> forces React to remount
 * the element on every route change, which re-triggers animate-pageFade.
 * Without the key, the animation only fires on first load.
 */
function AppShell() {
  const location = useLocation()

  const navLinkClass = ({ isActive }) =>
    `transition-colors focus:outline-none focus:ring-2 focus:ring-lavender focus:ring-offset-2 ${
      isActive
        ? 'text-lavender border-b border-lavender pb-0.5'
        : 'hover:text-lavender'
    }`

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />

      <header className="border-b border-warm-black/10">
        <nav
          className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12 py-6"
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="text-xl font-normal hover:text-lavender transition-colors tracking-wide focus:outline-none focus:ring-2 focus:ring-lavender focus:ring-offset-2"
            >
              Maybe Special
            </Link>

            <div className="flex gap-8">
              <NavLink to="/about" className={navLinkClass}>
                About
              </NavLink>
              <NavLink to="/entries" className={navLinkClass}>
                Entries
              </NavLink>
              <NavLink to="/contact" className={navLinkClass}>
                Contact
              </NavLink>
            </div>
          </div>
        </nav>
      </header>

      {/* key={location.pathname} re-triggers animate-pageFade on every route change */}
      <main key={location.pathname} className="flex-1 animate-pageFade">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/entries" element={<EntriesFeed />} />
          <Route path="/entry/:slug" element={<EntryDetail />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <footer className="border-t border-warm-black/10 mt-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12 py-8">
          <div className="flex justify-between items-center text-sm">
            <p className="text-warm-black/50">
              © {new Date().getFullYear()} Maybe Special
            </p>
            <a
              href="https://www.instagram.com/maybespecial/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-lavender transition-colors focus:outline-none focus:ring-2 focus:ring-lavender focus:ring-offset-2"
            >
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  )
}

export default App
