import type { Activity, Message, TurnBlock } from '../types/hermes'
import type { SSEEvent } from './sse'
import { eventPayload, messageText } from './hermes-api'

type Data = Record<string, unknown>
const string = (value: unknown) => typeof value === 'string' ? value : ''
const detail = (value: unknown) => typeof value === 'string' ? value : value == null ? '' : JSON.stringify(value, null, 2)
export function toolTitle(name: string, complete = false): string {
  const labels: Record<string, [string, string]> = {
    file_search: ['Searching files', 'Searched files'],
    terminal: ['Running command', 'Ran command'], search: ['Searching files', 'Searched files'],
    read_file: ['Reading file', 'Read file'], write_file: ['Updating file', 'Updated file'],
    web_search: ['Searching the web', 'Searched the web'], web_extract: ['Reading web page', 'Read web page'],
    python: ['Executing Python', 'Executed Python'], browser: ['Using browser', 'Used browser'],
  }
  const key = Object.keys(labels).find(key => name === key || name.startsWith(key + '_'))
  return key ? labels[key]![complete ? 1 : 0] : complete ? 'Used tool' : 'Using tool'
}
export interface TurnEvent { type: 'text' | 'text.snapshot' | 'text.completed' | 'reasoning' | 'reasoning.completed' | 'tool.started' | 'tool.updated' | 'tool.completed' | 'tool.failed' | 'status' | 'completed' | 'failed' | 'approval'; data: Data; key?: string }
export function normalizeEvent(frame: SSEEvent): TurnEvent | undefined {
  const data = eventPayload(frame), name = frame.event
  const sequence = typeof data.seq === 'number' ? String(data.seq) : frame.id
  const key = sequence === undefined ? undefined : `${data.run_id || ''}:${sequence}`
  let type: TurnEvent['type'] | undefined
  if (['assistant.delta', 'message.delta'].includes(name)) type = 'text'
  else if (name === 'assistant.snapshot') type = 'text.snapshot'
  else if (name === 'assistant.completed') type = 'text.completed'
  else if (name === 'assistant.commentary' && !data.already_streamed) type = 'text'
  else if (['reasoning.delta', 'thinking.delta', 'reasoning.available', 'reasoning.started', 'thinking.started'].includes(name) || name === 'tool.progress' && data.tool_name === '_thinking') type = 'reasoning'
  else if (['reasoning.completed', 'thinking.completed'].includes(name)) type = 'reasoning.completed'
  else if (name === 'tool.started' || name === 'tool.start') type = 'tool.started'
  else if (['tool.progress', 'tool.delta', 'tool.updated'].includes(name)) type = 'tool.updated'
  else if (name === 'tool.completed' || name === 'tool.complete') type = data.is_error ? 'tool.failed' : 'tool.completed'
  else if (name === 'tool.failed') type = 'tool.failed'
  else if (['run.status', 'run.progress', 'status', 'progress'].includes(name)) type = 'status'
  else if (name === 'run.completed') type = 'completed'
  else if (['run.failed', 'run.cancelled', 'error'].includes(name)) type = 'failed'
  else if (name === 'approval.request') type = 'approval'
  return type ? { type, data, key } : undefined
}
export interface AssistantTurn { blocks: TurnBlock[]; seen: Set<string>; sequence: number }
export const createTurn = (): AssistantTurn => ({ blocks: [], seen: new Set(), sequence: 0 })
export function finishTurn(turn: AssistantTurn) {
  for (const block of turn.blocks) if (block.kind !== 'text') { block.complete = true; if (block.kind === 'thinking') block.title = 'Thought'; if (block.state === 'running' || block.state === 'pending') block.state = 'completed' }
}
function closeReasoning(turn: AssistantTurn) {
  for (const block of turn.blocks) if (block.kind === 'thinking') { block.complete = true; block.state = 'completed'; block.title = 'Thought' }
}
export function reduceTurn(turn: AssistantTurn, event: TurnEvent): void {
  if (event.key && turn.seen.has(event.key)) return
  if (event.key) turn.seen.add(event.key)
  const { type, data } = event
  const delta = string(data.delta) || string(data.text) || string(data.preview)
  const id = string(data.tool_call_id) || string(data.tool_id)
  const name = string(data.tool_name) || string(data.name) || string(data.tool)
  const nextId = () => `block-${++turn.sequence}`
  if (type === 'text' || type === 'text.snapshot' || type === 'text.completed') {
    closeReasoning(turn)
    const content = type === 'text.completed' ? string(data.content) : delta
    if (!content) return
    let block = turn.blocks.at(-1)
    if (type === 'text.snapshot') {
      const existing = turn.blocks.filter(item => item.kind === 'text').map(item => item.content).join('')
      if (existing === content || existing.startsWith(content)) return
      if (content.startsWith(existing)) { reduceTurn(turn, { type: 'text', data: { delta: content.slice(existing.length) } }); return }
      // Hermes snapshots contain the current text phase, not necessarily earlier commentary.
      if (block?.kind === 'text') { block.content = content; return }
    }
    if (block?.kind !== 'text') { block = { id: nextId(), kind: 'text', content: '' }; turn.blocks.push(block) }
    block.content = type === 'text.completed' ? content : block.content + content
  } else if (type === 'reasoning' || type === 'status') {
    let block = turn.blocks.at(-1)
    if (block?.kind !== 'thinking' || block.complete) {
      block = { id: nextId(), kind: 'thinking', title: type === 'status' ? 'Working…' : 'Thinking…', content: '', complete: false, state: 'running' }
      turn.blocks.push(block)
    }
    block.content += delta
  } else if (type === 'reasoning.completed') closeReasoning(turn)
  else if (type.startsWith('tool.')) {
    closeReasoning(turn)
    let block = turn.blocks.find(item => item.kind === 'tool' && id && item.id === id) as Activity | undefined
    if (!block && !id) block = [...turn.blocks].reverse().find(item => item.kind === 'tool' && !item.complete && (!name || item.toolName === name)) as Activity | undefined
    if (!block) {
      block = { id: id || nextId(), kind: 'tool', title: toolTitle(name), toolName: name, content: '', complete: false, state: 'pending', startedAt: data.persisted ? undefined : typeof data.ts === 'number' ? data.ts * 1000 : Date.now() }
      turn.blocks.push(block)
    }
    if (type === 'tool.started' && block.complete) return
    if (type === 'tool.started') { block.state = 'running'; block.content = detail(data.args) || delta || block.content }
    else if (type === 'tool.updated') { if (!block.complete) block.state = 'running'; block.output = (block.output || '') + delta }
    else {
      block.complete = true; block.state = type === 'tool.failed' ? 'failed' : 'completed'
      block.title = toolTitle(block.toolName || name, true)
      block.output = detail(data.output ?? data.result ?? data.error) || block.output || delta
      block.content = detail(data.args) || block.content
      block.duration = typeof data.duration_s === 'number' ? data.duration_s : block.startedAt ? Math.max(0, ((typeof data.ts === 'number' ? data.ts * 1000 : Date.now()) - block.startedAt) / 1000) : undefined
    }
  } else {
    if (type === 'failed') for (const block of turn.blocks) if (block.kind === 'tool' && !block.complete) { block.state = 'failed'; block.output ||= 'The response ended before this tool completed.' }
    finishTurn(turn)
  }
}

