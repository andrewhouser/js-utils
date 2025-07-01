/**
 * @module NumberUtils
 * @description A comprehensive collection of utility functions for number manipulation, formatting, and mathematical operations.
 * @example
 * ```typescript
 * import { NumberUtils } from 'js-utils';
 *
 * // Format currency
 * const price = NumberUtils.formatCurrency(1234.56); // "$1,234.56"
 *
 * // Check if number is prime
 * const isPrime = NumberUtils.isPrime(17); // true
 *
 * // Round to decimal places
 * const rounded = NumberUtils.round(3.14159, 2); // 3.14
 * ```
 */

export const NumberUtils = {
  /**
   * Clamps a number between a minimum and maximum value (inclusive).
   * @param value - The number to clamp
   * @param min - The minimum allowed value
   * @param max - The maximum allowed value
   * @returns The clamped number within the specified range
   * @example
   * ```typescript
   * NumberUtils.clamp(10, 0, 5); // Returns 5
   * NumberUtils.clamp(-10, 0, 5); // Returns 0
   * NumberUtils.clamp(3, 0, 5); // Returns 3
   * ```
   */
  clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  },

  /**
   * Formats a number as currency using Intl.NumberFormat.
   * @param value - The number to format as currency
   * @param locale - The locale to use for formatting (default: 'en-US')
   * @param currency - The currency code (default: 'USD')
   * @returns The formatted currency string
   * @example
   * ```typescript
   * NumberUtils.formatCurrency(1234.56); // Returns "$1,234.56"
   * NumberUtils.formatCurrency(1000, 'de-DE', 'EUR'); // Returns "1.000,00 €"
   * NumberUtils.formatCurrency(500, 'ja-JP', 'JPY'); // Returns "¥500"
   * ```
   */
  formatCurrency(
    value: number,
    locale: string = "en-US",
    currency: string = "USD"
  ): string {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(value);
  },

  /**
   * Formats a number with locale-appropriate thousands separators.
   * @param value - The number to format
   * @param locale - The locale to use for formatting (default: 'en-US')
   * @returns The formatted number string with thousands separators
   * @example
   * ```typescript
   * NumberUtils.formatWithThousandsSeparator(1234567); // Returns "1,234,567"
   * NumberUtils.formatWithThousandsSeparator(1234567, 'de-DE'); // Returns "1.234.567"
   * NumberUtils.formatWithThousandsSeparator(1234567, 'fr-FR'); // Returns "1 234 567"
   * ```
   */
  formatWithThousandsSeparator(
    value: number,
    locale: string = "en-US"
  ): string {
    return new Intl.NumberFormat(locale).format(value);
  },

  /**
   * Checks if a number is between two values (inclusive).
   * @param value - The number to check
   * @param min - The minimum value (inclusive)
   * @param max - The maximum value (inclusive)
   * @returns True if the number is between min and max (inclusive), false otherwise
   * @example
   * ```typescript
   * NumberUtils.isBetween(5, 1, 10); // Returns true
   * NumberUtils.isBetween(0, 1, 10); // Returns false
   * NumberUtils.isBetween(10, 1, 10); // Returns true
   * ```
   */
  isBetween(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  },

  /**
   * Checks if a number is even.
   * @param value - The number to check
   * @returns True if the number is even, false otherwise
   * @example
   * ```typescript
   * NumberUtils.isEven(4); // Returns true
   * NumberUtils.isEven(5); // Returns false
   * NumberUtils.isEven(0); // Returns true
   * ```
   */
  isEven(value: number): boolean {
    return value % 2 === 0;
  },

  /**
   * Checks if a number is odd.
   * @param value - The number to check
   * @returns True if the number is odd, false otherwise
   * @example
   * ```typescript
   * NumberUtils.isOdd(5); // Returns true
   * NumberUtils.isOdd(4); // Returns false
   * NumberUtils.isOdd(1); // Returns true
   * ```
   */
  isOdd(value: number): boolean {
    return value % 2 !== 0;
  },

  /**
   * Checks if a number is prime using an optimized algorithm.
   * @param value - The number to check for primality
   * @returns True if the number is prime, false otherwise
   * @example
   * ```typescript
   * NumberUtils.isPrime(17); // Returns true
   * NumberUtils.isPrime(4); // Returns false
   * NumberUtils.isPrime(2); // Returns true
   * NumberUtils.isPrime(1); // Returns false
   * ```
   */
  isPrime(value: number): boolean {
    if (value <= 1) return false;
    if (value <= 3) return true;
    if (value % 2 === 0 || value % 3 === 0) return false;

    for (let i = 5; i * i <= value; i += 6) {
      if (value % i === 0 || value % (i + 2) === 0) return false;
    }
    return true;
  },

  /**
   * Generates a random integer between min and max (inclusive).
   * @param min - The minimum value (inclusive)
   * @param max - The maximum value (inclusive)
   * @returns A random integer between min and max
   * @example
   * ```typescript
   * NumberUtils.randomInt(1, 6); // Returns a random number between 1 and 6 (like a dice roll)
   * NumberUtils.randomInt(10, 20); // Returns a random number between 10 and 20
   * ```
   */
  randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Rounds a number to a specified number of decimal places.
   * @param value - The number to round
   * @param decimals - The number of decimal places (default: 0)
   * @returns The rounded number
   * @example
   * ```typescript
   * NumberUtils.round(3.14159, 2); // Returns 3.14
   * NumberUtils.round(2.7); // Returns 3
   * NumberUtils.round(1.005, 2); // Returns 1.01
   * ```
   */
  round(value: number, decimals: number = 0): number {
    const factor = Math.pow(10, decimals);
    // Add a small epsilon to handle floating-point precision issues
    const epsilon = 1e-10;
    return Math.round((value + epsilon) * factor) / factor;
  },

  /**
   * Formats a number with a fixed number of decimal places.
   * @param value - The number or string to format
   * @param decimals - The number of decimal places to display
   * @returns The formatted number as a string with fixed decimal places
   * @example
   * ```typescript
   * NumberUtils.formatWithDecimals(3.14159, 2); // Returns "3.14"
   * NumberUtils.formatWithDecimals(5, 3); // Returns "5.000"
   * NumberUtils.formatWithDecimals("invalid", 2); // Returns "0.00"
   * ```
   */
  formatWithDecimals(value: number | string, decimals: number): string {
    const num = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(num)) {
      return `0.${"0".repeat(decimals)}`;
    }

    return num.toFixed(decimals);
  },

  /**
   * Truncates a number to a specified number of decimal places (no rounding).
   * @param value - The number to truncate
   * @param decimals - The number of decimal places to keep (default: 0)
   * @returns The truncated number
   * @example
   * ```typescript
   * NumberUtils.truncate(3.14159, 2); // Returns 3.14
   * NumberUtils.truncate(2.99, 1); // Returns 2.9
   * NumberUtils.truncate(5.999); // Returns 5
   * ```
   */
  truncate(value: number, decimals: number = 0): number {
    const factor = Math.pow(10, decimals);
    return Math.trunc(value * factor) / factor;
  },
};
