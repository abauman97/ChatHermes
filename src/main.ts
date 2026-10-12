import { createApp } from "vue";
import "./assets/styles/main.css";
import App from "./App.vue";
import { createChatHermesRouter } from "./router";

export { App };
export function createChatHermesApp(initialUrl?: string) {
  return createApp(App).use(createChatHermesRouter(undefined, initialUrl));
}
