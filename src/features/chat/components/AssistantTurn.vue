<script setup lang="ts">
import type { Activity } from "../../../types/hermes";
import type { TranscriptEntry } from "../types/chat-ui";
import TurnWork from "../../../components/TurnWork.vue";
import AssistantTextBlock from "./AssistantTextBlock.vue";
defineProps<{ entry: Extract<TranscriptEntry, { kind: "turn" }> }>();
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
        @image-load="emit('imageLoad')"
      />
    </template>
  </div>
</template>
