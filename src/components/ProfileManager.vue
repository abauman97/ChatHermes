<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Profile } from '../types/hermes'
import { createProfile, updateProfile } from '../lib/profiles'
const props = defineProps<{ profiles: Profile[]; selected: string; open: boolean; saveError?: string }>()
const emit = defineEmits<{ close: []; save: [profile: Profile]; remove: [id: string] }>()
const editing = ref(''), label = ref(''), baseUrl = ref(''), key = ref(''), reveal = ref(false), error = ref('')
const active = computed(() => props.profiles.find(p => p.id === editing.value))
function edit(id = '') {
  const selected = props.profiles.find(p => p.id === id)
  editing.value = selected?.id || ''; label.value = selected?.label || ''; baseUrl.value = selected?.baseUrl || ''; key.value = ''; reveal.value = false; error.value = ''
}
watch(() => props.open, value => { if (value) edit(props.selected) }, { immediate: true })
function save() {
  try {
    emit('save', active.value ? updateProfile(active.value, label.value, baseUrl.value, key.value) : createProfile(label.value, baseUrl.value, key.value))
  } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Could not save profile.' }
}
function remove() {
  if (!active.value) return
  if (!confirm(`Remove “${active.value.label}” from this browser? Hermes sessions will remain on the server.`)) return
  emit('remove', active.value.id)
}
</script>
<template>
  <div v-if="open" class="profile-overlay fixed inset-0 z-40 grid place-items-center bg-[#10251e]/80 p-4 dark:bg-black/80" @click.self="emit('close')">
    <section class="profile-dialog max-h-[calc(100dvh-40px)] w-full max-w-[560px] overflow-y-auto rounded-[18px] bg-[#fbf9f3] p-5 text-[#20372f] shadow-2xl shadow-black/40 sm:p-7 dark:border dark:border-[#466353] dark:bg-[#20372e] dark:text-[#edf0e8]" role="dialog" aria-modal="true" aria-labelledby="profile-title" @keydown.esc="emit('close')">
      <header class="flex items-start justify-between gap-3"><div><small class="text-[10px] font-bold tracking-[0.16em] text-[#768d7f] dark:text-[#b2c6b7]">CONNECTIONS</small><h2 id="profile-title" class="mt-1 font-serif text-[28px]">Manage profiles</h2></div><button class="icon-button px-2 text-2xl leading-none hover:text-[#a44232] focus-visible:outline-3 focus-visible:outline-[#c18b53]" aria-label="Close profiles" @click="emit('close')">×</button></header>
      <p class="muted mt-4 text-sm leading-relaxed text-[#667d6c] dark:text-[#b5c9b8]">Each profile connects directly to its Hermes API with its own key. Keys stay in this browser’s storage.</p>
      <nav class="profile-tabs my-2 flex gap-2 overflow-x-auto py-2" aria-label="Saved profiles"><button v-for="profile in profiles" :key="profile.id" type="button" class="shrink-0 rounded-lg border border-[#cbd7cb] bg-white px-3 py-2 text-sm text-[#294a3b] hover:bg-[#edf0e8] focus-visible:outline-3 focus-visible:outline-[#c18b53] dark:border-[#64806c] dark:bg-[#294538] dark:text-[#ecf2e9] dark:hover:bg-[#365744]" :class="editing === profile.id ? 'active !bg-[#244b3e] !text-white dark:!bg-[#507357]' : ''" @click="edit(profile.id)">{{ profile.label }}</button><button type="button" class="shrink-0 rounded-lg border border-[#cbd7cb] bg-white px-3 py-2 text-sm text-[#294a3b] hover:bg-[#edf0e8] focus-visible:outline-3 focus-visible:outline-[#c18b53] dark:border-[#64806c] dark:bg-[#294538] dark:text-[#ecf2e9] dark:hover:bg-[#365744]" :class="!editing ? 'active !bg-[#244b3e] !text-white dark:!bg-[#507357]' : ''" @click="edit('')">+ Add profile</button></nav>
      <form class="grid gap-4" @submit.prevent="save">
        <label class="grid gap-2 text-[13px] font-bold">Label<input v-model="label" autocomplete="off" required placeholder="Personal" class="w-full rounded-lg border border-[#b8cabb] bg-white p-3 font-normal text-[#20372f] focus-visible:outline-3 focus-visible:outline-[#c18b53] dark:border-[#64806c] dark:bg-[#294538] dark:text-[#edf0e8] dark:placeholder:text-[#a9bcae]" /></label>
        <label class="grid gap-2 text-[13px] font-bold">Hermes base URL<input v-model="baseUrl" type="url" spellcheck="false" autocomplete="url" required placeholder="https://hermes.example.com/p/personal/" class="w-full rounded-lg border border-[#b8cabb] bg-white p-3 font-normal text-[#20372f] focus-visible:outline-3 focus-visible:outline-[#c18b53] dark:border-[#64806c] dark:bg-[#294538] dark:text-[#edf0e8] dark:placeholder:text-[#a9bcae]" /></label>
        <p class="field-help m-0 text-xs leading-relaxed text-[#667d6c] dark:text-[#b5c9b8]">Use the API root, or the shared multiplexer’s <code>/p/&lt;profile&gt;/</code> path. Remote endpoints require HTTPS.</p>
        <label class="grid gap-2 text-[13px] font-bold">API key <span v-if="active" class="field-help text-xs font-normal leading-relaxed text-[#667d6c] dark:text-[#b5c9b8]">Leave blank to keep the saved key only when the base URL is unchanged</span><span class="secret-field flex gap-2"><input v-model="key" :type="reveal ? 'text' : 'password'" :required="!active" autocomplete="new-password" spellcheck="false" placeholder="Bearer key" class="min-w-0 flex-1 rounded-lg border border-[#b8cabb] bg-white p-3 font-normal text-[#20372f] focus-visible:outline-3 focus-visible:outline-[#c18b53] dark:border-[#64806c] dark:bg-[#294538] dark:text-[#edf0e8] dark:placeholder:text-[#a9bcae]" /><button type="button" class="rounded-lg border border-[#cbd7cb] bg-white px-3 font-normal text-[#294a3b] hover:bg-[#edf0e8] dark:border-[#64806c] dark:bg-[#294538] dark:text-[#edf0e8] dark:hover:bg-[#365744]" @click="reveal = !reveal">{{ reveal ? 'Hide' : 'Show' }}</button></span></label>
        <p v-if="error || saveError" class="form-error m-0 text-[13px] text-[#9a3025] dark:text-[#ffb6a5]" role="alert">{{ error || saveError }}</p>
        <footer class="mt-2 flex flex-wrap items-center justify-end gap-2"><button v-if="active" type="button" class="remove-profile mr-auto px-2 py-2 text-sm text-[#a44232] underline dark:text-[#ffb6a5]" @click="remove">Remove profile</button><button type="button" class="secondary rounded-lg border border-[#cbd7cb] bg-white px-3 py-2 text-sm text-[#294a3b] hover:bg-[#edf0e8] dark:border-[#64806c] dark:bg-[#294538] dark:text-[#edf0e8] dark:hover:bg-[#365744]" @click="emit('close')">Cancel</button><button type="submit" class="primary rounded-lg bg-[#dcae6e] px-4 py-2 text-sm font-bold text-[#19372e] hover:bg-[#efc48a] dark:bg-[#d7ae75] dark:hover:bg-[#ebc590]">{{ active ? 'Save changes' : 'Add profile' }}</button></footer>
      </form>
    </section>
  </div>
</template>
