<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from "vue";
import type { Attachment } from "../../../types/hermes";
import { useChat, conversationFocus } from "../context";
import ChatComposer from "./ChatComposer.vue";
const props = defineProps<{ showChat: boolean; hideComposer?: boolean; draftScope?: string }>();
const picker = ref<InstanceType<typeof ChatComposer>>();
const transcript = ref<{ focusLatestMessage: () => void }>();
provide(conversationFocus, transcript);
let pendingFocus = false;
function focusConversation() {
  // Home and session routes mount distinct transcripts; transfer Send focus when
  // that replacement arrives, unless the reader has already focused a new draft.
  pendingFocus = true;
  if (transcript.value) transcript.value.focusLatestMessage();
  else {
    // Project home creates the conversation asynchronously.
    picker.value?.blurInput();
  }
}
watch(
  transcript,
  (current) => {
    if (!current || !pendingFocus) return;
    pendingFocus = false;
    if (document.activeElement === document.body) current.focusLatestMessage();
  },
  { flush: "post" },
);
async function sendMessage(text: string, attachments: Attachment[]) {
  const owner = picker.value;
  focusConversation();
  try {
    const sent = await actions.send(text, attachments);
    if (sent === false) {
      await nextTick();
      if (owner === picker.value) picker.value?.restoreDraft(text, attachments);
    }
  } finally {
    pendingFocus = false;
  }
}
async function steerMessage(text: string) {
  focusConversation();
  try {
    await actions.steer(text);
  } finally {
    pendingFocus = false;
  }
}
const dragging = ref(0);
function acceptsFiles(event: DragEvent) {
  return (
    props.showChat &&
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
  offline,
  canStream: nativeMode,
  reasoningEffort,
  models,
  providers,
  modelsLoading,
  model,
  provider,
  defaultModel,
  suggestedPrompt,
} = scope;
const {
  busy: viewBusy,
  active: viewActive,
  reconnect: viewReconnect,
  error: viewError,
  unavailable: viewUnavailable,
  connection,
} = view;
</script>
<template>
  <div class="chat-interface relative flex min-h-0 flex-1 flex-col overflow-hidden">
    <div
      v-if="dragging && showChat"
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
        v-if="showChat && viewReconnect"
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
        v-if="showChat && viewError"
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
      <slot />
    </div>
    <div class="composer-dock shrink-0">
      <div
        v-if="view.commandResults.value.length"
        class="mx-auto max-h-48 w-[calc(100%-24px)] max-w-[760px] overflow-y-auto px-2 pb-2 text-sm"
        aria-label="Command results"
        role="region"
      >
        <details
          v-for="(result, index) in view.commandResults.value"
          :key="index"
          :open="index === view.commandResults.value.length - 1"
        >
          <summary>{{ result.command }} · temporary result</summary>
          <pre class="whitespace-pre-wrap break-words font-sans" role="status">{{
            result.output
          }}</pre>
        </details>
      </div>
      <ChatComposer
        ref="picker"
        :profile="profile"
        :complete-slash="actions.completeSlash"
        :slash-scope="
          JSON.stringify([draftScope, composer.slashScope, nativeMode, connection, offline])
        "
        :session-id="nativeMode ? session || undefined : undefined"
        :context-usage="view.contextUsage.value"
        :context-breakdown="view.contextBreakdown.value"
        :context-loading="view.contextLoading.value"
        @context-open="actions.setContextOpen"
        v-show="!hideComposer"
        :project-name="composer.projectName"
        :key="JSON.stringify([profile, draftScope])"
        :disabled="composer.disabled || view.commandRunning.value"
        :models="models"
        :providers="providers"
        :models-loading="modelsLoading"
        :provider="provider"
        @update:provider="actions.setProvider"
        :default-model="defaultModel"
        :reasoning-effort="reasoningEffort"
        @update:reasoning-effort="actions.setReasoningEffort"
        :model="model"
        @update:model="actions.setModel"
        :sending="viewBusy"
        :stoppable="viewActive && !viewReconnect"
        :suggested-prompt="suggestedPrompt"
        :reason="composer.reason"
        @stop="actions.stop"
        @steer="steerMessage"
        @send="sendMessage"
      />
    </div>
  </div>
</template>
