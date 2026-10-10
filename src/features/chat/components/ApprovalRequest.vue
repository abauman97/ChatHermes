<script setup lang="ts">
import { ref } from "vue";
import type { PendingRequest, RequestAnswer } from "../utils/chat-requests";
import type { ApprovalChoice } from "../../../vendor/hermes/gateway-contract.generated";
const props = defineProps<{
  request: Extract<PendingRequest, { kind: "approval" }>;
  disabled: boolean;
  active: boolean;
  answer: (answer: RequestAnswer) => Promise<void>;
}>();
const pending = ref(false);
async function submit(choice: ApprovalChoice) {
  if (pending.value || props.disabled) return;
  pending.value = true;
  try {
    await props.answer({ choice });
  } finally {
    pending.value = false;
  }
}
</script>
<template>
  <p>Approval required{{ request.params.command ? ": " + request.params.command : "" }}</p>
  <div v-if="active" class="approval-choices grid grid-cols-1 gap-2 my-3">
    <button
      v-for="choice in request.params.choices"
      :key="choice"
      class="w-full rounded-xl bg-[#303030] px-[14px] py-[10px] text-left text-base leading-[1.5] text-white whitespace-normal break-words disabled:opacity-55"
      :class="choice === 'deny' ? 'text-red-500' : ''"
      :disabled="disabled || pending"
      @mousedown.prevent
      @click="submit(choice)"
    >
      {{
        choice === "once"
          ? "Allow once"
          : choice === "deny"
            ? "Deny"
            : choice === "session"
              ? "Allow for session"
              : "Always allow"
      }}
    </button>
  </div>
</template>
