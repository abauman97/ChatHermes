<script setup lang="ts">
import { computed } from "vue";
import ArtifactAttachment from "../../artifacts/ArtifactAttachment.vue";
import { hasReference, cleanFileText, type Artifact } from "../../artifacts/service";
import InlineImage from "../../artifacts/InlineImage.vue";
import type { Message } from "../../../types/hermes";
import { renderMarkdown } from "../../../utils/markdown";
import { images, displayText } from "../utils/user-message";
const props = defineProps<{ message: Message; profile?: string; artifacts?: Artifact[] }>();
const files = computed(() =>
  (props.artifacts || []).filter(
    (file) =>
      file.mime !== "application/octet-stream" &&
      file.direction === "uploaded" &&
      hasReference(props.message.content, file),
  ),
);
const emit = defineEmits<{ imageLoad: [] }>();
</script>
<template>
  <article
    class="message user self-end max-w-[90%] rounded-3xl bg-[#303030] px-5 py-3 min-[701px]:max-w-[85%]"
  >
    <div
      class="message-content markdown-content break-words text-base leading-7"
      v-html="renderMarkdown(cleanFileText(displayText(message), files))"
    />
    <ArtifactAttachment
      v-for="file in files"
      :key="file.id"
      :artifact="file"
      :profile="profile || ''"
      @image-load="emit('imageLoad')"
    />
    <InlineImage
      v-for="url in files.some((file) => file.mime.startsWith('image/'))
        ? []
        : images(message.content, profile)"
      :key="url"
      :src="url"
      alt="Attached image"
      @image-load="emit('imageLoad')"
      class="mt-2 max-h-72 max-w-full rounded-xl object-contain"
    />
  </article>
</template>
