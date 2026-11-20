import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import useToggle from "@/hooks/useToggle";

describe("useToggle", () => {
  it("starts false by default", () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  it("starts with the given initial state", () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });

  it("flips the state each time toggle is called", () => {
    const { result } = renderHook(() => useToggle());

    act(() => result.current[1]());
    expect(result.current[0]).toBe(true);

    act(() => result.current[1]());
    expect(result.current[0]).toBe(false);
  });
});
