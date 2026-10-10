import { createApp } from "vue";
import "./assets/styles/main.css";
import App from "./App.vue";

export { App };
export function createChatHermesApp() {
  return createApp(App);
}
