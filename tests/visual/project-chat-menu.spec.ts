import { expect, test } from '@playwright/test'
import { signIn } from './login'

// Adapted from PR61 while retaining PR60's project management menu.
test('project screen actions preserve management, scope and draft selection', async ({ page }, info) => {
  await signIn(page)
  const plugin = page.locator('.chathermes-embedded')
  const mobile = info.project.name === 'mobile'
  const openNav = async () => { if (mobile) await plugin.getByRole('button', { name: 'Open navigation', exact: true }).click() }
  await openNav()
  await plugin.getByRole('combobox', { name: 'Profile', exact: true }).selectOption('test-profile')
  await openNav()
  await plugin.getByRole('button', { name: 'Projects', exact: true }).click()
  const options = plugin.getByRole('button', { name: 'Screen options', exact: true })
  const menu = plugin.getByRole('menu', { name: 'Screen options' })
  await options.click()
  await expect(menu.getByRole('menuitem')).toHaveText(['Active projects', 'Archived projects'])
  await menu.screenshot({ path: info.outputPath('projects-list-menu.png') })
  await page.keyboard.press('Escape'); await expect(options).toBeFocused()
  const workspace = '/tmp/chathermes-issue7-runtime/workspace-a'
  const tree = await (await page.request.get('/api/plugins/chathermes/projects?profile=test-profile')).json()
  const existing = tree.projects.find((row: { path?: string }) => row.path === workspace)
  if (existing) await plugin.getByRole('button', { name: existing.label, exact: true }).click()
  else {
    await plugin.getByRole('button', { name: 'New project', exact: true }).click()
    await plugin.getByLabel('Project name', { exact: true }).fill('Menu regression')
    await plugin.getByLabel('Folder (optional)', { exact: true }).fill(workspace)
    await plugin.getByRole('button', { name: 'Create project', exact: true }).click()
  }
  const detail = plugin.getByRole('region', { name: 'Selected Project' })
  await expect(detail).toBeVisible()
  const scope = new URL(page.url()).searchParams.get('project')!
  const composer = plugin.getByRole('textbox', { name: 'Message Hermes' })
  await composer.click(); await expect(composer).toBeFocused()
  let current = ''
  for (const screen of ['project', 'chat']) {
    await options.click()
    await expect(menu.getByRole('menuitem')).toHaveText(['New project chat', 'Edit instructions', 'Edit project', 'Archive project', 'Delete project'])
    await expect(menu.getByRole('menuitem', { name: 'New project chat', exact: true })).toBeEnabled()
    const styles = await menu.getByRole('menuitem').evaluateAll(items => items.slice(0, 4).map(item => {
      const css = getComputedStyle(item)
      return [css.color, css.backgroundColor, css.fontSize, css.padding, css.borderRadius, css.textAlign]
    }))
    for (const style of styles) expect(style).toEqual(styles[0])
    await menu.screenshot({ animations: 'disabled', path: info.outputPath(`${screen}-menu-items.png`) })
    await page.screenshot({ animations: 'disabled', path: info.outputPath(`${screen}-screen-menu.png`) })
    const created = page.waitForResponse(r => new URL(r.url()).pathname === '/api/plugins/chathermes/projects/session' && r.request().method() === 'POST')
    await menu.getByRole('menuitem', { name: 'New project chat', exact: true }).click()
    const response = await created
    expect(response.status()).toBe(201)
    const made = (await response.json()).session.id
    const requestScope = new URL(response.url()).searchParams
    expect(requestScope.get('project_id')).toBe(scope)
    expect(requestScope.get('profile')).toBe('test-profile')
    await expect(menu).toHaveCount(0)
    await expect(options).toBeFocused()
    if (screen === 'project') {
      await expect.poll(() => new URL(page.url()).searchParams.get('session')).toBe(made)
      current = made
      await expect(detail).toHaveCount(0)
      await composer.fill('Menu context check [workspace]')
      await expect(plugin.getByRole('button', { name: 'Send message', exact: true })).toBeEnabled()
      await plugin.getByRole('button', { name: 'Send message', exact: true }).click()
      await expect(plugin.locator('.message.assistant').last()).toContainText('Project context discovered.', { timeout: 60_000 })
    } else {
      expect(made).not.toBe(current)
      await expect.poll(() => new URL(page.url()).searchParams.get('session')).toBe(made)
      await expect(plugin.locator('.message.assistant')).toHaveCount(0)
    }
    expect(new URL(page.url()).searchParams.get('project')).toBe(scope)
    expect(new URL(page.url()).searchParams.get('profile')).toBe('test-profile')
    await composer.click(); await expect(composer).toBeFocused()
  }
  await openNav()
  await plugin.getByRole('combobox', { name: 'Profile', exact: true }).selectOption('default')
  await options.click()
  await expect(menu.getByRole('menuitem')).toHaveCount(0)
  await page.keyboard.press('Escape')
  await openNav()
  await plugin.locator('.drawer-chat').click()
  await expect.poll(() => new URL(page.url()).searchParams.has('session')).toBe(true)
  expect(new URL(page.url()).searchParams.has('project')).toBe(false)
  await composer.click(); await expect(composer).toBeFocused()
  await page.screenshot({ animations: 'disabled', path: info.outputPath('ordinary-chat.png') })
})
