<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import type { Activity } from "../types/hermes";
import { isCommand, toolLabel } from "../features/chat/utils/activity-labels";
const props = defineProps<{ activity: Activity; turnComplete?: boolean }>();
const active = computed(
  () => !props.activity.complete && (!props.turnComplete || !!props.activity.delegated),
);
const state = computed(() =>
  !active.value && (!props.activity.state || ["pending", "running"].includes(props.activity.state))
    ? props.activity.kind === "tool"
      ? "unknown"
      : "completed"
    : props.activity.state,
);
const needsAttention = computed(() =>
  ["failed", "interrupted", "unknown"].includes(state.value || ""),
);
// null means follow the default; only a user action records disclosure intent.
const userOpen = ref<boolean | null>(null);
const expanded = computed(
  () =>
    userOpen.value ??
    ((props.activity.kind === "thinking" && (needsAttention.value || active.value)) ||
      (props.activity.kind === "tool" && !!props.activity.delegated && active.value)),
);
const preview = ref<HTMLElement>();
const following = ref(true);
function previewScrolled() {
  const element = preview.value;
  if (element)
    following.value = element.scrollHeight - element.scrollTop - element.clientHeight < 24;
}
watch(
  () => [props.activity.content, props.activity.output, expanded.value],
  () => {
    const element = preview.value;
    if (element && active.value && expanded.value && following.value)
      element.scrollTop = element.scrollHeight;
  },
  { flush: "post" },
);
const now = ref(Date.now());
let timer: ReturnType<typeof setInterval> | undefined;
watch(
  () => active.value && props.activity.startedAt !== undefined,
  (running) => {
    if (timer) clearInterval(timer);
    if (running)
      timer = setInterval(() => {
        now.value = Date.now();
      }, 1000);
  },
  { immediate: true },
);
onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
const duration = computed(
  () =>
    props.activity.duration ??
    (active.value && props.activity.startedAt !== undefined
      ? Math.max(0, (now.value - props.activity.startedAt) / 1000)
      : undefined),
);
const label = computed(() => {
  if (props.activity.kind === "thinking") return active.value ? "Thinking…" : "Thought";
  return toolLabel(props.activity, active.value);
});
function toggle(event: Event) {
  const open = (event.target as HTMLDetailsElement).open;
  // Native toggle also fires for :open changes. Do not turn those into intent.
  if (open !== expanded.value) userOpen.value = open;
}
</script>
<template>
  <details
    class="activity"
    :class="{
      'activity-failed': needsAttention,
      'activity-active': active,
      'activity-thinking': activity.kind === 'thinking',
    }"
    :open="expanded"
    @toggle="toggle"
  >
    <summary @click.prevent="userOpen = !expanded">
      <span v-if="isCommand(activity)" class="activity-command-icon" aria-hidden="true">›_</span>
      <span v-if="needsAttention" aria-hidden="true">!</span>
      <span class="activity-label" :class="{ 'working-shimmer': active }" :title="label">{{
        label
      }}</span>
      <span class="activity-meta" v-if="state === 'failed'"> · Failed</span>
      <span class="activity-meta" v-else-if="state === 'interrupted'"> · Interrupted</span>
      <span class="activity-meta" v-else-if="state === 'unknown'"> · Result unavailable</span>
      <span class="activity-meta" v-else-if="active && activity.kind === 'tool'">
        · {{ state === "pending" ? "Waiting…" : "Running…" }}</span
      >
      <span class="activity-meta" v-if="duration !== undefined"> · {{ duration.toFixed(1) }}s</span>
      <span class="work-chevron" :class="{ expanded }" aria-hidden="true">›</span>
    </summary>
    <pre
      v-if="activity.content || activity.output || activity.toolName"
      ref="preview"
      @scroll="previewScrolled"
      >{{
        [activity.toolName, activity.content, activity.output].filter(Boolean).join("\n\n")
      }}</pre>
    <p v-else-if="active" class="ml-6 py-1 text-sm" role="status">Working…</p>
  </details>
</template>
