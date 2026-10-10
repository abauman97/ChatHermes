<script setup lang="ts">
import type { Message } from "../../../types/hermes";
import { renderMarkdown } from "../../../utils/markdown";
import { images, displayText } from "../utils/user-message";
defineProps<{ message: Message; profile?: string }>();
const emit = defineEmits<{ imageLoad: [] }>();
</script>
<template>
  <article
    class="message user self-end max-w-[90%] rounded-3xl bg-[#303030] px-5 py-3 min-[701px]:max-w-[85%]"
  >
    <div
      class="message-content markdown-content break-words text-base leading-7"
      v-html="renderMarkdown(displayText(message))"
    />
    <img
      v-for="url in images(message.content, profile)"
      :key="url"
      :src="url"
      alt="Attached image"
      @load="emit('imageLoad')"
      class="mt-2 max-h-72 max-w-full rounded-xl object-contain"
    />
  </article>
</template>
