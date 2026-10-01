<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Attachment, ModelOption } from '../types/hermes'
const props = defineProps<{ disabled: boolean; sending: boolean; reason?: string; suggestedPrompt?: string; models?: ModelOption[]; model?: string; defaultModel?: string }>()
const emit = defineEmits<{ send: [text: string, attachments: Attachment[]]; 'update:model': [model: string] }>()
const value = ref(''), attachmentsOpen = ref(false), attachments = ref<Attachment[]>([]), attachmentError = ref(''), reading = ref(false)
const files = ref<HTMLInputElement>(), camera = ref<HTMLInputElement>()
watch(() => props.suggestedPrompt, text => { if (text) value.value = text }, { immediate: true })
function send() {
  if (props.disabled || props.sending || reading.value) return
  const text = value.value.trim()
  if (text || attachments.value.length) { emit('send', text, [...attachments.value]); value.value = ''; attachments.value = []; attachmentsOpen.value = false }
}
function keydown(event: KeyboardEvent) { if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); send() } }
async function fitImage(data: string): Promise<string> {
  if (data.length <= 1_398_104) return data // roughly 1 MB of decoded image data
  const image = new Image()
  await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error('Could not open this image. Try a JPEG or PNG.')); image.src = data })
  let edge = 2048
  while (edge >= 512) {
    const ratio = Math.min(1, edge / Math.max(image.naturalWidth, image.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio)); canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio))
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Could not prepare this photo.')
    context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    const resized = canvas.toDataURL('image/jpeg', .8)
    if (resized.length <= 1_398_104) return resized
    edge /= 2
  }
  throw new Error('This image is too large to send.')
}
async function attach(event: Event) {
  const input = event.target as HTMLInputElement
  reading.value = true; attachmentError.value = ''; attachmentsOpen.value = false
  try {
    for (const file of Array.from(input.files || [])) {
      if (file.size > 20 * 1024 * 1024) throw new Error('Each file must be 20 MB or smaller.')
      if (attachments.value.length >= 5) throw new Error('Attach up to five files per message.')
      let data = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('Could not read file.')); reader.readAsDataURL(file) })
      if (file.type.startsWith('image/')) data = await fitImage(data)
      const type = file.type.startsWith('image/') ? data.slice(5, data.indexOf(';')) : file.type || 'application/octet-stream'
      attachments.value.push({ name: file.name, type, data, size: file.size })
    }
  } catch (cause) { attachmentError.value = cause instanceof Error ? cause.message : 'Could not read file.' }
  finally { reading.value = false; input.value = '' }
}
</script>
<template>
  <form class="composer relative mx-auto mb-3 w-[calc(100%-24px)] max-w-[760px] shrink-0 rounded-[28px] border border-[#303030] bg-[#303030] p-3 focus-within:ring-1 focus-within:ring-[#525252] min-[701px]:mb-6 min-[701px]:w-[calc(100%-48px)]" @submit.prevent="send">
    <div v-if="attachments.length" class="flex flex-wrap gap-2 px-2 pb-2">
      <div v-for="(file, index) in attachments" :key="index" class="flex max-w-full items-center gap-2 rounded-xl bg-[#424242] p-2 text-sm">
        <img v-if="file.type.startsWith('image/')" :src="file.data" :alt="file.name" class="size-12 rounded-lg object-cover" />
        <span class="truncate">{{ file.name }}</span><button type="button" :aria-label="`Remove ${file.name}`" @click="attachments.splice(index, 1)">×</button>
      </div>
    </div>
    <p v-if="attachmentError" class="px-2 text-sm text-red-300" role="alert">{{ attachmentError }}</p>
    <label class="sr-only" for="prompt">Message Hermes</label>
    <textarea id="prompt" v-model="value" rows="2" maxlength="65536" placeholder="Message Hermes…" class="max-h-[35vh] min-h-14 w-full resize-none bg-transparent px-2 py-1 text-base leading-relaxed text-[#f4f4f4] outline-none placeholder:text-[#b4b4b4]" @keydown="keydown" />
    <input ref="files" type="file" multiple hidden aria-label="Upload files" @change="attach" />
    <input ref="camera" type="file" accept="image/*" capture="environment" hidden aria-label="Take a photo" @change="attach" />
    <div class="flex items-center gap-3">
      <button class="grid size-10 shrink-0 place-items-center rounded-full bg-[#424242] text-3xl text-white disabled:opacity-55" type="button" aria-label="Attachment options" :aria-expanded="attachmentsOpen" :disabled="sending || reading" @click="attachmentsOpen = !attachmentsOpen">+</button>
      <p class="composer-hint flex-1 px-1 text-[11px] text-[#a3a3a3]">{{ reading ? 'Reading files…' : reason || '' }}</p>
      <select aria-label="Model" class="model-select max-w-[45%] rounded-full border-0 bg-[#424242] px-3 py-2 text-base text-[#e5e5e5]" :value="model || ''" :disabled="sending" @change="emit('update:model', ($event.target as HTMLSelectElement).value)">
        <option value="">{{ defaultModel || 'Default' }}</option><option v-for="option in models" :key="option.id" :value="option.id">{{ option.id }}</option>
      </select>
      <button class="send-button grid size-11 shrink-0 place-items-center rounded-full bg-[#2563eb] text-white transition-colors hover:bg-[#3b82f6] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa] disabled:cursor-not-allowed disabled:opacity-55" type="submit" :disabled="disabled || sending || reading || (!value.trim() && !attachments.length)" :aria-label="sending ? 'Working…' : 'Send message'" :title="sending ? 'Working…' : 'Send message'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6" /></svg>
      </button>
    </div>
    <div v-if="attachmentsOpen" class="absolute bottom-full left-0 mb-2 grid min-w-48 gap-1 rounded-2xl border border-[#424242] bg-[#212121] p-2 text-base shadow-xl">
      <button type="button" class="rounded-xl px-3 py-3 text-left hover:bg-[#303030]" @click="files?.click()">Upload files</button>
      <button type="button" class="rounded-xl px-3 py-3 text-left hover:bg-[#303030]" @click="camera?.click()">Take a photo</button>
    </div>
  </form>
</template>
