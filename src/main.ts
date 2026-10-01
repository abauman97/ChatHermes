import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

export { App }
export function createChatHermesApp() { return createApp(App) }
