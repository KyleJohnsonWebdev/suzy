# Quality: before and after the refresh

**Before:** measured November 16, 2026, on the build deployed at commit `bea7f44` (see [baseline.md](baseline.md)).
**After:** measured November 17, 2026, on the live site, maybespecial.com, after the refresh deployed (commit `d6d9bd5`).

Both use the same method: Lighthouse 12.6.0, mobile (default settings), median of 3 runs per page, and axe-core (WCAG 2.2 AA) in light and dark at phone and desktop sizes.

## Before → after

| Route | Category | Before | After | Date measured (before / after) |
| --- | --- | --- | --- | --- |
| `/` | Performance | 95 | 100 | Nov 16 / Nov 17, 2026 |
| `/` | Accessibility | 94 | 100 | Nov 16 / Nov 17, 2026 |
| `/` | Best Practices | 100 | 100 | Nov 16 / Nov 17, 2026 |
| `/` | SEO | 90 | 100 | Nov 16 / Nov 17, 2026 |
| `/about` | Performance | 96 | 95 | Nov 16 / Nov 17, 2026 |
| `/about` | Accessibility | 89 | 100 | Nov 16 / Nov 17, 2026 |
| `/about` | Best Practices | 100 | 100 | Nov 16 / Nov 17, 2026 |
| `/about` | SEO | 91 | 100 | Nov 16 / Nov 17, 2026 |
| `/entries` | Performance | 98 | 100 | Nov 16 / Nov 17, 2026 |
| `/entries` | Accessibility | 94 | 100 | Nov 16 / Nov 17, 2026 |
| `/entries` | Best Practices | 100 | 100 | Nov 16 / Nov 17, 2026 |
| `/entries` | SEO | 90 | 100 | Nov 16 / Nov 17, 2026 |
| `/entry/a-promise` | Performance | 98 | 100 | Nov 16 / Nov 17, 2026 |
| `/entry/a-promise` | Accessibility | 94 | 100 | Nov 16 / Nov 17, 2026 |
| `/entry/a-promise` | Best Practices | 100 | 100 | Nov 16 / Nov 17, 2026 |
| `/entry/a-promise` | SEO | 90 | 100 | Nov 16 / Nov 17, 2026 |

### Beyond the scores

| Measure | Before | After |
| --- | --- | --- |
| Pages that load from a direct link | 1 of 4 (`/about`, `/entries` and entries returned **404**) | 4 of 4 (HTTP 200) |
| axe violations (all pages, both themes, phone and desktop) | 17 elements: 16 color-contrast, 1 link-in-text-block | 0 |
| Content in the HTML before JavaScript (what crawlers and link previews read) | Home: 1 word, other pages: GitHub's 404 page | Every page: its full content, title, description, canonical URL and share tags |
| Meta descriptions, Open Graph tags, sitemap.xml, robots.txt | None | All pages, generated on every build |
| Layout shift (CLS) on `/` | 0.103 | 0 |
| Largest Contentful Paint on `/` | 2.34 s | 1.51 s |
| Dark theme | None | Follows the system setting, with a saved toggle |
| Quality checks | None | Every push: lint, contrast, schema, browser and axe tests on every page, Lighthouse 95+ (deploys only when all pass) |

### Notes

- **Before, inner pages were measured locally.** Every page but `/` returned 404 on the live site, so the baseline served the exact deployed files locally to measure them; the live `/` matched that method within run-to-run noise. After, every page is measured live.
- **About's performance meets the 95 target but is a point under its old 96.** Its largest element is the portrait, which loads from Sanity's image CDN; the three runs scored 94, 95 and 95. With Lighthouse 13 (used by Lighthouse CI) it scored 96 locally, and it passes CI's 95 gate.
- **Content is Suzy's as published on November 17, 2026.** Her drafts in Sanity (the bios moved between Home and About, and "Hi, I'm Suzy.") weren't published yet when this was measured.

## Screenshots

The home page, full length, before and after, in `screenshots/before/` and `screenshots/after/`: desktop (1440 px) and phone (390 px), light and dark. Before has no dark theme, so its light and dark shots match.

- `home-light-desktop.png`, `home-dark-desktop.png`
- `home-light-phone.png`, `home-dark-phone.png`
