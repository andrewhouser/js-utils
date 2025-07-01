import { describe, it, expect } from "vitest";
import { ObjectUtils } from "../ObjectUtils";

describe("ObjectUtils", () => {
  describe("cloneObject", () => {
    it("should deep clone an object", () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = ObjectUtils.cloneObject(original);
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
    });
    it("should clone arrays", () => {
      const arr = [1, { a: 2 }];
      const cloned = ObjectUtils.cloneObject(arr);
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[1]).not.toBe(arr[1]);
    });
    it("should return primitives as is", () => {
      expect(ObjectUtils.cloneObject(5)).toBe(5);
      expect(ObjectUtils.cloneObject(null)).toBe(null);
    });
  });

  describe("deepEqual", () => {
    it("should return true for deeply equal objects", () => {
      expect(ObjectUtils.deepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(
        true
      );
    });
    it("should return false for different objects", () => {
      expect(ObjectUtils.deepEqual({ a: 1 }, { a: 2 })).toBe(false);
    });
    it("should return true for equal arrays", () => {
      expect(ObjectUtils.deepEqual([1, 2], [1, 2])).toBe(true);
    });
    it("should return false for different types", () => {
      expect(ObjectUtils.deepEqual({ a: 1 }, [1])).toBe(false);
    });
  });

  describe("filterUniqueByProp", () => {
    it("should filter unique objects by property", () => {
      const arr = [
        { id: 1, name: "A" },
        { id: 2, name: "B" },
        { id: 1, name: "C" },
      ];
      expect(ObjectUtils.filterUniqueByProp(arr, "id")).toEqual([
        { id: 1, name: "A" },
        { id: 2, name: "B" },
      ]);
    });
    it("should return empty array for empty input", () => {
      expect(ObjectUtils.filterUniqueByProp([], "id")).toEqual([]);
    });
  });

  describe("filterByKeys", () => {
    it("should filter object by keys", () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(ObjectUtils.filterByKeys(obj, ["a", "c"])).toEqual({ a: 1, c: 3 });
    });
  });

  describe("findFirstNonZeroIndex", () => {
    it("should find the first non-zero index", () => {
      expect(ObjectUtils.findFirstNonZeroIndex({ a: 0, b: 0, c: 5 })).toBe(2);
    });
    it("should return -1 if all are zero", () => {
      expect(ObjectUtils.findFirstNonZeroIndex({ a: 0, b: 0 })).toBe(-1);
    });
  });

  describe("flatten", () => {
    it("should flatten a nested object", () => {
      const nested = { user: { profile: { name: "John", age: 30 } } };
      expect(ObjectUtils.flatten(nested)).toEqual({
        "user.profile.name": "John",
        "user.profile.age": 30,
      });
    });
  });

  describe("fromMap", () => {
    it("should convert Map to object", () => {
      const map = new Map([
        ["a", 1],
        ["b", 2],
      ]);
      expect(ObjectUtils.fromMap(map)).toEqual({ a: 1, b: 2 });
    });
    it("should return object as is", () => {
      expect(ObjectUtils.fromMap({ a: 1 })).toEqual({ a: 1 });
    });
  });

  describe("getNestedProp", () => {
    it("should get a nested property", () => {
      const obj = { a: { b: { c: 5 } } };
      expect(ObjectUtils.getNestedProp(obj, "a", "b", "c")).toBe(5);
    });
    it("should return null if not found", () => {
      expect(ObjectUtils.getNestedProp({}, "a", "b")).toBeNull();
    });
  });

  describe("groupByProp", () => {
    it("should group objects by property", () => {
      const arr = [
        { type: "x", v: 1 },
        { type: "y", v: 2 },
        { type: "x", v: 3 },
      ];
      expect(ObjectUtils.groupByProp(arr, "type")).toEqual({
        x: [
          { type: "x", v: 1 },
          { type: "x", v: 3 },
        ],
        y: [{ type: "y", v: 2 }],
      });
    });
  });

  describe("hasNestedProp", () => {
    it("should check for nested property", () => {
      const obj = { a: { b: { c: 5 } } };
      expect(ObjectUtils.hasNestedProp(obj, "a", "b", "c")).toBe(true);
      expect(ObjectUtils.hasNestedProp(obj, "a", "x")).toBe(false);
    });
  });

  describe("isEmpty", () => {
    it("should check if object is empty", () => {
      expect(ObjectUtils.isEmpty({})).toBe(true);
      expect(ObjectUtils.isEmpty([])).toBe(true);
      expect(ObjectUtils.isEmpty({ a: 1 })).toBe(false);
    });
  });

  describe("isFunction", () => {
    it("should check if value is a function", () => {
      expect(ObjectUtils.isFunction(() => {})).toBe(true);
      expect(ObjectUtils.isFunction(5)).toBe(false);
    });
  });

  describe("isEqual", () => {
    it("should check if objects are equal by JSON", () => {
      expect(ObjectUtils.isEqual({ a: 1 }, { a: 1 })).toBe(true);
      expect(ObjectUtils.isEqual({ a: 1 }, { a: 2 })).toBe(false);
    });
  });

  describe("isEqualOnKeys", () => {
    it("should check equality on specific keys", () => {
      const a = { x: 1, y: 2 };
      const b = { x: 1, y: 3 };
      expect(ObjectUtils.isEqualOnKeys(a, b, ["x"])).toBe(true);
      expect(ObjectUtils.isEqualOnKeys(a, b, ["y"])).toBe(false);
    });
  });

  describe("isObject", () => {
    it("should check if value is an object", () => {
      expect(ObjectUtils.isObject({})).toBe(true);
      expect(ObjectUtils.isObject(null)).toBe(false);
      expect(ObjectUtils.isObject(5)).toBe(false);
    });
  });

  describe("mapByProp", () => {
    it("should map objects by property", () => {
      const arr = [
        { id: 1, name: "A" },
        { id: 2, name: "B" },
        { id: 1, name: "C" },
      ];
      expect(ObjectUtils.mapByProp(arr, "id")).toEqual({
        1: { id: 1, name: "A" },
        2: { id: 2, name: "B" },
      });
    });
  });

  describe("matchesRules", () => {
    it("should check if object matches rules", () => {
      const obj = { a: 5, b: "x" };
      const rules = {
        a: (v: unknown) => typeof v === "number",
        b: (v: unknown) => v === "x",
      };
      expect(ObjectUtils.matchesRules(obj, rules)).toBe(true);
      const badRules = {
        a: (v: unknown) => typeof v === "string",
        b: (v: unknown) => v === "x",
      };
      expect(ObjectUtils.matchesRules(obj, badRules)).toBe(false);
    });
  });

  describe("merge", () => {
    it("should deep merge objects", () => {
      const a = { x: 1, y: { z: 2 } };
      const b = { y: { w: 3 } };
      expect(
        ObjectUtils.merge(a as Record<string, any>, b as Record<string, any>)
      ).toEqual({ x: 1, y: { z: 2, w: 3 } });
    });
  });

  describe("omit", () => {
    it("should omit specified keys", () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(ObjectUtils.omit(obj, ["b"])).toEqual({ a: 1, c: 3 });
    });
  });

  describe("pick", () => {
    it("should pick specified keys", () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(ObjectUtils.pick(obj, ["b", "c"])).toEqual({ b: 2, c: 3 });
    });
  });

  describe("removeNullishValues", () => {
    it("should remove null and undefined", () => {
      const obj = { a: 1, b: null, c: undefined, d: "" };
      expect(ObjectUtils.removeNullishValues(obj)).toEqual({ a: 1, d: "" });
    });
    it("should remove empty strings if specified", () => {
      const obj = { a: 1, b: "", c: null };
      expect(ObjectUtils.removeNullishValues(obj, true)).toEqual({ a: 1 });
    });
  });

  describe("replaceEmptyStringsWithNull", () => {
    it("should replace empty strings with null", () => {
      const obj = { a: "", b: 2 };
      expect(ObjectUtils.replaceEmptyStringsWithNull(obj)).toEqual({
        a: null,
        b: 2,
      });
    });
    it("should replace deeply if specified", () => {
      const obj = { a: "", b: { c: "" }, d: ["x", "", { e: "" }] };
      expect(ObjectUtils.replaceEmptyStringsWithNull(obj, true)).toEqual({
        a: null,
        b: { c: null },
        d: ["x", null, { e: null }],
      });
    });
  });

  describe("replaceKey", () => {
    it("should replace a key in an object", () => {
      const obj = { a: 1, b: 2 };
      expect(ObjectUtils.replaceKey(obj, "a", "z")).toEqual({ z: 1, b: 2 });
    });
  });

  describe("replaceNullWithEmptyString", () => {
    it("should replace null with empty string", () => {
      const obj = { a: null, b: 2 };
      expect(ObjectUtils.replaceNullWithEmptyString(obj)).toEqual({
        a: "",
        b: 2,
      });
    });
    it("should replace only specified fields", () => {
      const obj = { a: null, b: null };
      expect(ObjectUtils.replaceNullWithEmptyString(obj, ["b"])).toEqual({
        a: null,
        b: "",
      });
    });
  });

  describe("setNestedProp", () => {
    it("should set a nested property", () => {
      const obj = { a: { b: { c: 1 } } };
      const result = ObjectUtils.setNestedProp(obj, "a", "b", "c", 5);
      expect(result).toEqual({ a: { b: { c: 5 } } });
    });
    it("should create nested structure if missing", () => {
      const obj = {};
      const result = ObjectUtils.setNestedProp(obj, "a", "b", 2);
      expect(result).toEqual({ a: { b: 2 } });
    });
  });

  describe("sortByProp", () => {
    it("should sort objects by property", () => {
      const arr = [{ name: "b" }, { name: "a" }];
      expect(ObjectUtils.sortByProp({ objects: arr, prop: "name" })).toEqual([
        { name: "a" },
        { name: "b" },
      ]);
      expect(
        ObjectUtils.sortByProp({
          objects: arr,
          prop: "name",
          direction: "desc",
        })
      ).toEqual([{ name: "b" }, { name: "a" }]);
    });
  });

  describe("toMap", () => {
    it("should convert object to Map", () => {
      const obj = { a: 1, b: 2 };
      const map = ObjectUtils.toMap(obj);
      expect(map instanceof Map).toBe(true);
      expect(map.get("a")).toBe(1);
    });
  });

  describe("transform", () => {
    it("should transform keys and values", () => {
      const obj = { a: 1, b: 2 };
      const result = ObjectUtils.transform(
        obj,
        (k) => k.toUpperCase(),
        (v) => (v as number) * 2
      );
      expect(result).toEqual({ A: 2, B: 4 });
    });
  });
});