// History retains native reasoning and call IDs; tool result rows update their call.
export function historyBlocks(messages: Message[]): TurnBlock[] {
  const turn = createTurn()
  for (const message of messages) {
    if (message.role === 'assistant') {
      const reasoning = message.reasoning_content || message.reasoning
      if (reasoning) { reduceTurn(turn, { type: 'reasoning', data: { delta: reasoning } }); closeReasoning(turn) }
      const text = messageText(message.content)
      if (text) {
        // Distinct persisted assistant messages are distinct text phases.
        turn.blocks.push({ id: `block-${++turn.sequence}`, kind: 'text', content: text })
      }
      const images = Array.isArray(message.content) ? message.content.flatMap(part => { const url = part?.image_url?.url; return typeof url === 'string' && /^(data:image\/|https?:\/\/)/.test(url) ? [url] : [] }) : []
      if (images.length) {
        let block = turn.blocks.at(-1)
        if (block?.kind !== 'text') { block = { id: `block-${++turn.sequence}`, kind: 'text', content: '' }; turn.blocks.push(block) }
        block.images = images
      }
      for (const call of message.tool_calls || []) reduceTurn(turn, { type: 'tool.started', data: { tool_call_id: call.id, tool_name: call.function?.name, args: call.function?.arguments, persisted: true } })
    } else if (message.role === 'tool') {
      const output = messageText(message.content)
      let failed = false
      try { const result = JSON.parse(output); failed = result?.is_error === true || result?.success === false || !!result?.error || typeof result?.exit_code === 'number' && result.exit_code !== 0 } catch { /* Plain terminal/file output. */ }
      reduceTurn(turn, { type: failed ? 'tool.failed' : 'tool.completed', data: { tool_call_id: message.tool_call_id, tool_name: message.tool_name, output, persisted: true } })
    }
  }
  closeReasoning(turn)
  return turn.blocks
}

