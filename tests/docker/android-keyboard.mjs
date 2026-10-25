import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "@playwright/test";
import { waitForChrome } from "./android-browser.mjs";

// Run after browser preparation; installation is optional. CDP touch events
// open the actual Android software IME in the visible dashboard target.
const [container, port = "9223", output = "tests/visual-output/android-keyboard"] =
  process.argv.slice(2);
if (!container)
  throw new Error("Usage: node tests/docker/android-keyboard.mjs CONTAINER [CDP_PORT] [OUTPUT]");
const adb = (...args) =>
  execFileSync("docker", ["exec", container, "adb", ...args], {
    timeout: 15000,
    stdio: ["ignore", "pipe", "pipe"],
  });
const settings = ["show_ime_with_hard_keyboard", "accelerometer_rotation", "user_rotation"];
const previous = settings.map((key, index) =>
  adb("shell", "settings", "get", index ? "system" : "secure", key)
    .toString()
    .trim(),
);
const endpoint = /^\d+$/.test(port) ? `http://127.0.0.1:${port}` : port;
const browser = await waitForChrome(endpoint, (url, options) =>
  chromium.connectOverCDP(url, options),
);
const evidence = {};
/** @type {import("@playwright/test").Page | undefined} */
let page;
try {
  for (let attempt = 0; attempt < 30 && !page; attempt++) {
    for (const candidate of browser.contexts().flatMap((context) => context.pages())) {
      if (
        candidate.url().startsWith("http://localhost:9119/chathermes") &&
        (await candidate.evaluate(() => document.visibilityState === "visible").catch(() => false))
      )
        page = candidate;
    }
    if (!page) await delay(500);
  }
  assert.ok(page, "Prepare and foreground the ChatHermes browser before running this check");
  await page.locator(".composer-input").waitFor();
  assert.notEqual(await page.evaluate(() => navigator.virtualKeyboard?.overlaysContent), true);
  await mkdir(output, { recursive: true });
  const cdp = await page.context().newCDPSession(page);
  const area = page.locator(".composer-input");
  const metrics = () =>
    page.evaluate(() => {
      const bounds = (selector) => {
        const rect = document.querySelector(selector).getBoundingClientRect();
        return {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom,
        };
      };
      return {
        viewport: {
          width: innerWidth,
          height: innerHeight,
          top: visualViewport.offsetTop,
          scroll: scrollY,
        },
        header: bounds(".topbar"),
        footer: bounds(".app-footer"),
        composer: bounds(".composer"),
        focused: document.activeElement === document.querySelector(".composer-input"),
        margin: getComputedStyle(document.querySelector(".composer")).marginBottom,
      };
    });
  const snapshot = async (name) => {
    evidence[name] = await metrics();
    await writeFile(`${output}/${name}.png`, adb("exec-out", "screencap", "-p"));
    return evidence[name];
  };
  const closeTo = (actual, expected, message) =>
    assert.ok(Math.abs(actual - expected) < 1, `${message}: ${actual} vs ${expected}`);
  const focusedLayout = (actual) => {
    assert.equal(actual.focused, true);
    assert.equal(actual.margin, "0px");
    closeTo(actual.footer.height, 4, "Focused mobile footer must be 4px");
    closeTo(actual.composer.bottom, actual.footer.y, "Composer must meet footer");
    closeTo(actual.footer.bottom, actual.viewport.height, "Footer must meet resized viewport");
  };
  const keyboardShown = () =>
    /mInputShown=true/.test(adb("shell", "dumpsys", "input_method").toString());
  const waitKeyboard = async (shown) => {
    for (let attempt = 0; attempt < 50; attempt++) {
      if (keyboardShown() === shown) return;
      await delay(100);
    }
    assert.fail(`Keyboard visibility did not become ${shown}`);
  };
  const dismissKeyboard = async () => {
    if (keyboardShown()) adb("shell", "input", "keyevent", "KEYCODE_BACK");
    await waitKeyboard(false);
  };
  const settledLayout = () =>
    page.waitForFunction(() => {
      const composer = document.querySelector(".composer").getBoundingClientRect();
      const footer = document.querySelector(".app-footer").getBoundingClientRect();
      return (
        Math.abs(composer.bottom - footer.top) < 1 && Math.abs(footer.bottom - innerHeight) < 1
      );
    });
  const tapComposer = async () => {
    const height = await page.evaluate(() => innerHeight);
    const rect = await area.boundingBox();
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }],
    });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await waitKeyboard(true);
    await page.waitForFunction((height) => innerHeight < height, height);
    await settledLayout();
    assert.match(adb("shell", "dumpsys", "input_method").toString(), /mInputShown=true/);
  };
  const orientation = async (name, rotation) => {
    await dismissKeyboard();
    await area.evaluate((element) => element.blur());
    adb("shell", "settings", "put", "system", "accelerometer_rotation", "0");
    adb("shell", "settings", "put", "system", "user_rotation", rotation);
    await page.waitForFunction(
      (landscape) => innerWidth > innerHeight === landscape,
      rotation === "1",
    );
    await settledLayout();
    const before = await snapshot(`${name}-closed`);
    closeTo(before.composer.bottom, before.footer.y, "Closed composer must meet footer");
    await tapComposer();
    const open = await snapshot(`${name}-open`);
    focusedLayout(open);
    assert.ok(open.viewport.height < before.viewport.height, "Keyboard must resize content");
    assert.equal(open.focused, true);
    const draft = Array.from({ length: 12 }, (_, index) => `Keyboard draft row ${index + 1}`).join(
      "\n",
    );
    await area.fill(draft);
    const grown = await snapshot(`${name}-grown`);
    focusedLayout(grown);
    assert.ok(
      grown.composer.y >= grown.header.bottom,
      "Growing composer must stay below the header",
    );
    const scrolling = await area.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
      return {
        content: element.scrollHeight,
        visible: element.clientHeight,
        top: element.scrollTop,
      };
    });
    assert.ok(
      scrolling.content > scrolling.visible && scrolling.top > 0,
      "Long drafts must scroll inside the composer",
    );
    // Android Back dismisses only the keyboard; the textarea remains focused.
    adb("shell", "input", "keyevent", "KEYCODE_BACK");
    await waitKeyboard(false);
    await page.waitForFunction((height) => innerHeight >= height, before.viewport.height);
    await settledLayout();
    const dismissed = await snapshot(`${name}-dismissed-focused`);
    focusedLayout(dismissed);
    assert.equal(dismissed.focused, true);
    assert.equal(await area.inputValue(), draft);
    closeTo(dismissed.composer.bottom, dismissed.footer.y, "Dismissed composer must meet footer");
    await area.fill("Keyboard draft preserved");
    await tapComposer();
    const reopened = await snapshot(`${name}-reopened`);
    focusedLayout(reopened);
    await dismissKeyboard();
    await area.fill("");
    await dismissKeyboard();
    await area.evaluate((element) => element.blur());
    console.log(
      `${name}: resized viewport and 4px focused footer survive keyboard opening, growth, dismissal and reopening`,
    );
  };
  adb("shell", "settings", "put", "secure", "show_ime_with_hard_keyboard", "1");
  await orientation("portrait", "0");
  await orientation("landscape", "1");
  await cdp.detach();
} finally {
  await writeFile(`${output}/metrics.json`, JSON.stringify(evidence, null, 2)).catch(() => {});
  for (let index = 0; index < settings.length; index++) {
    const namespace = index ? "system" : "secure";
    const value = previous[index];
    if (value === "null") adb("shell", "settings", "delete", namespace, settings[index]);
    else adb("shell", "settings", "put", namespace, settings[index], value);
  }
  await browser.close();
}
