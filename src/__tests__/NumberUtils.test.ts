import { describe, it, expect } from "vitest";
import { NumberUtils } from "../NumberUtils";

describe("NumberUtils", () => {
  describe("clamp", () => {
    it("should clamp a number between min and max values", () => {
      expect(NumberUtils.clamp(10, 0, 5)).toBe(5);
      expect(NumberUtils.clamp(-10, 0, 5)).toBe(0);
      expect(NumberUtils.clamp(3, 0, 5)).toBe(3);
    });

    it("should handle equal min and max values", () => {
      expect(NumberUtils.clamp(10, 5, 5)).toBe(5);
    });
  });

  describe("formatCurrency", () => {
    it("should format currency in USD by default", () => {
      expect(NumberUtils.formatCurrency(1234.56)).toBe("$1,234.56");
    });

    it("should format currency in different locales", () => {
      expect(NumberUtils.formatCurrency(1234.56, "de-DE", "EUR")).toMatch(
        /^1\.234,56\s€$/
      );
      expect(NumberUtils.formatCurrency(1234.56, "ja-JP", "JPY")).toMatch(
        /^[¥￥]1,235$/
      );
    });

    it("should handle zero and negative values", () => {
      expect(NumberUtils.formatCurrency(0)).toBe("$0.00");
      expect(NumberUtils.formatCurrency(-1234.56)).toBe("-$1,234.56");
    });
  });

  describe("formatWithThousandsSeparator", () => {
    it("should format numbers with thousands separators", () => {
      expect(NumberUtils.formatWithThousandsSeparator(1234567)).toBe(
        "1,234,567"
      );
    });

    it("should format numbers in different locales", () => {
      expect(NumberUtils.formatWithThousandsSeparator(1234567, "de-DE")).toBe(
        "1.234.567"
      );
      expect(
        NumberUtils.formatWithThousandsSeparator(1234567, "fr-FR")
      ).toMatch(/^1\s234\s567$/);
    });

    it("should handle decimal numbers", () => {
      expect(NumberUtils.formatWithThousandsSeparator(1234567.89)).toBe(
        "1,234,567.89"
      );
    });
  });

  describe("isBetween", () => {
    it("should check if a number is between two values", () => {
      expect(NumberUtils.isBetween(5, 1, 10)).toBe(true);
      expect(NumberUtils.isBetween(0, 1, 10)).toBe(false);
      expect(NumberUtils.isBetween(10, 1, 10)).toBe(true);
    });

    it("should handle equal min and max values", () => {
      expect(NumberUtils.isBetween(5, 5, 5)).toBe(true);
      expect(NumberUtils.isBetween(4, 5, 5)).toBe(false);
    });
  });

  describe("isEven", () => {
    it("should check if a number is even", () => {
      expect(NumberUtils.isEven(4)).toBe(true);
      expect(NumberUtils.isEven(5)).toBe(false);
      expect(NumberUtils.isEven(0)).toBe(true);
      expect(NumberUtils.isEven(-2)).toBe(true);
    });
  });

  describe("isOdd", () => {
    it("should check if a number is odd", () => {
      expect(NumberUtils.isOdd(5)).toBe(true);
      expect(NumberUtils.isOdd(4)).toBe(false);
      expect(NumberUtils.isOdd(1)).toBe(true);
      expect(NumberUtils.isOdd(-1)).toBe(true);
    });
  });

  describe("isPrime", () => {
    it("should check if a number is prime", () => {
      expect(NumberUtils.isPrime(2)).toBe(true);
      expect(NumberUtils.isPrime(3)).toBe(true);
      expect(NumberUtils.isPrime(4)).toBe(false);
      expect(NumberUtils.isPrime(17)).toBe(true);
      expect(NumberUtils.isPrime(1)).toBe(false);
      expect(NumberUtils.isPrime(0)).toBe(false);
      expect(NumberUtils.isPrime(-1)).toBe(false);
    });

    it("should handle large prime numbers", () => {
      expect(NumberUtils.isPrime(97)).toBe(true);
      expect(NumberUtils.isPrime(100)).toBe(false);
    });
  });

  describe("randomInt", () => {
    it("should generate random integers within range", () => {
      const min = 1;
      const max = 6;
      const result = NumberUtils.randomInt(min, max);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
      expect(Number.isInteger(result)).toBe(true);
    });

    it("should handle equal min and max values", () => {
      expect(NumberUtils.randomInt(5, 5)).toBe(5);
    });

    it("should handle negative ranges", () => {
      const result = NumberUtils.randomInt(-10, -5);
      expect(result).toBeGreaterThanOrEqual(-10);
      expect(result).toBeLessThanOrEqual(-5);
    });
  });

  describe("round", () => {
    it("should round numbers to specified decimal places", () => {
      expect(NumberUtils.round(3.14159, 2)).toBe(3.14);
      expect(NumberUtils.round(2.7)).toBe(3);
      expect(NumberUtils.round(1.005, 2)).toBeCloseTo(1.01, 5);
    });

    it("should handle zero decimal places by default", () => {
      expect(NumberUtils.round(3.7)).toBe(4);
      expect(NumberUtils.round(3.2)).toBe(3);
    });

    it("should handle negative numbers", () => {
      expect(NumberUtils.round(-3.14159, 2)).toBe(-3.14);
      expect(NumberUtils.round(-2.7)).toBe(-3);
    });
  });

  describe("formatWithDecimals", () => {
    it("should format numbers with fixed decimal places", () => {
      expect(NumberUtils.formatWithDecimals(3.14159, 2)).toBe("3.14");
      expect(NumberUtils.formatWithDecimals(5, 3)).toBe("5.000");
    });

    it("should handle string inputs", () => {
      expect(NumberUtils.formatWithDecimals("3.14159", 2)).toBe("3.14");
      expect(NumberUtils.formatWithDecimals("5", 3)).toBe("5.000");
    });

    it("should handle invalid inputs", () => {
      expect(NumberUtils.formatWithDecimals("invalid", 2)).toBe("0.00");
      expect(NumberUtils.formatWithDecimals(NaN, 2)).toBe("0.00");
    });

    it("should handle zero and negative numbers", () => {
      expect(NumberUtils.formatWithDecimals(0, 2)).toBe("0.00");
      expect(NumberUtils.formatWithDecimals(-3.14159, 2)).toBe("-3.14");
    });
  });

  describe("truncate", () => {
    it("should truncate numbers to specified decimal places", () => {
      expect(NumberUtils.truncate(3.14159, 2)).toBe(3.14);
      expect(NumberUtils.truncate(2.99, 1)).toBe(2.9);
      expect(NumberUtils.truncate(5.999)).toBe(5);
    });

    it("should handle zero decimal places by default", () => {
      expect(NumberUtils.truncate(3.7)).toBe(3);
      expect(NumberUtils.truncate(3.2)).toBe(3);
    });

    it("should handle negative numbers", () => {
      expect(NumberUtils.truncate(-3.14159, 2)).toBe(-3.14);
      expect(NumberUtils.truncate(-2.99, 1)).toBe(-2.9);
    });
  });
});
