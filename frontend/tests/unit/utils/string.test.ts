import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { breakUrl, collapse, copyToClipboard, dedent, formatNumber, stripHtml } from "@/utils/string";

describe("collapse", () => {
  it("collapses runs of whitespace and trims", () => {
    expect(collapse("  a \n\t  b  ")).toBe("a b");
  });

  it("defaults to an empty string", () => {
    expect(collapse()).toBe("");
  });
});

describe("dedent", () => {
  it("removes the indentation shared by all lines and keeps relative indentation", () => {
    expect(dedent("    a {\n      b;\n    }")).toBe("a {\n  b;\n}");
  });

  it("trims leading and trailing blank lines", () => {
    expect(dedent("\n\n    a\n    b\n  \n")).toBe("a\nb");
  });

  it("ignores blank lines when measuring indentation", () => {
    expect(dedent("    a\n\n    b")).toBe("a\n\nb");
  });

  it("leaves unindented text alone", () => {
    expect(dedent("a\n  b")).toBe("a\n  b");
  });

  it("defaults to an empty string", () => {
    expect(dedent()).toBe("");
  });
});

describe("breakUrl", () => {
  it("inserts <wbr/> after punctuation that precedes an alphanumeric character", () => {
    expect(breakUrl("a.b-c")).toBe("a.<wbr/>b-<wbr/>c");
    expect(breakUrl("example.com/path")).toBe("example.<wbr/>com/<wbr/>path");
  });

  it("leaves strings without breakpoints unchanged", () => {
    expect(breakUrl("plain")).toBe("plain");
    expect(breakUrl()).toBe("");
  });
});

describe("stripHtml", () => {
  it("returns only the text content", () => {
    expect(stripHtml("<p>Hello <b>world</b></p>")).toBe("Hello world");
  });

  it("handles empty input", () => {
    expect(stripHtml()).toBe("");
  });
});

describe("formatNumber", () => {
  // formatNumber uses the runtime's default locale; pin it so results don't depend on the machine.
  const originalToLocaleString = Number.prototype.toLocaleString;
  beforeEach(() => {
    vi.spyOn(Number.prototype, "toLocaleString").mockImplementation(function (
      this: number,
      _locales?: Intl.LocalesArgument,
      options?: Intl.NumberFormatOptions,
    ) {
      return originalToLocaleString.call(this, "en-US", options);
    });
  });

  it("adds grouping separators", () => {
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  it("uses compact notation with a space before the unit", () => {
    expect(formatNumber(1234567, true)).toBe("1.2 M");
    expect(formatNumber(999, true)).toBe("999");
  });
});

describe("copyToClipboard", () => {
  const setClipboard = (writeText: (value: string) => Promise<void>) =>
    Object.defineProperty(window.navigator, "clipboard", { value: { writeText }, configurable: true });

  afterEach(() => {
    Reflect.deleteProperty(window.navigator, "clipboard");
  });

  it("writes the value to the clipboard", async () => {
    const writeText = vi.fn(async () => {});
    setClipboard(writeText);

    await copyToClipboard("copied text");

    expect(writeText).toHaveBeenCalledWith("copied text");
  });

  it("logs instead of throwing when the clipboard rejects", async () => {
    const error = new Error("denied");
    setClipboard(async () => {
      throw error;
    });
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(copyToClipboard("text")).resolves.toBeUndefined();
    expect(consoleError).toHaveBeenCalledWith(error);
  });
});
