<script setup lang="ts">
import { useChat } from "../context";
import ApprovalRequest from "./ApprovalRequest.vue";
import ClarificationRequest from "./ClarificationRequest.vue";
import SecretRequest from "./SecretRequest.vue";
const { view, scope, actions } = useChat();
const { request, reconnect, active } = view;
const { profile, session } = scope;
// Each render captures the envelope identity, never the next request's ID.
const answerFor = actions.answerFor;
</script>
<template>
  <div
    v-if="request"
    :key="JSON.stringify([profile, session, request.id])"
    class="notice px-5 py-3 text-sm"
    role="status"
  >
    <ApprovalRequest
      v-if="request.kind === 'approval'"
      :request="request"
      :disabled="reconnect"
      :active="active"
      :answer="answerFor(request.id)"
    />
    <ClarificationRequest
      v-else-if="request.kind === 'clarify'"
      :request="request"
      :disabled="reconnect"
      :answer="answerFor(request.id)"
    />
    <SecretRequest
      v-else-if="request.kind === 'secret'"
      :request="request"
      :disabled="reconnect"
      :answer="answerFor(request.id)"
    />
    <p v-else>This request cannot be displayed. Open it in Hermes.</p>
  </div>
</template>
