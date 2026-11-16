# Quality baseline — before the refresh

**Measured:** November 16, 2026
**Site version:** commit `bea7f44` (the build deployed to maybespecial.com on that date)
**Purpose:** the "before" numbers for the maybespecial.com refresh. Nothing in the site was changed to produce them.

> This lives in `quality/`, not `docs/`. In this repo `docs/` is the published website: the deploy workflow deletes and rebuilds it on every push to `main`, so a file there would be lost (and served publicly).

## Lighthouse (mobile, median of 3 runs)

| Route | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` (live, maybespecial.com) | 96 | 94 | 100 | 90 | 2.24 s | 0.103 | 0 ms |
| `/` | 95 | 94 | 100 | 90 | 2.34 s | 0.103 | 0 ms |
| `/about` | 96 | **89** | 100 | 91 | 2.49 s | 0.073 | 0 ms |
| `/entries` | 98 | 94 | 100 | 90 | 2.35 s | 0.003 | 0 ms |
| `/entry/a-promise` | 98 | 94 | 100 | 90 | 2.34 s | 0.000 | 0 ms |
| `/contact` | 97 | 94 | 100 | 90 | 2.34 s | 0.070 | 0 ms |

Every route is below the 95 target in Accessibility and SEO. Performance passes everywhere.

### How these were measured

On the live site, only `/` can be tested: every other URL returns GitHub's 404 page (see **Critical** below). So every route, including `/`, was also measured by serving the exact deployed files (`docs/` at `bea7f44`) locally on `localhost:3333`. Only the five app routes fell back to `index.html`; every other missing file (`robots.txt`, `sitemap.xml`) returned a 404, as GitHub Pages does. That port is one of the origins her Sanity project allows, so each page loaded her real, live content. Local `/` matches live `/` within run-to-run noise, which confirms the method.

- Lighthouse 12.6.0, default mobile settings (simulated throttling, Moto G Power emulation), headless Chrome 157, 3 runs per route, median reported. All 18 local runs and 3 live runs completed without errors, and with no console errors.
- axe-core 4.10.3 via `@axe-core/playwright`, tags `wcag2a wcag2aa wcag21a wcag21aa wcag22aa`, on every route in light and dark color schemes, at phone (390×844) and desktop (1440×900) sizes. Scanned after the network went idle plus 1.5 s, so Sanity content was on the page.

## Critical: every page except the home page 404s when opened directly

| URL | HTTP status on maybespecial.com |
| --- | --- |
| `/` | 200 |
| `/about` | **404** |
| `/entries` | **404** |
| `/contact` | **404** |
| `/entry/a-promise` | **404** |

The site is a single-page React app on GitHub Pages, and nothing tells GitHub Pages to serve `index.html` for the app's routes. Clicking around from the home page works, but a shared link, a bookmark, a page refresh or a search engine visiting any page other than `/` gets "404 — File not found". As far as search engines can tell, the site has one page.

## Accessibility (axe, WCAG 2.2 AA)

Light and dark results are identical: the site has no dark theme yet. Phone and desktop are identical too.

| Route | Violations (elements) |
| --- | --- |
| `/` | color-contrast (2) |
| `/about` | color-contrast (10), link-in-text-block (1) |
| `/entries` | color-contrast (2) |
| `/entry/a-promise` | color-contrast (2) |
| `/contact` | color-contrast (6) |

Every failure comes from three text colors on the `#FAFAF8` page background:

| Text color | Class | Contrast | Needs | Where |
| --- | --- | --- | --- | --- |
| `#C0BEF5` lavender | `text-lavender` | **1.68:1** | 4.5:1 | The active nav link in the header (About, Entries, Contact pages); About's social links (@maybespecial, LinkedIn, Threads) and "Contact →" |
| `#8B8B89` | `text-warm-black/50` | **3.26:1** | 4.5:1 | "© 2026 Maybe Special" in the footer (every page); "View entries ↓" on Home; Contact's "Response within a few days." and its Instagram, LinkedIn and Threads links |
| `#757573` | `text-warm-black/60` | **4.41:1** | 4.5:1 | About's fact labels (Instagram, LinkedIn, Threads, Get in touch); "← Back to entries" |

Also on `/about`, the "Contact →" link is distinguished only by color (2.62:1 against the surrounding text, which needs 3:1 or an underline).

Lavender text on off-white is the contrast failure the brand book calls out by name.

## SEO

| Check | Status |
| --- | --- |
| Pages reachable by direct URL | Only `/` (see **Critical**) |
| `<title>` | `maybe_special` on every route: not unique, and a spelling the brand book rules out |
| Meta description | Missing on every route |
| Open Graph / social preview tags | None |
| `robots.txt` | None (404) |
| `sitemap.xml` | None (404) |
| HTML before JavaScript runs | An empty `<div id="root">`: crawlers and link previews that don't run JavaScript see no content |
| Favicon | The default Vite logo (`/vite.svg`) |

## Performance

Performance passes, but these are worth fixing while the code is open:

- **Layout shift on `/` (CLS 0.103):** just over Google's 0.1 "good" threshold. Smaller shifts on `/about` (0.073) and `/contact` (0.070).
- **No preconnect to Sanity's CDN:** est. 50–340 ms saved per route; on `/about`, preloading the portrait (the LCP image) could save about 540 ms more.
- **Render-blocking CSS:** about 150 ms.
- **Unused JavaScript:** about 56–58 KiB per route.
- **Short cache lifetimes:** GitHub Pages serves assets with a 10-minute cache. That's a hosting setting, not a code fix.

## Noticed, not scored

These affect the refresh but aren't Lighthouse or axe failures:

- **Home bio is third person** ("Suzanne Johnson has over 20 years'…"). The brand book asks for first person and "Suzy", not "Suzanne". That copy lives in Sanity, so it's hers to rewrite.
- **Tooth doodles:** one sits on the hero headline, and more than three are visible on one desktop screen. The brand allows at most three per screen, never behind text.
- **No dark theme**, and no theme toggle.

## Screenshots

The home page before any change, in `quality/screenshots/before/`, full page, desktop (1440 px) and phone (390 px). Light and dark look the same because the site has no dark theme.

- `home-light-desktop.png`, `home-dark-desktop.png`
- `home-light-phone.png`, `home-dark-phone.png`
