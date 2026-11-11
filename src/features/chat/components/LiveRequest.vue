<script setup lang="ts">
import { useChat } from "../context";
import ApprovalRequest from "./ApprovalRequest.vue";
import ClarificationRequest from "./ClarificationRequest.vue";
import SecretRequest from "./SecretRequest.vue";
const { view, scope, actions } = useChat();
const { request, requestDisabled } = view;
const { profile, session } = scope;
// Each render captures the envelope identity, never the next request's ID.
const answerFor = actions.answerFor;
</script>
<template>
  <div
    v-if="request"
    :key="JSON.stringify([profile, session, request.id])"
    class="live-request notice px-5 py-3 text-sm"
    role="status"
  >
    <ApprovalRequest
      v-if="request.kind === 'approval'"
      :request="request"
      :disabled="requestDisabled"
      :answer="answerFor(request.id)"
    />
    <ClarificationRequest
      v-else-if="request.kind === 'clarify'"
      :request="request"
      :disabled="requestDisabled"
      :answer="answerFor(request.id)"
    />
    <SecretRequest
      v-else-if="request.kind === 'secret'"
      :request="request"
      :disabled="requestDisabled"
      :answer="answerFor(request.id)"
    />
    <p v-else>This request cannot be displayed. Open it in Hermes.</p>
  </div>
</template>

<style scoped>
.live-request {
  min-width: 0;
  max-width: 100%;
  /* Commands, questions and environment names can contain unbroken tokens.
     Include wrapping in intrinsic sizing so nested flex/grid items can shrink. */
  overflow-wrap: anywhere;
}
</style>
