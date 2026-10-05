<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import type { Attachment, ModelOption, ProviderOption } from '../types/hermes'
const props = withDefaults(defineProps<{ disabled: boolean; sending: boolean; stoppable?: boolean; imagesSupported?: boolean; reason?: string; suggestedPrompt?: string; models?: ModelOption[]; model?: string; defaultModel?: string; providers?: ProviderOption[]; provider?: string; modelsLoading?: boolean }>(), { imagesSupported: true })
const emit = defineEmits<{ stop: []; send: [text: string, attachments: Attachment[]]; 'update:model': [model: string]; 'update:provider': [provider: string] }>()
const value = ref(''), attachmentsOpen = ref(false), attachments = ref<Attachment[]>([]), attachmentError = ref(''), reading = ref(false)
const files = ref<HTMLInputElement>(), camera = ref<HTMLInputElement>()
watch(() => props.suggestedPrompt, text => { if (text) value.value = text }, { immediate: true })
// Gateway catalog roots describe the backing model; their children are selectable routes.
const routeModels = computed(() => (props.models || []).filter(item => item.parent !== null))
const pickerOpen = ref(false), pickerProvider = ref<string | null>(null)
const pill = ref<HTMLButtonElement>(), panel = ref<HTMLElement>()
const panelId = useId()
const imageGated = computed(() => props.imagesSupported === false && attachments.value.some(file => file.type.startsWith('image/')))
const pickerDisabled = computed(() => props.sending || props.modelsLoading)
const selectedProvider = computed(() => props.providers?.find(item => item.slug === pickerProvider.value))
const pickerTitle = computed(() => selectedProvider.value?.name || 'Model routes')
const providerModels = computed(() => {
  const selected = selectedProvider.value
  const ids = selected ? selected.models : routeModels.value.map(item => item.id)
  // Keep the configured default selectable even when it is absent from a remote catalog.
  return [...new Set([...((selected?.is_current || !props.providers?.length) && props.defaultModel ? [props.defaultModel] : []), ...ids])]
})
async function focusPanel() {
  await nextTick()
  if (pickerOpen.value) panel.value?.querySelector<HTMLButtonElement>('button')?.focus()
}
function closePicker() {
  if (!pickerOpen.value) return
  pickerOpen.value = false
  pill.value?.focus()
}
function togglePicker() {
  if (pickerOpen.value) { closePicker(); return }
  if (pickerDisabled.value) return
  attachmentsOpen.value = false
  pickerProvider.value = null
  pickerOpen.value = true
  void focusPanel()
}
function showModels(slug: string) { pickerProvider.value = slug; void focusPanel() }
function showProviders() { pickerProvider.value = null; void focusPanel() }
function chooseModel(id: string) {
  if (pickerDisabled.value) return
  emit('update:provider', pickerProvider.value || '')
  emit('update:model', selectedProvider.value?.is_current && id === props.defaultModel ? '' : id)
  closePicker()
}
function outsideClick(event: MouseEvent) {
  // Rows can be replaced before the document listener runs; keep the original event path.
  const path = event.composedPath()
  if (panel.value && !path.includes(panel.value) && pill.value && !path.includes(pill.value)) closePicker()
}
function pickerKeydown(event: KeyboardEvent) {
  if (!pickerOpen.value) return
  if (event.key === 'Escape') { event.preventDefault(); closePicker() }
  if (event.key === 'Tab') {
    const buttons = Array.from(panel.value?.querySelectorAll<HTMLButtonElement>('button') || [])
    const target = event.shiftKey ? buttons.at(-1) : buttons[0]
    if (document.activeElement === (event.shiftKey ? buttons[0] : buttons.at(-1))) { event.preventDefault(); target?.focus() }
  }
}
watch(pickerDisabled, disabled => { if (disabled) closePicker() })
watch(() => props.providers, () => closePicker())
onMounted(() => { document.addEventListener('click', outsideClick); document.addEventListener('keydown', pickerKeydown) })
onBeforeUnmount(() => { document.removeEventListener('click', outsideClick); document.removeEventListener('keydown', pickerKeydown) })
function send() {
  if (props.disabled || props.sending || reading.value || imageGated.value) return
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
    <p v-if="imageGated" class="px-2 text-sm text-red-300" role="alert">Image sending is unavailable for this native capability. Remove the image to send text or files.</p>
    <p v-if="attachmentError" class="px-2 text-sm text-red-300" role="alert">{{ attachmentError }}</p>
    <label class="sr-only" for="prompt">Message Hermes</label>
    <textarea id="prompt" v-model="value" rows="2" maxlength="65536" placeholder="Message Hermes…" class="max-h-[35vh] min-h-14 w-full resize-none bg-transparent px-2 py-1 text-base leading-relaxed text-[#f4f4f4] outline-none placeholder:text-[#b4b4b4]" @keydown="keydown" />
    <input ref="files" type="file" multiple hidden aria-label="Upload files" @change="attach" />
    <input ref="camera" type="file" accept="image/*" capture="environment" hidden aria-label="Take a photo" @change="attach" />
    <div class="flex items-center gap-3">
      <button class="grid size-10 shrink-0 place-items-center rounded-full bg-[#424242] text-3xl text-white disabled:opacity-55" type="button" aria-label="Attachment options" :aria-expanded="attachmentsOpen" :disabled="sending || reading" @click="closePicker(); attachmentsOpen = !attachmentsOpen">+</button>
      <p class="composer-hint min-w-0 flex-1 px-1 text-[11px] text-[#a3a3a3]">{{ reading ? 'Reading files…' : reason || '' }}</p>
      <button ref="pill" type="button" class="model-pill flex min-w-0 max-w-[55%] items-center gap-2 rounded-full bg-[#424242] px-3 py-2 text-base text-[#e5e5e5] disabled:opacity-55" aria-label="Choose model" aria-haspopup="dialog" :aria-expanded="pickerOpen" :aria-controls="panelId" :disabled="pickerDisabled" @click="togglePicker">
        <span class="truncate">{{ modelsLoading ? 'Loading models…' : model || defaultModel || 'Default' }}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4 shrink-0" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      <button class="send-button grid size-11 shrink-0 place-items-center rounded-full bg-[#2563eb] text-white transition-colors hover:bg-[#3b82f6] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa] disabled:cursor-not-allowed disabled:opacity-55" :type="sending ? 'button' : 'submit'" :disabled="sending ? !stoppable : disabled || reading || imageGated || (!value.trim() && !attachments.length)" :aria-label="sending ? 'Stop response' : 'Send message'" :title="sending ? 'Stop response' : 'Send message'" @click="sending && stoppable && emit('stop')">
        <svg v-if="sending" viewBox="0 0 24 24" class="size-5" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6" /></svg>
      </button>
    </div>
    <div v-if="pickerOpen" :id="panelId" ref="panel" role="dialog" aria-modal="true" :aria-label="pickerProvider === null ? 'Choose provider' : pickerTitle" class="model-panel absolute bottom-full right-0 z-20 mb-2 flex max-h-[min(60vh,420px)] w-full max-w-sm flex-col rounded-2xl border border-[#424242] bg-[#212121] p-2 text-base text-[#e5e5e5] shadow-xl">
      <div class="flex shrink-0 items-center gap-2 border-b border-[#424242] p-2">
        <button v-if="pickerProvider !== null" type="button" aria-label="Back to providers" class="picker-back rounded-full p-2 hover:bg-[#424242]" @click="showProviders">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-5" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <h2 class="min-w-0 flex-1 truncate">{{ pickerProvider === null ? 'Choose provider' : pickerTitle }}</h2>
        <button type="button" aria-label="Close model picker" class="rounded-full px-3 py-2 hover:bg-[#424242]" @click="closePicker">×</button>
      </div>
      <div class="min-h-0 overflow-y-auto overscroll-contain">
        <template v-if="pickerProvider === null">
          <button v-for="item in providers" :key="item.slug" type="button" class="provider-option flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left hover:bg-[#424242]" :data-provider="item.slug" @click="showModels(item.slug)">
            <span class="min-w-0 flex-1 truncate">{{ item.name }}</span><span v-if="item.is_current" class="text-sm text-[#a3a3a3]">Current</span>
          </button>
          <button type="button" class="provider-option w-full rounded-xl px-3 py-3 text-left hover:bg-[#424242]" data-provider="" @click="showModels('')">Model routes</button>
        </template>
        <template v-else>
          <button v-for="id in providerModels" :key="id" type="button" class="model-option flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left hover:bg-[#424242]" :data-model="id" @click="chooseModel(id)">
            <span class="min-w-0 flex-1 break-all">{{ id }}</span><span v-if="(provider || '') === pickerProvider && id === (model || defaultModel)" aria-label="Selected">✓</span>
          </button>
          <p v-if="!providerModels.length" class="px-3 py-3 text-[#a3a3a3]">No models available</p>
        </template>
      </div>
    </div>
    <div v-if="attachmentsOpen" class="absolute bottom-full left-0 mb-2 grid min-w-48 gap-1 rounded-2xl border border-[#424242] bg-[#212121] p-2 text-base shadow-xl">
      <button type="button" class="rounded-xl px-3 py-3 text-left hover:bg-[#303030]" @click="files?.click()">Upload files</button>
      <button type="button" class="rounded-xl px-3 py-3 text-left hover:bg-[#303030]" @click="camera?.click()">Take a photo</button>
    </div>
  </form>
</template>
