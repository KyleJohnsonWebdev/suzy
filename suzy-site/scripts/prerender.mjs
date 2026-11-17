// Prerenders every page of the built site into static HTML, after `vite build`.
//
// GitHub Pages can only serve files, so without this every address except "/"
// was a 404, and crawlers and link previews saw an empty page. For each route
// (the fixed pages plus every published entry in Sanity) this loads the built
// app in headless Chromium, waits for its Sanity content, and saves:
//   - the rendered HTML, with its <head> tags (title, description, Open Graph)
//   - the Sanity data it used (window.__SANITY_DATA__), so the visitor's browser
//     hydrates the same markup and then refreshes the content live
// Files are written as about.html, entry/<slug>.html…: GitHub Pages serves
// /about from about.html with no redirect. Also writes 404.html (the plain app,
// for anything not prerendered, e.g. an entry published since the last build),
// sitemap.xml and robots.txt.
//
// Any page that fails to load its content fails the build, so a broken
// snapshot is never deployed.
import fs from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const DIST = fileURLToPath(new URL('../dist/', import.meta.url))
const SITE_URL = 'https://maybespecial.com'
const SANITY_QUERY_URL = 'https://ygagsfm8.apicdn.sanity.io/v2024-01-01/data/query/production'
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i

const MIME = {
  '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.txt': 'text/plain', '.json': 'application/json', '.ico': 'image/x-icon',
}

async function sanity(query) {
  const res = await fetch(`${SANITY_QUERY_URL}?query=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`)
  return (await res.json()).result
}

// Same filter as ENTRIES_QUERY in src/queries: every entry the site lists.
const content = await sanity(`{
  "entries": *[_type == "entry" && defined(publishedAt) && defined(slug.current)] | order(publishedAt desc){ "slug": slug.current, _updatedAt },
  "pages": *[_type == "page" && slug.current in ["home", "about"]]{ "slug": slug.current, _updatedAt },
  "latestEntry": *[_type == "entry"] | order(_updatedAt desc)[0]._updatedAt
}`)

const pageUpdated = Object.fromEntries(content.pages.map((p) => [p.slug, p._updatedAt]))
const routes = [
  { route: '/', file: 'index.html', lastmod: pageUpdated.home },
  { route: '/about', file: 'about.html', lastmod: pageUpdated.about },
  { route: '/entries', file: 'entries.html', lastmod: content.latestEntry },
]
for (const e of content.entries) {
  if (!SLUG.test(e.slug)) {
    console.warn(`Skipping entry with an unusual slug: ${JSON.stringify(e.slug)}`)
    continue
  }
  routes.push({ route: `/entry/${e.slug}`, file: `entry/${e.slug}.html`, lastmod: e._updatedAt })
}

// The built app shell, kept in memory: every route is rendered from it.
const template = await fs.readFile(path.join(DIST, 'index.html'), 'utf8')

const server = http.createServer(async (req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  const ext = path.extname(urlPath)
  if (!ext) {
    res.writeHead(200, { 'content-type': 'text/html' }).end(template)
    return
  }
  const file = path.join(DIST, path.normalize(urlPath))
  if (!file.startsWith(DIST)) return res.writeHead(403).end()
  try {
    const body = await fs.readFile(file)
    res.writeHead(200, { 'content-type': MIME[ext] || 'application/octet-stream' }).end(body)
  } catch {
    res.writeHead(404).end()
  }
})
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const base = `http://127.0.0.1:${server.address().port}`

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
await context.addInitScript(() => {
  window.__PRERENDER__ = true
})
// Sanity only accepts requests from approved origins. Fetch on the page's
// behalf (from Node, no CORS) and hand the response back with CORS allowed.
await context.route(/^https:\/\/ygagsfm8\.apicdn\.sanity\.io\//, async (route) => {
  const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*' }
  if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors })
  // Drop the page's Origin/Referer: a server-side request has none, and Sanity
  // rejects the local prerender origin.
  const headers = { ...route.request().headers() }
  delete headers.origin
  delete headers.referer
  const response = await route.fetch({ headers })
  await route.fulfill({ response, headers: { ...response.headers(), ...cors } })
})

