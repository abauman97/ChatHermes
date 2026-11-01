<script setup lang="ts">
import { computed, ref, useId } from "vue";
import type { Activity } from "../types/hermes";
import ActivityRow from "./ActivityRow.vue";
import { isCommand, toolGroupLabel } from "../features/chat/utils/activity-labels";
const props = defineProps<{
  activities: Activity[];
  working: boolean;
  approvalPending?: boolean;
}>();
const userOpen = ref<boolean | null>(null);
const timelineId = useId();
const active = (activity: Activity) =>
  !activity.complete && (props.working || !!activity.delegated);
// Summarize settled calls even while the next call is streaming. Keep the
// keyed timeline intact so live updates never remount a row or lose its intent.
const settled = computed(() => props.activities.filter((activity) => !active(activity)));
const expanded = computed(() => userOpen.value ?? false);
const label = computed(() =>
  props.approvalPending
    ? "Waiting for approval"
    : !props.activities.length
      ? "Working…"
      : [
          settled.value.some((activity) => activity.kind === "thinking") ? "Thought" : "",
          toolGroupLabel(
            settled.value.filter((activity) => activity.kind === "tool"),
            false,
          ),
          ...["interrupted", "unknown"].flatMap((state) => {
            const count = settled.value.filter((activity) =>
              state === "unknown"
                ? activity.state === state || !activity.complete
                : activity.state === state && activity.complete,
            ).length;
            return count ? [`${count} ${state === "unknown" ? "results unavailable" : state}`] : [];
          }),
        ]
          .filter(Boolean)
          .join(", ") || "Working…",
);
</script>
<template>
  <section class="turn-work" aria-label="Assistant activity">
    <button
      type="button"
      class="work-summary"
      :aria-expanded="expanded"
      :aria-controls="timelineId"
      @click="userOpen = !expanded"
    >
      <span v-if="activities.some(isCommand)" class="activity-command-icon" aria-hidden="true"
        >›_</span
      >
      <span
        class="activity-label"
        :class="{
          'working-shimmer': working && !activities.length && !approvalPending,
        }"
        :title="label"
        >{{ label }}</span
      >
      <span class="work-chevron" :class="{ expanded }" aria-hidden="true">›</span>
      <span v-if="approvalPending" class="sr-only" role="status">Waiting for approval</span>
    </button>
    <div :id="timelineId" class="work-timeline">
      <template v-for="activity in activities" :key="activity.id">
        <div
          v-show="expanded || active(activity)"
          :class="{ 'current-activity': active(activity) }"
        >
          <ActivityRow :activity="activity" :turn-complete="!working" />
        </div>
        <slot name="result" :activity="activity" />
      </template>
    </div>
  </section>
</template>
