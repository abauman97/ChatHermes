import { expect, test } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { signIn } from "./login";

// Seed only the caller's disposable fixture. No provider turn or personal state.
const container = process.env.CHATHERMES_TEST_CONTAINER;
test.skip(!container, "Set CHATHERMES_TEST_CONTAINER to the isolated launcher-owned fixture");
test.use({ trace: "off" });

// Named profiles can be included when the host supports secondary plugin processes.
for (const profile of (process.env.CHATHERMES_IMAGE_TEST_PROFILES || "default").split(",")) {
  for (const format of ["legacy-text", "legacy-multipart", "media-text", "media-multipart"]) {
    const multipart = format.endsWith("multipart");
    test(`persisted ${format} upload previews and downloads in ${profile}`, async ({
      page,
    }, info) => {
      await signIn(page);
      const file = await readFile(new URL("./fixtures/upload-colors.png", import.meta.url));
      const upload = await page.request.post(`/api/plugins/chathermes/uploads?profile=${profile}`, {
        data: {
          name: "upload-colors.png",
          data: `data:image/png;base64,${file.toString("base64")}`,
        },
      });
      expect(upload.status()).toBe(201);
      const storedPath = (await upload.json()).path as string;
      const imageId = storedPath.split("/").pop()!;
      const session = await page.request.post(
        `/api/plugins/chathermes/chat/sessions?profile=${profile}`,
        {
          data: {},
        },
      );
      expect(session.status()).toBe(201);
      const body = await session.json();
      const sessionId = (body.session || body).id as string;
      // Historical annotations used this home-independent path. Native resume
      // must retain the same image endpoint as the initial REST history read.
      const note = Buffer.from("Synthetic uploaded text preview.");
      let notePath = "";
      if (format.startsWith("media-")) {
        const uploadedNote = await page.request.post(
          `/api/plugins/chathermes/uploads?profile=${profile}`,
          {
            data: {
              name: "upload-note.txt",
              data: `data:text/plain;base64,${note.toString("base64")}`,
            },
          },
        );
        expect(uploadedNote.status()).toBe(201);
        notePath = (await uploadedNote.json()).path;
      }
      const text = `Inspect this image\nAttached image upload-colors.png: /uploads/chathermes/${imageId}${format.startsWith("media-") ? `\nMEDIA:"/uploads/chathermes/${imageId}"` : ""}`;
      const historyText =
        text +
        (notePath ? `\nAttached file upload-note.txt: ${notePath}\nMEDIA:"${notePath}"` : "");
      const content = multipart ? [{ type: "text", text: historyText }] : historyText;
      const fixture = JSON.stringify({ storedPath, sessionId, content });
      execFileSync("docker", ["exec", "-i", container!, "/opt/hermes/.venv/bin/python", "-"], {
        input: `import json\nfrom pathlib import Path\nfrom hermes_state import SessionDB\nf = json.loads(${JSON.stringify(fixture)})\ndb = SessionDB(db_path=Path(f['storedPath']).parents[2] / 'state.db')\ndb.append_message(f['sessionId'], 'user', f['content'])\ndb.close()\n`,
      });
      let snapshots = 0;
      page.on("websocket", (socket) => {
        socket.on("framereceived", ({ payload }) => {
          for (const line of String(payload).split("\n").filter(Boolean)) {
            const frame = JSON.parse(line);
            if (frame.result?.session_id && Array.isArray(frame.result.messages)) snapshots++;
          }
        });
      });
      try {
        for (const attempt of ["initial", "reload"]) {
          const previousSnapshots = snapshots;
          const resumed = page.waitForResponse((r) =>
            new URL(r.url()).pathname.endsWith(`/chat/sessions/${sessionId}/membership`),
          );
          if (attempt === "reload") await page.reload();
          else
            await page.goto(`/chathermes?profile=${profile}#/chat/${sessionId}?profile=${profile}`);
          expect((await resumed).status()).toBe(200);
          const plugin = page.locator(".chathermes-embedded");
          const message = plugin
            .locator("article.message.user")
            .filter({ hasText: "Inspect this image" });
          await expect(message).not.toContainText("MEDIA:");
          const card = message.locator(".artifact-card");
          const image = card.locator("button img");
          const src = `/api/plugins/chathermes/images/${imageId}?profile=${profile}`;
          await expect(image).toHaveAttribute("src", src);
          await expect(image).toHaveJSProperty("naturalWidth", 240);
          await expect(image).toHaveJSProperty("naturalHeight", 160);
          // Allow the native snapshot to replace the initial REST rows before
          // checking the final source; this caught the original disappearing image.
          await expect
            .poll(() => page.evaluate(() => document.querySelectorAll("dialog[open]").length))
            .toBe(0);
          await expect.poll(() => snapshots).toBeGreaterThan(previousSnapshots);
          await expect(image).toHaveAttribute("src", src);
          // A snapshot can replace the DOM node between source and layout
          // reads. Wait for the replacement to finish layout as well.
          await expect
            .poll(async () => (await image.boundingBox())?.width || 0)
            .toBeGreaterThanOrEqual(120);
          await expect
            .poll(async () => (await image.boundingBox())?.height || 0)
            .toBeGreaterThanOrEqual(80);
          const request = await page.request.get(src);
          expect(request.status()).toBe(200);
          expect(request.headers()["content-type"]).toBe("image/png");
          expect(await request.body()).toEqual(file);
          const anonymous = await page.request.get(src, {
            headers: { Cookie: "" },
            maxRedirects: 0,
          });
          expect([302, 401, 403]).toContain(anonymous.status());
          const dialog = card.filter({ hasText: "upload-colors.png" }).locator("dialog");
          await expect(dialog).not.toBeVisible();
          await page.screenshot({ path: info.outputPath(`${attempt}-inline.png`), fullPage: true });
          await image.click();
          await expect(dialog).toBeVisible();
          await expect(dialog.locator("img")).toHaveAttribute("src", src);
          await expect(dialog.locator("img")).toHaveJSProperty("naturalWidth", 240);
          await page.screenshot({ path: info.outputPath(`${attempt}-viewer.png`), fullPage: true });
          const download = page.waitForEvent("download");
          await dialog.getByRole("link", { name: "Download", exact: true }).click();
          const downloaded = await download;
          expect(downloaded.suggestedFilename()).toBe("upload-colors.png");
          expect(await readFile((await downloaded.path())!)).toEqual(file);
          await dialog.getByRole("button", { name: "Close preview" }).click();
          await expect(dialog).not.toBeVisible();
          if (notePath) {
            const noteCard = card.filter({ hasText: "upload-note.txt" });
            await expect(noteCard).toHaveCount(1);
            await noteCard
              .getByRole("button", { name: "Preview upload-note.txt", exact: true })
              .click();
            await expect(noteCard.locator("dialog pre")).toHaveText(note.toString());
            const noteDownload = page.waitForEvent("download");
            await noteCard
              .locator("dialog")
              .getByRole("link", { name: "Download", exact: true })
              .click();
            const downloadedNote = await noteDownload;
            expect(downloadedNote.suggestedFilename()).toBe("upload-note.txt");
            expect(await readFile((await downloadedNote.path())!)).toEqual(note);
            await noteCard.getByRole("button", { name: "Close preview" }).click();
          }
          const composer = plugin.getByRole("textbox", { name: "Message Hermes" });
          await composer.fill("Draft stays focusable");
          await expect(composer).toBeFocused();
          await expect(composer).toHaveCSS("font-size", "16px");
          expect(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          ).toBe(true);
        }
      } finally {
        await page.request.delete(
          `/api/plugins/chathermes/api/sessions/${sessionId}?profile=${profile}`,
        );
      }
    });
  }
}
