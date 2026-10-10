import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { signIn } from "./login";

const png = readFileSync(new URL("../../public/icons/icon-192.png", import.meta.url));

test("artifact tiles adapt to available width without clipping controls", async ({
  page,
}, info) => {
  // Exercise the real dashboard mount with deterministic artifact data, without a provider turn.
  const names = [
    "Landscape.png",
    "Quarterly research report.pdf",
    "very-long-unbroken-filename-" + "details".repeat(18) + ".html",
    "Meeting recording.mp3",
    "Notes.txt",
    "Design.png",
  ];
  await page.route("**/api/plugins/chathermes/artifacts?*", (route) =>
    route.fulfill({
      json: {
        artifacts: names.map((name, index) => ({
          id: String(index + 1).repeat(64),
          session_id: "layout-test",
          name,
          mime: [
            "image/png",
            "application/pdf",
            "text/html",
            "audio/mpeg",
            "text/plain",
            "image/png",
          ][index],
          size: 2048,
          created_at: 100 + index,
          direction: index % 2 ? "uploaded" : "generated",
          session_title: "A conversation about research and design",
          project_name: index === 2 ? "Research project with a longer name" : undefined,
          reference: "",
          ref_text: "",
          can_delete: true,
        })),
        has_more: false,
        next_offset: names.length,
      },
    }),
  );
  await page.route("**/api/plugins/chathermes/artifacts/*/content*", (route) =>
    route.fulfill({ body: png, contentType: "image/png" }),
  );
  await signIn(page);
  await page.goto("/chathermes?view=artifacts");
  const browser = page.getByRole("region", { name: "Artifacts", exact: true });
  const cards = browser.locator(".artifact-card");
  await expect(cards).toHaveCount(6);
  const sizes =
    info.project.name === "desktop"
      ? [
          { width: 1720, height: 1000, columns: 4 },
          { width: 1280, height: 900, columns: 3 },
          { width: 1000, height: 900, columns: 2 },
        ]
      : [
          { width: 390, height: 844, columns: 2 },
          { width: 320, height: 740, columns: 2 },
        ];
  for (const size of sizes) {
    await page.setViewportSize(size);
    await expect
      .poll(() =>
        browser
          .locator(".artifact-grid")
          .evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(" ").length),
      )
      .toBe(size.columns);
    const layout = await browser.evaluate((section) => {
      const bounds = section.getBoundingClientRect();
      const cards = Array.from(section.querySelectorAll<HTMLElement>(".artifact-card"));
      return {
        overflow: section.scrollWidth > section.clientWidth,
        inside: cards.every((card) => {
          const rect = card.getBoundingClientRect();
          return rect.left >= bounds.left && rect.right <= bounds.right;
        }),
        mediaHeights: cards.map(
          (card) => card.querySelector(".artifact-tile-media")!.getBoundingClientRect().height,
        ),
        actionBottoms: cards
          .slice(
            0,
            getComputedStyle(section.querySelector(".artifact-grid")!).gridTemplateColumns.split(
              " ",
            ).length,
          )
          .map(
            (card) => card.querySelector(".artifact-card-actions")!.getBoundingClientRect().bottom,
          ),
      };
    });
    expect(layout.overflow).toBe(false);
    expect(layout.inside).toBe(true);
    expect(new Set(layout.mediaHeights).size).toBe(1);
    expect(Math.max(...layout.actionBottoms) - Math.min(...layout.actionBottoms)).toBeLessThan(1);
    await page.screenshot({ path: info.outputPath(`artifact-tiles-${size.width}.png`) });
  }
  const image = browser.getByRole("button", { name: "Preview Design.png", exact: true });
  await image.scrollIntoViewIfNeeded();
  await image.focus();
  await expect(image).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Preview Design.png" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(image).toBeFocused();
  const last = cards.last();
  await last.getByRole("button", { name: `More actions for ${names[5]}` }).click();
  await page.getByRole("menuitem", { name: "Delete", exact: true }).click();
  await expect(page.getByRole("alertdialog", { name: "Delete artifact" })).toBeVisible();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(cards).toHaveCount(6);
  await expect(last.getByRole("link", { name: "Download" })).toBeVisible();
});