const LINE_SEP = new RegExp('\\u2028', 'g')
const PARA_SEP = new RegExp('\\u2029', 'g')
const safeJson = (value) =>
  JSON.stringify(value).replace(/</g, '\\u003c').replace(LINE_SEP, '\\u2028').replace(PARA_SEP, '\\u2029')

let failures = 0
for (const { route, file } of routes) {
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (err) => errors.push(err.message))
  page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()))
  page.on('requestfailed', (req) => errors.push(`request failed: ${req.url().slice(0, 80)} (${req.failure()?.errorText})`))
  try {
    await page.goto(base + route, { waitUntil: 'networkidle' })
    await page.waitForFunction(
      () => document.querySelector('#root')?.children.length > 0 && !document.querySelector('[data-loading]'),
      null,
      { timeout: 20000 }
    )
    await page.waitForLoadState('networkidle')

    const problem = await page.evaluate(() => {
      const text = document.querySelector('main')?.innerText || ''
      if (/couldn't load|not found|Unknown entry type/i.test(text)) return text.slice(0, 120)
      if (!document.querySelector('meta[name="description"]')?.content) return 'no meta description'
      return null
    })
    if (problem) throw new Error(`${problem}${errors.length ? ` [${errors.join(' | ').slice(0, 400)}]` : ''}`)
    if (errors.length) throw new Error(`console errors: ${errors.join(' | ').slice(0, 300)}`)

    // React renders "© {year} Maybe Special" as separate text nodes, but saved
    // HTML merges them, and hydration then fails with a text mismatch. React's
    // own server rendering separates adjacent text with <!-- -->; do the same.
    await page.evaluate(() => {
      const walk = (el) => {
        for (const node of [...el.childNodes]) {
          if (node.nodeType === Node.TEXT_NODE && node.previousSibling?.nodeType === Node.TEXT_NODE) {
            el.insertBefore(document.createComment(' '), node)
          }
          if (node.nodeType === Node.ELEMENT_NODE) walk(node)
        }
      }
      walk(document.getElementById('root'))
    })

    const data = await page.evaluate(() => window.__SANITY_DATA__ || {})
    let html = await page.content()
    const dataScript = `<script>window.__SANITY_DATA__=${safeJson(data)}</script>`
    if (!html.includes('<script type="module"')) throw new Error('module script not found in output')
    html = html.replace('<script type="module"', `${dataScript}\n    <script type="module"`)

    const out = path.join(DIST, file)
    await fs.mkdir(path.dirname(out), { recursive: true })
    await fs.writeFile(out, `<!doctype html>\n${html.replace(/^<!doctype html>\s*/i, '')}`)
    const title = await page.title()
    console.log(`✓ ${route.padEnd(28)} → ${file.padEnd(28)} "${title}"`)
  } catch (err) {
    failures++
    console.error(`✗ ${route}: ${err.message}`)
  } finally {
    await page.close()
  }
}

await browser.close()
server.close()
if (failures) {
  console.error(`\nPrerender failed for ${failures} page(s); not writing the rest of the output.`)
  process.exit(1)
}

// 404.html: the plain app shell. GitHub Pages serves it (with a 404 status)
// for any address without a file, so new entries still open for visitors
// until the next build prerenders them.
await fs.writeFile(
  path.join(DIST, '404.html'),
  template.replace('</head>', '    <meta name="robots" content="noindex" />\n  </head>')
)

const day = (iso) => (iso ? `\n    <lastmod>${iso.slice(0, 10)}</lastmod>` : '')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url>\n    <loc>${SITE_URL}${r.route}</loc>${day(r.lastmod)}\n  </url>`).join('\n')}
</urlset>
`
await fs.writeFile(path.join(DIST, 'sitemap.xml'), sitemap)
await fs.writeFile(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)

console.log(`\nPrerendered ${routes.length} pages; wrote 404.html, sitemap.xml, robots.txt.`)
