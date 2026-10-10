<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { PushState } from "../../notifications/services/push";
defineProps<{
  profile: string;
  profiles: { name: string }[];
  pushState: PushState;
  pushBusy: boolean;
  pushLoading: boolean;
  pushMessage: string;
}>();
const emit = defineEmits<{
  profile: [value: string];
  togglePush: [];
  testPush: [];
  close: [];
}>();
const heading = ref<HTMLElement>();
onMounted(() => heading.value?.focus());
</script>

<template>
  <section class="settings-page page-content" aria-label="Settings">
    <div class="settings-content">
      <div class="settings-heading">
        <h2 ref="heading" tabindex="-1" class="text-2xl font-semibold">Settings</h2>
        <button class="settings-close" aria-label="Close settings" @click="emit('close')">×</button>
      </div>
      <h3 id="settings-profile-heading" class="settings-section-title">Profile</h3>
      <div class="settings-group" aria-labelledby="settings-profile-heading">
        <div class="settings-row">
          <svg
            class="settings-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="9" r="3" />
            <path d="M6 19c0-6 12-6 12 0" />
          </svg>
          <label for="settings-profile">Active profile</label>
          <select
            id="settings-profile"
            :value="profile"
            @change="emit('profile', ($event.target as HTMLSelectElement).value)"
          >
            <option value="">Default profile</option>
            <option
              v-if="profile && !profiles.some((item) => item.name === profile)"
              :value="profile"
            >
              {{ profile }}
            </option>
            <option v-for="item in profiles" :key="item.name" :value="item.name">
              {{ item.name }}
            </option>
          </select>
        </div>
      </div>
      <h3 id="settings-notifications-heading" class="settings-section-title">App settings</h3>
      <div class="settings-group" aria-labelledby="settings-notifications-heading">
        <div class="settings-row settings-notifications">
          <svg
            class="settings-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path d="M5 16h14l-2-3V9a5 5 0 0 0-10 0v4l-2 3Z" />
            <path d="M10 19a2 2 0 0 0 4 0" />
          </svg>
          <div class="push-setting" aria-labelledby="notifications-heading">
            <h3 id="notifications-heading" class="text-sm font-medium text-white">
              Notifications for {{ profile || "default" }}
            </h3>
            <button
              class="mt-2 min-h-[44px] rounded-lg bg-[#303030] px-3 text-sm text-white disabled:opacity-55"
              :disabled="
                pushBusy ||
                pushLoading ||
                !pushState.supported ||
                (!pushState.subscribed && !pushState.available)
              "
              @click="emit('togglePush')"
            >
              {{
                pushLoading
                  ? "Loading…"
                  : pushBusy
                    ? "Updating…"
                    : pushState.subscribed
                      ? "Disable notifications"
                      : "Enable notifications"
              }}
            </button>
            <button
              v-if="pushState.subscribed"
              class="mt-2 min-h-[44px] rounded-lg bg-[#303030] px-3 text-sm text-white disabled:opacity-55"
              :disabled="pushBusy || pushLoading || !pushState.available"
              @click="emit('testPush')"
            >
              Send test
            </button>
            <p
              v-if="pushState.error || pushMessage"
              class="mt-1 text-sm text-[#dcae6e]"
              role="status"
            >
              {{ pushMessage || pushState.error }}
            </p>
            <p v-else-if="pushState.subscribed" class="mt-1 text-sm">
              Notifications enabled for {{ profile || "default" }} on this device.
            </p>
            <p v-else-if="pushLoading" class="mt-1 text-sm" role="status">
              Loading profile notification status…
            </p>
            <p v-else-if="!pushState.supported" class="mt-1 text-sm">
              Install ChatHermes on a secure HTTPS origin to enable notifications.
            </p>
            <p v-else-if="pushState.permission === 'denied'" class="mt-1 text-sm">
              Allow notifications in browser settings to enable them.
            </p>
            <p v-else class="mt-1 text-sm">
              Notifications disabled for {{ profile || "default" }} on this device.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