// Merge each persisted phase once, using later matches as insertion anchors.
// History can lag live events, so retain longer live text and unfinished calls.
export function mergeHistoryBlocks(turn: AssistantTurn, restored: TurnBlock[], active: boolean) {
  const live = [...turn.blocks]
  const matches = new Map<TurnBlock, TurnBlock>()
  const toolAnchors = new Map<number, number>()
  let toolCursor = 0
  for (const [index, item] of restored.entries()) {
    if (item.kind !== 'tool') continue
    const liveIndex = live.findIndex((block, index) => index >= toolCursor && block.kind === 'tool' && (
      item.id === block.id || item.id.startsWith('block-') || block.id.startsWith('block-')
    ))
    if (liveIndex >= 0) { toolAnchors.set(index, liveIndex); toolCursor = liveIndex + 1 }
  }
  let cursor = 0
  for (const [restoredIndex, item] of restored.entries()) {
    // Match text only between its surrounding tools, even when a phase is missing.
    const previousTool = [...toolAnchors].reverse().find(([index]) => index < restoredIndex)?.[1]
    const nextTool = [...toolAnchors].find(([index]) => index > restoredIndex)?.[1]
    const index = item.kind === 'tool' ? toolAnchors.get(restoredIndex) ?? -1 : live.findIndex((block, index) => (
      index >= Math.max(cursor, (previousTool ?? -1) + 1) && index < (nextTool ?? live.length)
      && block.kind === item.kind && (
        item.content.startsWith(block.content) || block.content.startsWith(item.content)
        || !active && item === restored.at(-1) && block === live.at(-1) && item.kind === 'text'
      )
    ))
    if (index >= 0) { matches.set(item, live[index]!); cursor = index + 1 }
  }
  for (const [index, item] of restored.entries()) {
    const block = matches.get(item)
    if (block) {
      if (item.kind === 'tool' && block.kind === 'tool') {
        if (item.complete) {
          block.output = item.output; block.complete = true; block.state = item.state; block.title = item.title
        }
      } else if (item.kind === 'text' && block.kind === 'text') {
        if (!block.content.startsWith(item.content)) block.content = item.content
        if (item.images) block.images = item.images
      } else if (item.content.startsWith(block.content)) block.content = item.content
    } else {
      const next = restored.slice(index + 1).map(item => matches.get(item)).find(Boolean)
      const anchor = next ? turn.blocks.indexOf(next) : turn.blocks.length
      const id = item.id.startsWith('block-') ? `block-${++turn.sequence}` : item.id
      turn.blocks.splice(anchor, 0, { ...item, id })
    }
  }
}

/** Native Desktop semantics, without Electron/React presentation side effects.
 * References: gateway-event/message-stream.ts, tools.ts and chat-messages/tool-parts.ts
 * in Hermes ac28abc96ce83f22f6b831f80d9007e2aba81f21 (MIT). */
export function reduceNativeTurn(turn: AssistantTurn, name: string, data: Data) {
  const native = turn as AssistantTurn & { sealedText?: string }
  if (name === 'thinking.delta' || name === 'tool.generating') return
  if (name === 'message.interim') {
    if (!data.already_streamed) reduceTurn(turn, { type: 'text', data: { delta: string(data.text) } })
    native.sealedText = turn.blocks.at(-1)?.id
  } else if (name === 'message.delta' || name === 'message.complete') {
    if (native.sealedText && native.sealedText === turn.blocks.at(-1)?.id && string(data.text)) {
      turn.blocks.push({ id: `block-${++turn.sequence}`, kind: 'text', content: '' })
    }
    reduceTurn(turn, { type: name === 'message.delta' ? 'text' : 'text.completed', data: name === 'message.delta' ? { delta: data.text } : { content: data.text } })
    if (name === 'message.complete') {
      for (const block of turn.blocks) if (block.kind !== 'text' && !block.delegated) {
        block.complete = true
        if (block.state === 'running' || block.state === 'pending') block.state = data.status === 'complete' ? 'completed' : 'failed'
      }
      if (data.reasoning && !turn.blocks.some(b => b.kind === 'thinking')) reduceTurn(turn, { type: 'reasoning', data: { text: data.reasoning } })
      closeReasoning(turn)
    }
  } else if (name === 'reasoning.delta' || name === 'reasoning.available') {
    if (name === 'reasoning.available') {
      const block = [...turn.blocks].reverse().find(b => b.kind === 'thinking')
      if (block && block.kind === 'thinking') { block.content = string(data.text); block.complete = false; return }
    }
    reduceTurn(turn, { type: 'reasoning', data: { delta: data.text } })
  } else if (name === 'tool.start' || name === 'tool.complete' || name === 'tool.progress') {
    const result = data.result as Record<string, unknown> | undefined
    const failed = data.is_error || data.error || result && typeof result === 'object' && (result.error || result.success === false || typeof result.exit_code === 'number' && result.exit_code !== 0)
    reduceTurn(turn, { type: name === 'tool.start' ? 'tool.started' : name === 'tool.progress' ? 'tool.updated' : failed ? 'tool.failed' : 'tool.completed',
      data: { ...data, tool_call_id: data.tool_id, tool_name: data.name, delta: data.text || data.delta || data.preview, output: data.result_text ?? data.result } })
  } else if (name.startsWith('subagent.')) {
    const id = string(data.subagent_id) || string(data.child_session_id) || (data.delegation_id ? `${data.delegation_id}:${data.task_index}` : '')
    if (!id) return
    const terminal = ['subagent.complete', 'subagent.failed', 'subagent.cancelled'].includes(name)
    reduceTurn(turn, { type: terminal ? name === 'subagent.complete' && data.status === 'completed' ? 'tool.completed' : 'tool.failed' : 'tool.updated',
      data: { tool_call_id: 'subagent-' + id, tool_name: string(data.name) || 'Delegated task', delta: string(data.text), output: data.summary ?? data.text ?? data.output_tail } })
    const block = turn.blocks.find(b => b.id === 'subagent-' + id)
    if (block && block.kind === 'tool') block.delegated = true
  }
}
