import { onMounted, onUnmounted, readonly, ref } from "vue";

const STORAGE_KEY = "chathermes.keep-screen-awake";

function savedPreference(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

// Owned by the plugin root, so the preference and lock survive profile/view changes.
export function useWakeLock() {
  const enabled = ref(savedPreference());
  const available = ref(false);
  let mounted = false;
  let pageActive = true;
  let sentinel: WakeLockSentinel | null = null;
  let releaseListener: (() => void) | null = null;
  let generation = 0;
  let pending: number | null = null;

  function required() {
    return mounted && pageActive && enabled.value && document.visibilityState === "visible";
  }

  async function releaseLock(lock: WakeLockSentinel) {
    try {
      if (!lock.released) await lock.release();
    } catch {
      // Browser policy and device state can prevent both acquisition and release.
    }
  }

  function release() {
    generation++;
    pending = null;
    const current = sentinel;
    sentinel = null;
    if (current) {
      if (releaseListener) current.removeEventListener("release", releaseListener);
      releaseListener = null;
      void releaseLock(current);
    }
  }

  async function acquire() {
    if (!required() || !available.value || sentinel || pending !== null) return;
    const token = ++generation;
    pending = token;
    try {
      const lock = await navigator.wakeLock.request("screen");
      if (token !== generation || !required()) {
        await releaseLock(lock);
        return;
      }
      // A browser may have already revoked the lock before the promise resolves.
      // Wait for a new foreground transition rather than repeatedly requesting it.
      if (lock.released) return;
      sentinel = lock;
      releaseListener = () => {
        if (sentinel !== lock) return;
        if (releaseListener) lock.removeEventListener("release", releaseListener);
        releaseListener = null;
        sentinel = null;
        if (required()) {
          generation++;
          void acquire();
        }
      };
      lock.addEventListener("release", releaseListener);
    } catch {
      // Denial (e.g. low battery) is transient. Retry on the next foreground/enable.
    } finally {
      if (pending === token) pending = null;
    }
  }

  function setEnabled(value: boolean) {
    enabled.value = value;
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // The preference still works for this mount when storage is unavailable.
    }
    if (value) void acquire();
    else release();
  }

  function visibilityChange() {
    if (required()) void acquire();
    else release();
  }

  function pageHide() {
    pageActive = false;
    release();
  }

  function pageShow() {
    pageActive = true;
    visibilityChange();
  }

  onMounted(() => {
    mounted = true;
    available.value = typeof navigator.wakeLock?.request === "function";
    document.addEventListener("visibilitychange", visibilityChange);
    window.addEventListener("pagehide", pageHide);
    window.addEventListener("pageshow", pageShow);
    void acquire();
  });
  onUnmounted(() => {
    mounted = false;
    document.removeEventListener("visibilitychange", visibilityChange);
    window.removeEventListener("pagehide", pageHide);
    window.removeEventListener("pageshow", pageShow);
    release();
  });

  return { enabled: readonly(enabled), available: readonly(available), setEnabled };
}
