<script setup lang="ts">
import type { Project } from '../types/hermes'
defineProps<{ projects: Project[]; selected: string; loading: boolean; error: string }>()
const emit = defineEmits<{ select: [id: string]; retry: [] }>()
</script>
<template>
  <section class="project-navigation flex min-h-0 max-h-[35%] shrink-0 flex-col gap-2" aria-label="Projects">
    <h2 class="text-xs font-semibold text-[#a3a3a3]">Projects</h2>
    <p v-if="error" class="text-sm text-[#fecaca]" role="alert">{{ error }} <button class="underline" @click="emit('retry')">Retry Projects</button></p>
    <p v-else-if="loading" class="text-sm text-[#a3a3a3]">Loading Projects…</p>
    <p v-else-if="!projects.length" class="text-sm text-[#a3a3a3]">No Projects yet.</p>
    <nav class="grid min-h-0 auto-rows-max gap-1 overflow-y-auto" aria-label="Project list">
      <button v-for="project in projects" :key="project.id" class="min-h-[48px] truncate rounded-lg px-2.5 py-3 text-left text-base hover:bg-[#303030] focus-visible:outline-3 focus-visible:outline-[#b4b4b4]" :class="selected === project.id ? 'bg-[#303030]' : ''" :aria-label="project.label" :aria-current="selected === project.id ? 'page' : undefined" @click="emit('select', project.id)"><span>{{ project.label }}</span><small class="ml-2 text-xs text-[#a3a3a3]">{{ project.sessionCount }} {{ project.sessionCount === 1 ? 'chat' : 'chats' }}</small></button>
    </nav>
  </section>
</template>
