<script setup lang="ts">
import { ref } from "vue";
import ClarificationCard from "./ClarificationCard.vue";
import type { PendingRequest, RequestAnswer } from "../utils/chat-requests";
const props = defineProps<{
  request: Extract<PendingRequest, { kind: "clarify" }>;
  disabled: boolean;
  answer: (answer: RequestAnswer) => Promise<void>;
}>();
const pending = ref(false);
async function submit(answers: Record<string, string>) {
  if (pending.value || props.disabled) return;
  pending.value = true;
  try {
    await props.answer({ answers });
  } finally {
    pending.value = false;
  }
}
</script>
<template>
  <ClarificationCard
    :questions="request.params.questions"
    :disabled="disabled || pending"
    @answer="submit"
  />
</template>
