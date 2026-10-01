<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '../types/hermes'
import { messageText } from '../lib/hermes-api'
const props = defineProps<{ messages: Message[]; draft: string; loading: boolean; progress: string[]; thinking?: boolean; home?: boolean }>()
const emit = defineEmits<{ suggest: [text: string] }>()
const visible = computed(() => props.messages.filter(m => m.role !== 'system'))
</script>
<template>
  <div class="transcript flex min-h-0 w-full flex-1 flex-col gap-7 overflow-y-auto px-4 py-6 text-[#f4f4f4] min-[701px]:px-[max(24px,calc((100%-760px)/2))] min-[701px]:py-9" role="log" aria-label="Conversation" aria-live="polite">
    <div v-if="loading" class="muted text-sm text-[#a3a3a3]">Loading conversation…</div>
    <div v-else-if="!visible.length && !draft && !thinking" class="empty-state mx-auto flex w-full max-w-[760px] flex-1 flex-col">
      <div class="m-auto text-center"><h2 class="text-2xl font-medium">What can I help with?</h2><p class="mt-3 text-sm text-[#a3a3a3]">Ask Hermes a question or continue a conversation.</p></div>
      <div v-if="home" class="grid gap-2 pt-8 text-[#b4b4b4]">
        <button class="flex items-center gap-3 rounded-2xl px-3 py-3 text-left hover:bg-[#303030]" @click="emit('suggest', 'Help me review my latest project changes')"><span aria-hidden="true">⌘</span><span class="truncate">Help me review my latest project changes</span></button>
        <button class="flex items-center gap-3 rounded-2xl px-3 py-3 text-left hover:bg-[#303030]" @click="emit('suggest', 'Find the most useful next step for my work')"><span aria-hidden="true">✳</span><span class="truncate">Find the most useful next step for my work</span></button>
      </div>
    </div>
    <article v-for="(message, index) in visible" :key="message.id || index" class="message max-w-full" :class="[message.role, message.role === 'user' ? 'self-end max-w-[90%] rounded-3xl bg-[#303030] px-5 py-3 min-[701px]:max-w-[85%]' : message.role === 'tool' ? 'border-l-2 border-[#525252] pl-3 text-sm text-[#a3a3a3]' : 'w-full self-start']">
      <div class="message-content whitespace-pre-wrap break-words text-base leading-7">{{ messageText(message.content) || '[Non-text content]' }}</div>
    </article>
    <div v-if="thinking" class="thinking-chip flex w-fit items-center gap-3 rounded-full bg-[#303030] px-4 py-2 text-sm text-[#e5e5e5]" role="status"><span class="thinking-dot size-2 rounded-full bg-white" aria-hidden="true" />Hermes is thinking…</div>
    <div v-for="(item, index) in progress" :key="index" class="tool-progress border-l-2 border-[#525252] px-3 py-1 text-[13px] text-[#a3a3a3]">{{ item }}</div>
    <article v-if="draft" class="message assistant w-full self-start"><div class="message-content whitespace-pre-wrap break-words text-base leading-7">{{ draft }}</div></article>
  </div>
</template>
