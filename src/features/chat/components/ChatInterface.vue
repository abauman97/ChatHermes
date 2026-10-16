<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useChat } from "../context";
import ChatTranscript from "../../../components/ChatTranscript.vue";
import ChatComposer from "./ChatComposer.vue";
import LiveRequest from "./LiveRequest.vue";
const props = defineProps<{ showPage: boolean; hideComposer?: boolean }>();
const picker = ref<InstanceType<typeof ChatComposer>>();
const dragging = ref(0);
function acceptsFiles(event: DragEvent) {
  return (
    !props.showPage &&
    !!event.dataTransfer?.types.includes("Files") &&
    event
      .composedPath()
      .some((node) => node instanceof HTMLElement && node.classList.contains("app-shell"))
  );
}
function dragEnter(event: DragEvent) {
  if (acceptsFiles(event)) {
    event.preventDefault();
    dragging.value++;
  }
}
function dragOver(event: DragEvent) {
  if (acceptsFiles(event)) event.preventDefault();
}
function dragLeave() {
  dragging.value = Math.max(0, dragging.value - 1);
}
function drop(event: DragEvent) {
  dragging.value = 0;
  if (!acceptsFiles(event) || !event.dataTransfer?.files.length) return;
  event.preventDefault();
  void picker.value?.stageFiles(Array.from(event.dataTransfer.files));
}
onMounted(() => {
  document.addEventListener("dragenter", dragEnter);
  document.addEventListener("dragover", dragOver);
  document.addEventListener("dragleave", dragLeave);
  document.addEventListener("drop", drop);
});
onBeforeUnmount(() => {
  document.removeEventListener("dragenter", dragEnter);
  document.removeEventListener("dragover", dragOver);
  document.removeEventListener("dragleave", dragLeave);
  document.removeEventListener("drop", drop);
});
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
  status,
} = view;
</script>
<template>
  <div class="chat-interface relative flex min-h-0 flex-1 flex-col overflow-hidden">
    <div
      v-if="dragging && !showPage"
      class="pointer-events-none absolute inset-0 z-20 grid place-items-center rounded-3xl border-2 border-dashed border-[#a3a3a3] bg-[#212121]/95 text-lg"
      role="status"
    >
      Drop files to attach
    </div>
    <div class="chat-content flex min-h-0 flex-1 flex-col overflow-hidden">
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
          connection === "reconnecting"
            ? "Reconnecting…"
            : "Session is read-only until reconnected."
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
        :session-id="session"
        :messages="viewMessages"
        :draft="''"
        :loading="viewLoading"
        :progress="[]"
        :thinking="viewBusy"
        :working="viewBusy || viewApprovalPending"
        :approval-pending="viewApprovalPending"
        :home="!session"
        :status-label="status"
      >
        <template #request><LiveRequest /></template>
      </ChatTranscript>
    </div>
    <div class="composer-dock shrink-0">
      <ChatComposer
        ref="picker"
        :profile="profile"
        v-show="!settingsPage && !hideComposer"
        :project-name="composer.projectName"
        :key="JSON.stringify([profile, session])"
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
  </div>
</template>
