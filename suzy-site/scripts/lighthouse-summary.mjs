// Turns Lighthouse CI's results into a Markdown table: each page's median-run
// scores (the run the 95 threshold is checked against) plus Core Web Vitals.
// In GitHub Actions it's appended to the run's summary page; locally it prints.
import fs from 'node:fs'

const dir = '.lighthouseci/reports'
const manifest = JSON.parse(fs.readFileSync(`${dir}/manifest.json`, 'utf8'))
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo']
const pct = (score) => Math.round(score * 100)
const mark = (score) => (pct(score) >= 95 ? `${pct(score)}` : `**${pct(score)} ✗**`)

const rows = manifest
  .filter((run) => run.isRepresentativeRun)
  .map((run) => {
    const lhr = JSON.parse(fs.readFileSync(run.jsonPath, 'utf8'))
    const audit = (id) => lhr.audits[id]?.displayValue ?? '—'
    const path = new URL(run.url).pathname
    return `| \`${path}\` | ${CATEGORIES.map((c) => mark(run.summary[c])).join(' | ')} | ${audit('largest-contentful-paint')} | ${audit('cumulative-layout-shift')} | ${audit('total-blocking-time')} |`
  })

const table = [
  '## Lighthouse (mobile, median of 3 runs; fails below 95)',
  '',
  '| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |',
  '| --- | --- | --- | --- | --- | --- | --- | --- |',
  ...rows,
  '',
  'Full reports are in this run’s **lighthouse-reports** artifact.',
  '',
].join('\n')

if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, table)
console.log(table)
