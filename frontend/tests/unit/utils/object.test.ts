import { beforeEach, describe, expect, it, vi } from "vitest";
import { ensure, mergeArrays, parse, renameKey, stringify } from "@/utils/object";

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "debug").mockImplementation(() => {});
});

describe("mergeArrays", () => {
  const arrayA = [{ id: "a", nested: { x: 1 } }, { id: "b" }];
  const arrayB = [{ id: "a", nested: { y: 2 } }, { id: "c" }];

  it("deep merges entries that share an id and keeps the rest", () => {
    expect(mergeArrays(arrayA, arrayB)).toEqual([{ id: "a", nested: { x: 1, y: 2 } }, { id: "b" }, { id: "c" }]);
  });

  it("only keeps ids from the first array when exclusive", () => {
    expect(mergeArrays(arrayA, arrayB, true)).toEqual([{ id: "a", nested: { x: 1, y: 2 } }, { id: "b" }]);
  });

  it("dedupes repeated ids within one array", () => {
    expect(mergeArrays([{ id: "a" }, { id: "a" }], [])).toEqual([{ id: "a" }]);
  });

  it("does not mutate its inputs", () => {
    mergeArrays(arrayA, arrayB);
    expect(arrayA[0]).toEqual({ id: "a", nested: { x: 1 } });
    expect(arrayB[0]).toEqual({ id: "a", nested: { y: 2 } });
  });
});

describe("renameKey", () => {
  it("moves a value to the new key in place", () => {
    const object: Record<string, unknown> = { old: "value", other: 1 };
    renameKey(object, "old", "new");
    expect(object).toEqual({ new: "value", other: 1 });
  });

  it("does nothing when the key is missing", () => {
    const object: Record<string, unknown> = { other: 1 };
    renameKey(object, "old", "new");
    expect(object).toEqual({ other: 1 });
  });
});

describe("stringify", () => {
  it("serializes with optional indentation", () => {
    expect(stringify({ a: 1 })).toBe('{"a":1}');
    expect(stringify({ a: 1 }, 2)).toBe('{\n  "a": 1\n}');
  });

  it("returns an empty string for missing values", () => {
    expect(stringify(undefined)).toBe("");
    expect(stringify(null)).toBe("");
  });

  it("returns an empty string and warns instead of throwing on circular values", () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(stringify(circular)).toBe("");
    expect(console.warn).toHaveBeenCalledOnce();
  });
});

describe("parse", () => {
  it("parses valid json", () => {
    expect(parse('{"a":[1,2]}', {})).toEqual({ a: [1, 2] });
  });

  it("returns the default for empty input", () => {
    expect(parse("", { fallback: true })).toEqual({ fallback: true });
  });

  it("returns the default and warns instead of throwing on invalid json", () => {
    expect(parse("{not json", [])).toEqual([]);
    expect(console.warn).toHaveBeenCalledOnce();
  });
});

describe("ensure", () => {
  it("returns present values, including falsy ones", () => {
    expect(ensure("value")).toBe("value");
    expect(ensure(0)).toBe(0);
    expect(ensure("")).toBe("");
    expect(ensure(false)).toBe(false);
  });

  it("throws a TypeError for null or undefined", () => {
    expect(() => ensure(null)).toThrow(TypeError);
    expect(() => ensure(undefined, "missing thing")).toThrow("missing thing");
  });
});
