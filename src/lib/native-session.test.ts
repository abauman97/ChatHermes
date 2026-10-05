// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useNativeSession } from './native-session'
import { api } from './hermes-api'
import { nativeOutcome } from './native-admission'
import type { NativeHooks } from './native-chat'
import { NativeError } from './native-chat'

const fake = vi.hoisted(() => ({ hooks: undefined as NativeHooks | undefined, rpc: vi.fn() }))
vi.mock('./native-chat', async importOriginal => {
  const original = await importOriginal<typeof import('./native-chat')>()
  return { ...original, NativeViewer: class {
    profile = 'alpha'; stored = 'one'; boundary = 10
    constructor(_profile: string, _stored: string, hooks: NativeHooks) { fake.hooks = hooks }
    async ensure() {
      fake.hooks!.snapshot({ session_id: 'runtime', messages: [], running: false,
        recovery: { epoch: 'epoch', through: 0, base_row_ids: [], complete: true } } as any)
      fake.hooks!.connection('open'); fake.hooks!.recovered()
    }
    rpc = fake.rpc
    close() {}
  } }
})
afterEach(() => { localStorage.clear(); vi.restoreAllMocks(); fake.rpc.mockReset() })
describe('native session state', () => {
  it('steering preserves earlier activity and routes its late tool completion once', async () => {
    vi.spyOn(api, 'messages').mockResolvedValue([]); fake.rpc.mockResolvedValue({ settled: false })
    const session = useNativeSession(vi.fn()); await session.attach('alpha', 'one')
    const event = (type: string, payload: any) => fake.hooks!.event({ session_id: 'runtime', type, payload } as any)
    fake.hooks!.input('Question', false)
    event('reasoning.delta', { text: 'Before correction' })
    event('tool.start', { tool_id: 'call', name: 'terminal' })
    fake.hooks!.input('Correction', true)
    event('tool.complete', { tool_id: 'call', name: 'terminal', result_text: 'Done' })
    event('message.complete', { text: 'Corrected answer', status: 'complete' })
    expect(session.messages.value.map(row => row.content)).toEqual(['Question', 'Correction'])
    expect(session.messages.value[0]!.blocks![1]).toMatchObject({ id: 'call', complete: true, output: 'Done' })
    expect(session.messages.value[1]!.blocks).toEqual([expect.objectContaining({ kind: 'text', content: 'Corrected answer' })])
    session.close()
  })
  it('retains a failed inflight fallback without making it busy or doubling saved partial text', async () => {
    vi.spyOn(api, 'messages').mockResolvedValue([]); fake.rpc.mockResolvedValue({ settled: false })
    const session = useNativeSession(vi.fn()); await session.attach('alpha', 'one')
    fake.hooks!.snapshot({ messages: [{ row_id: 1, role: 'user', text: 'Question' },
      { row_id: 2, role: 'assistant', text: 'Partial' }], running: false,
      inflight: { user: 'Question', assistant: 'Partial', error: 'Provider failed' },
      recovery: { complete: false, base_row_ids: null } } as any)
    fake.hooks!.recovered(); await session.hydrate()
    expect(session.busy.value).toBe(false)
    expect(session.error.value).toBe('Provider failed')
    expect(session.messages.value[0]!.blocks![0]!.content).toBe('Partial')
    session.close()
  })
  it('late delegated completion updates its parent after a subsequent turn starts', async () => {
    vi.spyOn(api, 'messages').mockResolvedValue([]); fake.rpc.mockResolvedValue({ settled: false })
    const session = useNativeSession(vi.fn()); await session.attach('alpha', 'one')
    const event = (type: string, payload: any) => fake.hooks!.event({ session_id: 'runtime', type, payload } as any)
    fake.hooks!.input('First', false)
    event('subagent.start', { subagent_id: 'child', status: 'running' })
    event('message.complete', { text: 'Parent done', status: 'complete' })
    fake.hooks!.input('Second', false); event('message.start', {})
    event('subagent.complete', { subagent_id: 'child', status: 'completed', summary: 'Child done' })
    expect(session.messages.value[0]!.blocks![0]).toMatchObject({ id: 'subagent-child', complete: true, output: 'Child done' })
    expect(session.messages.value[1]!.blocks).toEqual([])
    session.close()
  })
  it('a rejected local prompt does not remove a different viewer’s admitted turn', async () => {
    vi.spyOn(api, 'messages').mockResolvedValue([])
    let reject!: (error: Error) => void
    fake.rpc.mockImplementation((method: string) => method === 'chat.submit'
      ? new Promise((_resolve, fail) => { reject = fail }) : Promise.resolve({ settled: true }))
    const session = useNativeSession(vi.fn()); await session.attach('alpha', 'one')
    const pending = session.submit('Local question', 'Local question', {})
    fake.hooks!.input('Other viewer question', false, 'foreign-attempt')
    fake.hooks!.event({ type: 'message.start', session_id: 'runtime' } as any)
    reject(new NativeError('Session busy', 'rejected'))
    await expect(pending).rejects.toThrow('Session busy')
    expect(session.messages.value.map(row => row.content)).toEqual(['Other viewer question'])
    expect(session.busy.value).toBe(true)
    expect(session.uncertain.value).toBe(false)
    session.close()
  })
  it('foreground reconnect never polls a pending submission or submits it twice', async () => {
    vi.spyOn(api, 'messages').mockResolvedValue([])
    let acknowledge!: (value: unknown) => void
    fake.rpc.mockImplementation((method: string) => method === 'chat.submit'
      ? new Promise(resolve => { acknowledge = resolve }) : Promise.resolve({ settled: true }))
    const session = useNativeSession(vi.fn()); await session.attach('alpha', 'one')
    const pending = session.submit('Question', 'Question', {})
    expect(nativeOutcome('alpha', 'one')).toBe(true)
    // Healthy reconnect checks the existing connection only; no status RPC.
    fake.hooks!.connection('open')
    acknowledge({ outcome: 'accepted' }); await pending
    expect(nativeOutcome('alpha', 'one')).toBe(false)
    expect(fake.rpc.mock.calls.filter(([method]) => method === 'chat.submit')).toHaveLength(1)
    expect(fake.rpc.mock.calls.some(([method]) => method === 'chat.status')).toBe(false)
    session.close()
  })
  it('a lost acknowledgement remains locked across close and reattachment', async () => {
    vi.spyOn(api, 'messages').mockResolvedValue([])
    fake.rpc.mockImplementation((method: string) => method === 'chat.submit'
      ? Promise.reject(new Error('connection lost')) : Promise.resolve({ settled: true }))
    const session = useNativeSession(vi.fn()); await session.attach('alpha', 'one')
    await expect(session.submit('Question', 'Question', {})).rejects.toThrow('connection lost')
    session.close(); await session.attach('alpha', 'one')
    expect(session.uncertain.value).toBe(true)
    await expect(session.submit('Question', 'Question', {})).rejects.toMatchObject({ outcome: 'rejected' })
    session.close()
  })
  it('fresh recovery restores activity and output without using inflight text twice', async () => {
    vi.spyOn(api, 'messages').mockResolvedValue([])
    fake.rpc.mockResolvedValue({ settled: true })
    const session = useNativeSession(vi.fn()); await session.attach('alpha', 'one')
    fake.hooks!.snapshot({ messages: [], running: true, inflight: { user: 'Question', assistant: 'Hello' },
      recovery: { complete: true, base_row_ids: [] } } as any)
    fake.hooks!.input('Question', false)
    const event = (type: string, payload: any) => fake.hooks!.event({ session_id: 'runtime', type, payload } as any)
    event('reasoning.delta', { text: 'Think' }); event('reasoning.available', { text: 'Thinking' })
    event('tool.start', { tool_id: 'call', name: 'terminal', args: { command: 'pwd' } })
    event('tool.complete', { tool_id: 'call', name: 'terminal', result: { output: '/test' } })
    event('message.delta', { text: 'Hello' }); fake.hooks!.recovered()
    expect(session.messages.value).toHaveLength(1)
    expect(session.messages.value[0]!.blocks!.map(block => block.kind)).toEqual(['thinking', 'tool', 'text'])
    expect(session.messages.value[0]!.blocks![0]!.content).toBe('Thinking')
    expect(session.messages.value[0]!.blocks![2]!.content).toBe('Hello')
    expect(session.busy.value).toBe(true)
    session.close()
  })
})
