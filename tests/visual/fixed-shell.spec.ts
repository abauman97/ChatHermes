import { expect, test, type Page } from "@playwright/test";
import { signIn } from "./login";

async function assertBounds(page: Page, top: number, height: number) {
  await expect
    .poll(() =>
      page.evaluate(() => {
        const box = (selector: string) =>
          document.querySelector(`.chathermes-embedded ${selector}`)!.getBoundingClientRect();
        const shell = box(".app-shell");
        const main = box(".main-panel");
        const header = box(".topbar");
        const composer = box(".composer");
        const transcript = box(".transcript");
        const footer = box(".app-footer");
        return {
          shellTop: shell.top,
          shellHeight: shell.height,
          headerTop: header.top,
          headerBottom: header.bottom,
          mainTop: main.top,
          composerBottom: composer.bottom,
          footerTop: footer.top,
          footerBottom: footer.bottom,
          shellBottom: shell.bottom,
          transcriptHeight: transcript.height,
        };
      }),
    )
    .toMatchObject({
      shellTop: top,
      shellHeight: height,
      headerTop: top,
      mainTop: top,
      footerBottom: top + height,
      shellBottom: top + height,
    });
  const result = await page.evaluate(() => {
    const header = document.querySelector(".chathermes-embedded .topbar")!.getBoundingClientRect();
    const transcript = document
      .querySelector(".chathermes-embedded .transcript")!
      .getBoundingClientRect();
    const composer = document
      .querySelector(".chathermes-embedded .composer")!
      .getBoundingClientRect();
    const footer = document
      .querySelector(".chathermes-embedded .app-footer")!
      .getBoundingClientRect();
    return {
      headerBottom: header.bottom,
      transcriptTop: transcript.top,
      composerBottom: composer.bottom,
      footerTop: footer.top,
    };
  });
  expect(result.headerBottom).toBeLessThanOrEqual(result.transcriptTop + 1);
  expect(result.headerBottom).toBeLessThanOrEqual(top + height);
  expect(result.composerBottom).toBeCloseTo(result.footerTop, 0);
  await expect(page.getByRole("textbox", { name: "Message Hermes" })).toBeFocused();
}

async function assertScrollableTranscript(page: Page) {
  const transcript = page.locator(".chathermes-embedded .transcript");
  await transcript.evaluate((element) => {
    const content = document.createElement("div");
    content.style.cssText = "height: 1800px; flex-shrink: 0";
    content.textContent = "Transcript scroll regression content";
    element.firstElementChild!.append(content);
  });
  await expect
    .poll(() => transcript.evaluate((element) => element.scrollHeight - element.clientHeight))
    .toBeGreaterThan(0);
  await transcript.evaluate((element) => (element.scrollTop = 150));
  await expect.poll(() => transcript.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
}

test("fixed shell keeps its header visible and footer anchored as viewport shrinks", async ({
  page,
}, info) => {
  await signIn(page);
  const viewport = page.viewportSize()!;
  await page.getByRole("textbox", { name: "Message Hermes" }).focus();
  const height = viewport.height - 260;
  await page.setViewportSize({ width: viewport.width, height });
  await assertBounds(page, 0, height);
  await assertScrollableTranscript(page);
  await assertBounds(page, 0, height);
  await page.screenshot({ path: info.outputPath("shell-short-viewport.png") });
  await page.setViewportSize(viewport);
});

test("mobile shell stays anchored during synthetic visual viewport resize and pan", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "mobile", "Visual viewport keyboard behavior is mobile-only");
  await signIn(page);
  const viewport = page.viewportSize()!;
  await page.getByRole("textbox", { name: "Message Hermes" }).focus();
  const layoutHeight = await page.evaluate(() => document.documentElement.clientHeight);
  const keyboardHeight = viewport.height - 300;
  await page.evaluate((height) => {
    Object.defineProperty(window.visualViewport!, "height", { configurable: true, value: height });
    window.visualViewport!.dispatchEvent(new Event("resize"));
  }, keyboardHeight);
  await assertBounds(page, 0, viewport.height);
  await page.evaluate(() => {
    Object.defineProperty(window.visualViewport!, "offsetTop", { configurable: true, value: 84 });
    window.visualViewport!.dispatchEvent(new Event("scroll"));
  });
  expect(await page.evaluate(() => document.documentElement.clientHeight)).toBe(layoutHeight);
  await assertBounds(page, 0, viewport.height);
  await assertScrollableTranscript(page);
  await assertBounds(page, 0, viewport.height);
  await page.screenshot({
    path: info.outputPath("shell-visual-viewport-events.png"),
  });
});
