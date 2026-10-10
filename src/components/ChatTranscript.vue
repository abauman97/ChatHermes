<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { Activity, Message, TurnBlock } from "../types/hermes";
import { transcriptEntries } from "../features/chat/utils/transcript-entries";
import UserMessage from "../features/chat/components/UserMessage.vue";
import AssistantTurn from "../features/chat/components/AssistantTurn.vue";
import TurnWork from "./TurnWork.vue";
import { renderMarkdown } from "../utils/markdown";
import { sessionArtifacts, type Artifact } from "../features/artifacts/service";
const artifactRows = ref<Artifact[]>([]);
let artifactAbort: AbortController | undefined,
  artifactTimer: ReturnType<typeof setTimeout> | undefined;
const props = withDefaults(
  defineProps<{
    profile?: string;
    session?: string;
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
watch(
  () => [props.profile, props.session, props.messages, props.working],
  () => {
    clearTimeout(artifactTimer);
    artifactAbort?.abort();
    if (!props.session) {
      artifactRows.value = [];
      return;
    }
    artifactTimer = setTimeout(
      async () => {
        const current = (artifactAbort = new AbortController());
        try {
          const rows = await sessionArtifacts(props.profile || "", props.session!, current.signal);
          if (!current.signal.aborted) artifactRows.value = rows;
        } catch {
          /* Transcript remains readable if artifact discovery is unavailable. */
        }
      },
      props.working ? 1000 : 100,
    );
  },
  { deep: true, immediate: true },
);
watch(
  () => [props.profile, props.session],
  () => {
    artifactRows.value = [];
  },
);
onBeforeUnmount(() => {
  clearTimeout(artifactTimer);
  artifactAbort?.abort();
});
const emit = defineEmits<{ suggest: [text: string] }>();
const visible = computed(() => props.messages.filter((message) => message.role !== "system"));
const entries = computed(() => transcriptEntries(props));
const transcript = ref<HTMLElement>();
const content = ref<HTMLElement>();
const following = ref(props.followInitially !== false);
const atBottom = ref(true);
// Empty history marks a new conversation. Background reloads of existing
// history must preserve the reader's position, even when loading toggles.
let awaitingHistory = !props.messages.length && props.followInitially !== false;
let resizeObserver: ResizeObserver | undefined;
function measureBottom() {
  const element = transcript.value;
  atBottom.value = !element || element.scrollHeight - element.scrollTop - element.clientHeight <= 2;
}
function onScroll() {
  measureBottom();
  if (!awaitingHistory) following.value = atBottom.value;
}
function scrollToLatest() {
  const element = transcript.value;
  if (!element) return;
  element.scrollTop = element.scrollHeight;
  following.value = true;
  measureBottom();
}
function layoutChanged() {
  if (following.value) scrollToLatest();
  else measureBottom();
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
  () => [
    props.loading,
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
      class="transcript flex min-h-0 w-full flex-1 flex-col overflow-y-auto px-4 py-6 text-white min-[701px]:px-[max(24px,calc((100%-760px)/2))] min-[701px]:py-9"
      role="log"
      aria-label="Conversation"
      aria-live="polite"
      @scroll="onScroll"
      @toggle.capture="disclosureChanged"
    >
      <div ref="content" class="flex min-h-full shrink-0 flex-col gap-7">
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
          <div v-if="home" class="grid gap-2 pt-8 text-[#b4b4b4]">
            <button
              class="flex items-center gap-3 rounded-2xl px-3 py-3 text-left hover:bg-[#303030]"
              @click="emit('suggest', 'Help me review my latest project changes')"
            >
              <span aria-hidden="true">⌘</span
              ><span class="truncate">Help me review my latest project changes</span>
            </button>
            <button
              class="flex items-center gap-3 rounded-2xl px-3 py-3 text-left hover:bg-[#303030]"
              @click="emit('suggest', 'Find the most useful next step for my work')"
            >
              <span aria-hidden="true">✳</span
              ><span class="truncate">Find the most useful next step for my work</span>
            </button>
          </div>
        </div>
        <template v-for="entry in entries" :key="entry.key">
          <UserMessage
            v-if="entry.kind === 'user'"
            :message="entry.message"
            :artifacts="artifactRows"
            :profile="profile"
            @image-load="disclosureChanged"
          />
          <AssistantTurn
            v-else-if="entry.kind === 'turn'"
            :entry="entry"
            :profile="profile"
            :artifacts="artifactRows"
            @image-load="disclosureChanged"
          />
        </template>
        <div
          v-if="working && !entries.some((entry) => entry.kind === 'turn' && entry.working)"
          class="assistant-turn"
        >
          <TurnWork :activities="progress" :working="true" :approval-pending="approvalPending" />
        </div>
        <slot name="request" />
        <article v-if="draft && !blocks?.length" class="message assistant w-full self-start">
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
