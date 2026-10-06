<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import type { Activity } from '../types/hermes'
import ActivityRow from './ActivityRow.vue'
const props = defineProps<{ activities: Activity[]; working: boolean; approvalPending?: boolean }>()
const expanded = ref(false)
const timelineId = useId()
// Keep the ordered collection and row instances intact when hiding history.
const rows = computed(() => props.activities.map(activity => props.working ? activity : { ...activity, complete: true }))
const activeTool = computed(() => {
  if (!props.working) return undefined
  for (let index = rows.value.length - 1; index >= 0; index--) {
    const activity = rows.value[index]
    if (activity.kind === 'tool' && !activity.complete) return activity
  }
  return undefined
})
const timelineRows = computed(() => rows.value.filter(activity => activity.kind !== 'tool' || activity.complete))
const visibleActive = (activity: Activity) => props.working && !activity.complete
watch(() => props.working, working => { if (!working) expanded.value = false })
</script>
<template>
  <section class="turn-work" aria-label="Turn work">
    <button type="button" class="work-summary" :aria-expanded="expanded" :aria-controls="timelineId" @click="expanded = !expanded">
      <span class="work-chevron" :class="{ expanded }" aria-hidden="true">›</span>
      <span :class="{ 'working-shimmer': working && !approvalPending }">{{ approvalPending ? 'Waiting for approval' : working ? 'Working…' : 'Worked' }}<template v-if="working && !approvalPending && activeTool"> <span class="working-shimmer-tool"> Using tool: {{ activeTool.toolName }}</span></template></span>

      <span v-if="approvalPending" class="sr-only" role="status">Waiting for approval</span>
    </button>
    <div :id="timelineId" class="work-timeline">
      <div v-for="activity in timelineRows" :key="activity.id" v-show="expanded || visibleActive(activity)" :class="{ 'current-activity': visibleActive(activity) }">
        <ActivityRow :activity="activity" :turn-complete="!working" />
      </div>
    </div>
  </section>
</template>
