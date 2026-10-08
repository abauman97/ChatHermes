import { describe, expect, it } from 'vitest'
import { createTurn, historyBlocks, mergeHistoryBlocks, normalizeEvent, reduceTurn, reduceNativeTurn } from './assistant-turn'
import type { SSEEvent } from './sse'
const frame = (event: string, data: unknown, id?: string): SSEEvent => ({ event, data: JSON.stringify(data), id })
function setup() {
  const turn = createTurn()
  const emit = (name: string, data: unknown = {}, id?: string) => { const event = normalizeEvent(frame(name, data, id)); if (event) reduceTurn(turn, event) }
  return { turn, emit }
}
describe('Hermes event normalization and ordered assistant turns', () => {
  it('streams plain text without requiring reasoning or tools', () => {
    const { turn, emit } = setup()
    emit('assistant.delta', { delta: '**Hello' }); emit('assistant.delta', { delta: '** world' }); emit('run.completed')
    expect(turn.blocks).toEqual([{ id: 'block-1', kind: 'text', content: '**Hello** world' }])
  })
  it('coalesces continuous reasoning and collapses it before text', () => {
    const { turn, emit } = setup()
    emit('tool.progress', { tool_name: '_thinking', delta: 'First ' }); emit('reasoning.delta', { delta: 'second' })
    expect(turn.blocks).toHaveLength(1)
    expect(turn.blocks[0]).toMatchObject({ content: 'First second', complete: false })
    emit('assistant.delta', { delta: 'Answer' })
    expect(turn.blocks[0]).toMatchObject({ kind: 'thinking', complete: true })
    expect(turn.blocks[1]).toMatchObject({ kind: 'text', content: 'Answer' })
  })
  it('keeps multiple reasoning phases, tools, and commentary in arrival order', () => {
    const { turn, emit } = setup()
    emit('reasoning.delta', { delta: 'Locate files' })
    emit('tool.started', { tool_call_id: 'a', tool_name: 'file_search', args: { query: 'config' } })
    emit('tool.completed', { tool_call_id: 'a', output: 'config.yaml', duration_s: 1.8 })
    emit('reasoning.available', { text: 'Read the file' })
    emit('assistant.commentary', { text: 'Checking configuration' })
    emit('tool.started', { tool_call_id: 'b', tool_name: 'read_file' })
    emit('tool.completed', { tool_call_id: 'b', output: 'contents' })
    emit('reasoning.delta', { delta: 'Now explain' }); emit('assistant.delta', { delta: 'Answer' })
    expect(turn.blocks.map(block => block.kind)).toEqual(['thinking', 'tool', 'thinking', 'text', 'tool', 'thinking', 'text'])
    expect(turn.blocks[1]).toMatchObject({ id: 'a', title: 'Searched files', duration: 1.8, output: 'config.yaml' })
    expect(turn.blocks.every(block => block.kind !== 'thinking' || block.complete)).toBe(true)
  })
  it('updates parallel calls by native ID even while text is arriving', () => {
    const { turn, emit } = setup()
    emit('tool.started', { tool_call_id: 'a', tool_name: 'terminal' }); emit('tool.started', { tool_call_id: 'b', tool_name: 'terminal' })
    emit('tool.progress', { tool_call_id: 'a', delta: 'A' }); emit('assistant.delta', { delta: 'Writing' })
    emit('tool.completed', { tool_call_id: 'b', output: 'B' })
    expect(turn.blocks[0]).toMatchObject({ id: 'a', state: 'running', output: 'A' })
    expect(turn.blocks[1]).toMatchObject({ id: 'b', complete: true, output: 'B' })
    expect(turn.blocks[2]?.kind).toBe('text')
  })
  it('matches sequential REST tools without native call IDs', () => {
    const { turn, emit } = setup()
    for (let i = 0; i < 3; i++) {
      emit('tool.started', { tool_name: 'terminal', args: { command: `echo ${i}` } })
      emit('tool.completed', { tool_name: 'terminal' })
    }
    expect(turn.blocks).toHaveLength(3)
    expect(new Set(turn.blocks.map(block => block.id)).size).toBe(3)
  })
  it('preserves failures and long structured output inside activity details', () => {
    const { turn, emit } = setup()
    const output = { error: 'Command failed', stderr: 'x'.repeat(100_000), exit_code: 1 }
    emit('tool.started', { tool_call_id: 'a', tool_name: 'terminal' }); emit('tool.failed', { tool_call_id: 'a', output })
    expect(turn.blocks[0]).toMatchObject({ state: 'failed', complete: true, output: JSON.stringify(output, null, 2) })
    expect(turn.blocks).toHaveLength(1)
  })
  it('deduplicates sequenced replay during a tool and during assistant text', () => {
    const { turn, emit } = setup()
    const start = { seq: 1, run_id: 'run', tool_call_id: 'a', tool_name: 'terminal' }
    emit('tool.started', start); emit('assistant.delta', { seq: 2, run_id: 'run', delta: 'Hello' })
    emit('tool.started', start, '1'); emit('assistant.delta', { seq: 2, run_id: 'run', delta: 'Hello' }, '2')
    emit('tool.completed', { seq: 3, run_id: 'run', tool_call_id: 'a', output: 'done' })
    expect(turn.blocks).toHaveLength(2)
    expect(turn.blocks[1]?.content).toBe('Hello')
    expect(turn.blocks[0]).toMatchObject({ complete: true, output: 'done' })
  })
  it('merges native resume snapshots without duplicating text or losing activities', () => {
    const { turn, emit } = setup()
    emit('tool.started', { tool_call_id: 'a', tool_name: 'terminal' })
    emit('assistant.delta', { delta: 'Hello' }); emit('assistant.snapshot', { text: 'Hello world' })
    emit('assistant.snapshot', { text: 'Hello world' }); emit('assistant.delta', { delta: '!' })
    expect(turn.blocks).toHaveLength(2)
    expect(turn.blocks[1]?.content).toBe('Hello world!')
    expect(turn.blocks[0]).toMatchObject({ id: 'a', state: 'running' })
  })
  it('uses the final text snapshot for its phase and retains earlier commentary', () => {
    const { turn, emit } = setup()
    emit('assistant.delta', { delta: 'Checking' }); emit('assistant.commentary', { text: 'Checking', already_streamed: true })
    emit('tool.started', { tool_call_id: 'a' }); emit('tool.completed', { tool_call_id: 'a' })
    emit('assistant.delta', { delta: 'Answ' }); emit('assistant.completed', { content: 'Answer' }); emit('run.completed')
    expect(turn.blocks.filter(block => block.kind === 'text').map(block => block.content)).toEqual(['Checking', 'Answer'])
  })
  it.each(['reasoning.delta', 'tool.started'])('does not repeat completed text after trailing %s', activity => {
    const { turn, emit } = setup()
    emit('assistant.delta', { delta: 'Final ' }); emit('assistant.delta', { delta: 'answer' })
    emit(activity, { delta: 'Finishing', tool_call_id: 'a' })
    emit('assistant.completed', { content: 'Final answer' }); emit('run.completed')
    expect(turn.blocks).toHaveLength(2)
    expect(turn.blocks[0]).toMatchObject({ kind: 'text', content: 'Final answer' })
    expect(turn.blocks[1]).toMatchObject({ complete: true, state: 'completed' })
  })
  it.each([['Final checks', 'Final'], ['Final', 'Final answer']])('keeps distinct phases across a tool: %s → %s', (interim, final) => {
    const { turn, emit } = setup()
    emit('assistant.delta', { delta: interim })
    emit('tool.started', { tool_call_id: 'a' }); emit('tool.completed', { tool_call_id: 'a' })
    emit('assistant.completed', { content: final })
    expect(turn.blocks.map(block => block.kind)).toEqual(['text', 'tool', 'text'])
    expect(turn.blocks.filter(block => block.kind === 'text').map(block => block.content)).toEqual([interim, final])
  })
  it('compares a repeated completion only with the latest text phase', () => {
    const { turn, emit } = setup()
    emit('assistant.delta', { delta: 'Answer' }); emit('tool.started', { tool_call_id: 'a' })
    emit('assistant.delta', { delta: 'Checking' }); emit('tool.started', { tool_call_id: 'b' })
    emit('assistant.completed', { content: 'Answer' })
    expect(turn.blocks.map(block => block.kind)).toEqual(['text', 'tool', 'text', 'tool', 'text'])
    expect(turn.blocks.filter(block => block.kind === 'text').map(block => block.content)).toEqual(['Answer', 'Checking', 'Answer'])
  })
  it('reconstructs a completed conversation from native reasoning, call and result fields', () => {
    const blocks = historyBlocks([
      { role: 'assistant', content: 'Checking', reasoning_content: 'Plan', tool_calls: [{ id: 'a', function: { name: 'terminal', arguments: '{"command":"false"}' } }] },
      { role: 'tool', tool_call_id: 'a', content: '{"error":"failed"}' },
      { role: 'assistant', reasoning: 'Recover', content: 'Final answer' },
    ])
    expect(blocks.map(block => block.kind)).toEqual(['thinking', 'text', 'tool', 'thinking', 'text'])
    expect(blocks[2]).toMatchObject({ id: 'a', state: 'failed', output: '{"error":"failed"}', complete: true })
  })
  it('ignores unknown and malformed events', () => {
    expect(normalizeEvent(frame('new.protocol.event', { raw: 'hidden' }))).toBeUndefined()
    const { turn, emit } = setup(); emit('new.protocol.event'); emit('assistant.delta', { delta: 'OK' })
    expect(turn.blocks).toHaveLength(1)
    expect(normalizeEvent({ event: 'unknown', data: '{' })).toBeUndefined()
  })
  it('marks unfinished tools failed when the response fails', () => {
    const { turn, emit } = setup(); emit('tool.started', { tool_call_id: 'a' }); emit('run.failed')
    expect(turn.blocks[0]).toMatchObject({ complete: true, state: 'failed' })
  })
})

