import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, setTheme, test } from "./fixtures";

/**
 * Known serious violations per page, not yet fixed. Remove an entry once it's
 * fixed so the rule is enforced again. Moderate/minor rules aren't enforced yet.
 */
const TESTBED: Record<string, string> = {
  // TODO: AppButton text (primary/secondary/none) and the color swatch labels fail contrast in both themes
  "color-contrast": "AppButton text, color swatch labels",
  // TODO: the <pre> code sample scrolls horizontally but isn't keyboard focusable (needs tabindex="0")
  "scrollable-region-focusable": "<pre> code sample",
};

const KNOWN: Record<string, Record<string, string>> = {
  "Testbed (light)": TESTBED,
  "Testbed (dark)": TESTBED,
  404: {
    // TODO: primary AppButton text ("Return to Home") fails contrast
    "color-contrast": "AppButton text",
  },
};

/** run axe and fail on serious/critical violations that aren't listed in KNOWN */
const checkA11y = async (page: Page, name: string) => {
  const { violations } = await new AxeBuilder({ page }).analyze();
  const serious = violations
    .filter((v) => (v.impact === "serious" || v.impact === "critical") && !(v.id in (KNOWN[name] ?? {})))
    .map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
  expect(serious).toEqual([]);
};

for (const theme of ["light", "dark"] as const) {
  test(`Testbed (${theme} theme) has no serious a11y violations`, async ({ page }) => {
    await setTheme(page, theme);
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Testbed", level: 1 })).toBeVisible();
    await expect(page.locator("body")).toHaveClass(new RegExp(`\\b${theme}\\b`));
    await checkA11y(page, `Testbed (${theme})`);
  });
}

test("Testbed modal has no serious a11y violations", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Test modal" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await checkA11y(page, "Testbed modal");
});

test("Nexus page has no serious a11y violations", async ({ page }) => {
  await page.goto("/nexus");
  await expect(page.locator("canvas#nexus")).toBeVisible();
  await checkA11y(page, "Nexus");
});

test("404 page has no serious a11y violations", async ({ page }) => {
  await page.goto("/does-not-exist");
  await expect(page.getByRole("heading", { name: "Page Not Found" })).toBeVisible();
  await checkA11y(page, "404");
});
