<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { Activity, Message, TurnBlock } from "../types/hermes";
import { transcriptEntries } from "../features/chat/utils/transcript-entries";
import UserMessage from "../features/chat/components/UserMessage.vue";
import AssistantTurn from "../features/chat/components/AssistantTurn.vue";
import TurnWork from "./TurnWork.vue";
import { renderMarkdown } from "../utils/markdown";
const props = withDefaults(
  defineProps<{
    hasEarlier?: boolean;
    loadingEarlier?: boolean;
    earlierError?: string;
    branchDisabled?: boolean;
    responseTargets?: Record<string, string>;
    profile?: string;
    sessionId?: string;
    messages: Message[];
    draft: string;
    loading: boolean;
    progress: Activity[];
    blocks?: TurnBlock[];
    turnUserCount?: number;
    thinking?: boolean;
    working?: boolean;
    approvalPending?: boolean;
    statusLabel?: string;
    home?: boolean;
    followInitially?: boolean;
  }>(),
  { followInitially: true },
);
const emit = defineEmits<{ branch: [responseId: string]; earlier: [] }>();
const visible = computed(() => entries.value);
const entries = computed(() => transcriptEntries(props));
const transcript = ref<HTMLElement>();
const content = ref<HTMLElement>();
const following = ref(props.followInitially !== false);
const atBottom = ref(true);
let focusedMessage: HTMLElement | undefined;
function focusLatestIfOwned() {
  const element = transcript.value;
  if (!element || !following.value) return;
  if (document.activeElement !== element && document.activeElement !== focusedMessage) return;
  const latest = content.value?.querySelectorAll<HTMLElement>("[data-chat-message]");
  const target = latest?.[latest.length - 1] || element;
  if (document.activeElement !== target) target.focus({ preventScroll: true });
  focusedMessage = target;
}
function focusLatestMessage() {
  // Move focus during the Send click so iOS can dismiss its keyboard. Keep
  // following while session creation and the optimistic message arrive later.
  transcript.value?.focus({ preventScroll: true });
  scrollToLatest();
  void nextTick(() => {
    layoutChanged();
  });
}
defineExpose({ focusLatestMessage });
// Empty history marks a new conversation. Background reloads of existing
// history must preserve the reader's position, even when loading toggles.
let awaitingHistory = !props.messages.length && props.followInitially !== false;
let resizeObserver: ResizeObserver | undefined;
function measureBottom() {
  const element = transcript.value;
  atBottom.value = !element || element.scrollHeight - element.scrollTop - element.clientHeight <= 2;
}
let anchor: { element: HTMLElement; top: number; scrollTop: number } | undefined;
function rememberAnchor() {
  const box = transcript.value;
  if (!box) return;
  const top = box.getBoundingClientRect().top;
  const element = [
    ...box.querySelectorAll<HTMLElement>("[data-chat-message], [data-compaction]"),
  ].find((row) => row.getBoundingClientRect().bottom > top);
  anchor = element
    ? { element, top: element.getBoundingClientRect().top, scrollTop: box.scrollTop }
    : undefined;
}
function earlier() {
  if (props.loadingEarlier || !props.hasEarlier) return;
  following.value = false;
  rememberAnchor();
  emit("earlier");
}
function onScroll() {
  measureBottom();
  if (!awaitingHistory && !props.loadingEarlier) following.value = atBottom.value;
  rememberAnchor();
  if (transcript.value && transcript.value.scrollTop < 160 && !props.earlierError) earlier();
}
function scrollToLatest() {
  const element = transcript.value;
  if (!element) return;
  element.scrollTop = element.scrollHeight;
  following.value = true;
  measureBottom();
}
function layoutChanged() {
  if (following.value) {
    scrollToLatest();
    focusLatestIfOwned();
  } else {
    if (anchor?.element.isConnected && transcript.value) {
      const delta = anchor.element.getBoundingClientRect().top - anchor.top;
      if (Math.abs(delta) > 0.5) transcript.value.scrollTop += delta;
    }
    measureBottom();
    rememberAnchor();
  }
}
async function disclosureChanged() {
  await nextTick();
  layoutChanged();
}
onMounted(() => {
  layoutChanged();
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(layoutChanged);
    if (transcript.value) resizeObserver.observe(transcript.value);
    if (content.value) resizeObserver.observe(content.value);
  }
});
onBeforeUnmount(() => resizeObserver?.disconnect());
watch(
  () => [props.messages, props.hasEarlier, props.loadingEarlier],
  () => {
    // Parent notices and paging controls can move geometry before this
    // component patches. Keep the last measured anchor unless the reader
    // actually moved, so their height changes cannot redefine its position.
    if (
      !following.value &&
      (!anchor?.element.isConnected ||
        Math.abs((transcript.value?.scrollTop || 0) - anchor.scrollTop) > 0.5)
    )
      rememberAnchor();
  },
  { flush: "pre" },
);
watch(
  () => props.sessionId,
  () => {
    anchor = undefined;
    following.value = props.followInitially !== false;
    awaitingHistory = true;
  },
);
watch(
  () => [
    props.loading,
    props.hasEarlier,
    props.loadingEarlier,
    props.messages,
    props.draft,
    props.blocks || props.progress,
    props.working,
    props.thinking,
    props.approvalPending,
  ],
  () => {
    if (!props.messages.length && !props.draft && !props.working)
      awaitingHistory = props.followInitially !== false;
    if (props.loading) return;
    if (awaitingHistory && props.messages.length) {
      following.value = true;
      awaitingHistory = false;
    }
    layoutChanged();
  },
  { deep: true, flush: "post" },
);
</script>
<template>
  <div class="relative flex min-h-0 w-full flex-1">
    <div
      ref="transcript"
      style="overflow-anchor: none"
      class="transcript flex min-h-0 w-full flex-1 flex-col overflow-y-auto px-4 py-6 text-white min-[701px]:px-[max(24px,calc((100%-760px)/2))] min-[701px]:py-9"
      tabindex="-1"
      role="log"
      aria-label="Conversation"
      aria-live="polite"
      @scroll="onScroll"
      @toggle.capture="disclosureChanged"
    >
      <div ref="content" class="flex min-h-full shrink-0 flex-col gap-7">
        <div
          v-if="hasEarlier || loadingEarlier || earlierError"
          class="text-center text-sm text-[#a3a3a3]"
        >
          <button
            type="button"
            :disabled="loadingEarlier"
            class="rounded-full px-4 py-2 hover:bg-[#303030] disabled:opacity-60"
            @click="earlier"
          >
            {{ loadingEarlier ? "Loading earlier messages…" : "Show earlier messages" }}
          </button>
          <p v-if="earlierError" role="status">{{ earlierError }}</p>
        </div>
        <div v-if="loading" class="muted text-sm text-[#a3a3a3]">Loading conversation…</div>
        <div
          v-else-if="!visible.length && !draft && !thinking"
          class="empty-state mx-auto flex w-full max-w-[760px] flex-1 flex-col"
        >
          <div class="m-auto text-center">
            <h2 class="text-2xl font-medium">What can I help with?</h2>
            <p class="mt-3 text-sm text-[#a3a3a3]">
              Ask Hermes a question or continue a conversation.
            </p>
          </div>
        </div>
        <template v-for="entry in entries" :key="entry.key">
          <div
            v-if="entry.kind === 'compaction'"
            data-compaction
            class="flex items-center gap-3 text-xs text-[#a3a3a3]"
            role="separator"
            aria-label="Context compacted"
          >
            <span class="h-px flex-1 bg-[#383838]" /><span>Context compacted</span
            ><span class="h-px flex-1 bg-[#383838]" />
          </div>
          <UserMessage
            v-else-if="entry.kind === 'user'"
            data-chat-message
            tabindex="-1"
            :message="entry.message"
            :profile="profile"
            :session-id="sessionId"
            @image-load="disclosureChanged"
          />
          <div v-else-if="entry.kind === 'status'" class="text-sm text-[#a3a3a3]" role="status">
            <details class="system-notices">
              <summary class="cursor-pointer select-none">{{ entry.text }}</summary>
              <p class="mt-2 whitespace-pre-wrap break-words">{{ entry.content }}</p>
            </details>
          </div>
          <AssistantTurn
            v-else
            data-chat-message
            tabindex="-1"
            :entry="{ ...entry, responseId: entry.responseId || responseTargets?.[entry.key] }"
            :branch-disabled="branchDisabled"
            @branch="emit('branch', $event)"
            :profile="profile"
            :session-id="sessionId"
            @image-load="disclosureChanged"
          >
            <template v-if="entry.working" #request><slot name="request" /></template>
          </AssistantTurn>
        </template>
        <div
          v-if="working && !entries.some((entry) => entry.kind === 'turn' && entry.working)"
          class="assistant-turn"
          data-chat-message
          tabindex="-1"
        >
          <TurnWork :activities="progress" :working="true" :approval-pending="approvalPending" />
        </div>
        <div v-if="statusLabel && !working" class="text-sm text-[#a3a3a3]" role="status">
          {{ statusLabel }}
        </div>
        <slot
          v-if="!entries.some((entry) => entry.kind === 'turn' && entry.working)"
          name="request"
        />
        <article
          v-if="draft && !blocks?.length"
          class="message assistant w-full self-start"
          data-chat-message
          tabindex="-1"
        >
          <div
            class="message-content markdown-content break-words text-base leading-7"
            v-html="renderMarkdown(draft)"
          />
        </article>
      </div>
    </div>
    <button
      v-if="!atBottom && !home && !loading"
      type="button"
      class="absolute bottom-5 left-1/2 z-10 flex size-10 -translate-x-1/2 items-center justify-center rounded-full border border-[#424242] bg-[#303030] text-white shadow-xl hover:bg-[#424242] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      aria-label="Scroll to latest message"
      title="Scroll to latest message"
      @click="scrollToLatest"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        class="size-5"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M12 5v14m-7-7 7 7 7-7" />
      </svg>
    </button>
  </div>
</template>
