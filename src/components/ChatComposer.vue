<script setup lang="ts">
import { ref } from 'vue'
defineProps<{ disabled: boolean; sending: boolean; reason?: string }>()
const emit = defineEmits<{ send: [text: string] }>()
const value = ref('')
function send() { const text = value.value.trim(); if (text) { emit('send', text); value.value = '' } }
function keydown(event: KeyboardEvent) { if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); send() } }
</script>
<template>
  <form class="composer mx-auto mb-3 w-[calc(100%-24px)] max-w-[760px] rounded-2xl border border-[#d8dcd2] bg-white p-3 shadow-lg shadow-[#254734]/10 focus-within:ring-2 focus-within:ring-[#c18b53] min-[701px]:mb-6 min-[701px]:w-[calc(100%-48px)] dark:border-[#365348] dark:bg-[#21372f] dark:shadow-black/20" @submit.prevent="send">
    <div class="flex items-end gap-3">
      <label class="sr-only" for="prompt">Message Hermes</label>
      <textarea id="prompt" v-model="value" rows="2" placeholder="Message Hermes…" :disabled="disabled || sending" class="max-h-[35vh] min-h-15 min-w-0 flex-1 resize-y bg-transparent px-1 py-2 text-[15px] leading-relaxed text-[#20372f] outline-none placeholder:text-[#89988c] disabled:cursor-not-allowed disabled:opacity-55 dark:text-[#edf0e8] dark:placeholder:text-[#94aa9b]" @keydown="keydown" />
      <button class="send-button grid size-11 shrink-0 place-items-center rounded-full bg-[#dcae6e] text-[#19372e] transition-colors hover:bg-[#efc48a] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#c18b53] disabled:cursor-not-allowed disabled:opacity-55 dark:bg-[#d7ae75] dark:hover:bg-[#ebc590]" type="submit" :disabled="disabled || sending || !value.trim()" :aria-label="sending ? 'Working…' : 'Send message'" :title="sending ? 'Working…' : 'Send message'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
      </button>
    </div>
    <p class="composer-hint mt-1 px-1 text-[11px] text-[#74877a] dark:text-[#a9bcae]">{{ reason || 'Enter to send · Shift+Enter for a new line' }}</p>
  </form>
</template>
