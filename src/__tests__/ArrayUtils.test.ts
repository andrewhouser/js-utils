import { describe, it, expect } from "vitest";
import { ArrayUtils } from "../ArrayUtils";

describe("ArrayUtils", () => {
  describe("average", () => {
    it("should calculate average of numbers", () => {
      expect(ArrayUtils.average([1, 2, 3, 4, 5])).toBe(3);
    });

    it("should return 0 for empty array", () => {
      expect(ArrayUtils.average([])).toBe(0);
    });

    it("should handle single number", () => {
      expect(ArrayUtils.average([5])).toBe(5);
    });

    it("should handle negative numbers", () => {
      expect(ArrayUtils.average([-1, -2, -3])).toBe(-2);
    });
  });

  describe("arrayEquals", () => {
    it("should return true for identical arrays", () => {
      expect(ArrayUtils.arrayEquals([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    it("should return true for arrays with same elements in different order", () => {
      expect(ArrayUtils.arrayEquals([1, 2, 3], [3, 2, 1])).toBe(true);
    });

    it("should return false for different arrays", () => {
      expect(ArrayUtils.arrayEquals([1, 2, 3], [1, 2, 4])).toBe(false);
    });

    it("should handle empty arrays", () => {
      expect(ArrayUtils.arrayEquals([], [])).toBe(true);
    });

    it("should handle different types", () => {
      expect(ArrayUtils.arrayEquals([1, "2", true], [1, "2", true])).toBe(true);
    });
  });

  describe("chunks", () => {
    it("should split array into chunks of specified size", () => {
      const result = ArrayUtils.chunks([1, 2, 3, 4, 5], 2);
      expect(result).toEqual([[1, 2], [3, 4], [5]]);
    });

    it("should throw error for non-positive chunk size", () => {
      expect(() => ArrayUtils.chunks([1, 2, 3], 0)).toThrow();
      expect(() => ArrayUtils.chunks([1, 2, 3], -1)).toThrow();
    });

    it("should handle empty array", () => {
      expect(ArrayUtils.chunks([], 2)).toEqual([]);
    });
  });

  describe("compareArrays", () => {
    it("should compare arrays with ordered option", () => {
      expect(
        ArrayUtils.compareArrays([1, 2, 3], [1, 2, 3], { ordered: true })
      ).toBe(true);
      expect(
        ArrayUtils.compareArrays([1, 2, 3], [3, 2, 1], { ordered: true })
      ).toBe(false);
    });

    it("should compare arrays with deep option", () => {
      const arr1 = [{ a: 1 }, { b: 2 }];
      const arr2 = [{ a: 1 }, { b: 2 }];
      expect(ArrayUtils.compareArrays(arr1, arr2, { deep: true })).toBe(true);
    });

    it("should handle empty arrays", () => {
      expect(ArrayUtils.compareArrays([], [])).toBe(true);
    });
  });

  describe("deduplicate", () => {
    it("should remove duplicate values", () => {
      expect(ArrayUtils.deduplicate([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });

    it("should handle empty array", () => {
      expect(ArrayUtils.deduplicate([])).toEqual([]);
    });

    it("should handle objects", () => {
      const arr = [{ id: 1 }, { id: 1 }, { id: 2 }];
      expect(ArrayUtils.deduplicate(arr)).toEqual([
        { id: 1 },
        { id: 1 },
        { id: 2 },
      ]);
    });
  });

  describe("deepEqual", () => {
    it("should compare primitive values", () => {
      expect(ArrayUtils.deepEqual(1, 1)).toBe(true);
      expect(ArrayUtils.deepEqual("test", "test")).toBe(true);
      expect(ArrayUtils.deepEqual(true, true)).toBe(true);
    });

    it("should compare arrays", () => {
      expect(ArrayUtils.deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(ArrayUtils.deepEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    });

    it("should compare objects", () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj2 = { a: 1, b: { c: 2 } };
      expect(ArrayUtils.deepEqual(obj1, obj2)).toBe(true);
    });
  });

  describe("difference", () => {
    it("should return elements from first array not in second array", () => {
      const a = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const b = [{ id: 2 }, { id: 3 }];
      expect(ArrayUtils.difference(a, b)).toEqual([{ id: 1 }]);
    });

    it("should use custom id function", () => {
      const a = [{ value: 1 }, { value: 2 }];
      const b = [{ value: 2 }];
      expect(ArrayUtils.difference(a, b, (item) => item.value)).toEqual([
        { value: 1 },
      ]);
    });
  });

  describe("findMax", () => {
    it("should find maximum value", () => {
      expect(ArrayUtils.findMax([1, 5, 3, 2])).toBe(5);
    });

    it("should handle negative numbers", () => {
      expect(ArrayUtils.findMax([-1, -5, -3])).toBe(-1);
    });

    it("should return undefined for empty array", () => {
      expect(ArrayUtils.findMax([])).toBeUndefined();
    });
  });

  describe("findMin", () => {
    it("should find minimum value", () => {
      expect(ArrayUtils.findMin([1, 5, 3, 2])).toBe(1);
    });

    it("should handle negative numbers", () => {
      expect(ArrayUtils.findMin([-1, -5, -3])).toBe(-5);
    });

    it("should return undefined for empty array", () => {
      expect(ArrayUtils.findMin([])).toBeUndefined();
    });
  });

  describe("findAndUpdate", () => {
    it("should update item in collection", () => {
      const collection = [
        { id: "1", value: 1 },
        { id: "2", value: 2 },
      ];
      const item = { id: "1", value: 3 };
      const result = ArrayUtils.findAndUpdate(collection, item);
      expect(result).toEqual([
        { id: "1", value: 3 },
        { id: "2", value: 2 },
      ]);
    });

    it("should throw error if item not found", () => {
      const collection = [{ id: "1", value: 1 }];
      const item = { id: "2", value: 2 };
      expect(() => ArrayUtils.findAndUpdate(collection, item)).toThrow();
    });
  });

  describe("flatten", () => {
    it("should flatten nested arrays", () => {
      expect(ArrayUtils.flatten([1, [2, 3], [4, [5, 6]]])).toEqual([
        1, 2, 3, 4, 5, 6,
      ]);
    });

    it("should respect depth parameter", () => {
      expect(ArrayUtils.flatten([1, [2, [3, [4]]]], 2)).toEqual([1, 2, 3, [4]]);
    });

    it("should handle empty arrays", () => {
      expect(ArrayUtils.flatten([])).toEqual([]);
    });
  });

  describe("groupBy", () => {
    it("should group by key", () => {
      const arr = [
        { type: "A", value: 1 },
        { type: "B", value: 2 },
        { type: "A", value: 3 },
      ];
      const result = ArrayUtils.groupBy(arr, "type");
      expect(result).toEqual({
        A: [
          { type: "A", value: 1 },
          { type: "A", value: 3 },
        ],
        B: [{ type: "B", value: 2 }],
      });
    });

    it("should group by function", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = ArrayUtils.groupBy(arr, (n) =>
        n % 2 === 0 ? "even" : "odd"
      );
      expect(result).toEqual({
        even: [2, 4],
        odd: [1, 3, 5],
      });
    });
  });

  describe("hasCommonElement", () => {
    it("should return true if arrays share elements", () => {
      expect(ArrayUtils.hasCommonElement([1, 2, 3], [3, 4, 5])).toBe(true);
    });

    it("should return false if arrays don't share elements", () => {
      expect(ArrayUtils.hasCommonElement([1, 2, 3], [4, 5, 6])).toBe(false);
    });

    it("should handle empty arrays", () => {
      expect(ArrayUtils.hasCommonElement([], [1, 2, 3])).toBe(false);
    });
  });

  describe("intersection", () => {
    it("should return common elements", () => {
      expect(ArrayUtils.intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
    });

    it("should handle empty arrays", () => {
      expect(ArrayUtils.intersection([], [1, 2, 3])).toEqual([]);
    });
  });

  describe("moveItem", () => {
    it("should move item to new position", () => {
      expect(ArrayUtils.moveItem([1, 2, 3, 4], 1, 3)).toEqual([1, 3, 4, 2]);
    });

    it("should throw error for invalid indices", () => {
      expect(() => ArrayUtils.moveItem([1, 2, 3], -1, 2)).toThrow();
      expect(() => ArrayUtils.moveItem([1, 2, 3], 1, 5)).toThrow();
    });
  });

  describe("random", () => {
    it("should return undefined for empty array", () => {
      expect(ArrayUtils.random([])).toBeUndefined();
    });

    it("should return an element from the array", () => {
      const arr = [1, 2, 3];
      const result = ArrayUtils.random(arr);
      expect(arr).toContain(result);
    });
  });

  describe("remove", () => {
    it("should remove elements matching predicate", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = ArrayUtils.remove(arr, (n) => n % 2 === 0);
      expect(result).toEqual([1, 3, 5]);
    });

    it("should handle empty array", () => {
      expect(ArrayUtils.remove([], () => true)).toEqual([]);
    });
  });

  describe("shuffle", () => {
    it("should return array with same elements", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = ArrayUtils.shuffle(arr);
      expect(result).toHaveLength(arr.length);
      expect(result.sort()).toEqual(arr.sort());
    });

    it("should handle empty array", () => {
      expect(ArrayUtils.shuffle([])).toEqual([]);
    });
  });

  describe("sortCompare", () => {
    it("should compare numbers", () => {
      expect(ArrayUtils.sortCompare(1, 2)).toBe(-1);
      expect(ArrayUtils.sortCompare(2, 1)).toBe(1);
      expect(ArrayUtils.sortCompare(1, 1)).toBe(0);
    });

    it("should compare strings", () => {
      expect(ArrayUtils.sortCompare("a", "b")).toBe(-1);
      expect(ArrayUtils.sortCompare("b", "a")).toBe(1);
      expect(ArrayUtils.sortCompare("a", "a")).toBe(0);
    });

    it("should compare booleans", () => {
      expect(ArrayUtils.sortCompare(false, true)).toBe(-1);
      expect(ArrayUtils.sortCompare(true, false)).toBe(1);
      expect(ArrayUtils.sortCompare(true, true)).toBe(0);
    });
  });

  describe("sumArray", () => {
    it("should sum numbers", () => {
      expect(ArrayUtils.sumArray([1, 2, 3, 4])).toBe(10);
    });

    it("should handle empty array", () => {
      expect(ArrayUtils.sumArray([])).toBe(0);
    });

    it("should handle non-numbers", () => {
      expect(ArrayUtils.sumArray([1, 2, 0, 0])).toBe(3);
    });
  });

  describe("takeFirst", () => {
    it("should return first n elements", () => {
      expect(ArrayUtils.takeFirst([1, 2, 3, 4], 2)).toEqual([1, 2]);
    });

    it("should handle empty array", () => {
      expect(ArrayUtils.takeFirst([])).toEqual([]);
    });

    it("should handle n larger than array length", () => {
      expect(ArrayUtils.takeFirst([1, 2], 5)).toEqual([1, 2]);
    });
  });

  describe("takeLast", () => {
    it("should return last n elements", () => {
      expect(ArrayUtils.takeLast([1, 2, 3, 4], 2)).toEqual([3, 4]);
    });

    it("should handle empty array", () => {
      expect(ArrayUtils.takeLast([])).toEqual([]);
    });

    it("should handle n larger than array length", () => {
      expect(ArrayUtils.takeLast([1, 2], 5)).toEqual([1, 2]);
    });
  });

  describe("union", () => {
    it("should combine arrays and remove duplicates", () => {
      expect(ArrayUtils.union([1, 2], [2, 3], [3, 4])).toEqual([1, 2, 3, 4]);
    });

    it("should handle empty arrays", () => {
      expect(ArrayUtils.union([], [])).toEqual([]);
    });
  });
});
