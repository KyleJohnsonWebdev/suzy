// Interactions and routing. Theme and layout checks run in every project;
// the rest only need one (light-desktop).
import { test, expect } from '@playwright/test'

const onlyIn = (name) =>
  test.beforeEach(() => test.skip(test.info().project.name !== name, `runs in ${name} only`))

test('nav links and the theme toggle are at least 44px tall', async ({ page }) => {
  await page.goto('/about')
  const heights = await page.locator('nav a').evaluateAll((as) => as.map((a) => a.getBoundingClientRect().height))
  for (const h of heights) expect(h).toBeGreaterThanOrEqual(44)
  const toggle = await page.getByRole('button', { name: /Switch to (dark|light) theme/ }).boundingBox()
  expect(Math.round(toggle.width)).toBe(44)
  expect(Math.round(toggle.height)).toBe(44)
})

test('theme toggle: label, pressed state, saved choice survives reload', async ({ page }, info) => {
  const startsDark = info.project.use.colorScheme === 'dark'
  await page.goto('/')
  const toggle = page.getByRole('button', { name: /Switch to (dark|light) theme/ })
  await expect(toggle).toHaveAttribute('aria-label', startsDark ? 'Switch to light theme' : 'Switch to dark theme')
  await expect(toggle).toHaveAttribute('aria-pressed', String(startsDark))
  await toggle.click()
  const next = startsDark ? 'light' : 'dark'
  await expect(page.locator('html')).toHaveAttribute('data-theme', next)
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(next)
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', next)
  await expect(toggle).toHaveAttribute('aria-pressed', String(next === 'dark'))
})

test('the tooth icons are linked and served', async ({ page, request }) => {
  await page.goto('/')
  for (const [selector, href] of [
    ['link[rel="icon"][type="image/svg+xml"]', '/favicon.svg'],
    ['link[rel="icon"][sizes="32x32"]', '/favicon.ico'],
    ['link[rel="apple-touch-icon"]', '/apple-touch-icon.png'],
  ]) {
    await expect(page.locator(selector)).toHaveAttribute('href', href)
    expect((await request.get(href)).status(), href).toBe(200)
  }
})

test.describe('navigation', () => {
  onlyIn('light-desktop')

  test('the hero offers two actions: entries (until there is work) and About', async ({ page }) => {
    await page.goto('/')
    const hero = page.locator('main section').first()
    const hasWork = (await page.locator('#work').count()) > 0
    const primary = hero.getByRole('link', { name: hasWork ? 'See my work' : 'Read entries' })
    await expect(primary).toBeVisible()
    await expect(hero.getByRole('link', { name: 'More about me' })).toHaveAttribute('href', '/about')
    await primary.click()
    await expect(page).toHaveURL(hasWork ? /\/#work$/ : /\/entries$/)
  })

  test('Recent Things links to all entries', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'All entries →' }).click()
    await expect(page).toHaveURL(/\/entries$/)
  })

  test('the current page is marked in the nav', async ({ page }) => {
    await page.goto('/about')
    await expect(page.locator('nav a[aria-current="page"]')).toHaveText('About')
  })

  test('Contact jumps to the Let\'s Connect band and moves focus there', async ({ page }) => {
    await page.goto('/entries')
    await page.getByRole('link', { name: 'Contact', exact: true }).click()
    await expect(page).toHaveURL(/\/#contact$/)
    await expect(page.locator('#contact')).toBeFocused()
    await expect(page.locator('#contact')).toBeInViewport()
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Name')).toBeFocused()
  })

  test('the old /contact address redirects to the band', async ({ page }) => {
    await page.goto('/contact')
    await expect(page).toHaveURL(/\/#contact$/)
    await expect(page.locator('#contact')).toBeInViewport()
  })

  test('unknown addresses get a 404 status and a noindex "Page not found"', async ({ page }) => {
    const response = await page.goto('/no-such-page')
    expect(response.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex')
  })

  test('the footer credits the site\'s designer, linking to his LinkedIn', async ({ page }) => {
    await page.goto('/')
    const credit = page.locator('footer').getByRole('link', { name: 'Kyle Johnson' })
    await expect(credit).toHaveAttribute('href', 'https://www.linkedin.com/in/kjohnson-dev/')
    await expect(credit).toHaveAttribute('target', '_blank')
    await expect(page.locator('footer')).toContainText('Site by Kyle Johnson')
  })

  test('social links appear only in the footer', async ({ page }) => {
    for (const path of ['/', '/about', '/entries']) {
      await page.goto(path)
      const outside = await page.evaluate(
        () =>
          [...document.querySelectorAll('a[href*="instagram.com"],a[href*="linkedin.com"],a[href*="threads.com"]')].filter(
            (a) => !a.closest('footer')
          ).length
      )
      expect(outside, path).toBe(0)
    }
  })
})

test.describe('contact form', () => {
  onlyIn('light-desktop')

  test('sends name, email and message to Formspree (mocked)', async ({ page }) => {
    let posted = null
    await page.route('https://formspree.io/**', (route) => {
      posted = route.request().postDataJSON()
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
    })
    await page.goto('/')
    await page.getByLabel('Name').fill('Test Person')
    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Message').fill('Hello')
    await page.getByRole('button', { name: 'Send message' }).click()
    await expect(page.getByText('Message sent — thank you.')).toBeVisible()
    expect(posted).toMatchObject({ name: 'Test Person', email: 'test@example.com', message: 'Hello', _subject: 'New message from Test Person' })
  })

  test('a failed send says so and keeps what was typed', async ({ page }) => {
    await page.route('https://formspree.io/**', (route) => route.fulfill({ status: 500, body: '{}' }))
    await page.goto('/')
    await page.getByLabel('Name').fill('Test Person')
    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Message').fill('Hello')
    await page.getByRole('button', { name: 'Send message' }).click()
    await expect(page.getByRole('alert')).toContainText('Something went wrong')
    await expect(page.getByLabel('Message')).toHaveValue('Hello')
  })
})
