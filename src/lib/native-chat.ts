import { JsonRpcRequestChannel, JsonRpcGatewayError } from "../vendor/hermes/json-rpc-channel";
import type { GatewayEvent } from "../vendor/hermes/gateway-events";
import type {
  SessionResumeResult,
  OpenRequestEntry,
} from "../vendor/hermes/gateway-contract.generated";

export class NativeError extends Error {
  outcome: string;
  constructor(message: string, outcome = "unknown") {
    super(message);
    this.outcome = outcome;
  }
}
export interface Recovery {
  epoch: string;
  start?: number;
  through: number;
  base_row_ids: string[] | null;
  complete: boolean;
}
export type NativeSnapshot = SessionResumeResult & { recovery: Recovery };
export interface NativeHooks {
  snapshot: (snapshot: NativeSnapshot) => void;
  event: (event: GatewayEvent) => void;
  input: (text: string, correction: boolean, admissionId?: string) => void;
  requests: (requests: OpenRequestEntry[]) => void;
  connection: (state: "connecting" | "recovering" | "open" | "closed", error?: string) => void;
  recovered: () => void;
}
type Frame = { method?: string; params?: any; chat_offset?: number };

/** One authenticated viewer. RPC/heartbeat are upstream; recovery is the
 * retained plugin owner's ordered spool, not a Runs/SSE interpretation. */
