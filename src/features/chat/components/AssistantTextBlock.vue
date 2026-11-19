<script setup lang="ts">
import { computed } from "vue";
import ArtifactCard from "../../artifacts/components/ArtifactCard.vue";
import { textArtifactDelivery, type Artifact } from "../../artifacts/artifacts";
import type { TextBlock } from "../types/chat-ui";
import { renderMarkdownSections } from "../../../utils/markdown-sections";
const props = defineProps<{
  block: TextBlock;
  delivery?: ReturnType<typeof textArtifactDelivery>;
  profile?: string;
  sessionId?: string;
  excludedPaths?: string[];
  validatedFiles?: Record<string, Artifact>;
}>();
const delivery = computed(() => props.delivery ?? textArtifactDelivery(props.block.content));
const parts = computed(() => {
  const unique = new Set<string>();
  const candidates = new Map(delivery.value.files.map((file) => [file.path, file]));
  const selected: { file: Artifact; offset: number; block: boolean }[] = [];
  for (const placement of delivery.value.markdown?.placements ?? delivery.value.placements) {
    const candidate = candidates.get(placement.path)!;
    const validated = props.validatedFiles?.[candidate.path];
    const file = candidate.automatic
      ? validated
      : validated
        ? { ...candidate, path: validated.path }
        : candidate;
    if (!file || unique.has(file.path) || props.excludedPaths?.includes(file.path)) continue;
    unique.add(file.path);
    selected.push({ file, offset: placement.offset, block: placement.block });
  }
  const sections = renderMarkdownSections(delivery.value.text, selected, delivery.value.markdown);
  const parts: (
    | { kind: "text"; html: string; key: string }
    | { kind: "file"; file: Artifact; key: string }
  )[] = [];
  sections.forEach((html, index) => {
    if (html) parts.push({ kind: "text", html, key: `text:${index}` });
    const next = selected[index];
    if (next) parts.push({ kind: "file", file: next.file, key: `file:${next.file.path}` });
  });
  return parts;
});
const emit = defineEmits<{ imageLoad: [] }>();
</script>
<template>
  <article class="message assistant w-full self-start">
    <template v-for="part in parts" :key="part.key">
      <div
        v-if="part.kind === 'text'"
        class="message-content markdown-content break-words text-base leading-7"
        v-html="part.html"
      />
      <ArtifactCard
        v-else
        :file="{ ...part.file, sessionId }"
        :profile="profile"
        @image-load="emit('imageLoad')"
      />
    </template>
    <ArtifactCard
      v-for="url in block.images"
      :key="url"
      :file="{ path: url, name: 'Attached image.png', type: 'image/png', sessionId }"
      :profile="profile"
      @image-load="emit('imageLoad')"
    />
  </article>
</template>
