<script setup lang="ts">
import { ref } from 'vue'
defineProps<{ disabled: boolean; sending: boolean; reason?: string }>()
const emit = defineEmits<{ send: [text: string] }>()
const value = ref('')
function send() { const text = value.value.trim(); if (text) { emit('send', text); value.value = '' } }
function keydown(event: KeyboardEvent) { if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); send() } }
</script>
<template>
  <form class="composer" @submit.prevent="send">
    <label class="sr-only" for="prompt">Message Hermes</label>
    <textarea id="prompt" v-model="value" rows="2" placeholder="Message Hermes…" :disabled="disabled || sending" @keydown="keydown" />
    <button class="primary send-button" type="submit" :disabled="disabled || sending || !value.trim()">{{ sending ? 'Working…' : 'Send ↗' }}</button>
    <p class="composer-hint">{{ reason || 'Enter to send · Shift+Enter for a new line' }}</p>
  </form>
</template>
