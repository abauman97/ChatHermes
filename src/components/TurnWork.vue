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
const active = (activity: Activity) => props.working && !activity.complete;
// Summarize settled calls even while the next call is streaming. Keep the
// keyed timeline intact so live updates never remount a row or lose its intent.
const settled = computed(() => props.activities.filter((activity) => !active(activity)));
const grouped = computed(() => props.activities.length > 1 && settled.value.length > 0);
const expanded = computed(() => userOpen.value ?? false);
// Completed failures fold like successes; stopped or unavailable calls remain
// visible so a missing result is not mistaken for completed work.
const needsAttention = (activity: Activity) =>
  ["interrupted", "unknown"].includes(activity.state || "") ||
  (!props.working && !activity.complete);
const label = computed(() =>
  props.approvalPending
    ? "Waiting for approval"
    : !props.activities.length
      ? "Working…"
      : toolGroupLabel(settled.value, false),
);
</script>
<template>
  <section class="turn-work" aria-label="Tool activity">
    <button
      v-if="grouped || !activities.length"
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
    <div :id="timelineId" class="work-timeline" :class="{ 'work-timeline-single': !grouped }">
      <template v-for="activity in activities" :key="activity.id">
        <div
          v-show="!grouped || expanded || active(activity) || needsAttention(activity)"
          :class="{ 'current-activity': active(activity) }"
        >
          <ActivityRow :activity="activity" :turn-complete="!working" />
        </div>
        <slot name="result" :activity="activity" />
      </template>
    </div>
  </section>
</template>
