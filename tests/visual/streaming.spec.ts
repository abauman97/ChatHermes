import { expect, test } from '@playwright/test'

// Only plugin data is mocked. The host dashboard, authentication, React SDK
// mount, Vue bundle and styles must all come from the actual Hermes dashboard.
test('ordered streamed turn, reload, scroll and disclosures in dashboard plugin', async ({ page }, testInfo) => {
  const api = '/api/plugins/chathermes'
  let completed = false
  const history = [
    { id: 'user', role: 'user', content: 'Inspect this project' },
    { id: 'plan', role: 'assistant', content: '', reasoning_content: 'Inspecting files', tool_calls: [{ id: 'call', function: { name: 'terminal', arguments: '{"command":"test"}' } }] },
    { id: 'result', role: 'tool', tool_call_id: 'call', tool_name: 'terminal', content: '{"output":"test output","exit_code":0}' },
    { id: 'reply', role: 'assistant', reasoning_content: 'Explain findings', content: '**Finished**' },
  ]
  await page.route(`**${api}/**`, async route => {
    const path = new URL(route.request().url()).pathname.slice(api.length)
    if (path.endsWith('/chat/stream')) return route.fallback()
    let body: unknown = {}
    if (path === '/profiles') body = { profiles: [{ name: 'test-profile' }] }
    else if (path === '/projects') body = { projects: [], scoped_session_ids: [] }
    else if (path === '/api/sessions' && route.request().method() === 'POST') body = { id: 'stream-test' }
    else if (path === '/api/sessions') body = { sessions: [{ id: 'stream-test', title: 'Streaming test' }] }
    else if (path.endsWith('/messages')) body = completed ? history : []
    else if (path === '/v1/capabilities') body = { features: { session_chat_streaming: true }, endpoints: { session_chat_stream: { method: 'POST', path: '/api/sessions/{session_id}/chat/stream' } } }
    else if (path === '/v1/models') body = { data: [{ id: 'Instant' }], default_model: 'Instant' }
    else if (path === '/api/model/options') body = { providers: [], model: 'Instant', provider: '' }
    return route.fulfill({ json: body })
  })
  await page.addInitScript(() => {
    const original = window.fetch.bind(window)
    const state = window as unknown as { emitFrame: (event: string, data: unknown) => void; finishFrames: () => void }
    window.fetch = (input, init) => {
      if (String(input).includes('/api/plugins/chathermes/') && String(input).endsWith('/chat/stream')) {
        const encoder = new TextEncoder()
        return Promise.resolve(new Response(new ReadableStream({ start(controller) {
          state.emitFrame = (event, data) => controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
          state.finishFrames = () => controller.close()
        } }), { headers: { 'content-type': 'text/event-stream' } }))
      }
      return original(input, init)
    }
  })
  await page.goto('/login?next=/chathermes')
  await page.getByLabel('Username').fill('tester')
  await page.getByLabel('Password', { exact: true }).fill('chathermes-local-test')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page.locator('.chathermes-embedded')).toBeVisible()
  const textarea = page.getByRole('textbox', { name: 'Message Hermes' })
  await textarea.fill('Inspect this project')
  await page.getByRole('button', { name: 'Send message', exact: true }).click()
  const emit = async (event: string, data: unknown) => page.evaluate(({ event, data }) => {
    (window as unknown as { emitFrame: (event: string, data: unknown) => void }).emitFrame(event, data)
  }, { event, data })
  await expect(page.locator('.message.user').last()).toContainText('Inspect this project')
  await textarea.click(); await expect(textarea).toBeFocused()
  await emit('reasoning.delta', { delta: 'Inspecting files' })
  await emit('tool.started', { tool_call_id: 'call', tool_name: 'terminal', args: { command: 'test' } })
  await expect(page.locator('.activity[open]')).toHaveCount(1)
  await page.screenshot({ path: testInfo.outputPath('tool-running.png') })
  await emit('tool.progress', { tool_call_id: 'call', delta: 'test output\n'.repeat(300) })
  const output = page.locator('.activity[open] pre')
  expect(await output.evaluate(element => element.clientHeight)).toBeLessThanOrEqual(240)
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth', await page.locator('body').evaluate(element => element.clientWidth))
  await emit('tool.completed', { tool_call_id: 'call', output: 'test output', duration_s: 1.8 })
  await emit('reasoning.delta', { delta: 'Explain findings\n'.repeat(200) })
  await expect(page.locator('.activity[open]')).toHaveCount(1)
  const transcript = page.getByRole('log', { name: 'Conversation' })
  await transcript.evaluate(element => { element.scrollTop = 0; element.dispatchEvent(new Event('scroll')) })
  const before = await transcript.evaluate(element => element.scrollTop)
  await emit('assistant.delta', { delta: '**Finished**\n\n' + 'More detail\n\n'.repeat(80) })
  // Once there is enough history to scroll, streaming respects reader position.
  await transcript.evaluate(element => { element.scrollTop = 0; element.dispatchEvent(new Event('scroll')) })
  await emit('assistant.delta', { delta: 'End' })
  expect(await transcript.evaluate(element => element.scrollTop)).toBe(before)
  await expect(page.locator('.activity[open]')).toHaveCount(0)
  await page.locator('.activity summary').first().click()
  await expect(page.locator('.activity[open]')).toHaveCount(1)
  await page.screenshot({ path: testInfo.outputPath('reasoning-expanded.png') })
  completed = true
  await emit('assistant.completed', { content: '**Finished**' }); await emit('run.completed', {})
  await page.evaluate(() => (window as unknown as { finishFrames: () => void }).finishFrames())
  await expect(page.getByRole('button', { name: 'Send message', exact: true })).toBeVisible()
  await expect(page.locator('.activity')).toHaveCount(3)
  await page.screenshot({ path: testInfo.outputPath('completed.png') })
  await page.reload()
  await expect(page.locator('.activity')).toHaveCount(3)
  await expect(page.locator('.activity[open]')).toHaveCount(0)
  await expect(page.locator('.message.assistant').last()).toContainText('Finished')
  await page.screenshot({ path: testInfo.outputPath('reloaded.png') })
})
