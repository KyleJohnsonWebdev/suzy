// Every page in the built sitemap, in all four projects (light/dark × desktop/phone).
import fs from 'node:fs'
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const SITE_URL = 'https://maybespecial.com'
const sitemap = fs.readFileSync(new URL('../dist/sitemap.xml', import.meta.url), 'utf8')
const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE_URL, '') || '/')

test('the sitemap lists the fixed pages', () => {
  expect(pages).toEqual(expect.arrayContaining(['/', '/about', '/blog']))
})

for (const path of pages) {
  test.describe(`page ${path}`, () => {
    test('loads and hydrates with no errors', async ({ page }) => {
      const errors = []
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
      page.on('pageerror', (e) => errors.push(e.message))
      const response = await page.goto(path)
      expect(response.status(), 'HTTP status').toBe(200)
      await page.waitForLoadState('networkidle')
      // React hydration mismatches (#418 etc.) and failed requests land here.
      expect(errors).toEqual([])
    })

    test('has no WCAG 2.2 AA violations (axe)', async ({ page }) => {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()
      const summary = violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`)
      expect(summary).toEqual([])
    })

    test('ships its title, description and share tags in the HTML', async ({ request }) => {
      // The raw HTML, before JavaScript: what crawlers and link previews read.
      const html = await (await request.get(path)).text()
      const meta = (attr, key) => html.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`))?.[1]
      const title = html.match(/<title>([^<]*)<\/title>/)?.[1]
      expect(title).toMatch(/^(maybespecial — Suzy Johnson|.+ — maybespecial)$/)
      const description = meta('name', 'description')
      expect(description, 'meta description').toBeTruthy()
      expect(description.length).toBeLessThanOrEqual(160)
      expect(html).toContain(`<link rel="canonical" href="${SITE_URL}${path}">`)
      expect(meta('property', 'og:title')).toBe(title)
      expect(meta('property', 'og:url')).toBe(`${SITE_URL}${path}`)
      expect(html).toContain('window.__SANITY_DATA__=')
      // Real content in the HTML, not an empty app shell.
      expect(html).toMatch(/<main[^>]*>[\s\S]*<h1/)
    })

    test('doodles stay decorative: at most three in view, none near text', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      const r = await page.evaluate(() => {
        const doodles = [...document.querySelectorAll('[style*="--doodle"]')]
        const inView = doodles
          .map((d) => d.getBoundingClientRect())
          .filter((b) => b.width > 0 && b.bottom > 0 && b.top < innerHeight)
        const text = [...document.querySelectorAll('h1,h2,h3,p,a,li,label,input,textarea,button,img')]
          .map((e) => e.getBoundingClientRect())
          .filter((b) => b.width > 0)
        const pad = 25 // the float animation's reach
        const near = inView.filter((d) =>
          text.some((t) => d.left - pad < t.right && d.right + pad > t.left && d.top - pad < t.bottom && d.bottom + pad > t.top)
        )
        return { inView: inView.length, near: near.length, hidden: doodles.every((d) => d.closest('[aria-hidden="true"]')) }
      })
      expect(r.inView).toBeLessThanOrEqual(3)
      expect(r.near).toBe(0)
      expect(r.hidden).toBe(true)
    })
  })
}
