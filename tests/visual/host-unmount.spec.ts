import { signIn } from './login'
import { expect, test } from '@playwright/test'

test('host navigation unmounts the plugin and restores viewport settings', async ({ page }, info) => {
  await signIn(page, '/sessions')
  await page.waitForURL(url => url.pathname === '/sessions')
  const original = await page.locator('meta[name="viewport"]').getAttribute('content')
  await page.evaluate(() => { document.documentElement.dataset.viewportProbe = 'same-document' })
  // Use the host React router's link, including when its drawer is hidden.
  await page.locator('a[href="/chathermes"]').first().evaluate((el: HTMLAnchorElement) => el.click())
  const plugin = page.locator('.chathermes-embedded')
  await expect(plugin).toBeVisible()
  await plugin.getByRole('textbox', { name: 'Message Hermes' }).click()
  await expect(plugin.getByRole('textbox', { name: 'Message Hermes' })).toBeFocused()
  expect(await page.locator('meta[name="viewport"]').getAttribute('content')).toContain('maximum-scale=1')
  expect(await plugin.locator('input,select,textarea').evaluateAll(elements => elements.every(el => parseFloat(getComputedStyle(el).fontSize) >= 16))).toBe(true)
  await page.screenshot({ path: info.outputPath('mounted-home.png') })
  await page.locator('a[href="/sessions"]').first().evaluate((el: HTMLAnchorElement) => el.click())
  await expect(plugin).toHaveCount(0)
  await expect(page).toHaveURL(/\/sessions$/)
  expect(await page.evaluate(() => document.documentElement.dataset.viewportProbe)).toBe('same-document')
  expect(await page.locator('meta[name="viewport"]').getAttribute('content')).toBe(original)
  await page.screenshot({ path: info.outputPath('host-restored.png') })
})
