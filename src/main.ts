import { createApp } from "vue";
import "./assets/styles/main.css";
import App from "./App.vue";
import { createChatHermesRouter } from "./router";

import {
  notificationNavigationKey,
  type NotificationNavigation,
} from "./router/notification-navigation";

export { App };
export function createChatHermesApp(initialUrl?: string, navigation?: NotificationNavigation) {
  const app = createApp(App).use(createChatHermesRouter(undefined, initialUrl));
  if (navigation) app.provide(notificationNavigationKey, navigation);
  return app;
}
