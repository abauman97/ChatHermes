<script setup lang="ts">
import { computed } from "vue";
import ArtifactCard from "../../artifacts/components/ArtifactCard.vue";
import { textArtifacts, toolArtifacts } from "../../artifacts/artifacts";
import type { Activity } from "../../../types/hermes";
import type { TranscriptEntry } from "../types/chat-ui";
import TurnWork from "../../../components/TurnWork.vue";
import AssistantTextBlock from "./AssistantTextBlock.vue";
const props = defineProps<{
  entry: Extract<TranscriptEntry, { kind: "turn" }>;
  profile?: string;
  sessionId?: string;
}>();
const textPaths = computed(() =>
  props.entry.blocks.flatMap((block) =>
    block.kind === "text" ? textArtifacts(block.content).files.map((file) => file.path) : [],
  ),
);
const toolFiles = computed(() =>
  props.entry.blocks
    .flatMap(toolArtifacts)
    .filter(
      (file, index, all) =>
        !textPaths.value.includes(file.path) &&
        all.findIndex((item) => item.path === file.path) === index,
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
        :profile="profile"
        :session-id="sessionId"
        @image-load="emit('imageLoad')"
      />
    </template>
    <ArtifactCard
      v-for="file in toolFiles"
      :key="file.path"
      :file="{ ...file, sessionId }"
      :profile="profile"
      @image-load="emit('imageLoad')"
    />
  </div>
</template>
