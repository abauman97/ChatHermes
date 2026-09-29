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
  <div v-if="open" class="profile-overlay" @click.self="emit('close')">
    <section class="profile-dialog" role="dialog" aria-modal="true" aria-labelledby="profile-title" @keydown.esc="emit('close')">
      <header><div><small>CONNECTIONS</small><h2 id="profile-title">Manage profiles</h2></div><button class="icon-button" aria-label="Close profiles" @click="emit('close')">×</button></header>
      <p class="muted">Each profile connects directly to its Hermes API with its own key. Keys stay in this browser’s storage.</p>
      <nav class="profile-tabs" aria-label="Saved profiles"><button v-for="profile in profiles" :key="profile.id" type="button" :class="{ active: editing === profile.id }" @click="edit(profile.id)">{{ profile.label }}</button><button type="button" :class="{ active: !editing }" @click="edit('')">+ Add profile</button></nav>
      <form @submit.prevent="save">
        <label>Label<input v-model="label" autocomplete="off" required placeholder="Personal" /></label>
        <label>Hermes base URL<input v-model="baseUrl" type="url" spellcheck="false" autocomplete="url" required placeholder="https://hermes.example.com/p/personal/" /></label>
        <p class="field-help">Use the API root, or the shared multiplexer’s <code>/p/&lt;profile&gt;/</code> path. Remote endpoints require HTTPS.</p>
        <label>API key <span v-if="active" class="field-help">Leave blank to keep the saved key only when the base URL is unchanged</span><span class="secret-field"><input v-model="key" :type="reveal ? 'text' : 'password'" :required="!active" autocomplete="new-password" spellcheck="false" placeholder="Bearer key" /><button type="button" @click="reveal = !reveal">{{ reveal ? 'Hide' : 'Show' }}</button></span></label>
        <p v-if="error || saveError" class="form-error" role="alert">{{ error || saveError }}</p>
        <footer><button v-if="active" type="button" class="remove-profile" @click="remove">Remove profile</button><button type="button" class="secondary" @click="emit('close')">Cancel</button><button type="submit" class="primary">{{ active ? 'Save changes' : 'Add profile' }}</button></footer>
      </form>
    </section>
  </div>
</template>
