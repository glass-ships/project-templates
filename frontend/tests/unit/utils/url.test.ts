import { describe, expect, it, vi } from "vitest";
import { getUrl, isAbsolute, isExternal } from "@/utils/url";

describe("isAbsolute", () => {
  it.each(["http://a.com", "https://a.com/path", "ftp://files.a.com", "mailto:someone@a.com"])(
    "is true for %s",
    (url) => {
      expect(isAbsolute(url)).toBe(true);
    },
  );

  it.each(["/path", "path/to/page", "#anchor", "", "//a.com"])("is false for '%s'", (url) => {
    expect(isAbsolute(url)).toBe(false);
  });
});

describe("isExternal", () => {
  it("is true for absolute urls on other domains", () => {
    expect(isExternal("https://example.com/page")).toBe(true);
  });

  it("is false for relative urls", () => {
    expect(isExternal("/internal/page")).toBe(false);
  });

  it("is false for the site's own domain", () => {
    expect(isExternal(`${window.location.origin}/page`)).toBe(false);
  });

  it("is true for subdomains of the site", () => {
    expect(isExternal(`https://docs.${window.location.hostname}/page`)).toBe(true);
  });
});

describe("getUrl", () => {
  const url = "https://user@a.com:8080/some/path?query=1#hash";

  it("returns the requested part of the url", () => {
    expect(getUrl(url, "hostname")).toBe("a.com");
    expect(getUrl(url, "port")).toBe("8080");
    expect(getUrl(url, "pathname")).toBe("/some/path");
    expect(getUrl(url, "search")).toBe("?query=1");
    expect(getUrl(url, "hash")).toBe("#hash");
  });

  it("returns an empty string and logs for invalid urls", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(getUrl("not a url", "hostname")).toBe("");
    expect(consoleError).toHaveBeenCalledOnce();
  });
});
