<script setup lang="ts">
import { computed, ref } from "vue";
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
  branchDisabled?: boolean;
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
const emit = defineEmits<{ imageLoad: []; branch: [responseId: string] }>();
const copyStatus = ref("");
const responseText = computed(() =>
  props.entry.blocks
    .filter((block) => block.kind === "text")
    .map((block) => block.content)
    .join("\n\n"),
);
async function copyResponse() {
  try {
    await navigator.clipboard.writeText(responseText.value);
    copyStatus.value = "Copied";
  } catch {
    copyStatus.value = "Could not copy. Select the response text to copy it.";
  }
}
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
    <div
      v-if="!entry.working && responseText.trim()"
      class="response-actions flex items-center gap-1 text-[#a3a3a3]"
    >
      <button
        type="button"
        aria-label="Copy response"
        title="Copy response"
        class="flex size-9 items-center justify-center rounded-lg hover:bg-[#303030] focus-visible:outline-2 focus-visible:outline-white"
        @pointerdown.prevent
        @click="copyResponse"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          class="size-4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
        >
          <rect x="8" y="8" width="12" height="13" rx="2" />
          <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
        </svg>
      </button>
      <button
        v-if="entry.responseId"
        type="button"
        aria-label="Branch in new chat"
        title="Branch in new chat"
        :disabled="branchDisabled"
        class="flex size-9 items-center justify-center rounded-lg hover:bg-[#303030] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-white"
        @pointerdown.prevent
        @click="emit('branch', entry.responseId)"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          class="size-4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
        >
          <circle cx="6" cy="5" r="2" />
          <circle cx="6" cy="19" r="2" />
          <circle cx="18" cy="5" r="2" />
          <path d="M6 7v10m0-4h5a7 7 0 0 0 7-6" />
        </svg>
      </button>
      <span role="status" class="text-xs">{{ copyStatus }}</span>
    </div>
  </div>
</template>
