import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useFetch from "@/hooks/useFetch";

describe("useFetch", () => {
  it("starts loading, then returns the parsed json", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify([{ id: 1 }]))),
    );

    const { result } = renderHook(() => useFetch<{ id: number }[]>("/api/users"));
    expect(result.current).toEqual({ data: null, loading: true, error: null });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current).toEqual({ data: [{ id: 1 }], loading: false, error: null });
    expect(fetch).toHaveBeenCalledWith("/api/users", { signal: expect.any(AbortSignal) });
  });

  it("returns an error for an HTTP error status, not the body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ message: "nope" }), { status: 404, statusText: "Not Found" })),
    );

    const { result } = renderHook(() => useFetch("/api/missing"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBeNull();
    expect(result.current.error?.message).toBe("404 Not Found");
  });

  it("returns the error when the request fails", async () => {
    const error = new TypeError("Failed to fetch");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw error;
      }),
    );

    const { result } = renderHook(() => useFetch("/api/users"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current).toEqual({ data: null, loading: false, error });
  });

  it("refetches when the url changes", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => new Response(JSON.stringify({ url }))),
    );

    const { result, rerender } = renderHook(({ url }) => useFetch<{ url: string }>(url), {
      initialProps: { url: "/api/a" },
    });
    await waitFor(() => expect(result.current.data).toEqual({ url: "/api/a" }));

    rerender({ url: "/api/b" });

    await waitFor(() => expect(result.current.data).toEqual({ url: "/api/b" }));
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("aborts the previous request when the url changes, and ignores its late response", async () => {
    const signals: AbortSignal[] = [];
    const responders: ((response: Response) => void)[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn((_url: string, { signal }: RequestInit) => {
        signals.push(signal as AbortSignal);
        return new Promise<Response>((resolve) => responders.push(resolve));
      }),
    );

    const { result, rerender } = renderHook(({ url }) => useFetch<{ url: string }>(url), {
      initialProps: { url: "/api/a" },
    });
    rerender({ url: "/api/b" });

    expect(signals[0].aborted).toBe(true);
    expect(signals[1].aborted).toBe(false);

    responders[1](new Response(JSON.stringify({ url: "/api/b" })));
    await waitFor(() => expect(result.current.data).toEqual({ url: "/api/b" }));
    responders[0](new Response(JSON.stringify({ url: "/api/a" }))); // stale response arrives last
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(result.current).toEqual({ data: { url: "/api/b" }, loading: false, error: null });
  });

  it("aborts the request on unmount", () => {
    let signal: AbortSignal | undefined;
    vi.stubGlobal(
      "fetch",
      vi.fn((_url: string, init: RequestInit) => {
        signal = init.signal as AbortSignal;
        return new Promise<Response>(() => {});
      }),
    );

    const { unmount } = renderHook(() => useFetch("/api/users"));
    unmount();

    expect(signal?.aborted).toBe(true);
  });

  it("clears a previous error when a new request succeeds", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) =>
        url === "/api/bad" ? new Response("", { status: 500 }) : new Response(JSON.stringify({ ok: true })),
      ),
    );

    const { result, rerender } = renderHook(({ url }) => useFetch(url), { initialProps: { url: "/api/bad" } });
    await waitFor(() => expect(result.current.error).not.toBeNull());

    rerender({ url: "/api/good" });

    await waitFor(() => expect(result.current.data).toEqual({ ok: true }));
    expect(result.current.error).toBeNull();
  });
});
