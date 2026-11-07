import { inject, provide, type InjectionKey, type Ref } from "vue";
import type { ChatContext } from "./composables/useChatController";
import type { Session } from "../../types/hermes";
type Context = ChatContext & { sessions: Readonly<Ref<readonly Session[]>> };
const key: InjectionKey<Context> = Symbol("live chat");
export function provideChat(context: Context) {
  provide(key, context);
}
export function useChat() {
  const context = inject(key);
  if (!context) throw new Error("Live chat context is missing");
  return context;
}

export const conversationFocus: InjectionKey<Ref<{ focusLatestMessage: () => void } | undefined>> =
  Symbol("conversation focus");
