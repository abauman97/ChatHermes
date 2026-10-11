<script setup lang="ts">
import { computed } from "vue";
import ArtifactCard from "../../artifacts/components/ArtifactCard.vue";
import { textArtifacts, toolArtifacts } from "../../artifacts/artifacts";
import type { Activity } from "../../../types/hermes";
import { activityRuns } from "../utils/activity-runs";
import ActivityRow from "../../../components/ActivityRow.vue";
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
const parts = computed(() => activityRuns(props.entry.blocks));
const filesByTool = computed(() => {
  const seen = new Set(textPaths.value);
  const files = new Map<string, ReturnType<typeof toolArtifacts>>();
  for (const block of props.entry.blocks) {
    if (block.kind !== "tool") continue;
    files.set(
      block.id,
      toolArtifacts(block).filter((file) => {
        if (seen.has(file.path)) return false;
        seen.add(file.path);
        return true;
      }),
    );
  }
  return files;
});
const toolFiles = (activity: Activity) => filesByTool.value.get(activity.id) || [];
const emit = defineEmits<{ imageLoad: [] }>();
</script>
<template>
  <div class="assistant-turn grid min-w-0 gap-1">
    <template v-for="part in parts" :key="part.id">
      <TurnWork
        v-if="part.kind === 'tools'"
        :activities="part.activities"
        :working="!!entry.working"
      >
        <template #result="{ activity }">
          <ArtifactCard
            v-for="file in toolFiles(activity)"
            :key="file.path"
            :file="{ ...file, sessionId }"
            :profile="profile"
            @image-load="emit('imageLoad')"
          />
        </template>
      </TurnWork>
      <template v-else>
        <AssistantTextBlock
          v-if="part.block.kind === 'text'"
          :block="part.block"
          :profile="profile"
          :session-id="sessionId"
          @image-load="emit('imageLoad')"
        />
        <template v-else>
          <ActivityRow
            v-if="part.block.kind !== 'thinking' || part.block.content.trim()"
            :activity="part.block"
            :turn-complete="!entry.working"
          />
          <ArtifactCard
            v-for="file in toolFiles(part.block)"
            :key="file.path"
            :file="{ ...file, sessionId }"
            :profile="profile"
            @image-load="emit('imageLoad')"
          />
        </template>
      </template>
    </template>
    <TurnWork
      v-if="entry.working && (!entry.blocks.length || entry.approvalPending)"
      :activities="[]"
      :working="true"
      :approval-pending="entry.approvalPending"
    />
    <slot name="request" />
  </div>
</template>
