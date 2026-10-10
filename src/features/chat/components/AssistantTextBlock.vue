<script setup lang="ts">
import type { TextBlock } from "../types/chat-ui";
import { renderMarkdown } from "../../../utils/markdown";
defineProps<{ block: TextBlock }>();
const emit = defineEmits<{ imageLoad: [] }>();
</script>
<template>
  <article class="message assistant w-full self-start">
    <div
      class="message-content markdown-content break-words text-base leading-7"
      v-html="renderMarkdown(block.content)"
    />
    <img
      v-for="url in block.images"
      :key="url"
      :src="url"
      alt="Attached image"
      @load="emit('imageLoad')"
      class="mt-2 max-h-72 max-w-full rounded-xl object-contain"
    />
  </article>
</template>
