import { test as base, expect, type Page } from "@playwright/test";

/** `page` that fails the test if the app throws or logs a console error. */
export const test = base.extend<{ errors: string[] }>({
  errors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });
      await use(errors);
      expect(errors, "page errors / console errors").toEqual([]);
    },
    { auto: true },
  ],
});

/** Theme picked up by ThemeToggle on load; set before navigating. */
export const setTheme = (page: Page, theme: "light" | "dark") =>
  page.addInitScript((theme) => localStorage.setItem("theme", theme), theme);

export { expect };
