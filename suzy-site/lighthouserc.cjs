// Lighthouse CI: every page in the built sitemap, mobile (Lighthouse's
// default), 3 runs each. The build fails if the median run scores below 95
// in any category. Run with `npm run lighthouse` after `npm run build`.
const fs = require('node:fs')

const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8')
const urls = [...sitemap.matchAll(/<loc>https:\/\/maybespecial\.com(\/[^<]*)<\/loc>/g)].map(
  (m) => `http://localhost:5173${m[1]}`
)

const min95 = ['error', { minScore: 0.95, aggregationMethod: 'median-run' }]

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'node scripts/serve-dist.mjs',
      startServerReadyPattern: 'Serving dist',
      url: urls,
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': min95,
        'categories:accessibility': min95,
        'categories:best-practices': min95,
        'categories:seo': min95,
      },
    },
    // Reports stay with the CI run (uploaded as an artifact), not on a public server.
    upload: { target: 'filesystem', outputDir: '.lighthouseci/reports' },
  },
}
