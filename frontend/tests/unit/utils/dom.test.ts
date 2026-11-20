import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * dom.ts grabs a 2d canvas context when it is imported, and jsdom has no canvas.
 * Stub one that measures every character as 10px wide before the module loads.
 */
vi.hoisted(() => {
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    value: () => ({ font: "", measureText: (text: string) => ({ width: text.length * 10 }) }),
  });
});

const { firstInView, restartAnimations, safeDocument, truncateBySize, waitFor } = await import("@/utils/dom");

afterEach(() => {
  vi.useRealTimers();
});

describe("safeDocument", () => {
  it("returns the document when one exists", () => {
    expect(safeDocument()).toBe(document);
  });
});

describe("restartAnimations", () => {
  it("cancels and replays every animation on the element", () => {
    const animation = { cancel: vi.fn(), play: vi.fn() };
    const element = document.createElement("div");
    Object.assign(element, { getAnimations: () => [animation, animation] });

    restartAnimations(element);

    expect(animation.cancel).toHaveBeenCalledTimes(2);
    expect(animation.play).toHaveBeenCalledTimes(2);
  });
});

describe("waitFor", () => {
  it("resolves immediately when the element already exists", async () => {
    document.body.innerHTML = `<p id="ready"></p>`;
    expect(await waitFor("#ready")).toBe(document.getElementById("ready"));
  });

  it("resolves once the element appears", async () => {
    vi.useFakeTimers();
    const result = waitFor("#later");

    await vi.advanceTimersByTimeAsync(50);
    document.body.innerHTML = `<p id="later"></p>`;
    await vi.advanceTimersByTimeAsync(500);

    expect(await result).toBe(document.getElementById("later"));
  });

  it("gives up with undefined when the element never appears", async () => {
    vi.useFakeTimers();
    const result = waitFor("#never");

    await vi.runAllTimersAsync();

    expect(await result).toBeUndefined();
  });
});

describe("firstInView", () => {
  /** elements whose tops are at the given y positions */
  const elementsAt = (...tops: number[]) =>
    tops.map((top) => {
      const element = document.createElement("section");
      element.getBoundingClientRect = () => ({ top }) as DOMRect;
      return element;
    });

  it("returns the last element whose top is above the 100px threshold", () => {
    expect(firstInView(elementsAt(-500, -100, 50, 400))).toBe(2);
  });

  it("accounts for the header height", () => {
    document.body.innerHTML = "<header></header>";
    Object.defineProperty(document.querySelector("header"), "clientHeight", { value: 200 });

    expect(firstInView(elementsAt(-500, -100, 50, 250, 400))).toBe(3);
  });

  it("defaults to the first element", () => {
    expect(firstInView(elementsAt(500, 600))).toBe(0);
    expect(firstInView([])).toBe(0);
  });
});

describe("truncateBySize", () => {
  it("returns text that fits unchanged", () => {
    expect(truncateBySize("short", 100)).toBe("short");
  });

  it("trims characters until the text plus ellipsis fits", () => {
    // 10px per character: "hello..." is 80px
    expect(truncateBySize("hello world", 80)).toBe("hello...");
  });

  it("keeps at least three characters", () => {
    expect(truncateBySize("hello world", 10)).toBe("hel...");
  });
});
