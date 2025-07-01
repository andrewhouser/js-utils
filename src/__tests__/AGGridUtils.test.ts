import { describe, it, expect } from "vitest";
import { AGGridUtils } from "../AGGridUtils";

describe("AGGridUtils", () => {
  describe("parsers", () => {
    describe("number", () => {
      it("should parse valid number strings", () => {
        expect(AGGridUtils.parsers.number({ newValue: "123.45" })).toBe(123.45);
        expect(AGGridUtils.parsers.number({ newValue: "-123.45" })).toBe(
          -123.45
        );
        expect(AGGridUtils.parsers.number({ newValue: "0" })).toBe(0);
      });

      it("should return null for invalid number strings", () => {
        expect(AGGridUtils.parsers.number({ newValue: "abc" })).toBeNull();
        expect(AGGridUtils.parsers.number({ newValue: "" })).toBeNull();
        expect(AGGridUtils.parsers.number({ newValue: " " })).toBeNull();
      });
    });

    describe("string", () => {
      it("should trim string values", () => {
        expect(AGGridUtils.parsers.string({ newValue: "  hello  " })).toBe(
          "hello"
        );
        expect(AGGridUtils.parsers.string({ newValue: "hello" })).toBe("hello");
        expect(AGGridUtils.parsers.string({ newValue: "" })).toBe("");
      });
    });
  });

  describe("setters", () => {
    describe("numberCeil", () => {
      it("should round numbers up to nearest integer", () => {
        const setter = AGGridUtils.setters.numberCeil("price");
        const data: Record<string, number> = {};
        setter({ data, newValue: 123.45 } as any);
        expect(data.price).toBe(124);
      });

      it("should handle negative numbers", () => {
        const setter = AGGridUtils.setters.numberCeil("price");
        const data: Record<string, number> = {};
        setter({ data, newValue: -123.45 } as any);
        expect(data.price).toBe(-123);
      });
    });

    describe("numberFloor", () => {
      it("should round numbers down to nearest integer", () => {
        const setter = AGGridUtils.setters.numberFloor("price");
        const data: Record<string, number> = {};
        setter({ data, newValue: 123.45 } as any);
        expect(data.price).toBe(123);
      });

      it("should handle negative numbers", () => {
        const setter = AGGridUtils.setters.numberFloor("price");
        const data: Record<string, number> = {};
        setter({ data, newValue: -123.45 } as any);
        expect(data.price).toBe(-124);
      });
    });

    describe("numberFloat", () => {
      it("should format integers to one decimal place", () => {
        const setter = AGGridUtils.setters.numberFloat("price");
        const data: Record<string, number | string> = {};
        setter({ data, newValue: 123 } as any);
        expect(data.price).toBe("123.0");
      });

      it("should not modify non-integer numbers", () => {
        const setter = AGGridUtils.setters.numberFloat("price");
        const data: Record<string, number | string> = {};
        setter({ data, newValue: 123.45 } as any);
        expect(data.price).toBe(123.45);
      });

      it("should handle negative numbers", () => {
        const setter = AGGridUtils.setters.numberFloat("price");
        const data: Record<string, number | string> = {};
        setter({ data, newValue: -123 } as any);
        expect(data.price).toBe("-123.0");
      });
    });
  });
});
