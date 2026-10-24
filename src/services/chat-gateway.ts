// Read-only native support probe. It never dispatches a prompt.
// Tickets are ephemeral and only sent in the host's supported subprotocol.
export interface ChatCapabilities {
  protocol: "hermes.native.bf0203a7";
  reviewed_source: string;
  mode: "native-gateway";
  admission: true;
  operations: string[];
  blockers: string[];
  guarantees: {
    crash_safe_idempotency: false;
    lossless_snapshot_replay: false;
    offline_turn_lease: true;
  };
}
export function chatCapabilities(value: unknown): ChatCapabilities {
  const v = value as ChatCapabilities | null;
  if (
    !v ||
    typeof v !== "object" ||
    v.protocol !== "hermes.native.bf0203a7" ||
    v.reviewed_source !== "bf0203a794a07aac3ff764972ab9087baa4e4f4e" ||
    v.mode !== "native-gateway" ||
    v.admission !== true ||
    !Array.isArray(v.operations) ||
    !v.operations.every((operation) => typeof operation === "string") ||
    !Array.isArray(v.blockers) ||
    !v.blockers.every((blocker) => typeof blocker === "string") ||
    v.guarantees?.crash_safe_idempotency !== false ||
    v.guarantees?.lossless_snapshot_replay !== false ||
    v.guarantees?.offline_turn_lease !== true
  )
    throw new Error("Unsupported native chat contract");
  return v;
}

export async function probeChatGateway(
  profile: string,
  signal?: AbortSignal,
): Promise<ChatCapabilities> {
  if (profile && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(profile))
    throw new Error("Invalid profile name");
  signal?.throwIfAborted();
  const capabilityResponse = await fetch(
    `/api/plugins/chathermes/chat/capabilities?profile=${encodeURIComponent(profile || "default")}`,
    {
      credentials: "same-origin",
      cache: "no-store",
      redirect: "manual",
      signal,
    },
  );
  if (!capabilityResponse.ok || capabilityResponse.type === "opaqueredirect")
    throw new Error("Sign in to the dashboard to inspect native chat support");
  const capabilities = chatCapabilities(await capabilityResponse.json());
  const response = await fetch("/api/auth/ws-ticket", {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    redirect: "manual",
    signal,
  });
  if (!response.ok || response.type === "opaqueredirect")
    throw new Error("Sign in to the dashboard to inspect native chat support");
  const value: unknown = await response.json();
  const ticket = value && typeof value === "object" && "ticket" in value ? value.ticket : undefined;
  if (typeof ticket !== "string" || !ticket || ticket.length > 1024)
    throw new Error("Invalid dashboard ticket response");
  signal?.throwIfAborted();
  const url = new URL("/api/ws", location.href);
  url.protocol = location.protocol === "https:" ? "wss:" : "ws:";
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url, ["hermes-gateway-v1", `hermes-gateway-ticket.${ticket}`]);
    let settled = false;
    const finish = (result?: ChatCapabilities, error?: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      signal?.removeEventListener("abort", abort);
      ws.onopen = ws.onmessage = ws.onerror = ws.onclose = null;
      try {
        ws.close();
      } catch {
        /* nothing was admitted */
      }
      if (error) reject(error);
      else resolve(result!);
    };
    const abort = () => finish(undefined, new Error("Native chat probe cancelled"));
    const timeout = setTimeout(
      () => finish(undefined, new Error("Native chat probe timed out")),
      10_000,
    );
    signal?.addEventListener("abort", abort, { once: true });
    ws.onopen = () =>
      ws.send(
        JSON.stringify({
          jsonrpc: "2.0",
          id: "capabilities",
          method: "gateway.ping",
          params: { profile: profile || "default" },
        }),
      );
    ws.onmessage = (event) => {
      try {
        if (typeof event.data !== "string" || event.data.length > 8192) throw new Error();
        const frame = JSON.parse(event.data);
        if (frame.jsonrpc !== "2.0" || Array.isArray(frame)) throw new Error();
        if (
          frame.method === "event" &&
          frame.params?.type === "gateway.ready" &&
          frame.params.payload?.session_authority === true
        )
          throw new Error();
        if (frame.id !== "capabilities" || "method" in frame) return;
        if ("error" in frame || frame.result?.ok !== true) throw new Error();
        finish(capabilities);
      } catch {
        finish(undefined, new Error("Unsupported native chat contract"));
      }
    };
    ws.onerror = ws.onclose = () => finish(undefined, new Error("Native chat probe disconnected"));
    if (signal?.aborted) abort();
  });
}
