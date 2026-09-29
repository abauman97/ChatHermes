import { afterEach, describe, expect, it, vi } from 'vitest'
import { api, ApiError, messageText } from './hermes-api'
afterEach(() => vi.unstubAllGlobals())
describe('typed API client', () => {
  it('uses profile scoped paths and returns pagination', async () => {
    const fake = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => new Response(JSON.stringify({ object: 'list', data: [{ id: 'fake' }], limit: 30, offset: 30, has_more: false }), { status: 200, headers: { 'content-type': 'application/json' } }))
    vi.stubGlobal('fetch', fake)
    expect(await api.sessions('work', 30)).toMatchObject({ sessions: [{ id: 'fake' }], has_more: false, offset: 30 })
    expect(fake.mock.calls[0]?.[0]).toBe('/api/profiles/work/api/sessions?limit=30&offset=30')
  })
  it('unwraps create, read, rename and complete message history for two profiles', async () => {
    const fake = vi.fn(async (input: string, init?: RequestInit) => {
      const profile = input.includes('/alpha/') ? 'alpha' : 'beta'
      const offset = Number(new URL(input, 'http://localhost').searchParams.get('offset'))
      const value = input.includes('/messages')
        ? { object: 'list', session_id: `${profile}-one`, data: offset ? [{ id: `${profile}-last`, role: 'assistant', content: 'last' }] : Array.from({ length: 500 }, (_, i) => ({ id: `${profile}-${i}`, role: 'user', content: String(i) })), pagination: { limit: 500, offset, order: 'oldest', returned: offset ? 1 : 500 } }
        : { object: 'hermes.session', session: { id: `${profile}-one`, title: init?.method === 'PATCH' ? 'Renamed' : 'Original' } }
      return new Response(JSON.stringify(value), { status: 200 })
    })
    vi.stubGlobal('fetch', fake)
    for (const profile of ['alpha', 'beta']) {
      expect((await api.create(profile)).id).toBe(`${profile}-one`)
      expect((await api.session(profile, `${profile}-one`)).id).toBe(`${profile}-one`)
      expect((await api.rename(profile, `${profile}-one`, 'Renamed')).title).toBe('Renamed')
      const messages = await api.messages(profile, `${profile}-one`)
      expect(messages).toHaveLength(501)
      expect(messages.at(-1)?.id).toBe(`${profile}-last`)
    }
    expect(fake.mock.calls.filter(([input]) => String(input).includes('/messages')).map(([input]) => new URL(String(input), 'http://localhost').searchParams.get('offset'))).toEqual(['0', '500', '0', '500'])
  })
  it('rejects malformed history instead of silently replacing it with an empty list', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ object: 'list', data: null }), { status: 200 })))
    await expect(api.messages('alpha', 'one')).rejects.toThrow('Invalid Hermes messages response')
  })
  it('preserves HTTP status for safe error handling', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 401 })))
    await expect(api.profiles()).rejects.toMatchObject({ status: 401 } satisfies Partial<ApiError>)
  })
  it('extracts text without interpreting HTML', () => {
    expect(messageText([{ type: 'text', text: '<script>fake</script>' }])).toBe('<script>fake</script>')
  })
})
