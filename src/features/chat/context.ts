import { inject, provide, type InjectionKey } from "vue";
import type { ChatContext } from "./composables/useChatController";
const key: InjectionKey<ChatContext> = Symbol("live chat");
export function provideChat(context: ChatContext) {
  provide(key, context);
}
export function useChat() {
  const context = inject(key);
  if (!context) throw new Error("Live chat context is missing");
  return context;
}
