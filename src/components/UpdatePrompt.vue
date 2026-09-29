<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'
const { needRefresh, offlineReady, updateServiceWorker } = useRegisterSW()
</script>
<template>
  <div v-if="needRefresh || offlineReady" class="update-prompt" role="status">
    <span>{{ needRefresh ? 'An update is ready.' : 'The app shell is ready for offline reading.' }}</span>
    <button v-if="needRefresh" @click="updateServiceWorker(true)">Update now</button>
    <button @click="needRefresh = false; offlineReady = false">Dismiss</button>
  </div>
</template>
