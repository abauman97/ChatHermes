<script setup lang="ts">
import { inject, onMounted, onBeforeUnmount, ref } from "vue";
import ChatTranscript from "../../../components/ChatTranscript.vue";
import LiveRequest from "./LiveRequest.vue";
import { useChat, conversationFocus } from "../context";
const { view, scope, actions } = useChat();
const { profile, session } = scope;
const {
  messages: viewMessages,
  loading: viewLoading,
  busy: viewBusy,
  approvalPending: viewApprovalPending,
  status,
} = view;
const transcript = ref<InstanceType<typeof ChatTranscript>>();
const focus = inject(conversationFocus);
onMounted(() => {
  if (focus) focus.value = transcript.value;
});
onBeforeUnmount(() => {
  if (focus && focus.value === transcript.value) focus.value = undefined;
});
</script>
<template>
  <ChatTranscript
    ref="transcript"
    :profile="profile"
    :session-id="session"
    :has-earlier="view.hasEarlier.value"
    :loading-earlier="view.loadingEarlier.value"
    :earlier-error="view.earlierError.value"
    @earlier="actions.loadEarlier"
    :messages="viewMessages"
    :draft="''"
    :loading="viewLoading"
    :progress="[]"
    :thinking="viewBusy"
    :working="viewBusy || viewApprovalPending"
    :approval-pending="viewApprovalPending"
    :home="!session"
    :status-label="status"
    :branch-disabled="view.branchDisabled.value"
    :response-targets="view.responseTargets.value"
    @branch="actions.branch"
  >
    <template #request><LiveRequest /></template>
  </ChatTranscript>
</template>
