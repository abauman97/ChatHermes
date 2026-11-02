<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";
import { useApplication } from "./composables/useApplication";
import SessionSidebar from "./features/sessions/components/SessionSidebar.vue";
import ChatInterface from "./features/chat/components/ChatInterface.vue";
import { projectRoot } from "./features/projects/utils/projects";
const route = useRoute();
const {
  profile,
  session,
  sessions,
  projects,
  selectedProject,
  projectId,
  offline,
  creating,
  profiles,
  loading,
  error,
  hasMore,
  tracking,
  trackingPending,
  sessionBusy,
  drawer,
  embedded,
  menuButton,
  closeButton,
  screenMenuButton,
  screenMenuWrap,
  screenMenu,
  sidebar,
  chatPlane,
  drawerSwipe,
  kanban,
  settingsButton,
  inboxUnread,
  settingsPage,
  projectView,
  recentSession,
  chooseProfile,
  createSession,
  trackSession,
  newChat,
  loadSessions,
  manageSession,
  rename,
  exitPlugin,
  showSettings,
  openDrawer,
  closeDrawer,
  closeScreenMenu,
  screenLink,
} = useApplication();
</script>
<template>
  <div
    class="app-shell flex h-dvh min-h-0 overflow-hidden bg-black font-sans text-white dark:bg-black dark:text-white"
  >
    <aside
      :ref="(el) => (sidebar = el as HTMLElement | null)"
      class="sidebar fixed inset-y-0 h-dvh left-0 z-20 flex w-[min(300px,85vw)] shrink-0 flex-col gap-1 bg-black px-3 py-4 text-white shadow-xl transition-transform duration-200 min-[701px]:static min-[701px]:w-[294px] min-[701px]:translate-x-0 min-[701px]:shadow-none dark:bg-black dark:text-white"
      :class="drawer ? 'translate-x-0' : '-translate-x-full'"
      :style="drawerSwipe.sidebarStyle.value"
      @touchstart="drawerSwipe.start"
      @touchmove="drawerSwipe.move"
      @touchend="drawerSwipe.end"
      @touchcancel="drawerSwipe.cancel"
      @click.capture="drawerSwipe.click"
      aria-label="Navigation"
    >
      <div class="brand mb-3 shrink-0 flex items-center gap-2 px-2 text-xl font-semibold">
        <span class="min-w-0 truncate">ChatHermes</span>
        <button
          v-if="embedded"
          class="drawer-dashboard grid size-8 shrink-0 place-items-center rounded-lg text-[#a3a3a3] hover:bg-[#303030] hover:text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4]"
          aria-label="Return to Hermes Desktop"
          title="Return to Hermes Desktop"
          @click="exitPlugin"
        >
          <svg
            class="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path d="M10 5 3 12l7 7M3 12h12a6 6 0 0 0 6-6V3" />
          </svg></button
        ><button
          :ref="(el) => (closeButton = el as HTMLButtonElement | null)"
          class="mobile-close ml-auto px-2 text-2xl leading-none min-[701px]:hidden focus-visible:outline-3 focus-visible:outline-[#b4b4b4]"
          aria-label="Close navigation"
          @click="closeDrawer"
        >
          ×
        </button>
      </div>
      <RouterLink
        class="inbox-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]"
        :aria-current="route.name === 'inbox' ? 'page' : undefined"
        :to="screenLink('inbox')"
        @click="drawer = false"
      >
        <svg
          class="size-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path d="M4 4h16v16H4zM4 13h4l2 3h4l2-3h4" />
        </svg>
        Inbox
        <span
          v-if="inboxUnread"
          class="ml-auto rounded-full bg-[#424242] px-2 text-sm leading-[1.5]"
          :aria-label="`${inboxUnread} unread notifications`"
          >{{ inboxUnread }}</span
        >
      </RouterLink>
      <RouterLink
        class="projects-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]"
        :aria-current="route.meta.section === 'projects' ? 'page' : undefined"
        :to="screenLink('projects')"
        @click="drawer = false"
      >
        <svg
          class="size-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path d="M3 7V5a1 1 0 0 1 1-1h5l2 3h9a1 1 0 0 1 1 1v11H3Z" /></svg
        >Projects
      </RouterLink>
      <RouterLink
        class="scheduled-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]"
        :aria-current="route.meta.section === 'scheduled' ? 'page' : undefined"
        :to="screenLink('scheduled')"
        @click="drawer = false"
      >
        <svg
          class="size-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M7 3v4M17 3v4M3 11h18M8 15h3M8 18h6" /></svg
        >Scheduled
      </RouterLink>
      <RouterLink
        class="artifacts-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]"
        :aria-current="route.name === 'artifacts' ? 'page' : undefined"
        :to="screenLink('artifacts')"
        @click="drawer = false"
      >
        <svg
          class="size-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path d="M6 3h8l4 4v14H6ZM14 3v5h4M9 12h6M9 16h6" /></svg
        >Artifacts
      </RouterLink>
      <RouterLink
        v-if="kanban.visible.value"
        class="kanban-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-base hover:bg-[#303030]"
        :aria-current="route.name === 'kanban' ? 'page' : undefined"
        :to="screenLink('kanban')"
        @click="drawer = false"
        >Kanban</RouterLink
      >
      <SessionSidebar
        heading="Recents"
        :sessions="sessions"
        :tracking="tracking"
        :tracking-pending="trackingPending"
        @track="trackSession"
        :selected="session"
        :loading="loading"
        :error="error"
        :has-more="hasMore"
        :busy="offline || creating || sessionBusy"
        :projects="projects"
        :key="profile"
        @archive="manageSession('archive', $event)"
        @delete="manageSession('delete', $event)"
        @project="(id, target) => manageSession('project', id, target)"
        @select="recentSession"
        @create="newChat"
        @more="loadSessions(true)"
        @retry="loadSessions()"
        @rename="rename"
      />
      <div
        class="sidebar-foot relative shrink-0 mt-auto grid gap-2 border-t border-[#303030] px-2 pt-4 text-xs text-[#a3a3a3] dark:border-[#303030] dark:text-[#a3a3a3]"
      >
        <label for="profile-field">Profile</label>
        <div class="drawer-account flex min-w-0 items-center gap-2">
          <select
            id="profile-field"
            class="profile-field min-w-0 flex-1 rounded-md border border-[#424242] bg-[#171717] px-2 py-2 text-base text-white"
            :value="profile"
            @change="chooseProfile(($event.target as HTMLSelectElement).value)"
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
            </option></select
          ><button
            class="drawer-chat grid size-11 shrink-0 place-items-center rounded-lg bg-[#2563eb] text-white hover:bg-[#1d4ed8] focus-visible:outline-3 focus-visible:outline-[#b4b4b4] disabled:opacity-55"
            aria-label="New chat"
            title="New chat"
            :disabled="offline || creating"
            @click="newChat"
          >
            <svg
              class="size-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              aria-hidden="true"
            >
              <path
                d="M13 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-8M16 3l5 5M10 14l1-5 7-7 5 5-7 7Z"
              />
            </svg></button
          ><button
            :ref="(el) => (settingsButton = el as HTMLButtonElement | null)"
            class="drawer-settings grid size-11 shrink-0 place-items-center rounded-lg text-white hover:bg-[#303030]"
            aria-label="Settings"
            :aria-current="settingsPage ? 'page' : undefined"
            @click="showSettings()"
          >
            <svg
              class="size-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              aria-hidden="true"
            >
              <path
                d="m9 3-.6 2.5-2 .9L4 5.7l-2 3.5 1.8 1.8v2L2 14.8l2 3.5 2.4-.7 2 .9L9 21h6l.6-2.5 2-.9 2.4.7 2-3.5-1.8-1.8v-2L22 9.2l-2-3.5-2.4.7-2-.9L15 3Z"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
        <span
          ><span
            class="status-dot mr-2 inline-block size-2 rounded-full"
            :class="offline ? 'disconnected bg-[#dcae6e]' : 'bg-[#94c9a5]'"
          />{{ offline ? "Offline · read only" : "Connected through dashboard" }}</span
        >
      </div>
    </aside>
    <div
      v-if="drawer || drawerSwipe.dragging.value"
      class="scrim fixed inset-0 z-10 bg-black/55 min-[701px]:hidden"
      :style="drawerSwipe.scrimStyle.value"
      @touchstart="drawerSwipe.start"
      @touchmove="drawerSwipe.move"
      @touchend="drawerSwipe.end"
      @touchcancel="drawerSwipe.cancel"
      @click.capture="drawerSwipe.click"
      @click="closeDrawer"
    />
    <main class="main-panel flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <header class="topbar flex h-[68px] shrink-0 items-center gap-3 px-[18px] min-[701px]:px-8">
        <button
          :ref="(el) => (menuButton = el as HTMLButtonElement | null)"
          class="mobile-menu grid size-10 place-items-center rounded-xl min-[701px]:hidden hover:bg-[#303030]"
          aria-label="Open navigation"
          :aria-expanded="drawer"
          @click="openDrawer"
        >
          <svg
            class="size-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path d="M3 6h18M3 13h12" />
          </svg>
        </button>
        <div class="min-w-0 flex-1">
          <h1 class="header-title truncate text-base font-medium">
            {{
              route.meta.title ||
              sessions.find((s) => s.id === session)?.title ||
              (session ? "Conversation" : selectedProject?.label || "ChatHermes")
            }}
          </h1>
          <p
            v-if="!settingsPage && projectId && session && selectedProject"
            class="header-project-subtitle truncate text-xs text-[#a3a3a3]"
          >
            {{ selectedProject.label }}
          </p>
        </div>
        <span class="topbar-profile sr-only">{{ profile || "Current profile" }}</span>
        <div
          v-if="!settingsPage"
          :ref="(el) => (screenMenuWrap = el as HTMLElement | null)"
          class="screen-menu-wrap relative"
          @keydown.esc.stop.prevent="closeScreenMenu()"
        >
          <button
            :ref="(el) => (screenMenuButton = el as HTMLButtonElement | null)"
            class="screen-menu-button grid size-10 place-items-center rounded-full text-xl text-[#b4b4b4] hover:bg-[#303030]"
            aria-label="Screen options"
            aria-haspopup="menu"
            :aria-expanded="screenMenu"
            aria-controls="screen-menu"
            @click="screenMenu = !screenMenu"
          >
            ···
          </button>
          <div
            v-show="screenMenu"
            id="screen-menu"
            class="screen-menu absolute right-0 top-12 z-30 grid min-w-48 gap-1 rounded-xl border border-[#424242] bg-[#303030] p-2 shadow-xl"
            role="menu"
            aria-label="Screen options"
            @click="closeScreenMenu()"
          >
            <span class="truncate px-3 py-2 text-xs text-[#a3a3a3]" role="presentation">{{
              profile || "Current profile"
            }}</span>
            <button
              class="rounded-lg px-3 py-2 text-left text-sm hover:bg-[#424242]"
              role="menuitem"
              :disabled="
                offline ||
                creating ||
                (projectView &&
                  (!selectedProject ||
                    selectedProject.archived ||
                    (!selectedProject.isNoProject && !projectRoot(selectedProject))))
              "
              @click="
                projectView ? createSession() : newChat();
                closeScreenMenu();
              "
            >
              New chat
            </button>
            <RouterView name="actions" />
          </div>
        </div>
      </header>
      <RouterView name="dialogs" />
      <ChatInterface
        :ref="(el) => (chatPlane = el as InstanceType<typeof ChatInterface> | null)"
        @touchstart="drawerSwipe.start"
        @touchmove="drawerSwipe.move"
        @touchend="drawerSwipe.end"
        @touchcancel="drawerSwipe.cancel"
        @click.capture="drawerSwipe.click"
        :show-chat="route.meta.chat === true"
        :hide-composer="route.meta.hideComposer === true"
      >
        <template #default>
          <RouterView :key="profile" />
        </template>
      </ChatInterface>
      <footer class="app-footer shrink-0 bg-black" aria-hidden="true" />
    </main>
  </div>
</template>