export class NativeViewer {
  private ws?: WebSocket;
  private channel: JsonRpcRequestChannel;
  private opening?: Promise<void>;
  private detached = false;
  private holding = true;
  private held: Frame[] = [];
  private offset = 0;
  private runtime = "";
  private failed = false;
  private abort = new AbortController();
  private cancelOpening?: () => void;
  private hooks: NativeHooks;
  readonly profile: string;
  readonly stored: string;
  constructor(profile: string, stored: string, hooks: NativeHooks) {
    this.profile = profile;
    this.stored = stored;
    this.hooks = hooks;
    this.channel = new JsonRpcRequestChannel({
      requestIdPrefix: "c-",
      heartbeatLiveness: "any-inbound",
      requestTimeoutMs: 95000,
      onHeartbeatFailure: () => {
        this.ws?.close();
        this.disconnected();
      },
    });
    this.channel.onRequest((request) => {
      if (!["approval", "clarify"].includes(request.method)) return false;
      // Request cards are reconciled by ID; result.open_requests is redelivered
      // by the upstream channel before the attach promise resolves.
      this.requestEntries.set(request.id, {
        id: request.id,
        method: request.method,
        params: request.params,
      });
      if (!this.holding) this.hooks.requests([...this.requestEntries.values()]);
      return true;
    });
  }
  private requestEntries = new Map<string, OpenRequestEntry>();
  async ensure() {
    if (this.detached) throw new NativeError("Viewer detached");
    if (this.opening) return this.opening;
    if (this.ws?.readyState === WebSocket.OPEN && !this.holding) return;
    if (this.failed) throw new NativeError("Native viewer disconnected");
    this.opening = this.open();
    try {
      await this.opening;
    } catch (error) {
      this.ws?.close();
      this.disconnected();
      throw error;
    } finally {
      this.opening = undefined;
    }
  }
  private async open() {
    this.hooks.connection("connecting");
    const response = await fetch("/api/auth/ws-ticket", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      redirect: "manual",
      signal: this.abort.signal,
    });
    if (!response.ok || response.type === "opaqueredirect")
      throw new NativeError("Dashboard sign-in required", "rejected");
    const { ticket } = await response.json();
    if (typeof ticket !== "string" || !ticket || ticket.length > 1024)
      throw new NativeError("Invalid dashboard ticket", "rejected");
    if (this.detached) throw new NativeError("Viewer detached");
    const url = new URL("/api/plugins/chathermes/chat/ws", location.href);
    url.protocol = location.protocol === "https:" ? "wss:" : "ws:";
    if (this.profile) url.searchParams.set("profile", this.profile);
    this.holding = true;
    this.held = [];
    this.requestEntries.clear();
    const ws = (this.ws = new WebSocket(url, [
      "hermes-gateway-v1",
      "hermes-gateway-ticket." + ticket,
    ]));
    ws.onmessage = (event) => {
      if (this.ws !== ws || this.detached) return;
      try {
        if (typeof event.data !== "string" || event.data.length > 29 * 1024 * 1024)
          throw new Error();
        const frame = JSON.parse(event.data);
        if (frame.jsonrpc !== "2.0" || Array.isArray(frame)) throw new Error();
        this.channel.handleFrame(event.data);
        if (frame.method && !("id" in frame) && frame.method !== "chat.ready") {
          if (this.holding) {
            if (this.held.length >= 2048) throw new Error();
            this.held.push(frame);
          } else this.apply(frame);
        }
      } catch {
        ws.close();
        this.disconnected("Native data unavailable. Reconnect to restore this session.");
      }
    };
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        ws.close();
        reject(new NativeError("Native viewer connection timed out"));
      }, 10000);
      this.cancelOpening = () => {
        clearTimeout(timer);
        reject(new NativeError("Viewer detached"));
      };
      ws.onopen = () => {
        clearTimeout(timer);
        if (this.detached || this.ws !== ws) {
          reject(new NativeError("Viewer detached"));
          return;
        }
        this.channel.attach({ send: (text) => ws.send(text) });
        resolve();
      };
      ws.onerror = ws.onclose = () => {
        clearTimeout(timer);
        reject(new NativeError("Native viewer disconnected"));
      };
    });
    this.cancelOpening = undefined;
    ws.onclose = ws.onerror = () => {
      if (this.ws === ws) this.disconnected();
    };
    this.hooks.connection("recovering");
    const snapshot = await this.rpc<NativeSnapshot>("chat.attach", { session_id: this.stored });
    if (this.detached || this.ws !== ws) throw new NativeError("Viewer detached");
    if (
      typeof snapshot.session_id !== "string" ||
      !snapshot.session_id ||
      !Array.isArray(snapshot.messages) ||
      !snapshot.recovery ||
      typeof snapshot.recovery.epoch !== "string" ||
      typeof snapshot.recovery.complete !== "boolean" ||
      !Number.isSafeInteger(snapshot.recovery.through) ||
      snapshot.recovery.through < 0 ||
      (snapshot.recovery.start !== undefined &&
        (!Number.isSafeInteger(snapshot.recovery.start) ||
          snapshot.recovery.start < 0 ||
          snapshot.recovery.start > snapshot.recovery.through)) ||
      (snapshot.recovery.complete && !Array.isArray(snapshot.recovery.base_row_ids))
    )
      throw new NativeError("Invalid native recovery snapshot");
    this.runtime = snapshot.session_id;
    this.offset = snapshot.recovery.complete
      ? snapshot.recovery.start || 0
      : snapshot.recovery.through;
    this.hooks.snapshot(snapshot);
    let offset = this.offset;
    while (offset < snapshot.recovery.through) {
      const page = await this.rpc<{ frames: Frame[]; offset: number; epoch: string }>(
        "chat.replay",
        { offset, through: snapshot.recovery.through },
      );
      if (
        this.detached ||
        this.ws !== ws ||
        page.epoch !== snapshot.recovery.epoch ||
        !Array.isArray(page.frames) ||
        !Number.isSafeInteger(page.offset) ||
        page.offset <= offset ||
        page.offset > snapshot.recovery.through
      )
        throw new NativeError("Recovery generation changed");
      if (
        page.frames.length !== page.offset - offset ||
        page.frames.some((frame, index) => frame.chat_offset !== offset + index + 1)
      )
        throw new NativeError("Invalid native replay boundary");
      for (const frame of page.frames) this.apply(frame);
      offset = page.offset;
    }
    if (this.detached || this.ws !== ws || !this.channel.connected)
      throw new NativeError("Native viewer disconnected");
    this.holding = false;
    for (const frame of this.held) this.apply(frame);
    this.held = [];
    this.hooks.requests([...this.requestEntries.values()]);
    this.channel.startHeartbeat();
    this.hooks.connection("open");
    this.hooks.recovered();
  }
  private apply(frame: Frame) {
    if (typeof frame.chat_offset === "number") {
      if (frame.chat_offset <= this.offset) return;
      this.offset = frame.chat_offset;
    }
    if (frame.method === "event") {
      const event = frame.params as GatewayEvent;
      if (event.session_id !== this.runtime) return;
      if (event.type === "request.cancel") {
        this.requestEntries.delete(
          String((event.payload as any)?.id || (event.payload as any)?.request_id || ""),
        );
        this.hooks.requests([...this.requestEntries.values()]);
      }
      this.hooks.event(event);
    } else if (frame.method === "chat.input" || frame.method === "chat.correction")
      this.hooks.input(
        String(frame.params?.text || ""),
        frame.method === "chat.correction",
        frame.params?.admission_id,
      );
    else if (frame.method === "chat.unsupported")
      this.hooks.connection("open", "Unavailable in ChatHermes: " + frame.params?.method);
  }
  private disconnected(message?: string) {
    if (this.detached || this.failed) return;
    this.failed = true;
    const ws = this.ws;
    this.ws = undefined;
    if (ws) {
      ws.onclose = ws.onerror = null;
      ws.close();
    }
    this.channel.detach(new NativeError("Native viewer disconnected"));
    this.hooks.connection("closed", message);
  }
  async rpc<T = any>(method: string, params: Record<string, unknown> = {}): Promise<T> {
    if (!this.channel.connected)
      throw new NativeError("Native viewer disconnected; message not submitted", "rejected");
    try {
      return await this.channel.request<T>(method, params);
    } catch (error) {
      if (error instanceof JsonRpcGatewayError)
        throw new NativeError(
          error.message,
          (error.data as { outcome?: string } | undefined)?.outcome ||
            (method === "chat.submit" ? "unknown" : "rejected"),
        );
      throw error;
    }
  }
  async answer(id: string, result: Record<string, unknown>) {
    await this.rpc("chat.answer", { request_id: id, result });
    this.requestEntries.delete(id);
    this.hooks.requests([...this.requestEntries.values()]);
  }
  get boundary() {
    return this.offset;
  }
  close() {
    this.detached = true;
    this.abort.abort();
    this.cancelOpening?.();
    this.cancelOpening = undefined;
    this.channel.detach(new NativeError("Viewer detached"));
    const ws = this.ws;
    this.ws = undefined;
    if (ws) {
      ws.onopen = ws.onmessage = ws.onclose = ws.onerror = null;
      ws.close();
    }
    this.held = [];
  }
}
