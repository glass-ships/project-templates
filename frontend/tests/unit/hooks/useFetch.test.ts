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
    expect(fetch).toHaveBeenCalledWith("/api/users");
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
});
