import { expect, test } from "@playwright/test";
import { signIn } from "./login";

test.use({ trace: "off" });

test("native duplicate interim/final settles once in the mounted dashboard", async ({
  page,
}, info) => {
  // Exercise the real authenticated dashboard and native admission. Add the
  // Desktop duplicate-delivery sequence at the browser socket boundary.
  await page.addInitScript(() => {
    const Socket = window.WebSocket;
    class DuplicateFinalSocket extends Socket {
      constructor(url: string | URL, protocols?: string | string[]) {
        super(url, protocols);
        if (!new URL(String(url)).pathname.endsWith("/chathermes/chat/ws")) return;
        let injected = false;
        this.addEventListener("message", (event) => {
          const frame = JSON.parse(event.data);
          if (injected || frame.method !== "event" || frame.params?.type !== "message.complete")
            return;
          const text = frame.params.payload?.text;
          if (!text) return;
          injected = true;
          (
            window as unknown as { chathermesDuplicateInjected: boolean }
          ).chathermesDuplicateInjected = true;
          const deliver = (type: string, payload: object) =>
            this.dispatchEvent(
              new MessageEvent("message", {
                data: JSON.stringify({
                  jsonrpc: "2.0",
                  method: "event",
                  params: { ...frame.params, type, payload },
                }),
              }),
            );
          deliver("message.interim", { text, already_streamed: true });
          deliver("message.delta", { text: text + "\n" });
        });
      }
    }
    window.WebSocket = DuplicateFinalSocket;
  });
  await signIn(page);
  const plugin = page.locator(".chathermes-embedded");
  const composer = plugin.getByRole("textbox", { name: "Message Hermes" });
  await composer.click();
  await expect(composer).toBeFocused();
  await composer.fill("Native duplicate-final browser regression");
  await plugin.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(plugin.locator(".message.assistant")).toHaveCount(1);
  await expect(plugin.getByRole("button", { name: "Send message", exact: true })).toBeVisible({
    timeout: 30000,
  });
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { chathermesDuplicateInjected: boolean }).chathermesDuplicateInjected,
    ),
  ).toBe(true);
  await expect(plugin.locator(".message.assistant")).toHaveCount(1);
  await expect(plugin.locator(".message.assistant")).toHaveText(
    "Isolated Hermes reply. Your message was received.",
  );
  await composer.click();
  await expect(composer).toBeFocused();
  await page.screenshot({ path: info.outputPath("native-duplicate-final-completed.png") });
  await page.reload();
  await expect(plugin.locator(".message.assistant")).toHaveCount(1);
  await expect(plugin.locator(".message.assistant")).toHaveText(
    "Isolated Hermes reply. Your message was received.",
  );
});
