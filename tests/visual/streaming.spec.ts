import { signIn } from './login'
import { expect, test } from '@playwright/test'

// Only plugin data is mocked. The host dashboard, authentication, React SDK
// mount, Vue bundle and styles must all come from the actual Hermes dashboard.
test('ordered streamed turn, reload, scroll and disclosures in dashboard plugin', async ({ page }, testInfo) => {
  const api = '/api/plugins/chathermes'
  let completed = false
  const history = [
    { id: 'user', role: 'user', content: 'Inspect this project' },
    { id: 'plan', role: 'assistant', content: '', reasoning_content: 'Inspecting files', tool_calls: [{ id: 'call', function: { name: 'session_search', arguments: '{"command":"test"}' } }] },
    { id: 'result', role: 'tool', tool_call_id: 'call', tool_name: 'session_search', content: '{"output":"test output","exit_code":0}' },
    { id: 'reply', role: 'assistant', reasoning_content: 'Explain findings', content: '**Finished**' },
  ]
  await page.route(`**${api}/**`, async route => {
    const path = new URL(route.request().url()).pathname.slice(api.length)
    if (path.endsWith('/run_stream/events')) return route.fallback()
    let body: unknown = {}
    if (path === '/profiles') body = { profiles: [{ name: 'test-profile' }] }
    else if (path === '/projects') body = { projects: [], scoped_session_ids: [] }
    else if (path === '/api/sessions' && route.request().method() === 'POST') body = { id: 'stream-test' }
    else if (path === '/api/sessions') body = { sessions: [{ id: 'stream-test', title: 'Streaming test' }] }
    else if (path.endsWith('/messages')) body = completed ? history : []
    else if (path === '/v1/capabilities') body = { features: { run_events_sse: true }, endpoints: { runs: { method: 'POST', path: '/v1/runs' } } }
    else if (path === '/v1/runs') body = { run_id: 'run_stream', status: 'started' }
    else if (path === '/v1/runs/run_stream') body = { status: completed ? 'completed' : 'running' }
    else if (path === '/v1/models') body = { data: [{ id: 'Instant' }], default_model: 'Instant' }
    else if (path === '/api/model/options') body = { providers: [], model: 'Instant', provider: '' }
    return route.fulfill({ json: body })
  })
  await page.addInitScript(() => {
    const original = window.fetch.bind(window)
    const state = window as unknown as { emitFrame: (event: string, data: unknown) => void }
    window.fetch = (input, init) => {
      if (String(input).includes('/api/plugins/chathermes/') && String(input).includes('/run_stream/events')) {
        const encoder = new TextEncoder()
        return Promise.resolve(new Response(new ReadableStream({ start(controller) {
          state.emitFrame = (event, data) => controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
        } }), { headers: { 'content-type': 'text/event-stream' } }))
      }
      return original(input, init)
    }
  })
  await signIn(page, '/chathermes')
  await expect(page.locator('.chathermes-embedded')).toBeVisible()
  const textarea = page.getByRole('textbox', { name: 'Message Hermes' })
  await textarea.fill('Inspect this project')
  await page.getByRole('button', { name: 'Send message', exact: true }).click()
  const emit = async (event: string, data: unknown) => page.evaluate(({ event, data }) => {
    (window as unknown as { emitFrame: (event: string, data: unknown) => void }).emitFrame(event, data)
  }, { event, data })
  await expect(page.locator('.message.user').last()).toContainText('Inspect this project')
  await expect(page.locator('.work-summary .working-shimmer')).toHaveCSS('font-weight', '700')
  await expect(page.locator('.work-summary .working-shimmer')).toHaveCSS('color', 'rgb(180, 180, 180)')
  await expect(page.locator('.work-summary .working-shimmer')).toHaveCSS('animation-name', 'working-shimmer')
  await textarea.click(); await expect(textarea).toBeFocused()
  await page.waitForFunction(() => typeof (window as unknown as { emitFrame?: unknown }).emitFrame === 'function')
  await emit('reasoning.delta', { delta: 'Inspecting files' })
  await emit('tool.progress', { tool_name: 'session_search', delta: 'Early tool output' })
  await emit('tool.started', { tool_name: 'session_search', args: { command: 'test' } })
  await expect(page.locator('.activity')).toHaveCount(1)
  const summary = page.locator('.work-summary')
  const activeTool = summary.locator('.active-tool')
  await expect(summary).toHaveText('›Working…Using tool: Session search')
  await expect(activeTool).toHaveCSS('font-weight', '400')
  await expect(activeTool).toHaveCSS('animation-name', 'none')
  await expect(activeTool).toHaveCSS('-webkit-text-fill-color', 'rgb(244, 244, 244)')
  await expect(page.locator('.current-activity, .active-tool pre, .active-tool summary')).toHaveCount(0)
  await expect(page.locator('.activity[open]')).toHaveCount(0)
  await expect(activeTool).toHaveCSS('white-space', 'nowrap')
  const workingBounds = await summary.locator('.working-shimmer').boundingBox()
  const toolBounds = await activeTool.boundingBox()
  expect(toolBounds!.x).toBeGreaterThan(workingBounds!.x + workingBounds!.width)
  expect(Math.abs(toolBounds!.y - workingBounds!.y)).toBeLessThan(1)
  await expect(summary).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('.working-shimmer')).toHaveCount(1)
  await expect(page.getByRole('status')).toHaveText('Using tool: Session search')
  await textarea.click(); await expect(textarea).toBeFocused()
  await summary.click()
  await expect(page.locator('.work-timeline')).not.toContainText('Early tool output')
  await expect(page.locator('.work-timeline')).not.toContainText('"command"')
  await expect(activeTool).toBeVisible()
  await summary.click()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(summary.locator('.working-shimmer')).toHaveCSS('animation-name', 'none')
  await expect(activeTool).toHaveCSS('animation-name', 'none')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.screenshot({ path: testInfo.outputPath('tool-running.png') })
  await emit('tool.progress', { tool_name: 'session_search', delta: 'test output\n'.repeat(300) })
  await expect(activeTool).toHaveText('Using tool: Session search')
  await expect(page.locator('.current-activity pre')).toHaveCount(0)
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth', await page.locator('body').evaluate(element => element.clientWidth))
  await emit('tool.completed', { tool_name: 'session_search', output: 'test output', duration_s: 1.8 })
  await emit('approval.request', { request_id: 'approval-test' })
  await expect(page.locator('.work-summary')).toContainText('Waiting for approval')
  await expect(page.locator('.work-summary [role="status"]')).toHaveText('Waiting for approval')
  await expect(page.locator('.current-activity')).toHaveCount(0)
  await expect(page.locator('.activity').last()).not.toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('approval-waiting.png') })
  await emit('approval.responded', {})
  await emit('reasoning.delta', { delta: 'Explain findings\n'.repeat(200) })
  const transcript = page.getByRole('log', { name: 'Conversation' })
  await expect(page.locator('.activity[open]')).toHaveCount(1)
  await transcript.evaluate(element => { element.scrollTop = 0; element.dispatchEvent(new Event('scroll')) })
  const before = await transcript.evaluate(element => element.scrollTop)
  await emit('assistant.delta', { delta: '**Finished**\n\n' + 'More detail\n\n'.repeat(80) })
  // Once there is enough history to scroll, streaming respects reader position.
  await transcript.evaluate(element => { element.scrollTop = 0; element.dispatchEvent(new Event('scroll')) })
  await emit('assistant.delta', { delta: 'End' })
  expect(await transcript.evaluate(element => element.scrollTop)).toBe(before)
  await expect(page.locator('.activity[open]')).toHaveCount(0)
  await page.locator('.work-summary').click()
  await page.locator('.activity summary').first().click()
  await expect(page.locator('.activity[open]')).toHaveCount(1)
  await page.screenshot({ path: testInfo.outputPath('reasoning-expanded.png') })
  completed = true
  await emit('assistant.completed', { content: '**Finished**' }); await emit('run.completed', {})
  await expect(page.getByRole('button', { name: 'Send message', exact: true })).toBeVisible()
  await expect(page.locator('.activity')).toHaveCount(3)
  await expect(page.locator('.work-summary')).toContainText('Worked')
  await expect(page.locator('.work-summary')).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('.working-shimmer')).toHaveCount(0)
  await expect(page.locator('.activity').first()).not.toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('completed.png') })
  await page.locator('.work-summary').click()
  await expect(page.locator('.activity').first()).toBeVisible()
  await expect(page.locator('.activity[open]')).toHaveCount(0)
  await page.locator('.activity summary').nth(1).click()
  await expect(page.locator('.activity[open]')).toHaveCount(1)
  await expect(page.locator('.activity[open] pre')).toContainText('test output')
  await page.screenshot({ path: testInfo.outputPath('tool-expanded.png') })
  await page.reload()
  await expect(page.locator('.message.assistant').last()).toContainText('Finished')
  await expect(page.locator('.work-summary')).toContainText('Worked')
  await expect(page.locator('.work-summary')).toHaveAttribute('aria-expanded', 'false')
  await page.screenshot({ path: testInfo.outputPath('reloaded.png') })
})
