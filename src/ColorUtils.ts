/**
 * @module ColorUtils
 * @description A collection of utility functions for color manipulation and conversion.
 * Supports RGB, HEX, HSL, and CMYK color formats with conversion between them.
 *
 * @example
 * ```typescript
 * import { ColorUtils } from 'js-utils';
 *
 * // Convert hex to RGB
 * const rgb = ColorUtils.hexToRgb('#FF0000');
 *
 * // Adjust color brightness
 * const darker = ColorUtils.adjustBrightness(rgb, -20);
 *
 * // Generate random color
 * const randomHex = ColorUtils.randomColor('hex');
 * ```
 */

/**
 * Supported color format types
 */
type ColorType = "rgb" | "hex" | "hsl" | "cmyk";

/**
 * RGB color representation
 */
interface RGBColor {
  /** Red component (0-255) */
  r: number;
  /** Green component (0-255) */
  g: number;
  /** Blue component (0-255) */
  b: number;
}

/**
 * HSL color representation
 */
interface HSLColor {
  /** Hue component (0-360) */
  h: number;
  /** Saturation component (0-100) */
  s: number;
  /** Lightness component (0-100) */
  l: number;
}

/**
 * CMYK color representation
 */
interface CMYKColor {
  /** Cyan component (0-100) */
  c: number;
  /** Magenta component (0-100) */
  m: number;
  /** Yellow component (0-100) */
  y: number;
  /** Key (black) component (0-100) */
  k: number;
}

/**
 * Validates RGB color values
 * @param color - RGB color to validate
 * @throws Error if color values are invalid
 */
const validateRGB = (color: RGBColor): void => {
  const { r, g, b } = color;
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    throw new Error("RGB values must be between 0 and 255");
  }
};

/**
 * Validates HSL color values
 * @param color - HSL color to validate
 * @throws Error if color values are invalid
 */
const validateHSL = (color: HSLColor): void => {
  const { h, s, l } = color;
  if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) {
    throw new Error(
      "HSL values must be between 0-360 for hue and 0-100 for saturation and lightness"
    );
  }
};

/**
 * Validates CMYK color values
 * @param color - CMYK color to validate
 * @throws Error if color values are invalid
 */
const validateCMYK = (color: CMYKColor): void => {
  const { c, m, y, k } = color;
  if (
    c < 0 ||
    c > 100 ||
    m < 0 ||
    m > 100 ||
    y < 0 ||
    y > 100 ||
    k < 0 ||
    k > 100
  ) {
    throw new Error("CMYK values must be between 0 and 100");
  }
};

