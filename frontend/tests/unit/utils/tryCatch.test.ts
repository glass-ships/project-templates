import { describe, expect, it } from "vitest";
import { tryCatch } from "@/utils/tryCatch";

describe("tryCatch", () => {
  it("returns [data, null] when the promise resolves", async () => {
    expect(await tryCatch(Promise.resolve(42))).toEqual([42, null]);
  });

  it("returns [null, error] when the promise rejects", async () => {
    const error = new Error("boom");
    const [data, caught] = await tryCatch(Promise.reject(error));
    expect(data).toBeNull();
    expect(caught).toBe(error);
  });
});
