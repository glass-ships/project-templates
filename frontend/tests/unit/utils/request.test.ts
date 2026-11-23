import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { request, requestSimple } from "@/utils/request";

/** Node's Request rejects relative urls, which browsers resolve against the page; request() only reads .method */
class FakeRequest {
  url: string;
  method: string;
  constructor(url: string, init: RequestInit = {}) {
    this.url = url;
    this.method = (init.method ?? "GET").toUpperCase();
  }
}

const jsonResponse = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

let fetchMock: Mock<typeof fetch>;

/** request() caches GET responses by url for the whole module, so give every test its own path */
let pathCounter = 0;
const uniquePath = (name: string) => `/${name}-${++pathCounter}`;

beforeEach(() => {
  fetchMock = vi.fn<typeof fetch>(async () => jsonResponse({ ok: true }));
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("Request", FakeRequest);
  vi.spyOn(console, "debug").mockImplementation(() => {});
});

describe("request", () => {
  it("prefixes the path with /api and returns parsed json", async () => {
    const path = uniquePath("json");
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: 1 }));

    await expect(request(path)).resolves.toEqual({ id: 1 });
    expect(fetchMock).toHaveBeenCalledWith(`/api${path}`, {});
  });

  it("sorts params, repeats array values, and drops null/undefined", async () => {
    const path = uniquePath("params");

    await request(path, { b: 2, a: ["x", "y"], flag: true, empty: null, missing: undefined });

    expect(fetchMock.mock.calls[0][0]).toBe(`/api${path}?a=x&a=y&b=2&flag=true`);
  });

  it("passes fetch options through", async () => {
    const options = { headers: { Accept: "application/json" } };
    await request(uniquePath("options"), {}, options);
    expect(fetchMock.mock.calls[0][1]).toBe(options);
  });

  it("can parse the response as text", async () => {
    fetchMock.mockResolvedValueOnce(new Response("plain text"));
    await expect(request(uniquePath("text"), {}, {}, "text")).resolves.toBe("plain text");
  });

  it("caches GET responses by url", async () => {
    const path = uniquePath("cached");
    fetchMock.mockResolvedValueOnce(jsonResponse({ n: 1 }));

    await expect(request(path)).resolves.toEqual({ n: 1 });
    await expect(request(path)).resolves.toEqual({ n: 1 });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("does not cache non-GET responses", async () => {
    const path = uniquePath("post");
    await request(path, {}, { method: "POST" });
    await request(path, {}, { method: "POST" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it.each([
    [401, "Unauthorized"],
    [403, "Forbidden"],
    [500, "Internal Server Error"],
    [502, "Bad Gateway"],
    [503, "Service Unavailable"],
    [504, "Gateway Timeout"],
    [418, "Response not OK"],
  ])("throws for status %i with '%s'", async (status, message) => {
    fetchMock.mockResolvedValueOnce(jsonResponse({}, status));
    await expect(request(uniquePath(`status-${status}`))).rejects.toThrow(message);
  });

  it("does not cache failed responses", async () => {
    const path = uniquePath("retry");
    fetchMock.mockResolvedValueOnce(jsonResponse({}, 500)).mockResolvedValueOnce(jsonResponse({ recovered: true }));

    await expect(request(path)).rejects.toThrow("Internal Server Error");
    await expect(request(path)).resolves.toEqual({ recovered: true });
  });

  it("returns a not-found value instead of throwing on 404", async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, 404));
    await expect(request(uniquePath("missing-json"))).resolves.toEqual({ error: "Not found" });
    await expect(request(uniquePath("missing-text"), {}, {}, "text")).resolves.toBe("Not found");
  });

  it("throws when the body cannot be parsed", async () => {
    fetchMock.mockResolvedValueOnce(new Response("{not json"));
    await expect(request(uniquePath("bad-json"))).rejects.toThrow("Couldn't parse response as json");
  });

  it("opens the url in a new tab when asked", async () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const path = uniquePath("tab");

    await request(path, { q: 1 }, {}, "json", true);

    expect(open).toHaveBeenCalledWith(`/api${path}?q=1`);
  });
});

describe("requestSimple", () => {
  it("fetches the url as-is, following redirects, and parses json", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([1, 2]));

    await expect(requestSimple("https://a.com/data")).resolves.toEqual([1, 2]);
    expect(fetchMock).toHaveBeenCalledWith("https://a.com/data", { redirect: "follow" });
  });

  it("can parse the response as text", async () => {
    fetchMock.mockResolvedValueOnce(new Response("hello"));
    await expect(requestSimple("https://a.com/data", "text")).resolves.toBe("hello");
  });

  it("throws when the response is not ok", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({}, 500));
    await expect(requestSimple("https://a.com/data")).rejects.toThrow("Response not OK");
  });
});
