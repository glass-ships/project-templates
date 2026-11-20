import { afterEach, describe, expect, it, vi } from "vitest";
import { sleep, syncLog } from "@/utils/debug";

afterEach(() => {
  vi.useRealTimers();
});

describe("sleep", () => {
  it("resolves after the given delay", async () => {
    vi.useFakeTimers();
    const done = vi.fn();
    sleep(100).then(done);

    await vi.advanceTimersByTimeAsync(99);
    expect(done).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(done).toHaveBeenCalledOnce();
  });
});

describe("syncLog", () => {
  it("logs a snapshot, so later mutations don't show up", () => {
    const debug = vi.spyOn(console, "debug").mockImplementation(() => {});
    const object = { count: 1 };

    syncLog("label", object);
    object.count = 2;

    expect(debug).toHaveBeenCalledWith("label", { count: 1 });
  });

  it("falls back to logging the raw values when they can't be serialized", () => {
    const debug = vi.spyOn(console, "debug").mockImplementation(() => {});
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    syncLog(circular);

    expect(debug).toHaveBeenLastCalledWith(circular);
  });
});
