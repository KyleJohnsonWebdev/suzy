import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import EntriesFeed from './pages/EntriesFeed'
import EntryDetail from './pages/EntryDetail'
import Contact from './pages/Contact'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-warm-black/10">
          <nav className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-xl font-normal hover:text-lavender transition-colors">
                Maybe Special
              </Link>
              <div className="flex gap-8">
                <Link to="/entries" className="hover:text-lavender transition-colors">
                  Entries
                </Link>
                <Link to="/contact" className="hover:text-lavender transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          </nav>
        </header>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/entries" element={<EntriesFeed />} />
            <Route path="/entry/:slug" element={<EntryDetail />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <footer className="border-t border-warm-black/10 mt-20">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex justify-between items-center text-sm">
              <p>© {new Date().getFullYear()} Maybe Special</p>
              <a 
                href="https://www.instagram.com/maybespecial/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-lavender transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