export const ColorUtils = {
  /**
   * Adjusts the brightness of a color
   * @param color - RGB color values
   * @param amount - Amount to adjust (-100 to 100)
   * @returns Adjusted RGB color values
   */
  adjustBrightness(color: RGBColor, amount: number): RGBColor {
    validateRGB(color);
    const adjust = (value: number) =>
      Math.max(0, Math.min(255, value + amount));
    return {
      r: adjust(color.r),
      g: adjust(color.g),
      b: adjust(color.b),
    };
  },

  /**
   * Adjusts the saturation of a color by a specified amount
   * @param color - RGB color values
   * @param amount - Amount to adjust (-100 to 100)
   * @returns Adjusted RGB color values
   */
  adjustSaturation(color: RGBColor, amount: number): RGBColor {
    validateRGB(color);
    const hsl = this.rgbToHsl(color);
    hsl.s = Math.max(0, Math.min(100, hsl.s + amount));
    return this.hslToRgb(hsl);
  },

  /**
   * Blends two colors together
   * @param color1 - First RGB color
   * @param color2 - Second RGB color
   * @param ratio - Blend ratio (0 to 1)
   * @returns Blended RGB color
   */
  blendColors(color1: RGBColor, color2: RGBColor, ratio: number): RGBColor {
    validateRGB(color1);
    validateRGB(color2);
    if (ratio < 0 || ratio > 1) {
      throw new Error("Blend ratio must be between 0 and 1");
    }
    const blend = (a: number, b: number) =>
      Math.round(a * (1 - ratio) + b * ratio);
    return {
      r: blend(color1.r, color2.r),
      g: blend(color1.g, color2.g),
      b: blend(color1.b, color2.b),
    };
  },

  /**
   * Converts a CMYK color to RGB
   * @param cmyk - CMYK color values
   * @returns RGB color values
   */
  cmykToRgb(cmyk: CMYKColor): RGBColor {
    validateCMYK(cmyk);
    const { c, m, y, k } = cmyk;
    const r = 255 * (1 - c / 100) * (1 - k / 100);
    const g = 255 * (1 - m / 100) * (1 - k / 100);
    const b = 255 * (1 - y / 100) * (1 - k / 100);
    return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
  },

  /**
   * Calculates the contrast ratio between two colors
   * @param color1 - First RGB color
   * @param color2 - Second RGB color
   * @returns Contrast ratio (1 to 21)
   */
  contrastRatio(color1: RGBColor, color2: RGBColor): number {
    validateRGB(color1);
    validateRGB(color2);
    const getLuminance = (color: RGBColor) => {
      const [r, g, b] = [color.r, color.g, color.b].map((c) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  },

  /**
   * Converts a hex color to RGB
   * @param hex - Hex color string (e.g., "#FF0000")
   * @returns RGB color values
   */
  hexToRgb(hex: string): RGBColor {
    if (!this.isValidHexColor(hex)) {
      throw new Error("Invalid hex color format");
    }
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) throw new Error("Invalid hex color");
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    };
  },

  /**
   * Converts an HSL color to RGB
   * @param hsl - HSL color values
   * @returns RGB color values
   */
  hslToRgb(hsl: HSLColor): RGBColor {
    validateHSL(hsl);
    const { h, s, l } = hsl;
    const s1 = s / 100;
    const l1 = l / 100;

    const c = (1 - Math.abs(2 * l1 - 1)) * s1;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l1 - c / 2;

    let r = 0,
      g = 0,
      b = 0;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (h >= 300 && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  },

  /**
   * Inverts a color
   * @param color - RGB color values
   * @returns Inverted RGB color values
   */
  invertColor(color: RGBColor): RGBColor {
    validateRGB(color);
    return {
      r: 255 - color.r,
      g: 255 - color.g,
      b: 255 - color.b,
    };
  },

  /**
   * Validates if a string is a valid hex color
   * @param hex - Hex color string to validate
   * @returns True if the string is a valid hex color
   */
  isValidHexColor(hex: string): boolean {
    return /^#?([a-f\d]{3}|[a-f\d]{6})$/i.test(hex);
  },

  /**
   * Generates a random color in the specified format
   * @param type - Color format (rgb, hex, hsl, or cmyk)
   * @returns Random color string in the specified format
   */
  randomColor(type: ColorType = "hex"): string {
    const getRandomValue = (max: number): number =>
      Math.floor(Math.random() * max);

    switch (type) {
      case "rgb":
        const r = getRandomValue(256);
        const g = getRandomValue(256);
        const b = getRandomValue(256);
        return `rgb(${r}, ${g}, ${b})`;

      case "hex":
        const r1 = getRandomValue(256);
        const g1 = getRandomValue(256);
        const b1 = getRandomValue(256);
        return `#${[r1, g1, b1]
          .map((x) => x.toString(16).padStart(2, "0"))
          .join("")}`;

      case "hsl":
        const h = getRandomValue(361);
        const s = getRandomValue(101);
        const l = getRandomValue(101);
        return `hsl(${h}, ${s}%, ${l}%)`;

      case "cmyk":
        const c = getRandomValue(101);
        const m = getRandomValue(101);
        const y = getRandomValue(101);
        const k = getRandomValue(101);
        return `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`;

      default:
        const r2 = getRandomValue(256);
        const g2 = getRandomValue(256);
        const b2 = getRandomValue(256);
        return `#${[r2, g2, b2]
          .map((x) => x.toString(16).padStart(2, "0"))
          .join("")}`;
    }
  },

  /**
   * Converts RGB color to CMYK
   * @param rgb - RGB color values
   * @returns CMYK color values
   */
  rgbToCmyk(rgb: RGBColor): CMYKColor {
    validateRGB(rgb);
    const { r, g, b } = rgb;
    const r1 = r / 255;
    const g1 = g / 255;
    const b1 = b / 255;

    const k = 1 - Math.max(r1, g1, b1);
    const c = (1 - r1 - k) / (1 - k) || 0;
    const m = (1 - g1 - k) / (1 - k) || 0;
    const y = (1 - b1 - k) / (1 - k) || 0;

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100),
    };
  },

  /**
   * Converts RGB color to hex
   * @param rgb - RGB color values
   * @returns Hex color string
   */
  rgbToHex(rgb: RGBColor): string {
    validateRGB(rgb);
    const { r, g, b } = rgb;
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
  },

  /**
   * Converts RGB color to HSL
   * @param rgb - RGB color values
   * @returns HSL color values
   */
  rgbToHsl(rgb: RGBColor): HSLColor {
    validateRGB(rgb);
    const { r, g, b } = rgb;
    const r1 = r / 255;
    const g1 = g / 255;
    const b1 = b / 255;

    const max = Math.max(r1, g1, b1);
    const min = Math.min(r1, g1, b1);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r1:
          h = (g1 - b1) / d + (g1 < b1 ? 6 : 0);
          break;
        case g1:
          h = (b1 - r1) / d + 2;
          break;
        case b1:
          h = (r1 - g1) / d + 4;
          break;
      }

      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  },
};
