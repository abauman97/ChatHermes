<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import InboxList from "../components/InboxList.vue";
import { useInbox } from "../context";
const { profile, inboxRevision: revision, openInboxItem: openItem, refreshInbox } = useInbox();
const route = useRoute(),
  router = useRouter();
const scope = computed({
  get: () => (route.query.scope === "profile" ? ("profile" as const) : ("all" as const)),
  set: (scope: "all" | "profile") => {
    void router.replace({ query: { ...route.query, scope } });
  },
});
</script>
<template>
  <InboxList
    v-model:scope="scope"
    :profile="profile"
    :revision="revision"
    :open-item="openItem"
    @refresh="refreshInbox"
  />
</template>
