import { defineConfig } from '@playwright/test'

// Tests run against the built, prerendered site (`npm run build` first),
// served the way GitHub Pages serves it.
const phone = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 }
const desktop = { viewport: { width: 1440, height: 900 } }

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: 'http://localhost:5173',
    browserName: 'chromium',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'light-desktop', use: { ...desktop, colorScheme: 'light' } },
    { name: 'dark-desktop', use: { ...desktop, colorScheme: 'dark' } },
    { name: 'light-phone', use: { ...phone, colorScheme: 'light' } },
    { name: 'dark-phone', use: { ...phone, colorScheme: 'dark' } },
  ],
  webServer: {
    command: 'node scripts/serve-dist.mjs',
    url: 'http://localhost:5173/sitemap.xml',
    reuseExistingServer: !process.env.CI,
  },
})
