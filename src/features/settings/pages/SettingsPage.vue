<script setup lang="ts">
import SettingsPanel from "../components/SettingsPanel.vue";
import { useSettings } from "../context";
const {
  profile,
  profiles,
  pushState,
  pushBusy,
  pushLoading,
  pushMessage,
  wakeLock,
  chooseProfile,
  togglePush,
  testPush,
  closeSettings,
} = useSettings();
</script>
<template>
  <SettingsPanel
    :profile="profile"
    :profiles="profiles"
    :push-state="pushState"
    :push-busy="pushBusy"
    :push-loading="pushLoading"
    :push-message="pushMessage"
    :keep-screen-awake="wakeLock.enabled.value"
    :wake-lock-available="wakeLock.available.value"
    @profile="chooseProfile"
    @toggle-push="togglePush"
    @test-push="testPush"
    @toggle-wake-lock="wakeLock.setEnabled"
    @close="closeSettings"
  />
</template>
