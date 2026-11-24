import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import EntriesFeed from './pages/EntriesFeed'
import EntryDetail from './pages/EntryDetail'
import About from './pages/About'
import NotFound from './pages/NotFound'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import { useSiteSettings } from './hooks/useSiteSettings'
import { scrollToSection } from './utils/scrollToSection'
import { SeoDefaults } from './seo/useSeo'

/**
 * On navigation: jump to the #section if there is one (once Sanity content has
 * rendered it), otherwise to the top of the page.
 */
function ScrollManager() {
  const { pathname, hash, key } = useLocation()
  useEffect(() => {
    if (hash) return scrollToSection(decodeURIComponent(hash.slice(1)))
    window.scrollTo(0, 0)
  }, [pathname, hash, key])
  return null
}

/**
 * AppShell — separated from Router so useLocation() is available.
 * <main key={pathname}> remounts on every route change, which re-triggers
 * animate-pageFade.
 */
function AppShell() {
  const { pathname } = useLocation()
  const { settings } = useSiteSettings()
  // Fallbacks for pages without their own: Site Description (else her home
  // headline) and the About portrait for link previews.
  const seoDefaults = {
    description: settings?.siteDescription || settings?.homeHeroText || '',
    image: settings?.defaultShareImage || null,
  }

  return (
    <SeoDefaults.Provider value={seoDefaults}>
      <div className="flex min-h-screen flex-col">
        <ScrollManager />
        <Header showWork={Boolean(settings?.hasWork)} />

        <main key={pathname} className="flex-1 animate-pageFade">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<EntriesFeed />} />
            {/* The blog was called Entries until 2026-11; keep old links working. */}
            <Route path="/entries" element={<Navigate to="/blog" replace />} />
            <Route path="/entry/:slug" element={<EntryDetail />} />
            {/* Contact is now the Let's Connect band; keep old links working. */}
            <Route path="/contact" element={<Navigate to={{ pathname: '/', hash: '#contact' }} replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer settings={settings} />
      </div>
    </SeoDefaults.Provider>
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