describe('persisted turn recovery', () => {
  it.each([false, true])('does not match an intermediate text prefix across a tool boundary (active: %s)', active => {
    const { turn, emit } = setup()
    emit('assistant.delta', { delta: 'Checking' })
    emit('tool.started', { tool_call_id: 'a' })
    emit('tool.started', { tool_call_id: 'b' })
    emit('assistant.delta', { delta: 'Final' })
    const restored = historyBlocks([
      { role: 'assistant', content: 'Checking', tool_calls: [{ id: 'a' }] },
      { role: 'tool', tool_call_id: 'a', content: 'first' },
      { role: 'assistant', content: 'Final checks', tool_calls: [{ id: 'b' }] },
      { role: 'tool', tool_call_id: 'b', content: 'second' },
      { role: 'assistant', content: 'Final answer' },
    ])
    const expected = [
      { kind: 'text', content: 'Checking' },
      { kind: 'tool', id: 'a', output: 'first', complete: true },
      { kind: 'text', content: 'Final checks' },
      { kind: 'tool', id: 'b', output: 'second', complete: true },
      { kind: 'text', content: 'Final answer' },
    ]
    mergeHistoryBlocks(turn, restored, active)
    expect(turn.blocks).toMatchObject(expected)
    expect(turn.blocks).toHaveLength(expected.length)
    mergeHistoryBlocks(turn, restored, active)
    expect(turn.blocks).toMatchObject(expected)
    expect(turn.blocks).toHaveLength(expected.length)
  })
  it('retains every missing text phase between matched tools without duplication', () => {
    const turn = createTurn()
    reduceTurn(turn, { type: 'text', data: { delta: 'Checking' } })
    reduceTurn(turn, { type: 'tool.started', data: { tool_call_id: 'a' } })
    reduceTurn(turn, { type: 'tool.started', data: { tool_call_id: 'b' } })
    reduceTurn(turn, { type: 'text', data: { delta: 'Final' } })
    const restored = historyBlocks([
      { role: 'assistant', content: 'Checking', tool_calls: [{ id: 'a' }] },
      { role: 'tool', tool_call_id: 'a', content: 'first' },
      { role: 'assistant', content: 'Intermediate one' },
      { role: 'assistant', content: 'Intermediate two', tool_calls: [{ id: 'b' }] },
      { role: 'tool', tool_call_id: 'b', content: 'second' },
      { role: 'assistant', content: 'Final answer' },
    ])
    mergeHistoryBlocks(turn, restored, false)
    mergeHistoryBlocks(turn, restored, false)
    expect(turn.blocks.map(block => block.kind)).toEqual(['text', 'tool', 'text', 'text', 'tool', 'text'])
    expect(turn.blocks.filter(block => block.kind === 'text').map(block => block.content)).toEqual(['Checking', 'Intermediate one', 'Intermediate two', 'Final answer'])
  })
  it('keeps matched and newly recovered unfinished calls running during active recovery', () => {
    const turn = createTurn()
    reduceTurn(turn, { type: 'tool.started', data: { tool_call_id: 'a', tool_name: 'terminal' } })
    reduceTurn(turn, { type: 'tool.updated', data: { tool_call_id: 'a', delta: 'live progress' } })
    const restored = historyBlocks([{ role: 'assistant', content: '', tool_calls: [
      { id: 'a', function: { name: 'terminal' } }, { id: 'b', function: { name: 'read_file' } },
    ] }])
    mergeHistoryBlocks(turn, restored, true)
    expect(turn.blocks[0]).toMatchObject({ id: 'a', complete: false, state: 'running', output: 'live progress' })
    expect(turn.blocks[1]).toMatchObject({ id: 'b', complete: false, state: 'running', title: 'Reading file' })
    mergeHistoryBlocks(turn, historyBlocks([{ role: 'tool', tool_call_id: 'a', content: '' }]), true)
    expect(turn.blocks[0]).toMatchObject({ complete: true, state: 'completed', output: '' })
  })
  it('never invents timing for persisted calls or orphaned results', () => {
    const blocks = historyBlocks([
      { role: 'assistant', content: '', tool_calls: [{ id: 'a' }] },
      { role: 'tool', tool_call_id: 'a', content: 'done' },
      { role: 'tool', tool_call_id: 'orphan', content: 'done' },
    ])
    for (const block of blocks) {
      expect(block).toMatchObject({ complete: true })
      expect(block).not.toHaveProperty('duration', expect.any(Number))
      expect(block).not.toHaveProperty('startedAt', expect.any(Number))
    }
  })
  it('preserves measured live duration and longer text when history lags', () => {
    const turn = createTurn()
    reduceTurn(turn, { type: 'tool.started', data: { tool_call_id: 'a', ts: 100 } })
    reduceTurn(turn, { type: 'tool.completed', data: { tool_call_id: 'a', ts: 102, output: 'done' } })
    reduceTurn(turn, { type: 'text', data: { delta: 'Answer in progress' } })
    mergeHistoryBlocks(turn, historyBlocks([
      { role: 'assistant', content: '', tool_calls: [{ id: 'a' }] },
      { role: 'tool', tool_call_id: 'a', content: 'done' },
      { role: 'assistant', content: 'Answer' },
    ]), true)
    expect(turn.blocks[0]).toMatchObject({ duration: 2 })
    expect(turn.blocks[1]?.content).toBe('Answer in progress')
  })
})


