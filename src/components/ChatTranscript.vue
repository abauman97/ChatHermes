<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { Activity, Message } from '../types/hermes'
import ActivityRow from './ActivityRow.vue'
import { renderMarkdown } from '../lib/markdown'
import { messageText } from '../lib/hermes-api'
const props = defineProps<{ messages: Message[]; draft: string; loading: boolean; progress: Activity[]; thinking?: boolean; home?: boolean }>()
const emit = defineEmits<{ suggest: [text: string] }>()
const visible = computed(() => {
  const last = props.messages.reduce((index, message, current) => message.role === 'user' ? current : index, -1)
  return props.messages.filter((message, index) => message.role !== 'system'
    && !(message.role === 'assistant' && !messageText(message.content) && !images(message.content).length)
    && !(message.role === 'tool' && props.progress.length && index > last))
})
const lastUser = computed(() => visible.value.reduce((last, message, index) => message.role === 'user' ? index : last, -1))
const transcript = ref<HTMLElement>()
function images(content: unknown): string[] {
  if (!Array.isArray(content)) return []
  return content.flatMap(part => { const url = part?.image_url?.url; return typeof url === 'string' && /^(data:image\/|https?:\/\/)/.test(url) ? [url] : [] })
}
function displayText(message: Message) {
  const text = messageText(message.content)
  return message.role === 'user' ? text
    .replace(/Attached file ([^\n]+): [^\n]*\/uploads\/chathermes\/[a-f0-9]{32}(?:\.[a-z0-9]{1,12})?/g, '📎 $1')
    .replace(/\[screenshot\]/g, '📷 Attached image') : text
}
watch(() => [props.messages.length, props.draft, JSON.stringify(props.progress)], async () => {
  const element = transcript.value
  const follow = element && element.scrollHeight - element.scrollTop - element.clientHeight < 120
  await nextTick()
  if (element && follow) element.scrollTop = element.scrollHeight
})
</script>
<template>
  <div ref="transcript" class="transcript flex min-h-0 w-full flex-1 flex-col gap-7 overflow-y-auto px-4 py-6 text-[#f4f4f4] min-[701px]:px-[max(24px,calc((100%-760px)/2))] min-[701px]:py-9" role="log" aria-label="Conversation" aria-live="polite">
    <div v-if="loading" class="muted text-sm text-[#a3a3a3]">Loading conversation…</div>
    <div v-else-if="!visible.length && !draft && !thinking" class="empty-state mx-auto flex w-full max-w-[760px] flex-1 flex-col">
      <div class="m-auto text-center"><h2 class="text-2xl font-medium">What can I help with?</h2><p class="mt-3 text-sm text-[#a3a3a3]">Ask Hermes a question or continue a conversation.</p></div>
      <div v-if="home" class="grid gap-2 pt-8 text-[#b4b4b4]">
        <button class="flex items-center gap-3 rounded-2xl px-3 py-3 text-left hover:bg-[#303030]" @click="emit('suggest', 'Help me review my latest project changes')"><span aria-hidden="true">⌘</span><span class="truncate">Help me review my latest project changes</span></button>
        <button class="flex items-center gap-3 rounded-2xl px-3 py-3 text-left hover:bg-[#303030]" @click="emit('suggest', 'Find the most useful next step for my work')"><span aria-hidden="true">✳</span><span class="truncate">Find the most useful next step for my work</span></button>
      </div>
    </div>
    <template v-for="(message, index) in visible" :key="message.id || index">
      <ActivityRow v-if="message.role === 'tool'" :activity="{ id: message.id || String(index), title: message.tool_name || 'Tool call', content: messageText(message.content), complete: true, kind: 'tool' }" />
      <article v-else class="message max-w-full" :class="message.role === 'user' ? 'user self-end max-w-[90%] rounded-3xl bg-[#303030] px-5 py-3 min-[701px]:max-w-[85%]' : 'assistant w-full self-start'">
        <div class="message-content markdown-content break-words text-base leading-7" v-html="renderMarkdown(displayText(message))" />
        <img v-for="url in images(message.content)" :key="url" :src="url" alt="Attached image" class="mt-2 max-h-72 max-w-full rounded-xl object-contain" />
      </article>
      <div v-if="index === lastUser && progress.length" class="grid gap-1">
        <ActivityRow v-for="item in progress" :key="item.id" :activity="item" />
      </div>
    </template>
    <article v-if="draft" class="message assistant w-full self-start"><div class="message-content markdown-content break-words text-base leading-7" v-html="renderMarkdown(draft)" /></article>
  </div>
</template>
