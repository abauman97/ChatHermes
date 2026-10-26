import {
  JsonRpcRequestChannel,
  JsonRpcGatewayError,
  type ServerRequest,
} from "../../../vendor/hermes/json-rpc-channel";
import type { GatewayEvent } from "../../../vendor/hermes/gateway-events";
import { NativeError, type NativeHooks, type NativeSnapshot } from "./native-chat";

const pendingDrafts = new Map<
  string,
  { viewer: NativeGatewayViewer; timer: ReturnType<typeof setTimeout> }
>();
const draftKey = (profile: string, stored: string) =>
  JSON.stringify([profile || "default", stored]);
const silentHooks: NativeHooks = {
  snapshot: () => {},
  event: () => {},
  input: () => {},
  requests: () => {},
  connection: () => {},
  recovered: () => {},
};

/** A profile-bound connection to the dashboard's native gateway. Credentials
 * remain in the host's single-use subprotocol; no plugin-host WS is involved.
 * Snapshots are authoritative but do not promise lossless replay. */
export class NativeGatewayViewer {
  static async create(profile: string, params: Record<string, unknown>, signal?: AbortSignal) {
    if (pendingDrafts.size >= 32) throw new NativeError("Too many unopened drafts", "rejected");
    const creator = new NativeGatewayViewer(profile, "", silentHooks);
    const abort = () => creator.close();
    signal?.addEventListener("abort", abort, { once: true });
    try {
      signal?.throwIfAborted();
      await creator.ensure();
      const made = await creator.call("session.create", params);
      signal?.throwIfAborted();
      const stored = made.stored_session_id;
      if (typeof stored !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(stored))
        throw new NativeError("Invalid native draft receipt");
      // Native drafts are lazy. Persist the same ID through the existing
      // authenticated profile API so secondary plugin hosts can prove membership.
      const durable = await fetch(
        `/api/plugins/chathermes/api/sessions?profile=${encodeURIComponent(profile || "default")}`,
        {
          method: "POST",
          credentials: "same-origin",
          redirect: "manual",
          signal,
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id: stored, source: "desktop" }),
        },
      );
      if (!durable.ok) throw new NativeError("Could not persist native draft", "rejected");
      const key = draftKey(profile, stored);
      const timer = setTimeout(() => {
        if (pendingDrafts.get(key)?.viewer === creator) pendingDrafts.delete(key);
        creator.close();
      }, 300000);
      pendingDrafts.set(key, { viewer: creator, timer });
      return { id: stored, source: "desktop", cwd: made.info?.cwd };
    } catch (error) {
      creator.close();
      throw error;
    } finally {
      signal?.removeEventListener("abort", abort);
    }
  }
  private ws?: WebSocket;
  private channel: JsonRpcRequestChannel;
  private abort = new AbortController();
  private opening?: Promise<void>;
  private cancelOpening?: () => void;
  private detached = false;
  private failed = false;
  private holding = true;
  private snapshotReceived = false;
  private snapshotBoundary = 0;
  private held: GatewayEvent[] = [];
  private runtime = "";
  private sequence = 0;
  private requests = new Map<string, ServerRequest>();
  readonly retainWhileHidden = true;
  private preparing = false;
  private preparationCancelled = false;
  readonly profile: string;
  readonly stored: string;
  private hooks: NativeHooks;
  constructor(profile: string, stored: string, hooks: NativeHooks) {
    this.profile = profile;
    this.stored = stored;
    this.hooks = hooks;
    if (profile && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(profile))
      throw new NativeError("Invalid profile", "rejected");
    this.channel = new JsonRpcRequestChannel({
      requestIdPrefix: "native-",
      heartbeatLiveness: "any-inbound",
      requestTimeoutMs: 95000,
      onHeartbeatFailure: () => this.disconnected(),
    });
    this.channel.onRequest((request) => {
      if (!["approval", "clarify", "secret"].includes(request.method)) return false;
      if (
        (this.runtime && request.params.session_id !== this.runtime) ||
        (request.params.profile && request.params.profile !== (this.profile || "default"))
      ) {
        request.decline?.("This viewer does not show that session");
        return true;
      }
      this.requests.set(request.id, request);
      if (!this.holding) this.publishRequests();
      return true;
    });
  }
  private publishRequests() {
    this.hooks.requests(
      [...this.requests.values()].map(({ id, method, params }) => ({ id, method, params })),
    );
  }
  ensure(): Promise<void> {
    if (this.detached || this.failed) return Promise.reject(new NativeError("Viewer detached"));
    if (this.opening) return this.opening;
    if (this.channel.connected && !this.holding) return Promise.resolve();
    this.opening = this.open().catch((error) => {
      this.disconnected();
      throw error;
    });
    return this.opening;
  }
  private async open() {
    this.hooks.connection("connecting");
    // Confirm membership before resume: native resume can otherwise adopt a
    // foreign stored ID into the selected profile on some Hermes releases.
    // A pending draft carries an authenticated session.create receipt from this
    // exact profile. Its creator stays attached until this viewer resumes it.
    const pending = pendingDrafts.get(draftKey(this.profile, this.stored));
    if (this.stored && !pending) {
      const membership = await fetch(
        `/api/plugins/chathermes/chat/sessions/${encodeURIComponent(this.stored)}/membership?profile=${encodeURIComponent(this.profile || "default")}`,
        {
          credentials: "same-origin",
          cache: "no-store",
          redirect: "manual",
          signal: this.abort.signal,
        },
      );
      if (!membership.ok || membership.type === "opaqueredirect")
        throw new NativeError("Session unavailable in this profile", "rejected");
    }
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
    this.assertLive();
    const url = new URL("/api/ws", location.href);
    url.protocol = location.protocol === "https:" ? "wss:" : "ws:";
    const ws = (this.ws = new WebSocket(url, [
      "hermes-gateway-v1",
      `hermes-gateway-ticket.${ticket}`,
    ]));
    ws.onmessage = (event) => {
      if (this.ws !== ws || this.detached) return;
      try {
        if (typeof event.data !== "string" || event.data.length > 29 * 1024 * 1024)
          throw new Error();
        // Native Hermes coalesces token frames into newline-delimited batches.
        for (const line of event.data.split("\n").filter(Boolean)) {
          const frame = JSON.parse(line);
          if (!frame || frame.jsonrpc !== "2.0" || Array.isArray(frame)) throw new Error();
          if (frame.result?.session_id && Array.isArray(frame.result.messages)) {
            this.snapshotReceived = true;
            this.snapshotBoundary = this.held.length;
          }
          if (
            frame.method === "event" &&
            frame.params?.type === "gateway.ready" &&
            frame.params.payload?.session_authority === true
          )
            throw new Error("Unsupported native contract");
          this.channel.handleFrame(line);
          if (frame.method === "event") {
            if (!this.holding) this.event(frame.params);
            else if (this.snapshotReceived) {
              if (this.held.length >= 2048) throw new Error();
              this.held.push(frame.params);
            }
          }
        }
      } catch {
        this.disconnected("Native data unavailable. Reconnect to restore this session.");
      }
    };
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new NativeError("Native connection timed out"));
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
        reject(new NativeError("Native gateway disconnected"));
      };
    });
    this.cancelOpening = undefined;
    ws.onerror = ws.onclose = () => this.disconnected();
    if (!this.stored) {
      // Complete the native readiness round trip before creating a draft.
      await this.call("gateway.ping");
      this.holding = false;
      this.channel.startHeartbeat();
      return;
    }
    this.hooks.connection("recovering");
    let snapshot = await this.call<NativeSnapshot>("session.resume", {
      session_id: this.stored,
      source: "desktop",
    });
    this.assertLive();
    if (!snapshot || typeof snapshot.session_id !== "string" || !Array.isArray(snapshot.messages))
      throw new NativeError("Invalid native snapshot");
    if ("revision" in snapshot || "execution_generation" in snapshot)
      throw new NativeError("Unsupported native contract", "rejected");
    this.runtime = snapshot.session_id;
    if (snapshot.running || snapshot.queued) {
      // A native resume can capture running=true just before completion and
      // return after that terminal event. Confirm once after its reply, while
      // retaining later events. This is a recovery barrier, not completion polling.
      this.requests.clear();
      const confirmed = await this.call<NativeSnapshot>("session.activate", {
        session_id: this.runtime,
      });
      this.assertLive();
      if (confirmed.session_id !== this.runtime || !Array.isArray(confirmed.messages))
        throw new NativeError("Invalid native recovery confirmation");
      if (!confirmed.running && !confirmed.queued) {
        snapshot = confirmed;
        // The settled authoritative history covers frames before this reply.
        // Keep only events arriving after it, preventing duplicated text.
        this.held = this.held.filter(
          (event, index) => index >= this.snapshotBoundary || event.type === "request.cancel",
        );
      }
    }
    if (pending && pendingDrafts.get(draftKey(this.profile, this.stored)) === pending) {
      pendingDrafts.delete(draftKey(this.profile, this.stored));
      clearTimeout(pending.timer);
      pending.viewer.close();
    }
    this.hooks.snapshot({
      ...snapshot,
      recovery: { epoch: "native-snapshot", through: 0, base_row_ids: null, complete: false },
    });
    this.holding = false;
    for (const event of this.held) this.event(event);
    this.held = [];
    this.publishRequests();
    this.channel.startHeartbeat();
    this.hooks.connection("open");
    this.hooks.recovered();
  }
  private event(event: GatewayEvent & { profile?: string }) {
    if (
      event.session_id !== this.runtime ||
      (event.profile && event.profile !== (this.profile || "default"))
    )
      return;
    this.sequence++;
    if (event.type === "request.cancel") {
      const payload = event.payload as { id?: string; request_id?: string };
      this.requests.delete(String(payload?.id || payload?.request_id || ""));
      this.publishRequests();
    }
    this.hooks.event(event);
  }
  private assertLive() {
    if (this.detached || this.failed) throw new NativeError("Viewer detached", "rejected");
  }
  private async call<T = any>(method: string, params: Record<string, unknown> = {}): Promise<T> {
    this.assertLive();
    if (!this.channel.connected) throw new NativeError("Native gateway disconnected", "rejected");
    try {
      const routed = { ...params, profile: this.profile || "default" };
      return await this.channel.request<T>(method, routed);
    } catch (error) {
      if (error instanceof JsonRpcGatewayError)
        throw new NativeError(
          "Hermes could not complete this operation",
          method === "prompt.submit" ? "unknown" : "rejected",
        );
      throw error;
    }
  }
  async rpc<T = any>(method: string, params: Record<string, unknown> = {}): Promise<T> {
    this.assertLive();
    if (!this.channel.connected)
      throw new NativeError("Native gateway disconnected; message not submitted", "rejected");
    const scoped = { session_id: this.runtime };
    let result: unknown;
    if (method === "prompt.submit") result = await this.submit(params);
    else if (method === "session.interrupt") {
      if (this.preparing) this.preparationCancelled = true;
      result = await this.call("session.interrupt", scoped);
    } else if (method === "session.steer") {
      result = await this.call("session.steer", { ...scoped, text: params.text });
      if ((result as { status?: string })?.status !== "rejected")
        this.hooks.input(String(params.text), true);
    } else if (["state", "history", "reconciled"].includes(method)) {
      const live = await this.call<NativeSnapshot>("session.activate", {
        ...scoped,
        ...(method === "history" ? {} : { omit_messages: true }),
      });
      result =
        method === "reconciled"
          ? { settled: !live.running && !live.queued && params.through === this.sequence }
          : method === "history"
            ? {
                messages: live.messages.map((row) => ({
                  ...row,
                  id: row.row_id == null ? undefined : String(row.row_id),
                  content: row.role === "tool" ? row.content : row.text || row.content || "",
                })),
              }
            : { running: !!live.running, queued: !!live.queued, delegating: false };
    } else throw new NativeError("Unsupported native operation", "rejected");
    return result as T;
  }
  private async submit(params: Record<string, unknown>) {
    if (this.preparing) throw new NativeError("Submission already in progress", "rejected");
    this.preparing = true;
    this.preparationCancelled = false;
    const guard = () => {
      this.assertLive();
      if (this.preparationCancelled)
        throw new NativeError("Message cancelled before submission", "rejected");
    };
    let dispatched = false;
    try {
      const response = await fetch(
        `/api/plugins/chathermes/chat/prepare?profile=${encodeURIComponent(this.profile || "default")}`,
        {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
          redirect: "manual",
          signal: this.abort.signal,
          headers: { "content-type": "application/json" },
          body: JSON.stringify(params),
        },
      );
      if (!response.ok || response.type === "opaqueredirect")
        throw new NativeError("Could not prepare this message; nothing submitted", "rejected");
      const prepared = await response.json();
      guard();
      const state = await this.call<NativeSnapshot>("session.activate", {
        session_id: this.runtime,
        omit_messages: true,
      });
      if (state.running || state.queued) throw new NativeError("This session is busy", "rejected");
      let input = prepared.input;
      const refs: string[] = [];
      for (const file of prepared.files || []) {
        guard();
        const attached = await this.call("file.attach", { session_id: this.runtime, ...file });
        if (!attached.attached || typeof attached.ref_text !== "string")
          throw new NativeError("Could not stage this file", "rejected");
        refs.push(attached.ref_text);
      }
      if (refs.length)
        input = Array.isArray(input)
          ? [...input, { type: "text", text: "\n" + refs.join("\n") }]
          : input + "\n" + refs.join("\n");
      if (prepared.model) {
        guard();
        await this.call("approval.pending", { session_id: this.runtime });
        guard();
        const value =
          prepared.model +
          " --session" +
          (prepared.provider ? " --provider " + prepared.provider : "");
        const switched = await this.call("config.set", {
          session_id: this.runtime,
          key: "model",
          value,
          scope: "session",
        });
        if (switched.confirm_required || switched.deferred)
          throw new NativeError("Selected runtime model unavailable", "rejected");
        const confirmed = await this.call<NativeSnapshot>("session.activate", {
          session_id: this.runtime,
          omit_messages: true,
        });
        if (
          confirmed.info.model !== prepared.model ||
          (prepared.provider && confirmed.info.provider !== prepared.provider)
        )
          throw new NativeError("Selected runtime model was not applied", "rejected");
      }
      if (prepared.reasoning_effort !== undefined) {
        guard();
        const changed = await this.call("config.set", {
          session_id: this.runtime,
          key: "reasoning",
          value: prepared.reasoning_effort,
          scope: "session",
        });
        guard();
        const confirmed = await this.call("config.get", {
          session_id: this.runtime,
          key: "reasoning",
        });
        if (
          changed.deferred ||
          changed.confirm_required ||
          confirmed.value !== prepared.reasoning_effort
        )
          throw new NativeError("Selected reasoning effort was not applied", "rejected");
      }
      guard();
      const ticketResponse = await fetch("/api/auth/ws-ticket", {
        method: "POST",
        credentials: "same-origin",
        redirect: "manual",
        signal: this.abort.signal,
      });
      if (!ticketResponse.ok) throw new NativeError("Could not retain execution", "rejected");
      const { ticket } = await ticketResponse.json();
      guard();
      const retained = await fetch(
        `/api/plugins/chathermes/chat/retain?profile=${encodeURIComponent(this.profile || "default")}`,
        {
          method: "POST",
          credentials: "same-origin",
          redirect: "manual",
          signal: this.abort.signal,
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ session_id: this.stored, ticket }),
        },
      );
      if (!retained.ok || (await retained.json()).session_id !== this.runtime)
        throw new NativeError("Could not retain execution; nothing submitted", "rejected");
      guard();
      dispatched = true;
      return await this.call("prompt.submit", { session_id: this.runtime, text: input });
    } catch (error) {
      throw new NativeError(
        dispatched
          ? "Native submission outcome unknown. Inspect history before sending again."
          : error instanceof NativeError
            ? error.message
            : "Message preparation failed",
        dispatched ? "unknown" : "rejected",
      );
    } finally {
      this.preparing = false;
    }
  }
  async answer(id: string, result: Record<string, unknown>) {
    this.assertLive();
    const request = this.requests.get(id);
    if (!this.channel.connected || !request)
      throw new NativeError("Request is no longer open", "rejected");
    request.respond(result);
    this.requests.delete(id);
    this.publishRequests();
  }
  get boundary() {
    return this.sequence;
  }
  private disconnected(message?: string) {
    if (this.detached || this.failed) return;
    this.failed = true;
    this.dispose();
    this.hooks.connection("closed", message);
  }
  private dispose() {
    this.abort.abort();
    this.cancelOpening?.();
    this.cancelOpening = undefined;
    this.channel.detach(new NativeError("Viewer detached"));
    if (this.ws) {
      this.ws.onopen = this.ws.onmessage = this.ws.onerror = this.ws.onclose = null;
      this.ws.close();
      this.ws = undefined;
    }
    this.requests.clear();
  }
  close() {
    this.detached = true;
    this.dispose();
  }
}
