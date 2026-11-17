// Serves dist/ the way GitHub Pages serves the site: /about → about.html,
// /entry/x → entry/x.html, folders → index.html, anything else → 404.html
// with a 404 status, and text files gzipped (as GitHub Pages does; Lighthouse's
// throttled load depends on transfer sizes). Used by the Playwright tests and Lighthouse CI.
// Port 5173 by default: one of the origins Sanity allows, so the pages'
// live refresh from Sanity works during tests.
import fs from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'

const DIST = fileURLToPath(new URL('../dist/', import.meta.url))
const PORT = Number(process.env.PORT || 5173)
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain',
  '.json': 'application/json', '.ico': 'image/x-icon',
}

const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.svg', '.xml', '.txt', '.json'])

async function file(rel) {
  const full = path.join(DIST, rel)
  if (!full.startsWith(DIST)) return null
  try {
    const stat = await fs.stat(full)
    return stat.isFile() ? full : null
  } catch {
    return null
  }
}

const server = http.createServer(async (req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  const rel = urlPath.replace(/^\/+/, '')
  const found =
    (await file(rel)) ||
    (!path.extname(rel) && (await file(`${rel.replace(/\/$/, '')}.html`))) ||
    (await file(path.join(rel, 'index.html')))
  const target = found || (await file('404.html'))
  if (!target) return res.writeHead(404).end('Not found')
  const ext = path.extname(target)
  const headers = { 'content-type': TYPES[ext] || 'application/octet-stream' }
  let body = await fs.readFile(target)
  if (COMPRESSIBLE.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
    body = zlib.gzipSync(body)
    headers['content-encoding'] = 'gzip'
    headers.vary = 'Accept-Encoding'
  }
  res.writeHead(found ? 200 : 404, headers)
  res.end(body)
})

server.listen(PORT, () => console.log(`Serving dist/ like GitHub Pages at http://localhost:${PORT}`))
