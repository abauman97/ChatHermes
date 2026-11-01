<script setup lang="ts">
import { useInbox } from "../context";
const { refreshInbox, inboxRevision } = useInbox();
</script>
<template>
  <button
    role="menuitem"
    class="rounded-lg px-3 py-2 text-left text-sm hover:bg-[#424242]"
    data-test="refresh-inbox"
    aria-label="Refresh inbox"
    @click="
      refreshInbox();
      inboxRevision++;
    "
  >
    Refresh inbox
  </button>
</template>
