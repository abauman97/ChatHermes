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
const grouped = computed(() => props.activities.length > 1);
const running = computed(() => props.activities.some(active));
const expanded = computed(() => userOpen.value ?? running.value);
const needsAttention = (activity: Activity) =>
  ["failed", "interrupted", "unknown"].includes(activity.state || "") ||
  (!props.working && !activity.complete);
const label = computed(() =>
  props.approvalPending
    ? "Waiting for approval"
    : !props.activities.length
      ? "Working…"
      : toolGroupLabel(props.activities, running.value),
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
          'working-shimmer': running || (working && !activities.length && !approvalPending),
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
