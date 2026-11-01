<script setup lang="ts">
defineProps<{ title?: string; subtitle?: string; loading: boolean; error: string }>();
defineEmits<{ retry: [] }>();
</script>
<template>
  <div class="scheduled-heading">
    <div class="scheduled-heading-content">
      <div class="page-heading">
        <h2>{{ title || "Scheduled" }}</h2>
      </div>
      <slot />
      <p v-if="subtitle" class="project-muted">{{ subtitle }}</p>
      <p v-if="loading" role="status" class="project-muted">Loading scheduled history…</p>
      <p v-if="error" role="alert" class="project-error">
        {{ error }} <button class="underline" @click="$emit('retry')">Retry</button>
      </p>
    </div>
  </div>
</template>
