<script setup lang="ts">
import type { Profile } from '../types/hermes'
defineProps<{ profiles: Profile[]; selected: string }>()
const emit = defineEmits<{ change: [id: string] }>()
</script>
<template>
  <label class="profile-picker grid gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#b5c8bd] dark:text-[#c0d0c3]">Profile
    <select :value="selected" :disabled="!profiles.length" class="w-full rounded-lg border border-[#5c796e] bg-[#244b3e] px-3 py-3 text-[15px] font-normal normal-case tracking-normal text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#dfb476] disabled:opacity-55 dark:border-[#6c8977] dark:bg-[#2b4a3c]" @change="emit('change', ($event.target as HTMLSelectElement).value)">
      <option v-if="!profiles.length" value="">No profiles configured</option>
      <option v-for="profile in profiles" :key="profile.id" :value="profile.id">{{ profile.label }}</option>
    </select>
  </label>
</template>
