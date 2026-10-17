import { computed, ref, watch, type Ref } from "vue";

const controls =
  'button, a, input, textarea, select, label, summary, audio, video, [role="button"], [role="link"], [role="slider"], [role="checkbox"], [role="switch"], [role="combobox"], [role="textbox"], [role="menuitem"], [tabindex]:not([data-chat-message]):not(.transcript), [contenteditable]:not([contenteditable="false"]), .composer, pre, code';

/** Local touch handlers only: opening belongs to the transcript, never the viewport. */
export function useDrawerSwipe(
  open: Ref<boolean>,
  width: () => number,
  plane: () => HTMLElement | null,
  settle: (open: boolean) => void,
) {
  const position = ref<number | null>(null);
  let gesture:
    | { id: number; x: number; y: number; open: boolean; width: number; locked: boolean }
    | undefined;
  let sampleX = 0,
    sampleTime = 0,
    velocity = 0,
    suppressClickUntil = 0;
  const mobile = () => window.matchMedia("(max-width: 700px)").matches;
  function cancel() {
    gesture = undefined;
    position.value = null;
  }
  watch(open, cancel, { flush: "sync" });
  function start(event: TouchEvent) {
    cancel();
    if (!mobile() || event.touches.length !== 1) return;
    const touch = event.touches[0]!;
    const target = event.target;
    if (touch.clientX < 30 || !(target instanceof Element) || target.closest(controls)) return;
    if (!open.value && !target.closest(".transcript")) return;
    if (target.closest(".scrim")) {
      const bounds = plane()?.getBoundingClientRect();
      if (!bounds || touch.clientY < bounds.top || touch.clientY > bounds.bottom) return;
    }
    gesture = {
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
      open: open.value,
      width: width(),
      locked: false,
    };
    sampleX = touch.clientX;
    sampleTime = event.timeStamp;
    velocity = 0;
  }
  function move(event: TouchEvent) {
    if (!gesture) return;
    if (!mobile() || event.touches.length !== 1) return cancel();
    const touch = Array.from(event.touches).find((touch) => touch.identifier === gesture!.id);
    if (!touch) return cancel();
    const dx = touch.clientX - gesture.x,
      dy = touch.clientY - gesture.y;
    if (!gesture.locked) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 10) return;
      // Once vertical scrolling wins, this contact cannot become a drawer gesture.
      if (Math.abs(dx) <= Math.abs(dy) * 1.25 || (gesture.open ? dx >= 0 : dx <= 0))
        return cancel();
      gesture.locked = true;
    }
    if (!event.cancelable) return cancel();
    event.preventDefault();
    position.value = Math.max(0, Math.min(gesture.width, (gesture.open ? gesture.width : 0) + dx));
    const elapsed = event.timeStamp - sampleTime;
    if (elapsed > 0) velocity = (touch.clientX - sampleX) / elapsed;
    sampleX = touch.clientX;
    sampleTime = event.timeStamp;
  }
  function end(event: TouchEvent) {
    if (!gesture) return;
    if (!mobile()) return cancel();
    if (!gesture.locked || position.value === null) return cancel();
    const touch = Array.from(event.changedTouches).find(
      (touch) => touch.identifier === gesture!.id,
    );
    if (!touch) return cancel();
    const travel = gesture.open ? gesture.width - position.value : position.value;
    const speed = event.timeStamp - sampleTime <= 100 ? velocity : 0;
    const direction = gesture.open ? -1 : 1;
    const change =
      speed * direction >= 0.5 || (speed * direction > -0.5 && travel >= gesture.width * 0.35);
    const next = change ? !gesture.open : gesture.open;
    suppressClickUntil = Date.now() + 400;
    cancel();
    settle(next);
  }
  function click(event: MouseEvent) {
    if (Date.now() >= suppressClickUntil) return;
    event.preventDefault();
    event.stopPropagation();
  }
  return {
    start,
    move,
    end,
    cancel,
    click,
    dragging: computed(() => position.value !== null),
    sidebarStyle: computed(() =>
      position.value === null
        ? undefined
        : // Tailwind's translate classes use the independent CSS translate property.
          { translate: `${position.value - width()}px 0`, transition: "none" },
    ),
    scrimStyle: computed(() =>
      position.value === null ? undefined : { opacity: position.value / width() },
    ),
  };
}
