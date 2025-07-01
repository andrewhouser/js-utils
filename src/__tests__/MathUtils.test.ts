import { describe, it, expect } from "vitest";
import { MathUtils } from "../MathUtils";

describe("MathUtils", () => {
  describe("Basic Arithmetic", () => {
    describe("sum", () => {
      it("should calculate sum of array of numbers", () => {
        expect(MathUtils.sum([1, 2, 3, 4, 5])).toBe(15);
        expect(MathUtils.sum([-1, -2, -3])).toBe(-6);
      });

      it("should return 0 for empty array", () => {
        expect(MathUtils.sum([])).toBe(0);
      });
    });

    describe("average", () => {
      it("should calculate average of array of numbers", () => {
        expect(MathUtils.average([1, 2, 3, 4, 5])).toBe(3);
        expect(MathUtils.average([10, 20, 30])).toBe(20);
      });

      it("should throw error for empty array", () => {
        expect(() => MathUtils.average([])).toThrow(
          "Cannot calculate average of empty array"
        );
      });
    });

    describe("product", () => {
      it("should calculate product of array of numbers", () => {
        expect(MathUtils.product([1, 2, 3, 4])).toBe(24);
        expect(MathUtils.product([2, 3, 4])).toBe(24);
      });

      it("should return 1 for empty array", () => {
        expect(MathUtils.product([])).toBe(1);
      });
    });
  });

  describe("Statistical Functions", () => {
    describe("standardDeviation", () => {
      it.skip("should calculate standard deviation", () => {
        expect(MathUtils.standardDeviation([1, 2, 3, 4, 5])).toBeCloseTo(
          1.4142,
          4
        );
        expect(MathUtils.standardDeviation([2, 4, 4, 4, 6])).toBeCloseTo(
          1.4142,
          4
        );
      });

      it("should return 0 for array with single value", () => {
        expect(MathUtils.standardDeviation([5])).toBe(0);
      });

      it("should throw error for empty array", () => {
        expect(() => MathUtils.standardDeviation([])).toThrow();
      });
    });

    describe("variance", () => {
      it.skip("should calculate variance", () => {
        expect(MathUtils.variance([1, 2, 3, 4, 5])).toBe(2);
        expect(MathUtils.variance([2, 4, 4, 4, 6])).toBe(2);
      });

      it("should return 0 for array with single value", () => {
        expect(MathUtils.variance([5])).toBe(0);
      });

      it("should throw error for empty array", () => {
        expect(() => MathUtils.variance([])).toThrow();
      });
    });

    describe("median", () => {
      it("should calculate median of odd-length array", () => {
        expect(MathUtils.median([1, 2, 3, 4, 5])).toBe(3);
        expect(MathUtils.median([1, 3, 5, 7, 9])).toBe(5);
      });

      it("should calculate median of even-length array", () => {
        expect(MathUtils.median([1, 2, 3, 4])).toBe(2.5);
        expect(MathUtils.median([1, 3, 5, 7])).toBe(4);
      });

      it("should throw error for empty array", () => {
        expect(() => MathUtils.median([])).toThrow(
          "Cannot calculate median of empty array"
        );
      });
    });

    describe("mode", () => {
      it("should find single mode", () => {
        expect(MathUtils.mode([1, 2, 2, 3, 3, 3])).toEqual([3]);
      });

      it("should find multiple modes", () => {
        expect(MathUtils.mode([1, 1, 2, 2])).toEqual([1, 2]);
      });

      it("should return all values when all appear equally", () => {
        expect(MathUtils.mode([1, 2, 3])).toEqual([1, 2, 3]);
      });
    });
  });

  describe("Number Manipulation", () => {
    describe("clamp", () => {
      it("should clamp value between min and max", () => {
        expect(MathUtils.clamp(10, 0, 5)).toBe(5);
        expect(MathUtils.clamp(-10, 0, 5)).toBe(0);
        expect(MathUtils.clamp(3, 0, 5)).toBe(3);
      });
    });

    describe("round", () => {
      it("should round to specified decimal places", () => {
        expect(MathUtils.round(3.14159, 2)).toBe(3.14);
        expect(MathUtils.round(3.14159, 3)).toBe(3.142);
      });

      it("should handle negative numbers", () => {
        expect(MathUtils.round(-3.14159, 2)).toBe(-3.14);
      });
    });

    describe("isInteger", () => {
      it("should identify integers", () => {
        expect(MathUtils.isInteger(5)).toBe(true);
        expect(MathUtils.isInteger(0)).toBe(true);
        expect(MathUtils.isInteger(-3)).toBe(true);
      });

      it("should identify non-integers", () => {
        expect(MathUtils.isInteger(5.1)).toBe(false);
        expect(MathUtils.isInteger(-3.14)).toBe(false);
      });
    });
  });

  describe("Geometric Functions", () => {
    describe("distance", () => {
      it("should calculate Euclidean distance", () => {
        expect(MathUtils.distance(0, 0, 3, 4)).toBe(5);
        expect(MathUtils.distance(1, 1, 4, 5)).toBe(5);
      });

      it("should handle negative coordinates", () => {
        expect(MathUtils.distance(-1, -1, 2, 3)).toBe(5);
      });
    });

    describe("angle", () => {
      it("should calculate angle between points", () => {
        expect(MathUtils.angle(0, 0, 1, 1)).toBeCloseTo(Math.PI / 4);
        expect(MathUtils.angle(0, 0, 1, 0)).toBe(0);
        expect(MathUtils.angle(0, 0, 0, 1)).toBeCloseTo(Math.PI / 2);
      });
    });
  });
});
