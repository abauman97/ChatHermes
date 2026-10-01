<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ disabled: boolean; sending: boolean; reason?: string; suggestedPrompt?: string }>()
const emit = defineEmits<{ send: [text: string] }>()
const value = ref(''), attachmentsOpen = ref(false)
watch(() => props.suggestedPrompt, text => { if (text) value.value = text }, { immediate: true })
function send() { const text = value.value.trim(); if (text) { emit('send', text); value.value = '' } }
function keydown(event: KeyboardEvent) { if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); send() } }
</script>
<template>
  <form class="composer relative mx-auto mb-3 w-[calc(100%-24px)] max-w-[760px] shrink-0 rounded-[28px] border border-[#303030] bg-[#303030] p-3 focus-within:ring-1 focus-within:ring-[#525252] min-[701px]:mb-6 min-[701px]:w-[calc(100%-48px)]" @submit.prevent="send">
    <label class="sr-only" for="prompt">Message Hermes</label>
    <textarea id="prompt" v-model="value" rows="2" placeholder="Message Hermes…" :disabled="disabled || sending" class="max-h-[35vh] min-h-14 w-full resize-y bg-transparent px-2 py-1 text-base leading-relaxed text-[#f4f4f4] outline-none placeholder:text-[#b4b4b4] disabled:cursor-not-allowed disabled:opacity-55" @keydown="keydown" />
    <div class="flex items-center gap-3">
      <button class="grid size-10 shrink-0 place-items-center rounded-full bg-[#424242] text-3xl text-white disabled:opacity-55" type="button" aria-label="Attachment options" :aria-expanded="attachmentsOpen" :disabled="disabled || sending" @click="attachmentsOpen = !attachmentsOpen">+</button>
      <p class="composer-hint flex-1 px-1 text-[11px] text-[#a3a3a3]">{{ reason || 'Enter to send · Shift+Enter for a new line' }}</p>
      <button class="send-button grid size-11 shrink-0 place-items-center rounded-full bg-[#2563eb] text-white transition-colors hover:bg-[#3b82f6] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa] disabled:cursor-not-allowed disabled:opacity-55" type="submit" :disabled="disabled || sending || !value.trim()" :aria-label="sending ? 'Working…' : 'Send message'" :title="sending ? 'Working…' : 'Send message'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6" /></svg>
      </button>
    </div>
    <div v-if="attachmentsOpen" class="absolute bottom-full left-0 mb-2 max-w-[280px] rounded-2xl border border-[#424242] bg-[#212121] p-4 text-sm text-[#b4b4b4]" role="status">Attachments are not available through session chat yet.<button type="button" class="mt-3 block text-white underline" @click="attachmentsOpen = false">Close</button></div>
  </form>
</template>
