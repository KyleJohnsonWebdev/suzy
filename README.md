# maybespecial.com

The website for maybespecial, Suzy Johnson's design practice. It's a React site with content in Sanity, so she updates her own work, bio and blog posts without touching code.

- **Design guide:** [design/README.md](design/README.md) covers the design choices behind the November 2026 refresh: color, contrast, type, layout, the tooth doodles and the components.
- **Quality, before and after:** [quality/after.md](quality/after.md) has the Lighthouse scores, accessibility results and SEO checks, measured before and after the refresh.

## What's here

| Folder | What |
| --- | --- |
| `suzy-site/` | The site: React, Vite, Tailwind CSS, React Router. Each page is prerendered at build time, so its content is in the HTML before JavaScript runs. |
| `studio-suzy-website/` | The Sanity Studio where she edits content. |
| `design/` | The design guide. |
| `quality/` | Audit results and screenshots. |

## Running it

```sh
cd suzy-site
npm install
npm run dev            # local dev server
npm run build          # production build + prerender
npm run lint
npm run check:contrast # every text color pairing must pass WCAG AA
npm test               # Playwright browser and axe accessibility tests
```

Every push to `main` runs lint, the contrast check, the browser and accessibility tests and Lighthouse (95+ in every category). The site deploys to GitHub Pages only when they all pass.

Designed and built by [Kyle Johnson](https://github.com/KyleJohnsonWebdev).
