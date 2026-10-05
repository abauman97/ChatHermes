// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { appliedCursor, nativeFrame, NativeViewer } from './native-chat'
import { nativeOutcome, settleNativeOutcome, uncertainNativeOutcome } from './native-admission'
describe('bounded native recovery', () => {
  it('advances only to events actually returned, preserving an intervening writer', () => {
    expect(appliedCursor([{ seq: 1 }], 0)).toBe(1)
    expect(appliedCursor([{ seq: 2 }], 1)).toBe(2)
    expect(appliedCursor([], 2)).toBe(2)
  })
  it('retains call IDs, full results, final output and interruption status', () => {
    const frame = nativeFrame({ type: 'tool.complete', seq: 9, payload: { name: 'terminal', tool_id: 'call-1', result_text: 'full output' } }, 'stored')!
    expect(JSON.parse(frame.data)).toMatchObject({ run_id: 'workspace-stored', seq: 9, tool_call_id: 'call-1', output: 'full output' })
    expect(nativeFrame({ type: 'message.complete', payload: { status: 'interrupted' } }, 'stored')?.event).toBe('run.cancelled')
  })
  it('a detached viewer cannot open again or mint a ticket', async () => {
    const fetcher = vi.spyOn(globalThis, 'fetch')
    const viewer = new NativeViewer('a', 'stored')
    viewer.close()
    await expect(viewer.ensure()).rejects.toThrow('Viewer detached')
    expect(fetcher).not.toHaveBeenCalled()
    fetcher.mockRestore()
  })
  it('rejects a submit when no open socket can dispatch it', async () => {
    const viewer = new NativeViewer('a', 'stored')
    await expect(viewer.rpc('chat.submit', { input: 'hello' })).rejects.toMatchObject({ outcome: 'rejected' })
    viewer.close()
  })
  it('one tab acknowledgement cannot clear another uncertain attempt', () => {
    const a = uncertainNativeOutcome('same', 'session')
    const b = uncertainNativeOutcome('same', 'session')
    settleNativeOutcome('same', 'session', a)
    expect(nativeOutcome('same', 'session')).toBe(true)
    settleNativeOutcome('same', 'session', b)
    expect(nativeOutcome('same', 'session')).toBe(false)
  })
  it('persists uncertainty before admission without storing input and isolates profiles', () => {
    uncertainNativeOutcome('a', 'session')
    expect(nativeOutcome('a', 'session')).toBe(true)
    expect(nativeOutcome('b', 'session')).toBe(false)
    settleNativeOutcome('a', 'session')
    expect(nativeOutcome('a', 'session')).toBe(false)
  })
})
