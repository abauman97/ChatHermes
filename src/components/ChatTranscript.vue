<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '../types/hermes'
import { messageText } from '../lib/hermes-api'
const props = defineProps<{ messages: Message[]; draft: string; loading: boolean; progress: string[] }>()
const visible = computed(() => props.messages.filter(m => m.role !== 'system'))
</script>
<template>
  <div class="transcript" role="log" aria-label="Conversation" aria-live="polite">
    <div v-if="loading" class="muted">Loading conversation…</div>
    <div v-else-if="!visible.length && !draft" class="empty-state"><div class="empty-mark">✳</div><h2>A clear space to begin.</h2><p>Ask Hermes a question or continue a conversation from your history.</p></div>
    <article v-for="(message, index) in visible" :key="message.id || index" class="message" :class="message.role">
      <div class="message-role">{{ message.role === 'assistant' ? 'Hermes' : message.role === 'user' ? 'You' : message.role === 'tool' ? (message.tool_name || 'Tool') : message.role }}</div>
      <div class="message-content">{{ messageText(message.content) || '[Non-text content]' }}</div>
    </article>
    <div v-for="(item, index) in progress" :key="index" class="tool-progress">{{ item }}</div>
    <article v-if="draft" class="message assistant"><div class="message-role">Hermes · writing</div><div class="message-content">{{ draft }}</div></article>
  </div>
</template>
