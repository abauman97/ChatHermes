<script setup lang="ts">
import InboxList from "../../inbox/components/InboxList.vue";
import { useInbox } from "../../inbox/context";
const { profile, inboxRevision, openInboxItem, refreshInbox } = useInbox();
</script>
<template>
  <InboxList
    preview
    scope="all"
    :profile="profile"
    :revision="inboxRevision"
    :open-item="openInboxItem"
    @refresh="refreshInbox"
  />
</template>
