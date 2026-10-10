<script setup lang="ts">
import { ref } from "vue";
import ArtifactPreview from "./ArtifactPreview.vue";
defineProps<{ src: string; alt: string }>();
const emit = defineEmits<{ imageLoad: [] }>();
const open = ref(false);
</script>
<template>
  <button
    type="button"
    :aria-label="`Preview ${alt}`"
    class="block max-w-full"
    @click="open = true"
  >
    <img
      :src="src"
      :alt="alt"
      class="mt-2 max-h-72 max-w-full rounded-xl object-contain"
      @load="emit('imageLoad')"
    />
  </button>
  <ArtifactPreview
    v-if="open"
    :src="src"
    :name="alt"
    mime="image/png"
    :download="src"
    @close="open = false"
  />
</template>
