<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '../types/hermes'
import { messageText } from '../lib/hermes-api'
const props = defineProps<{ messages: Message[]; draft: string; loading: boolean; progress: string[] }>()
const visible = computed(() => props.messages.filter(m => m.role !== 'system'))
</script>
<template>
  <div class="transcript flex min-h-0 w-full flex-1 flex-col gap-6 overflow-y-auto px-4 py-6 text-[#20372f] min-[701px]:px-[max(24px,calc((100%-760px)/2))] min-[701px]:py-9 dark:text-[#edf0e8]" role="log" aria-label="Conversation" aria-live="polite">
    <div v-if="loading" class="muted text-sm text-[#74877a] dark:text-[#a9bcae]">Loading conversation…</div>
    <div v-else-if="!visible.length && !draft" class="empty-state m-auto max-w-[410px] text-center"><div class="empty-mark text-4xl text-[#b37939] dark:text-[#dfb476]">✳</div><h2 class="mt-3 font-serif text-3xl">A clear space to begin.</h2><p class="mt-3 text-sm leading-relaxed text-[#74877a] dark:text-[#a9bcae]">Ask Hermes a question or continue a conversation from your history.</p></div>
    <article v-for="(message, index) in visible" :key="message.id || index" class="message max-w-full" :class="[message.role, message.role === 'user' ? 'self-end max-w-[95%] rounded-2xl rounded-br-sm bg-[#e7e8da] px-4 py-3 min-[701px]:max-w-[85%] dark:bg-[#34483c] dark:text-[#f5f2e9]' : message.role === 'tool' ? 'border-l-2 border-[#c18b53] pl-3 text-sm text-[#63776a] dark:text-[#b7c9b8]' : 'self-start']">
      <div class="message-content whitespace-pre-wrap break-words text-[15px] leading-relaxed">{{ messageText(message.content) || '[Non-text content]' }}</div>
    </article>
    <div v-for="(item, index) in progress" :key="index" class="tool-progress border-l-2 border-[#c18b53] px-3 py-1 text-[13px] text-[#63776a] dark:text-[#b7c9b8]">{{ item }}</div>
    <article v-if="draft" class="message assistant self-start"><div class="message-content whitespace-pre-wrap break-words text-[15px] leading-relaxed">{{ draft }}</div></article>
  </div>
</template>
