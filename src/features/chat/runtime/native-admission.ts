// Receipt state only: no prompt, credentials, attachments or transcript.
// Separate attempt keys prevent one tab's acknowledgement from clearing another
// tab's uncertain submission. Storage writes never perform read/modify/write.
const key = (profile: string, session: string) =>
  "chathermes.native-outcome:" + JSON.stringify([profile || "default", session]);
const keys = (profile: string, session: string) =>
  profile && profile !== "default"
    ? [key(profile, session)]
    : [key("default", session), "chathermes.native-outcome:" + JSON.stringify(["", session])];
export function nativeOutcome(profile: string, session: string): boolean {
  try {
    const prefixes = keys(profile, session);
    return Object.keys(localStorage).some(
      (k) =>
        prefixes.some((prefix) => k === prefix || k.startsWith(prefix + ":")) &&
        localStorage.getItem(k) === "unknown",
    );
  } catch {
    return true;
  }
}
export function uncertainNativeOutcome(profile: string, session: string): string {
  const attempt = Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  try {
    localStorage.setItem(key(profile, session) + ":" + attempt, "unknown");
  } catch {
    throw new Error("Cannot safely record native submission state");
  }
  return attempt;
}
export function settleNativeOutcome(profile: string, session: string, attempt?: string) {
  try {
    for (const prefix of keys(profile, session)) {
      if (attempt) localStorage.removeItem(prefix + ":" + attempt);
      else
        for (const k of Object.keys(localStorage))
          if (k === prefix || k.startsWith(prefix + ":")) localStorage.removeItem(k);
    }
  } catch {
    /* Conservatively keep the lock on reload. */
  }
}