describe('native Desktop event semantics', () => {
  it.each([false, true])('does not repeat interim text in a completion (already_streamed: %s)', already_streamed => {
    const turn = createTurn()
    reduceNativeTurn(turn, 'tool.start', { tool_id: 'a', name: 'terminal' })
    if (already_streamed) reduceNativeTurn(turn, 'message.delta', { text: 'Final answer' })
    reduceNativeTurn(turn, 'message.interim', { text: 'Final answer', already_streamed })
    reduceNativeTurn(turn, 'message.complete', { text: 'Final answer', status: 'complete' })
    expect(turn.blocks).toHaveLength(2)
    expect(turn.blocks[0]).toMatchObject({ kind: 'tool', complete: true, state: 'completed' })
    expect(turn.blocks[1]).toMatchObject({ kind: 'text', content: 'Final answer' })
  })
  it('retains a distinct completion after sealed interim text even when it shares a prefix', () => {
    const turn = createTurn()
    reduceNativeTurn(turn, 'message.delta', { text: 'Final' })
    reduceNativeTurn(turn, 'message.interim', { text: 'Final', already_streamed: true })
    reduceNativeTurn(turn, 'message.complete', { text: 'Final answer', status: 'complete' })
    expect(turn.blocks.map(block => block.content)).toEqual(['Final', 'Final answer'])
  })
  it('keeps transient status out of reasoning, replaces reasoning, and upserts completed tools by identity', () => {
    const turn = createTurn()
    reduceNativeTurn(turn, 'thinking.delta', { text: 'Waiting on provider' })
    reduceNativeTurn(turn, 'tool.generating', { name: 'terminal' })
    expect(turn.blocks).toEqual([])
    reduceNativeTurn(turn, 'reasoning.delta', { text: 'Partial' })
    reduceNativeTurn(turn, 'reasoning.available', { text: 'Full reasoning' })
    reduceNativeTurn(turn, 'tool.start', { tool_id: 'a', name: 'terminal' })
    reduceNativeTurn(turn, 'message.delta', { text: 'Commentary' })
    expect(turn.blocks[1]).toMatchObject({ id: 'a', complete: false })
    reduceNativeTurn(turn, 'tool.complete', { tool_id: 'a', name: 'terminal', result_text: 'done' })
    reduceNativeTurn(turn, 'tool.start', { tool_id: 'a', name: 'terminal' })
    expect(turn.blocks).toHaveLength(3)
    expect(turn.blocks[0]?.content).toBe('Full reasoning')
    expect(turn.blocks[1]).toMatchObject({ complete: true, output: 'done' })
  })
  it('separates streamed interim text from final text without repeating interim output', () => {
    const turn = createTurn()
    reduceNativeTurn(turn, 'message.delta', { text: 'Checking' })
    reduceNativeTurn(turn, 'message.interim', { text: 'Checking', already_streamed: true })
    reduceNativeTurn(turn, 'message.delta', { text: 'Answer' })
    reduceNativeTurn(turn, 'message.complete', { text: 'Answer', status: 'complete' })
    expect(turn.blocks.map(block => block.content)).toEqual(['Checking', 'Answer'])
  })
  it('keeps delegated activity alive after parent interruption and records later child failure', () => {
    const turn = createTurn()
    reduceNativeTurn(turn, 'subagent.start', { subagent_id: 'child', goal: 'Check files', status: 'running' })
    reduceNativeTurn(turn, 'message.complete', { text: 'Interrupted', status: 'interrupted' })
    expect(turn.blocks[0]).toMatchObject({ id: 'subagent-child', complete: false, delegated: true })
    reduceNativeTurn(turn, 'subagent.complete', { subagent_id: 'child', status: 'failed', summary: 'Tool failed' })
    expect(turn.blocks[0]).toMatchObject({ complete: true, state: 'failed', output: 'Tool failed' })
  })
})
