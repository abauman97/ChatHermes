import {
  computed,
  inject,
  onScopeDispose,
  provide,
  shallowRef,
  type ComputedRef,
  type InjectionKey,
} from "vue";
import { useRouter } from "vue-router";

type PageHeader = { title: string; subtitle?: string };
type RegisterHeader = (source: () => PageHeader) => () => void;
const key: InjectionKey<RegisterHeader> = Symbol("page header");

/** One header owner per mounted shell; pages supply reactive data, never async writes. */
export function providePageHeader() {
  const router = useRouter();
  const active = shallowRef<{
    record: (typeof router.currentRoute.value.matched)[number] | undefined;
    context: ComputedRef<PageHeader>;
  }>();
  provide(key, (source) => {
    const owner = {
      record: router.currentRoute.value.matched.at(-1),
      context: computed(source),
    };
    active.value = owner;
    return () => {
      if (active.value === owner) active.value = undefined;
    };
  });
  return computed<PageHeader>(() => {
    const route = router.currentRoute.value;
    const owner = active.value;
    if (owner?.record && route.matched.includes(owner.record)) return owner.context.value;
    return { title: typeof route.meta.title === "string" ? route.meta.title : "ChatHermes" };
  });
}

export function usePageHeader(source: () => PageHeader) {
  const register = inject(key);
  if (!register) throw new Error("page header context is missing");
  onScopeDispose(register(source));
}
