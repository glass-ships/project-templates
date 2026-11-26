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

  test("lets the page scroll again after the modal closes", async ({ page }) => {
    await page.getByRole("button", { name: "Test modal" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();

    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden", { timeout: 1_000 });
  });

  test("keeps a locked modal open on Escape and backdrop clicks", async ({ page }) => {
    await page.getByRole("button", { name: "Test locked modal" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading", { name: "Locked Modal" })).toBeVisible();

    // Press twice: Chrome force-closes a dialog on a repeated Escape if it only cancelled the first one
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
    await page.mouse.click(5, 5); // backdrop
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).toBeHidden();
  });

  test("links to the nexus page", async ({ page }) => {
    await page.getByRole("link", { name: "Link to nexus" }).click();
    await expect(page).toHaveURL("/nexus");
    await expect(page.locator("canvas#nexus")).toBeVisible();
  });

  test("scrolls to the target of a hash link", async ({ page }) => {
    await page.getByRole("link", { name: "Hash link" }).click();
    await expect(page).toHaveURL("/#test-icons");
    await expect(page.locator("#test-icons")).toBeInViewport();
  });

  test("opens the next page at the top, not at this page's scroll position", async ({ page }) => {
    await page.getByRole("link", { name: "Infinite Scroll" }).click(); // the button is far down, so the Testbed is scrolled
    await expect(page).toHaveURL("/infinite-scroll");
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("opens same-site files instead of the 404 page", async ({ page }) => {
    await page.getByRole("link", { name: "Static file" }).click();
    await expect(page).toHaveURL("/images/favicon.ico");
    // the browser loaded the file itself, so the app (and its navbar) is gone
    await expect(page.getByRole("navigation")).toHaveCount(0);
  });
});

test.describe("theme", () => {
  test("follows the system color scheme when nothing is saved", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  });

  test("toggles, and the choice survives a reload", async ({ page }) => {
    await setTheme(page, "dark");
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);

    await page.getByRole("button", { name: "Light theme" }).click();
    await expect(page.locator("html")).toHaveClass(/\blight\b/);

    // addInitScript re-runs on reload, so check storage rather than reloading.
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe('"light"');
  });
});

// a page whose content is all there on first render; see the shortcut on ScrollToHash
test("scrolls to the #hash target after moving to another page", async ({ page }) => {
  await page.goto("/infinite-scroll");
  await page.getByRole("link", { name: "Testbed tooltip" }).click();
  await expect(page).toHaveURL("/#tooltip-text");
  await expect(page.locator("#tooltip-text")).toBeInViewport();
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

  // a flag on window survives router navigation but not a page reload
  await page.evaluate(() => Object.assign(window, { noReload: true }));
  await page.getByRole("link", { name: "Return to Home" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { name: "Testbed", level: 1 })).toBeVisible();
  expect(await page.evaluate(() => "noReload" in window)).toBe(true);
});
