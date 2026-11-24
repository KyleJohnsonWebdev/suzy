import { Link, NavLink, useLocation } from 'react-router-dom'
import ThemeToggle from '../brand/ThemeToggle'
import ToothSVG from '../../assets/tooth.svg?react'
import { scrollToSection } from '../../utils/scrollToSection'

// Pages that end with the Let's Connect band (id="contact").
const PAGES_WITH_CONTACT = ['/', '/about']

const linkBase = 'inline-block py-3 text-type-ui transition-colors'

/**
 * Header (brand book, Components › Header).
 * Wordmark left (on phones, with her tooth in a circle beside it);
 * Work / About / Blog / Contact, then the theme toggle.
 * The active page gets a 2px accent underline and aria-current="page"
 * (NavLink sets aria-current itself).
 */
function Header({ showWork }) {
  const { pathname } = useLocation()
  const contactPath = PAGES_WITH_CONTACT.includes(pathname) ? pathname : '/'

  const navClass = ({ isActive }) =>
    `${linkBase} border-b-2 ${isActive ? 'border-accent text-ink' : 'border-transparent text-ink hover:text-accent'}`

  // Same-page section links: React Router won't re-scroll if the URL is unchanged.
  const sectionClick = (path, id) => (e) => {
    if (pathname === path && window.location.hash === `#${id}`) {
      e.preventDefault()
      scrollToSection(id)
    }
  }

  return (
    <header className="border-b border-border">
      <nav aria-label="Main navigation" className="container-page flex flex-wrap items-center justify-between gap-x-space-7 gap-y-space-2 py-space-4">
        <Link to="/" className="flex items-center gap-space-3 py-3 text-[20px] font-medium leading-none text-ink">
          {/* Phones only: the tooth logo in a circle, in place of the hero doodles. */}
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface md:hidden"
          >
            <ToothSVG className="h-6 w-auto text-ink" style={{ fill: 'currentColor' }} focusable="false" />
          </span>
          maybespecial
        </Link>

        <div className="flex items-center gap-space-7">
          <ul className="flex items-center gap-space-6 sm:gap-space-7">
            {showWork && (
              <li>
                <Link to={{ pathname: '/', hash: '#work' }} onClick={sectionClick('/', 'work')} className={`${linkBase} border-b-2 border-transparent text-ink hover:text-accent`}>
                  Work
                </Link>
              </li>
            )}
            <li>
              <NavLink to="/about" className={navClass}>About</NavLink>
            </li>
            <li>
              <NavLink to="/blog" className={navClass}>Blog</NavLink>
            </li>
            <li>
              <Link
                to={{ pathname: contactPath, hash: '#contact' }}
                onClick={sectionClick(contactPath, 'contact')}
                className={`${linkBase} border-b-2 border-transparent text-ink hover:text-accent`}
              >
                Contact
              </Link>
            </li>
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}

export default Header
