<script setup lang="ts">
import type { Profile } from '../types/hermes'
defineProps<{ profiles: Profile[]; selected: string }>()
const emit = defineEmits<{ change: [id: string] }>()
</script>
<template>
  <label class="profile-picker">Profile
    <select :value="selected" :disabled="!profiles.length" @change="emit('change', ($event.target as HTMLSelectElement).value)">
      <option v-if="!profiles.length" value="">No profiles configured</option>
      <option v-for="profile in profiles" :key="profile.id" :value="profile.id">{{ profile.label }}</option>
    </select>
  </label>
</template>
