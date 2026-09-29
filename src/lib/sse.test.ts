import { describe, expect, it } from 'vitest'
import { readSSE } from './sse'
function chunks(parts: Uint8Array[]) { return new ReadableStream<Uint8Array>({ start(controller) { for (const part of parts) controller.enqueue(part); controller.close() } }) }
describe('SSE decoder', () => {
  it('handles split UTF-8, multiline data, comments and terminal frame', async () => {
    const bytes = new TextEncoder().encode(': keepalive\n\nevent: assistant.delta\ndata: café\ndata: next\n\nevent: run.completed\ndata: {}')
    const frames = []; for await (const frame of readSSE(chunks([bytes.slice(0, 47), bytes.slice(47, 48), bytes.slice(48)]))) frames.push(frame)
    expect(frames).toEqual([{ event: 'assistant.delta', data: 'café\nnext', id: undefined }, { event: 'run.completed', data: '{}', id: undefined }])
  })
})
