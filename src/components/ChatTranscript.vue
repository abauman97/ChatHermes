<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { Activity, Message, TurnBlock } from '../types/hermes'
import { historyBlocks } from '../lib/assistant-turn'
import TurnWork from './TurnWork.vue'
import { renderMarkdown } from '../lib/markdown'
import { messageText } from '../lib/hermes-api'
const props = defineProps<{ profile?: string; messages: Message[]; draft: string; loading: boolean; progress: Activity[]; blocks?: TurnBlock[]; turnUserCount?: number; thinking?: boolean; working?: boolean; approvalPending?: boolean; statusLabel?: string; home?: boolean; followInitially?: boolean }>()
const emit = defineEmits<{ suggest: [text: string] }>()
const visible = computed(() => props.messages.filter(message => message.role !== 'system'))
const entries = computed(() => {
  const result: { message?: Message; blocks?: TurnBlock[]; working?: boolean; approvalPending?: boolean; key: string }[] = []
  let userCount = 0
  for (let index = 0; index < visible.value.length;) {
    const message = visible.value[index]!
    if (message.role === 'user') {
      userCount++
      result.push({ message, key: message.id || `user-${index}` })
      let end = index + 1
      while (end < visible.value.length && visible.value[end]!.role !== 'user') end++
      const last = end === visible.value.length
      const blocks = last && (!props.turnUserCount || props.turnUserCount === userCount) && props.blocks?.length ? props.blocks : message.blocks || historyBlocks(visible.value.slice(index + 1, end))
      const turnBlocks = blocks.length ? blocks : last ? props.progress : []
      const working = last && (props.working ?? turnBlocks.some(block => block.kind !== 'text' && !block.complete))
      if (turnBlocks.length || working) result.push({ blocks: turnBlocks, working, approvalPending: last && props.approvalPending, key: `turn-${message.id || index}` })
      index = end
    } else {
      let end = index + 1
      while (end < visible.value.length && visible.value[end]!.role !== 'user') end++
      result.push({ blocks: historyBlocks(visible.value.slice(index, end)), key: `history-${index}` }); index = end
    }
  }
  return result
})
const transcript = ref<HTMLElement>()
const following = ref(props.followInitially !== false)
function onScroll() { const element = transcript.value; if (element) following.value = element.scrollHeight - element.scrollTop - element.clientHeight < 120 }
async function disclosureChanged() { await nextTick(); if (following.value && transcript.value) transcript.value.scrollTop = transcript.value.scrollHeight }
function images(content: unknown): string[] {
  const inline = Array.isArray(content) ? content.flatMap(part => { const url = part?.image_url?.url; return typeof url === 'string' && /^(data:image\/|https?:\/\/)/.test(url) ? [url] : [] }) : []
  if (inline.length) return inline
  const text = messageText(content)
  return [...text.matchAll(/Attached image [^\n]+: [^\n]*\/uploads\/chathermes\/([a-f0-9]{32}\.(?:png|jpe?g|gif|webp))/g)]
    .map(match => '/api/plugins/chathermes/images/' + match[1] + (props.profile ? '?profile=' + encodeURIComponent(props.profile) : ''))
}
function displayText(message: Message) {
  const text = messageText(message.content)
  return message.role === 'user' ? text
    .replace(/Attached image ([^\n]+): [^\n]*\/uploads\/chathermes\/[a-f0-9]{32}\.(?:png|jpe?g|gif|webp)/g, '📷 $1')
    .replace(/Attached file ([^\n]+): [^\n]*\/uploads\/chathermes\/[a-f0-9]{32}(?:\.[a-z0-9]{1,12})?/g, '📎 $1')
    .replace(/\[screenshot\]/g, '📷 Attached image') : text
}
watch(() => [props.messages.length, props.draft, props.blocks || props.progress], async () => {
  const element = transcript.value
  const follow = following.value
  await nextTick()
  if (element && follow && following.value) element.scrollTop = element.scrollHeight
}, { deep: true })
</script>
<template>
  <div ref="transcript" class="transcript flex min-h-0 w-full flex-1 flex-col gap-7 overflow-y-auto px-4 py-6 text-[#f4f4f4] min-[701px]:px-[max(24px,calc((100%-760px)/2))] min-[701px]:py-9" role="log" aria-label="Conversation" aria-live="polite" @scroll="onScroll" @toggle.capture="disclosureChanged">
    <div v-if="loading" class="muted text-sm text-[#a3a3a3]">Loading conversation…</div>
    <div v-else-if="!visible.length && !draft && !thinking" class="empty-state mx-auto flex w-full max-w-[760px] flex-1 flex-col">
      <div class="m-auto text-center"><h2 class="text-2xl font-medium">What can I help with?</h2><p class="mt-3 text-sm text-[#a3a3a3]">Ask Hermes a question or continue a conversation.</p></div>
      <div v-if="home" class="grid gap-2 pt-8 text-[#b4b4b4]">
        <button class="flex items-center gap-3 rounded-2xl px-3 py-3 text-left hover:bg-[#303030]" @click="emit('suggest', 'Help me review my latest project changes')"><span aria-hidden="true">⌘</span><span class="truncate">Help me review my latest project changes</span></button>
        <button class="flex items-center gap-3 rounded-2xl px-3 py-3 text-left hover:bg-[#303030]" @click="emit('suggest', 'Find the most useful next step for my work')"><span aria-hidden="true">✳</span><span class="truncate">Find the most useful next step for my work</span></button>
      </div>
    </div>
    <template v-for="entry in entries" :key="entry.key">
      <article v-if="entry.message" class="message user self-end max-w-[90%] rounded-3xl bg-[#303030] px-5 py-3 min-[701px]:max-w-[85%]">
        <div class="message-content markdown-content break-words text-base leading-7" v-html="renderMarkdown(displayText(entry.message))" />
        <img v-for="url in images(entry.message.content)" :key="url" :src="url" alt="Attached image" @load="disclosureChanged" class="mt-2 max-h-72 max-w-full rounded-xl object-contain" />
      </article>
      <div v-else class="assistant-turn grid min-w-0 gap-1">
        <TurnWork v-if="entry.working || entry.blocks?.some(block => block.kind !== 'text')" :activities="(entry.blocks || []).filter((block): block is Activity => block.kind !== 'text')" :working="!!entry.working" :approval-pending="entry.approvalPending" />
        <template v-for="block in entry.blocks" :key="block.id">
          <article v-if="block.kind === 'text'" class="message assistant w-full self-start"><div class="message-content markdown-content break-words text-base leading-7" v-html="renderMarkdown(block.content)" /><img v-for="url in block.images" :key="url" :src="url" alt="Attached image" @load="disclosureChanged" class="mt-2 max-h-72 max-w-full rounded-xl object-contain" /></article>
        </template>
      </div>
    </template>
    <div v-if="working && !entries.some(entry => entry.working)" class="assistant-turn"><TurnWork :activities="progress" :working="true" :approval-pending="approvalPending" /></div>
    <slot name="request" />
    <article v-if="draft && !blocks?.length" class="message assistant w-full self-start"><div class="message-content markdown-content break-words text-base leading-7" v-html="renderMarkdown(draft)" /></article>
  </div>
</template>
