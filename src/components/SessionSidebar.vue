<script setup lang="ts">
import { ref } from 'vue'
import type { Session } from '../types/hermes'
defineProps<{ sessions: Session[]; selected: string; loading: boolean; error: string; hasMore: boolean; busy: boolean }>()
const emit = defineEmits<{ select: [id: string]; create: []; more: []; retry: []; rename: [id: string, title: string] }>()
const editing = ref(''); const title = ref('')
function edit(session: Session) { editing.value = session.id; title.value = session.title || '' }
function save() { if (title.value.trim()) emit('rename', editing.value, title.value.trim()); editing.value = '' }
</script>
<template>
  <div class="session-head"><h2>Conversations</h2><button class="primary small" :disabled="busy" @click="emit('create')">New chat</button></div>
  <p v-if="error" class="notice error" role="alert">{{ error }} <button @click="emit('retry')">Retry</button></p>
  <p v-else-if="loading && !sessions.length" class="muted">Loading sessions…</p>
  <p v-else-if="!sessions.length" class="muted">No conversations yet.</p>
  <nav v-else aria-label="Sessions" class="session-list">
    <div v-for="session in sessions" :key="session.id" class="session-row" :class="{ active: selected === session.id }">
      <template v-if="editing === session.id">
        <input v-model="title" aria-label="Session title" maxlength="160" @keydown.enter="save" @keydown.esc="editing = ''" />
        <button aria-label="Save title" @click="save">Save</button>
      </template>
      <template v-else>
        <button class="session-select" :aria-current="selected === session.id ? 'page' : undefined" @click="emit('select', session.id)"><span>{{ session.title || 'Untitled session' }}</span><small>{{ session.source || 'Hermes' }}</small></button>
        <button class="icon-button" :aria-label="`Rename ${session.title || 'Untitled session'}`" @click="edit(session)">✎</button>
      </template>
    </div>
  </nav>
  <button v-if="hasMore" class="load-more" :disabled="loading" @click="emit('more')">{{ loading ? 'Loading…' : 'Load more' }}</button>
</template>
