import { expect, setTheme, test } from "./fixtures";

test.describe("Testbed (/)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders the page", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Testbed", level: 1 })).toBeVisible();
    await expect(page.getByRole("navigation").getByRole("img", { name: "Logo" })).toBeVisible();
  });

  test("shows a toast when a button is clicked", async ({ page }) => {
    await page.getByRole("button", { name: "Toast Success" }).click();
    await expect(page.getByText("Button 1 clicked")).toBeVisible();
  });

  test("shows a tooltip on hover", async ({ page }) => {
    await page.getByRole("button", { name: "Tooltip Left" }).hover();
    await expect(page.getByRole("tooltip")).toHaveText("Tooltip content");
  });

  test("opens the modal and closes it with Escape", async ({ page }) => {
    await page.getByRole("button", { name: "Test modal" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading", { name: "Test Modal" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  // KNOWN BUG: body overflow isn't reset when AppModal closes (see tests/unit/components/AppModal.test.tsx).
  // Remove `.fail` once AppModal.tsx is fixed.
  test.fail("lets the page scroll again after the modal closes", async ({ page }) => {
    await page.getByRole("button", { name: "Test modal" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();

    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden", { timeout: 1_000 });
  });

  test("links to the nexus page", async ({ page }) => {
    await page.getByRole("link", { name: "Link to nexus" }).click();
    await expect(page).toHaveURL("/nexus");
    await expect(page.locator("canvas#nexus")).toBeVisible();
  });
});

test.describe("theme", () => {
  test("follows the system color scheme when nothing is saved", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.locator("body")).toHaveClass(/\bdark\b/);
  });

  test("toggles, and the choice survives a reload", async ({ page }) => {
    await setTheme(page, "dark");
    await page.goto("/");
    await expect(page.locator("body")).toHaveClass(/\bdark\b/);

    await page.getByText("Toggle", { exact: true }).click();
    await expect(page.locator("body")).toHaveClass(/\blight\b/);

    // addInitScript re-runs on reload, so check storage rather than reloading.
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("light");
  });
});

test("nexus page draws its canvas", async ({ page }) => {
  await page.goto("/nexus");
  const canvas = page.locator("canvas#nexus");
  await expect(canvas).toBeVisible();
  expect(await canvas.evaluate((el: HTMLCanvasElement) => el.width)).toBeGreaterThan(0);
});

test("unknown routes show the 404 page with a way home", async ({ page }) => {
  await page.goto("/does-not-exist");
  await expect(page.getByRole("heading", { name: "Page Not Found" })).toBeVisible();

  await page.getByRole("link", { name: "Return to Home" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { name: "Testbed", level: 1 })).toBeVisible();
});
