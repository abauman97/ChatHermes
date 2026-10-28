<script setup lang="ts">
import { computed } from "vue";
import type {
  Usage,
  SessionContextBreakdownResult,
} from "../../../vendor/hermes/gateway-contract.generated";
import { contextNumber, contextPercent } from "../utils/context-usage";
const props = defineProps<{
  usage: Usage | null;
  breakdown: SessionContextBreakdownResult | null;
  loading: boolean;
  model?: string;
}>();
defineEmits<{ close: [] }>();
// Gateway category colors refer to Desktop theme variables. Resolve them locally
// while keeping category identities, order and counts entirely gateway supplied.
const colors: Record<string, string> = {
  system_prompt: "#60a5fa",
  tool_definitions: "#a78bfa",
  skills: "#34d399",
  memory: "#fb923c",
  rules: "#fbbf24",
  mcp: "#f472b6",
  subagent_definitions: "#22d3ee",
  conversation: "#818cf8",
};
const categories = computed(() =>
  (props.breakdown?.categories || [])
    .filter(
      (category) =>
        category && typeof category.label === "string" && contextNumber(category.tokens) !== null,
    )
    .map((category) => ({ ...category, color: colors[category.id] || "#a3a3a3" })),
);
const total = computed(() => categories.value.reduce((sum, category) => sum + category.tokens, 0));
const occupancy = computed(() =>
  contextPercent(props.usage) !== null ? props.usage : props.breakdown,
);
const percent = computed(() => contextPercent(occupancy.value));
const tokens = (value: unknown) => contextNumber(value)?.toLocaleString() ?? "—";
const estimated = computed(
  () =>
    occupancy.value?.context_estimated ||
    ["local_estimate", "provider_usage_plus_estimate"].includes(
      occupancy.value?.context_source || "",
    ),
);
</script>
<template>
  <section
    role="dialog"
    aria-label="Context usage"
    class="context-panel rounded-2xl border border-[#424242] bg-[#212121] p-3 text-sm text-white shadow-xl"
  >
    <div class="flex items-center justify-between gap-3">
      <strong>Context usage</strong>
      <button
        type="button"
        aria-label="Close context usage"
        class="px-2 text-base"
        @click="$emit('close')"
      >
        ×
      </button>
    </div>
    <p class="mt-1 break-all">{{ usage?.model || breakdown?.model || model || "Current model" }}</p>
    <p class="text-[#b4b4b4]">
      {{ tokens(occupancy?.context_used) }} / {{ tokens(occupancy?.context_max) }} tokens ·
      {{ percent === null ? "Unknown" : `${Math.round(percent)}%` }}
    </p>
    <p v-if="percent === null" class="mt-2 text-[#b4b4b4]">Context usage unavailable</p>
    <p v-if="estimated" class="text-amber-200">Estimated usage</p>
    <p v-if="contextNumber(usage?.compressions) !== null" class="text-[#b4b4b4]">
      {{ usage?.compressions }} compressions
    </p>
    <p v-if="loading" class="mt-2 text-[#b4b4b4]" role="status">Loading context breakdown…</p>
    <template v-else-if="categories.length">
      <p class="mt-3 text-[#b4b4b4]">Estimated breakdown</p>
      <div
        class="context-breakdown-bar mt-2 flex h-2 overflow-hidden rounded-full bg-[#424242]"
        aria-hidden="true"
      >
        <span
          v-for="(category, index) in categories"
          :key="`${category.id}-${index}`"
          :style="{
            width: total > 0 ? `${(category.tokens / total) * 100}%` : '0%',
            backgroundColor: category.color,
          }"
        />
      </div>
      <dl class="mt-2 space-y-1">
        <div
          v-for="(category, index) in categories"
          :key="`${category.id}-${index}`"
          class="flex items-center justify-between gap-3"
        >
          <dt class="flex min-w-0 items-center gap-2">
            <span
              class="size-2 shrink-0 rounded-full"
              :style="{ backgroundColor: category.color }"
              aria-hidden="true"
            />{{ category.label }}
          </dt>
          <dd class="shrink-0">{{ tokens(category.tokens) }} tokens</dd>
        </div>
      </dl>
    </template>
    <p v-else class="mt-2 text-[#b4b4b4]">
      Context breakdown unavailable until the agent has initialized.
    </p>
  </section>
</template>
