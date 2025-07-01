import { describe, it, expect } from "vitest";
import { ColorUtils } from "../ColorUtils";

describe("ColorUtils", () => {
  describe("adjustBrightness", () => {
    it("should increase brightness", () => {
      const color = { r: 100, g: 100, b: 100 };
      const result = ColorUtils.adjustBrightness(color, 50);
      expect(result).toEqual({ r: 150, g: 150, b: 150 });
    });

    it("should decrease brightness", () => {
      const color = { r: 100, g: 100, b: 100 };
      const result = ColorUtils.adjustBrightness(color, -50);
      expect(result).toEqual({ r: 50, g: 50, b: 50 });
    });

    it("should clamp values between 0 and 255", () => {
      const color = { r: 100, g: 100, b: 100 };
      const result = ColorUtils.adjustBrightness(color, 200);
      expect(result).toEqual({ r: 255, g: 255, b: 255 });
    });

    it("should throw error for invalid RGB values", () => {
      const color = { r: 300, g: 100, b: 100 };
      expect(() => ColorUtils.adjustBrightness(color, 50)).toThrow();
    });
  });

  describe("adjustSaturation", () => {
    it("should increase saturation", () => {
      const color = { r: 100, g: 100, b: 100 };
      const result = ColorUtils.adjustSaturation(color, 50);
      expect(result).toBeDefined();
      expect(result.r).toBeGreaterThanOrEqual(0);
      expect(result.r).toBeLessThanOrEqual(255);
    });

    it("should decrease saturation", () => {
      const color = { r: 100, g: 100, b: 100 };
      const result = ColorUtils.adjustSaturation(color, -50);
      expect(result).toBeDefined();
      expect(result.r).toBeGreaterThanOrEqual(0);
      expect(result.r).toBeLessThanOrEqual(255);
    });
  });

  describe("blendColors", () => {
    it("should blend two colors", () => {
      const color1 = { r: 0, g: 0, b: 0 };
      const color2 = { r: 255, g: 255, b: 255 };
      const result = ColorUtils.blendColors(color1, color2, 0.5);
      expect(result).toEqual({ r: 128, g: 128, b: 128 });
    });

    it("should throw error for invalid ratio", () => {
      const color1 = { r: 0, g: 0, b: 0 };
      const color2 = { r: 255, g: 255, b: 255 };
      expect(() => ColorUtils.blendColors(color1, color2, 1.5)).toThrow();
    });
  });

  describe("cmykToRgb", () => {
    it("should convert CMYK to RGB", () => {
      const cmyk = { c: 0, m: 0, y: 0, k: 0 };
      const result = ColorUtils.cmykToRgb(cmyk);
      expect(result).toEqual({ r: 255, g: 255, b: 255 });
    });

    it("should handle black", () => {
      const cmyk = { c: 0, m: 0, y: 0, k: 100 };
      const result = ColorUtils.cmykToRgb(cmyk);
      expect(result).toEqual({ r: 0, g: 0, b: 0 });
    });

    it("should throw error for invalid CMYK values", () => {
      const cmyk = { c: 150, m: 0, y: 0, k: 0 };
      expect(() => ColorUtils.cmykToRgb(cmyk)).toThrow();
    });
  });

  describe("contrastRatio", () => {
    it("should calculate contrast ratio between black and white", () => {
      const black = { r: 0, g: 0, b: 0 };
      const white = { r: 255, g: 255, b: 255 };
      const ratio = ColorUtils.contrastRatio(black, white);
      expect(ratio).toBeGreaterThan(20);
    });

    it("should calculate contrast ratio between similar colors", () => {
      const color1 = { r: 100, g: 100, b: 100 };
      const color2 = { r: 110, g: 110, b: 110 };
      const ratio = ColorUtils.contrastRatio(color1, color2);
      expect(ratio).toBeLessThan(2);
    });
  });

  describe("hexToRgb", () => {
    it("should convert hex to RGB", () => {
      expect(ColorUtils.hexToRgb("#FF0000")).toEqual({ r: 255, g: 0, b: 0 });
      expect(ColorUtils.hexToRgb("#00FF00")).toEqual({ r: 0, g: 255, b: 0 });
      expect(ColorUtils.hexToRgb("#0000FF")).toEqual({ r: 0, g: 0, b: 255 });
    });

    it("should handle hex without hash", () => {
      expect(ColorUtils.hexToRgb("FF0000")).toEqual({ r: 255, g: 0, b: 0 });
    });

    it("should throw error for invalid hex", () => {
      expect(() => ColorUtils.hexToRgb("invalid")).toThrow();
    });
  });

  describe("hslToRgb", () => {
    it("should convert HSL to RGB", () => {
      const hsl = { h: 0, s: 100, l: 50 };
      const result = ColorUtils.hslToRgb(hsl);
      expect(result).toEqual({ r: 255, g: 0, b: 0 });
    });

    it("should handle grayscale", () => {
      const hsl = { h: 0, s: 0, l: 50 };
      const result = ColorUtils.hslToRgb(hsl);
      expect(result.r).toBe(result.g);
      expect(result.g).toBe(result.b);
    });

    it("should throw error for invalid HSL values", () => {
      const hsl = { h: 400, s: 100, l: 50 };
      expect(() => ColorUtils.hslToRgb(hsl)).toThrow();
    });
  });

  describe("invertColor", () => {
    it("should invert RGB color", () => {
      const color = { r: 255, g: 0, b: 0 };
      const result = ColorUtils.invertColor(color);
      expect(result).toEqual({ r: 0, g: 255, b: 255 });
    });

    it("should handle middle values", () => {
      const color = { r: 128, g: 128, b: 128 };
      const result = ColorUtils.invertColor(color);
      expect(result).toEqual({ r: 127, g: 127, b: 127 });
    });
  });

  describe("isValidHexColor", () => {
    it("should validate hex colors", () => {
      expect(ColorUtils.isValidHexColor("#FF0000")).toBe(true);
      expect(ColorUtils.isValidHexColor("#F00")).toBe(true);
      expect(ColorUtils.isValidHexColor("invalid")).toBe(false);
    });
  });

  describe("randomColor", () => {
    it("should generate random hex color", () => {
      const color = ColorUtils.randomColor("hex");
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it("should generate random RGB color", () => {
      const color = ColorUtils.randomColor("rgb");
      expect(color).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/);
    });

    it("should generate random HSL color", () => {
      const color = ColorUtils.randomColor("hsl");
      expect(color).toMatch(/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/);
    });

    it("should generate random CMYK color", () => {
      const color = ColorUtils.randomColor("cmyk");
      expect(color).toMatch(/^cmyk\(\d+%,\s*\d+%,\s*\d+%,\s*\d+%\)$/);
    });
  });

  describe("rgbToCmyk", () => {
    it("should convert RGB to CMYK", () => {
      const rgb = { r: 255, g: 0, b: 0 };
      const result = ColorUtils.rgbToCmyk(rgb);
      expect(result).toEqual({ c: 0, m: 100, y: 100, k: 0 });
    });

    it("should handle black", () => {
      const rgb = { r: 0, g: 0, b: 0 };
      const result = ColorUtils.rgbToCmyk(rgb);
      expect(result).toEqual({ c: 0, m: 0, y: 0, k: 100 });
    });

    it("should throw error for invalid RGB values", () => {
      const rgb = { r: 300, g: 0, b: 0 };
      expect(() => ColorUtils.rgbToCmyk(rgb)).toThrow();
    });
  });

  describe("rgbToHex", () => {
    it("should convert RGB to hex", () => {
      expect(ColorUtils.rgbToHex({ r: 255, g: 0, b: 0 })).toBe("#ff0000");
      expect(ColorUtils.rgbToHex({ r: 0, g: 255, b: 0 })).toBe("#00ff00");
      expect(ColorUtils.rgbToHex({ r: 0, g: 0, b: 255 })).toBe("#0000ff");
    });

    it("should throw error for invalid RGB values", () => {
      expect(() => ColorUtils.rgbToHex({ r: 300, g: 0, b: 0 })).toThrow();
    });
  });

  describe("rgbToHsl", () => {
    it("should convert RGB to HSL", () => {
      const rgb = { r: 255, g: 0, b: 0 };
      const result = ColorUtils.rgbToHsl(rgb);
      expect(result).toEqual({ h: 0, s: 100, l: 50 });
    });

    it("should handle grayscale", () => {
      const rgb = { r: 128, g: 128, b: 128 };
      const result = ColorUtils.rgbToHsl(rgb);
      expect(result.s).toBe(0);
    });

    it("should throw error for invalid RGB values", () => {
      const rgb = { r: 300, g: 0, b: 0 };
      expect(() => ColorUtils.rgbToHsl(rgb)).toThrow();
    });
  });
});
