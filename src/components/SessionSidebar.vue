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
  <div class="session-head flex items-center justify-between gap-2"><h2 class="text-xs font-semibold uppercase tracking-[0.1em] text-[#b5c8bd] dark:text-[#c0d0c3]">Conversations</h2><button class="primary small rounded-lg bg-[#dcae6e] px-3 py-2 text-xs font-bold text-[#19372e] hover:bg-[#efc48a] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#dfb476] disabled:cursor-not-allowed disabled:opacity-55 dark:bg-[#d7ae75] dark:hover:bg-[#ebc590]" :disabled="busy" @click="emit('create')">New chat</button></div>
  <p v-if="error" class="notice error rounded-lg bg-[#f5dfd7] p-3 text-sm text-[#70382b] dark:bg-[#59332e] dark:text-[#ffe1d4]" role="alert">{{ error }} <button class="underline" @click="emit('retry')">Retry</button></p>
  <p v-if="loading && !sessions.length" class="muted text-sm leading-relaxed text-[#b5c8bd] dark:text-[#c0d0c3]">Loading sessions…</p>
  <p v-else-if="!sessions.length" class="muted text-sm leading-relaxed text-[#b5c8bd] dark:text-[#c0d0c3]">No conversations yet.</p>
  <nav v-else aria-label="Sessions" class="session-list grid min-h-0 gap-1 overflow-y-auto">
    <div v-for="session in sessions" :key="session.id" class="session-row flex items-center rounded-lg hover:bg-[#315b4a] dark:hover:bg-[#345343]" :class="selected === session.id ? 'active bg-[#315b4a] dark:bg-[#345343]' : ''">
      <template v-if="editing === session.id">
        <input v-model="title" aria-label="Session title" maxlength="160" class="min-w-0 flex-1 rounded-md border border-[#789386] bg-[#f5f2e9] p-2 text-sm text-[#20372f] focus-visible:outline-3 focus-visible:outline-[#dfb476] dark:bg-[#253d32] dark:text-white" @keydown.enter="save" @keydown.esc="editing = ''" />
        <button aria-label="Save title" class="rounded-md px-2 py-2 text-sm text-[#f5f2e9] hover:bg-[#426b57] focus-visible:outline-3 focus-visible:outline-[#dfb476]" @click="save">Save</button>
      </template>
      <template v-else>
        <button class="session-select grid min-w-0 flex-1 gap-0.5 px-2.5 py-2.5 text-left text-[#f5f2e9] focus-visible:outline-3 focus-visible:outline-[#dfb476]" :aria-current="selected === session.id ? 'page' : undefined" @click="emit('select', session.id)"><span class="truncate">{{ session.title || 'Untitled session' }}</span><small class="text-xs text-[#bad0c2] dark:text-[#c0d0c3]">{{ session.source || 'Hermes' }}</small></button>
        <button class="icon-button rounded-md px-2 py-1 text-xl text-[#f5f2e9] hover:bg-[#426b57] focus-visible:outline-3 focus-visible:outline-[#dfb476]" :aria-label="`Rename ${session.title || 'Untitled session'}`" @click="edit(session)">✎</button>
      </template>
    </div>
  </nav>
  <button v-if="hasMore" class="load-more rounded-lg border border-[#718e7c] px-3 py-2 text-sm text-[#f5f2e9] hover:bg-[#315b4a] disabled:cursor-not-allowed disabled:opacity-55 dark:border-[#789383]" :disabled="loading" @click="emit('more')">{{ loading ? 'Loading…' : 'Load more' }}</button>
</template>
