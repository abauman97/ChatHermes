<script setup lang="ts">
import { ref } from "vue";
import type { PendingRequest, RequestAnswer } from "../utils/chat-requests";
const props = defineProps<{
  request: Extract<PendingRequest, { kind: "secret" }>;
  disabled: boolean;
  answer: (answer: RequestAnswer) => Promise<void>;
}>();
const value = ref("");
const pending = ref(false);
async function submit() {
  if (!value.value || pending.value || props.disabled) return;
  const secret = value.value;
  value.value = "";
  pending.value = true;
  try {
    await props.answer({ value: secret });
  } finally {
    pending.value = false;
  }
}
</script>
<template>
  <p>{{ request.params.prompt }}</p>
  <form @submit.prevent="submit">
    <label class="block my-3"
      >{{ request.params.env_var }}
      <input
        v-model="value"
        type="password"
        autocomplete="off"
        :aria-label="request.params.prompt || 'Secret'"
        :disabled="disabled || pending"
        class="block w-full rounded-lg bg-[#303030] p-2 text-base"
      />
    </label>
    <button
      type="submit"
      :disabled="disabled || pending || !value"
      class="rounded-lg bg-[#303030] p-2 text-base"
    >
      Submit secret
    </button>
  </form>
</template>
