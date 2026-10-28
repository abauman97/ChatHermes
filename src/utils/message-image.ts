/** Persisted multipart images may use authenticated addresses instead of bytes. */
export function isMessageImage(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^(?:data:image\/|https?:\/\/|\/api\/plugins\/chathermes\/artifact-images\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+\/\d+$)/.test(
      value,
    )
  );
}
