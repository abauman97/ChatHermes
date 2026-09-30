<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'
const { needRefresh, offlineReady, updateServiceWorker } = useRegisterSW()
</script>
<template>
  <div v-if="needRefresh || offlineReady" class="update-prompt fixed right-3 bottom-3 left-3 z-30 flex flex-wrap items-center gap-3 rounded-xl bg-[#173a30] p-4 text-sm text-white shadow-xl shadow-black/25 min-[701px]:right-5 min-[701px]:left-auto dark:border dark:border-[#56735e] dark:bg-[#254236]" role="status">
    <span>{{ needRefresh ? 'An update is ready.' : 'The app shell is ready for offline reading.' }}</span>
    <button v-if="needRefresh" class="rounded-lg bg-[#dcae6e] px-3 py-2 font-semibold text-[#19372e] hover:bg-[#efc48a] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#dfb476] dark:bg-[#d7ae75]" @click="updateServiceWorker(true)">Update now</button>
    <button class="rounded-lg border border-[#789383] px-3 py-2 hover:bg-[#315b4a] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#dfb476]" @click="needRefresh = false; offlineReady = false">Dismiss</button>
  </div>
</template>
