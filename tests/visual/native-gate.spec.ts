import { expect, test } from "@playwright/test";
import { signIn } from "./login";

test.use({ trace: "off" });

test("native gate exposes one pinned contract and rejects unknown wire operations", async ({
  page,
}) => {
  await signIn(page);
  const response = await page.request.get("/api/plugins/chathermes/chat/capabilities");
  expect(await response.json()).toMatchObject({
    protocol: "hermes.native.2bd378ed",
    mode: "native-gateway",
    reviewed_source: "2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19",
    guarantees: {
      offline_turn_lease: true,
      crash_safe_idempotency: false,
      lossless_snapshot_replay: false,
    },
  });
  const result = await page.evaluate(async () => {
    const { ticket } = await (await fetch("/api/auth/ws-ticket", { method: "POST" })).json();
    return new Promise<number | undefined>((resolve) => {
      const url = new URL("/api/ws", location.href);
      url.protocol = location.protocol === "https:" ? "wss:" : "ws:";
      const ws = new WebSocket(url, ["hermes-gateway-v1", "hermes-gateway-ticket." + ticket]);
      const timer = setTimeout(() => {
        ws.close();
        resolve(undefined);
      }, 10000);
      ws.onopen = () =>
        ws.send(
          JSON.stringify({
            jsonrpc: "2.0",
            id: "probe",
            method: "unsupported.fixture",
            params: { profile: "default" },
          }),
        );
      ws.onmessage = (event) => {
        for (const line of String(event.data).split("\n").filter(Boolean)) {
          const frame = JSON.parse(line);
          if (frame.id === "probe") {
            clearTimeout(timer);
            ws.close();
            resolve(frame.error?.code);
          }
        }
      };
    });
  });
  expect(result).toBe(-32601);
});

test("profile membership rejects another profile's stored session", async ({ page }) => {
  await signIn(page);
  const made = await page.request.post("/api/plugins/chathermes/chat/sessions?profile=alpha", {
    data: {},
  });
  expect(made.ok()).toBe(true);
  const { session } = await made.json();
  try {
    expect(
      (
        await page.request.get(
          `/api/plugins/chathermes/chat/sessions/${session.id}/membership?profile=alpha`,
        )
      ).ok(),
    ).toBe(true);
    expect(
      (
        await page.request.get(
          `/api/plugins/chathermes/chat/sessions/${session.id}/membership?profile=beta`,
        )
      ).status(),
    ).toBe(404);
  } finally {
    await page.request.delete(`/api/plugins/chathermes/api/sessions/${session.id}?profile=alpha`);
  }
});
