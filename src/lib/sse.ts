export interface SSEEvent { event: string; data: string; id?: string }
export async function* readSSE(stream: ReadableStream<Uint8Array>, signal?: AbortSignal): AsyncGenerator<SSEEvent> {
  const reader = stream.getReader(); const decoder = new TextDecoder()
  let buffer = ''; let event = 'message'; let data: string[] = []; let id: string | undefined
  function frame(): SSEEvent | undefined { if (!data.length) return; const result = { event, data: data.join('\n'), id }; event = 'message'; data = []; id = undefined; return result }
  const abort = () => { void reader.cancel().catch(() => {}) }
  signal?.addEventListener('abort', abort, { once: true })
  try {
    while (true) {
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
      const chunk = await reader.read()
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
      buffer += decoder.decode(chunk.value, { stream: !chunk.done })
      let split: number
      while ((split = buffer.indexOf('\n')) >= 0) {
        let line = buffer.slice(0, split); buffer = buffer.slice(split + 1)
        if (line.endsWith('\r')) line = line.slice(0, -1)
        if (!line) { const value = frame(); if (value) yield value; continue }
        if (line.startsWith(':')) continue
        const colon = line.indexOf(':'); const field = colon < 0 ? line : line.slice(0, colon); let value = colon < 0 ? '' : line.slice(colon + 1)
        if (value.startsWith(' ')) value = value.slice(1)
        if (field === 'event') event = value; else if (field === 'data') data.push(value); else if (field === 'id') id = value
      }
      if (chunk.done) { if (buffer) { const line = buffer.replace(/\r$/, ''); if (line.startsWith('data:')) data.push(line.slice(5).replace(/^ /, '')) } const value = frame(); if (value) yield value; break }
    }
  } finally { signal?.removeEventListener('abort', abort); await reader.cancel().catch(() => {}); reader.releaseLock() }
}
