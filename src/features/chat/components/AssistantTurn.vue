<script setup lang="ts">
import { computed } from "vue";
import ArtifactAttachment from "../../artifacts/ArtifactAttachment.vue";
import { hasReference, type Artifact } from "../../artifacts/service";
import type { Activity } from "../../../types/hermes";
import type { TranscriptEntry } from "../types/chat-ui";
import TurnWork from "../../../components/TurnWork.vue";
import AssistantTextBlock from "./AssistantTextBlock.vue";
const props = defineProps<{
  entry: Extract<TranscriptEntry, { kind: "turn" }>;
  profile?: string;
  artifacts?: Artifact[];
}>();
const files = computed(() =>
  (props.artifacts || []).filter(
    (file) =>
      file.mime !== "application/octet-stream" &&
      file.direction === "generated" &&
      props.entry.blocks.some((block) =>
        block.kind === "text"
          ? hasReference(block.content, file)
          : block.kind === "tool" && hasReference(block.output, file),
      ),
  ),
);
const emit = defineEmits<{ imageLoad: [] }>();
</script>
<template>
  <div class="assistant-turn grid min-w-0 gap-1">
    <TurnWork
      v-if="entry.working || entry.blocks?.some((block) => block.kind !== 'text')"
      :activities="(entry.blocks || []).filter((block): block is Activity => block.kind !== 'text')"
      :working="!!entry.working"
      :approval-pending="entry.approvalPending"
    />
    <template v-for="block in entry.blocks" :key="block.id">
      <AssistantTextBlock
        v-if="block.kind === 'text'"
        :block="block"
        :artifacts="files"
        @image-load="emit('imageLoad')"
      />
    </template>
    <ArtifactAttachment
      v-for="file in files"
      :key="file.id"
      :artifact="file"
      :profile="profile || ''"
      @image-load="emit('imageLoad')"
    />
  </div>
</template>
