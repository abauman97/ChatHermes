import { inject, provide, type InjectionKey } from "vue";
import type { Ref } from "vue";
import type { InboxItem } from "./inbox";
type Context = {
  profile: Readonly<Ref<string>>;
  inboxRevision: Ref<number>;
  openInboxItem: (item: InboxItem) => Promise<void>;
  refreshInbox: () => Promise<void>;
};
const key: InjectionKey<Context> = Symbol("inbox");
export function provideInbox(context: Context) {
  provide(key, context);
}
export function useInbox() {
  const context = inject(key);
  if (!context) throw new Error("inbox context is missing");
  return context;
}
