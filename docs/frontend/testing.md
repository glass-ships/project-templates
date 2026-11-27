# Testing

```sh
bun run test:unit
bun run test:e2e
```

CI runs both, plus the type check, lint and format checks, on every change.

## Unit tests

[Vitest](https://vitest.dev/) with [Testing Library](https://testing-library.com/docs/react-testing-library/intro/), in a simulated browser ([jsdom](https://github.com/jsdom/jsdom)). Tests are in `tests/unit/`, named `*.test.ts` or `*.test.tsx`.

```tsx title="tests/unit/components/AppCard.test.tsx"
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AppCard from "@/components/ui/AppCard";

describe("AppCard", () => {
  it("renders its children", () => {
    render(<AppCard>content</AppCard>);
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});
```

`tests/unit/setup.ts` runs before the tests:

- It fills in browser features jsdom doesn't have: `<dialog>`'s `showModal()` and `close()`, and `ResizeObserver`.
- After each test, it clears `localStorage` and the page, and undoes mocks and stubbed globals, so tests don't affect each other.

jsdom doesn't do layout, scrolling or `IntersectionObserver`. Tests that need them fake them (see `AppInfiniteScroll.test.tsx`), or belong in the end-to-end tests.

## End-to-end tests

[Playwright](https://playwright.dev/) tests in `tests/e2e/`, run in Chromium against a production build. `bun run test:e2e` builds the app and serves it on port 4180 first.

Before the first run, and after each Playwright update, install the browser:

```sh
bunx playwright install chromium
```

Import `test` and `expect` from `./fixtures`, not from `@playwright/test`:

```ts
import { expect, setTheme, test } from "./fixtures";

test("shows the about page", async ({ page }) => {
  await setTheme(page, "dark");
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: "About" })).toBeVisible();
});
```

Its `test` fails any test where the page logs a console error or throws an uncaught exception. `setTheme` saves a theme before the page loads, as if the user had picked it.

## Accessibility tests

`tests/e2e/a11y.test.ts` runs [axe](https://github.com/dequelabs/axe-core) on each page, in both themes, and fails on serious and critical violations. Add a test there for each new page.

Known violations that aren't fixed yet are listed in `KNOWN` in that file, so they don't fail the tests. Remove an entry once it's fixed, so the rule is checked again.
