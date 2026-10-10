<script setup lang="ts">
import { ref } from "vue";
import { useChat } from "../context";
import ChatTranscript from "../../../components/ChatTranscript.vue";
import ChatComposer from "./ChatComposer.vue";
import LiveRequest from "./LiveRequest.vue";
const props = defineProps<{ showPage: boolean; hideComposer?: boolean }>();
const picker = ref<InstanceType<typeof ChatComposer>>();
const dragging = ref(0);
function drag(event: DragEvent) {
  if (props.showPage || !event.dataTransfer?.types.includes("Files")) return;
  event.preventDefault();
  dragging.value++;
}
function dragOver(event: DragEvent) {
  if (!props.showPage && event.dataTransfer?.types.includes("Files")) event.preventDefault();
}
function leave() {
  dragging.value = Math.max(0, dragging.value - 1);
}
defineExpose({ drag, drop, dragOver, leave });
function drop(event: DragEvent) {
  if (props.showPage || !event.dataTransfer?.types.includes("Files")) return;
  event.preventDefault();
  dragging.value = 0;
  void picker.value?.addFiles(Array.from(event.dataTransfer.files));
}
const { view, scope, composer, actions } = useChat();
const {
  profile,
  session,
  settingsPage,
  scheduledPage,
  offline,
  canStream: nativeMode,
  models,
  providers,
  modelsLoading,
  model,
  provider,
  defaultModel,
  suggestedPrompt,
} = scope;
const {
  messages: viewMessages,
  loading: viewLoading,
  busy: viewBusy,
  approvalPending: viewApprovalPending,
  active: viewActive,
  reconnect: viewReconnect,
  error: viewError,
  unavailable: viewUnavailable,
  connection,
} = view;
</script>
<template>
  <div class="relative flex min-h-0 flex-1 flex-col">
    <div
      v-if="dragging"
      role="status"
      class="pointer-events-none absolute inset-2 z-30 grid place-items-center rounded-3xl border-2 border-dashed border-[#60a5fa] bg-[#212121]/95 text-xl"
    >
      Drop files to attach to your next message
    </div>
    <div
      v-if="offline"
      class="notice bg-[#303030] px-5 py-3 text-sm text-white dark:bg-[#303030] dark:text-white"
      role="status"
    >
      You are offline. Messages cannot be loaded or sent.
    </div>
    <div
      v-if="!settingsPage && !scheduledPage && viewReconnect"
      class="notice px-5 py-3 text-sm text-[#b4b4b4]"
      role="status"
    >
      {{
        connection === "reconnecting" ? "Reconnecting…" : "Session is read-only until reconnected."
      }}
      <button
        v-if="nativeMode && connection === 'stale' && !offline"
        class="ml-3 underline"
        @click="actions.retry"
      >
        Reconnect
      </button>
    </div>
    <div
      v-if="!settingsPage && !scheduledPage && viewError"
      class="notice error bg-[#402b2b] px-5 py-3 text-sm text-[#fecaca] dark:bg-[#402b2b] dark:text-[#fecaca]"
      role="alert"
    >
      {{ viewError }}
      <button v-if="session" class="underline" @click="actions.retry">
        {{ viewReconnect ? "Retry connection" : "Refresh history" }}
      </button>
      <button v-if="viewUnavailable" class="ml-3 underline" @click="actions.resolve">
        Resolve uncertain submission
      </button>
    </div>
    <slot v-if="showPage" name="page" />
    <ChatTranscript
      v-else
      :profile="profile"
      :session="session"
      :messages="viewMessages"
      :draft="''"
      :loading="viewLoading"
      :progress="[]"
      :thinking="viewBusy"
      :working="viewBusy || viewApprovalPending"
      :approval-pending="viewApprovalPending"
      :home="!session"
      @suggest="actions.suggest"
    >
      <template #request><LiveRequest /></template>
    </ChatTranscript>
    <ChatComposer
      ref="picker"
      :context-key="session"
      :stage-attachment="actions.stage"
      :submit-message="actions.send"
      v-show="!settingsPage && !hideComposer"
      :project-name="composer.projectName"
      :key="profile"
      :disabled="composer.disabled"
      :models="models"
      :providers="providers"
      :models-loading="modelsLoading"
      :provider="provider"
      @update:provider="actions.setProvider"
      :default-model="defaultModel"
      :model="model"
      @update:model="actions.setModel"
      :sending="viewBusy"
      :stoppable="viewActive && !viewReconnect"
      :suggested-prompt="suggestedPrompt"
      :reason="composer.reason"
      @stop="actions.stop"
      @steer="actions.steer"
      @send="actions.send"
    />
  </div>
</template>
