<script setup lang="ts">
import { computed } from "vue";
import ArtifactCard from "../../artifacts/components/ArtifactCard.vue";
import { textArtifacts } from "../../artifacts/artifacts";
import type { TextBlock } from "../types/chat-ui";
import { renderMarkdown } from "../../../utils/markdown";
const props = defineProps<{
  block: TextBlock;
  profile?: string;
  sessionId?: string;
  excludedPaths?: string[];
}>();
const delivery = computed(() => textArtifacts(props.block.content));
const emit = defineEmits<{ imageLoad: [] }>();
</script>
<template>
  <article class="message assistant w-full self-start">
    <div
      class="message-content markdown-content break-words text-base leading-7"
      v-html="renderMarkdown(delivery.text)"
    />
    <ArtifactCard
      v-for="file in delivery.files.filter((file) => !excludedPaths?.includes(file.path))"
      :key="file.path"
      :file="{ ...file, sessionId }"
      :profile="profile"
      @image-load="emit('imageLoad')"
    />
    <ArtifactCard
      v-for="url in block.images"
      :key="url"
      :file="{ path: url, name: 'Attached image.png', type: 'image/png', sessionId }"
      :profile="profile"
      @image-load="emit('imageLoad')"
    />
  </article>
</template>
