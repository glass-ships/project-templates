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

  test("returns focus to the button that opened the modal", async ({ page }) => {
    const opener = page.getByRole("button", { name: "Test modal", exact: true });
    await opener.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(opener).toBeFocused();
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
  // both schemes: dark is also the fallback, so checking dark alone can't tell them apart
  for (const scheme of ["light", "dark"] as const) {
    test(`follows a ${scheme} system color scheme when nothing is saved`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto("/");
      await expect(page.locator("html")).toHaveClass(new RegExp(`\\b${scheme}\\b`));
    });
  }

  test("toggles, and saves the choice", async ({ page }) => {
    await setTheme(page, "dark");
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);

    await page.getByRole("button", { name: "Light theme" }).click();
    await expect(page.locator("html")).toHaveClass(/\blight\b/);

    // addInitScript re-runs on reload, so check storage rather than reloading.
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe('"light"');
  });
});

test.describe("smooth scrolling", () => {
  for (const [reducedMotion, expected] of [
    ["no-preference", "smooth"],
    ["reduce", "auto"],
  ] as const) {
    test(`is ${expected} when the user's reduced-motion setting is ${reducedMotion}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion });
      await page.goto("/");
      await expect(page.locator("html")).toHaveCSS("scroll-behavior", expected);
    });
  }
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

  // sized to the window (a canvas that was never sized is 300x150)
  const size = await canvas.evaluate((el: HTMLCanvasElement) => ({
    width: el.width,
    expected: Math.floor(window.innerWidth * window.devicePixelRatio),
  }));
  expect(size.width).toBe(size.expected);

  // and something was drawn: some pixels aren't transparent
  await expect
    .poll(() =>
      canvas.evaluate((el: HTMLCanvasElement) => {
        const data = el.getContext("2d")?.getImageData(0, 0, el.width, el.height).data ?? [];
        let drawn = 0;
        for (let i = 3; i < data.length; i += 4) if (data[i] > 0) drawn++;
        return drawn;
      }),
    )
    .toBeGreaterThan(0);
});

test("loads the fonts from the page head, not from an @import in the CSS", async ({ page }) => {
  await page.goto("/");
  // an @import'd stylesheet holds back the CSS that imports it, so nothing paints until it loads
  // (only this site's sheets: the browser hides the rules of the fonts sheet, which is from another site)
  const imports = await page.evaluate(
    () =>
      [...document.styleSheets]
        .filter((sheet) => !sheet.href || new URL(sheet.href).origin === location.origin)
        .flatMap((sheet) => [...sheet.cssRules].filter((rule) => rule instanceof CSSImportRule)).length,
  );
  expect(imports).toBe(0);
  await expect(page.locator("link[rel=stylesheet][href*='fonts.googleapis.com']")).toHaveCount(1);
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
