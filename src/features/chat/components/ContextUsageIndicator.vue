<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import type {
  Usage,
  SessionContextBreakdownResult,
} from "../../../vendor/hermes/gateway-contract.generated";
import { contextPercent } from "../utils/context-usage";
import ContextUsagePopover from "./ContextUsagePopover.vue";
const props = defineProps<{
  usage: Usage | null;
  breakdown: SessionContextBreakdownResult | null;
  loading: boolean;
  active: boolean;
  visible?: boolean;
  model?: string;
}>();
const emit = defineEmits<{ open: [open: boolean] }>();
const root = ref<HTMLElement>(),
  button = ref<HTMLButtonElement>();
const open = ref(false),
  pinned = ref(false),
  height = ref(360);
const id = useId();
let timer: ReturnType<typeof setTimeout> | undefined;
let observer: ResizeObserver | undefined;
const percent = computed(() => contextPercent(props.usage));
const tone = computed(() =>
  percent.value === null
    ? "text-[#a3a3a3]"
    : percent.value >= 90
      ? "text-red-200"
      : percent.value >= 75
        ? "text-amber-200"
        : "text-emerald-200",
);
function position() {
  const top = root.value?.closest(".composer")?.getBoundingClientRect().top ?? 0;
  // Content clips below the plugin header. Also respect visual viewport panning.
  const boundary = Math.max(
    window.visualViewport?.offsetTop ?? 0,
    root.value?.closest(".chat-interface")?.getBoundingClientRect().top ?? 0,
  );
  height.value = Math.max(0, Math.min(360, top - boundary - 16));
}
function cancelClose() {
  clearTimeout(timer);
}
function close() {
  cancelClose();
  pinned.value = false;
  open.value = false;
}
function show() {
  cancelClose();
  if (!props.active || open.value) return;
  position();
  open.value = true;
  void nextTick(position);
}
function hover(event: PointerEvent) {
  if (event.pointerType === "mouse") show();
}
function leave() {
  if (!pinned.value) timer = setTimeout(close, 150);
}
function toggle() {
  if (pinned.value) close();
  else {
    show();
    pinned.value = open.value;
  }
}
function outside(event: MouseEvent) {
  if (!event.composedPath().includes(root.value as EventTarget)) close();
}
function keydown(event: KeyboardEvent) {
  if (event.key !== "Escape" || !open.value) return;
  const restore = root.value?.contains(document.activeElement);
  close();
  if (restore) button.value?.focus();
}
watch(open, (value) => emit("open", value), { flush: "sync" });
watch(
  () => props.active,
  (value) => {
    if (!value) close();
  },
);
onMounted(() => {
  document.addEventListener("click", outside);
  document.addEventListener("keydown", keydown);
  window.addEventListener("resize", position);
  window.addEventListener("scroll", position, true);
  window.visualViewport?.addEventListener("resize", position);
  window.visualViewport?.addEventListener("scroll", position);
  if (typeof ResizeObserver !== "undefined") {
    observer = new ResizeObserver(position);
    const composer = root.value?.closest(".composer");
    if (composer) observer.observe(composer);
  }
});
onBeforeUnmount(() => {
  close();
  observer?.disconnect();
  document.removeEventListener("click", outside);
  document.removeEventListener("keydown", keydown);
  window.removeEventListener("resize", position);
  window.removeEventListener("scroll", position, true);
  window.visualViewport?.removeEventListener("resize", position);
  window.visualViewport?.removeEventListener("scroll", position);
});
</script>
<template>
  <div
    ref="root"
    v-show="visible ?? active"
    class="context-control shrink-0"
    @pointerenter="cancelClose"
    @pointerleave="leave"
  >
    <button
      ref="button"
      type="button"
      class="context-meter relative grid size-[30px] place-items-center rounded-full p-0 text-[9px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
      :class="tone"
      :aria-label="
        percent === null
          ? 'Context usage unavailable'
          : `Context ${Math.round(percent)} percent used`
      "
      aria-haspopup="dialog"
      :aria-expanded="open"
      :aria-controls="id"
      @click="toggle"
      @pointerenter="hover"
    >
      <svg viewBox="0 0 30 30" class="absolute inset-0 size-full -rotate-90" aria-hidden="true">
        <circle cx="15" cy="15" r="13" fill="none" stroke="#525252" stroke-width="2" />
        <circle
          v-if="percent !== null"
          cx="15"
          cy="15"
          r="13"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          pathLength="100"
          :stroke-dasharray="`${percent} 100`"
        />
      </svg>
      <span>{{ percent === null ? "—" : `${Math.round(percent)}%` }}</span>
    </button>
    <ContextUsagePopover
      v-if="open"
      :id="id"
      class="absolute bottom-full right-0 z-30 mb-2 w-full max-w-[340px] overflow-y-auto overscroll-contain"
      :style="{ maxHeight: `${height}px` }"
      :usage="usage"
      :breakdown="breakdown"
      :loading="loading"
      :model="model"
      @close="close"
    />
  </div>
</template>
