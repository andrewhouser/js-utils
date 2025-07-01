/**
 * @module MathUtils
 * @description A comprehensive collection of mathematical utility functions for common calculations and operations. Provides methods for basic arithmetic, trigonometric functions, statistical calculations, number manipulation, geometric calculations, and random number generation.
 *
 * @example
 * ```typescript
 * import { MathUtils } from 'houser-js-utils';
 *
 * // Basic arithmetic
 * const sum = MathUtils.sum([1, 2, 3, 4, 5]); // 15
 * const avg = MathUtils.average([1, 2, 3, 4, 5]); // 3
 *
 * // Statistical calculations
 * const stdDev = MathUtils.standardDeviation([1, 2, 3, 4, 5]); // 1.4142...
 * const variance = MathUtils.variance([1, 2, 3, 4, 5]); // 2
 *
 * // Number manipulation
 * const clamped = MathUtils.clamp(10, 0, 5); // 5
 * const rounded = MathUtils.round(3.14159, 2); // 3.14
 * ```
 */
export const MathUtils = {
  /**
   * Calculates the absolute value of a number
   * @param value - Number to calculate absolute value for
   * @returns Absolute value
   * @example
   * ```typescript
   * MathUtils.abs(-5); // 5
   * MathUtils.abs(5); // 5
   * ```
   */
  abs(value: number): number {
    return Math.abs(value);
  },

  /**
   * Calculates the angle between two points in radians
   * @param x1 - First point x coordinate
   * @param y1 - First point y coordinate
   * @param x2 - Second point x coordinate
   * @param y2 - Second point y coordinate
   * @returns Angle in radians
   * @example
   * ```typescript
   * // Calculate angle between points (0,0) and (1,1)
   * const angle = MathUtils.angle(0, 0, 1, 1); // π/4 radians
   * ```
   */
  angle(x1: number, y1: number, x2: number, y2: number): number {
    return Math.atan2(y2 - y1, x2 - x1);
  },

  /**
   * Calculates the average (arithmetic mean) of an array of numbers
   * @param numbers - Array of numbers
   * @returns Average value
   * @throws {Error} If array is empty
   * @example
   * ```typescript
   * MathUtils.average([1, 2, 3, 4, 5]); // 3
   * MathUtils.average([10, 20, 30]); // 20
   * ```
   */
  average(numbers: number[]): number {
    if (numbers.length === 0) {
      throw new Error("Cannot calculate average of empty array");
    }
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  },

  /**
   * Calculates the inverse cosine (arccos) of a number
   * @param value - Number to calculate inverse cosine for (-1 to 1)
   * @returns Inverse cosine in radians
   * @example
   * ```typescript
   * MathUtils.acos(0); // π/2 radians
   * MathUtils.acos(1); // 0 radians
   * ```
   */
  acos(value: number): number {
    return Math.acos(value);
  },

  /**
   * Calculates the inverse hyperbolic cosine of a number
   * @param value - Number to calculate inverse hyperbolic cosine for (≥ 1)
   * @returns Inverse hyperbolic cosine
   * @example
   * ```typescript
   * MathUtils.acosh(1); // 0
   * MathUtils.acosh(2); // 1.3169...
   * ```
   */
  acosh(value: number): number {
    return Math.acosh(value);
  },

  /**
   * Calculates the inverse sine (arcsin) of a number
   * @param value - Number to calculate inverse sine for (-1 to 1)
   * @returns Inverse sine in radians
   * @example
   * ```typescript
   * MathUtils.asin(0); // 0 radians
   * MathUtils.asin(1); // π/2 radians
   * ```
   */
  asin(value: number): number {
    return Math.asin(value);
  },

  /**
   * Calculates the inverse hyperbolic sine of a number
   * @param value - Number to calculate inverse hyperbolic sine for
   * @returns Inverse hyperbolic sine
   * @example
   * ```typescript
   * MathUtils.asinh(0); // 0
   * MathUtils.asinh(1); // 0.8813...
   * ```
   */
  asinh(value: number): number {
    return Math.asinh(value);
  },

  /**
   * Calculates the inverse tangent (arctan) of a number
   * @param value - Number to calculate inverse tangent for
   * @returns Inverse tangent in radians
   * @example
   * ```typescript
   * MathUtils.atan(0); // 0 radians
   * MathUtils.atan(1); // π/4 radians
   * ```
   */
  atan(value: number): number {
    return Math.atan(value);
  },

  /**
   * Calculates the inverse tangent of y/x
   * @param y - Y coordinate
   * @param x - X coordinate
   * @returns Inverse tangent in radians
   * @example
   * ```typescript
   * MathUtils.atan2(1, 1); // π/4 radians
   * MathUtils.atan2(1, 0); // π/2 radians
   * ```
   */
  atan2(y: number, x: number): number {
    return Math.atan2(y, x);
  },

  /**
   * Calculates the inverse hyperbolic tangent of a number
   * @param value - Number to calculate inverse hyperbolic tangent for (-1 to 1)
   * @returns Inverse hyperbolic tangent
   * @example
   * ```typescript
   * MathUtils.atanh(0); // 0
   * MathUtils.atanh(0.5); // 0.5493...
   * ```
   */
  atanh(value: number): number {
    return Math.atanh(value);
  },

  /**
   * Rounds a number up to the nearest integer
   * @param value - Number to round up
   * @returns Rounded number
   * @example
   * ```typescript
   * MathUtils.ceil(3.14); // 4
   * MathUtils.ceil(-3.14); // -3
   * ```
   */
  ceil(value: number): number {
    return Math.ceil(value);
  },

  /**
   * Clamps a number between a minimum and maximum value
   * @param value - Number to clamp
   * @param min - Minimum value
   * @param max - Maximum value
   * @returns Clamped number
   * @example
   * ```typescript
   * MathUtils.clamp(10, 0, 5); // 5
   * MathUtils.clamp(-10, 0, 5); // 0
   * MathUtils.clamp(3, 0, 5); // 3
   * ```
   */
  clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  },

  /**
   * Calculates the cosine of an angle
   * @param angle - Angle in radians
   * @returns Cosine value
   * @example
   * ```typescript
   * MathUtils.cos(0); // 1
   * MathUtils.cos(Math.PI); // -1
   * ```
   */
  cos(angle: number): number {
    return Math.cos(angle);
  },

  /**
   * Calculates the hyperbolic cosine of a number
   * @param value - Number to calculate hyperbolic cosine for
   * @returns Hyperbolic cosine
   * @example
   * ```typescript
   * MathUtils.cosh(0); // 1
   * MathUtils.cosh(1); // 1.5430...
   * ```
   */
  cosh(value: number): number {
    return Math.cosh(value);
  },

  /**
   * Calculates the cube root of a number
   * @param value - Number to calculate cube root for
   * @returns Cube root
   * @example
   * ```typescript
   * MathUtils.cbrt(8); // 2
   * MathUtils.cbrt(-8); // -2
   * ```
   */
  cbrt(value: number): number {
    return Math.cbrt(value);
  },

  /**
   * Calculates the Euclidean distance between two points
   * @param x1 - First point x coordinate
   * @param y1 - First point y coordinate
   * @param x2 - Second point x coordinate
   * @param y2 - Second point y coordinate
   * @returns Distance between points
   * @example
   * ```typescript
   * MathUtils.distance(0, 0, 3, 4); // 5
   * MathUtils.distance(1, 1, 4, 5); // 5
   * ```
   */
  distance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  },

  /**
   * Checks if a number is even
   * @param value - Number to check
   * @returns True if even, false otherwise
   * @example
   * ```typescript
   * MathUtils.isEven(2); // true
   * MathUtils.isEven(3); // false
   * ```
   */
  isEven(value: number): boolean {
    return value % 2 === 0;
  },

  /**
   * Calculates the nth Fibonacci number
   * @param n - Position in Fibonacci sequence (0-based)
   * @returns Fibonacci number
   * @example
   * ```typescript
   * MathUtils.fibonacci(0); // 0
   * MathUtils.fibonacci(1); // 1
   * MathUtils.fibonacci(10); // 55
   * ```
   */
  fibonacci(n: number): number {
    if (n < 0) return NaN;
    if (n <= 1) return n;

    let a = 0,
      b = 1;
    for (let i = 2; i <= n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  },

  /**
   * Calculates the factorial of a number
   * @param n - Number to calculate factorial for
   * @returns Factorial result
   * @example
   * ```typescript
   * MathUtils.factorial(0); // 1
   * MathUtils.factorial(5); // 120
   * ```
   */
  factorial(n: number): number {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    return n * this.factorial(n - 1);
  },

  /**
   * Rounds a number down to the nearest integer
   * @param value - Number to round down
   * @returns Rounded number
   * @example
   * ```typescript
   * MathUtils.floor(3.14); // 3
   * MathUtils.floor(-3.14); // -4
   * ```
   */
  floor(value: number): number {
    return Math.floor(value);
  },

  /**
   * Calculates the greatest common divisor of two numbers
   * @param a - First number
   * @param b - Second number
   * @returns Greatest common divisor
   * @example
   * ```typescript
   * MathUtils.gcd(12, 18); // 6
   * MathUtils.gcd(7, 13); // 1
   * ```
   */
  gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  },

  /**
   * Calculates the interquartile range of an array of numbers
   * @param numbers - Array of numbers
   * @returns Interquartile range
   * @example
   * ```typescript
   * MathUtils.iqr([1, 2, 3, 4, 5, 6, 7, 8]); // 4
   * ```
   */
  iqr(numbers: number[]): number {
    const { q1, q3 } = this.quartiles(numbers);
    return q3 - q1;
  },

  /**
   * Checks if a number is an integer
   * @param value - Number to check
   * @returns True if integer, false otherwise
   * @example
   * ```typescript
   * MathUtils.isInteger(5); // true
   * MathUtils.isInteger(5.1); // false
   * ```
   */
  isInteger(value: number): boolean {
    return Number.isInteger(value);
  },

  /**
   * Checks if a number is within a range
   * @param value - Number to check
   * @param min - Minimum value
   * @param max - Maximum value
   * @param inclusive - Whether to include min and max values
   * @returns True if in range, false otherwise
   * @example
   * ```typescript
   * MathUtils.isInRange(5, 0, 10); // true
   * MathUtils.isInRange(5, 0, 5, true); // true
   * MathUtils.isInRange(5, 0, 5, false); // false
   * ```
   */
  isInRange(
    value: number,
    min: number,
    max: number,
    inclusive = true
  ): boolean {
    return inclusive
      ? value >= min && value <= max
      : value > min && value < max;
  },

  /**
   * Checks if a number is odd
   * @param value - Number to check
   * @returns True if odd, false otherwise
   * @example
   * ```typescript
   * MathUtils.isOdd(3); // true
   * MathUtils.isOdd(4); // false
   * ```
   */
  isOdd(value: number): boolean {
    return value % 2 !== 0;
  },

  /**
   * Checks if a number is prime
   * @param n - Number to check
   * @returns True if prime, false otherwise
   * @example
   * ```typescript
   * MathUtils.isPrime(2); // true
   * MathUtils.isPrime(4); // false
   * MathUtils.isPrime(17); // true
   * ```
   */
  isPrime(n: number): boolean {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;

    for (let i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
  },

  /**
   * Calculates the least common multiple of two numbers
   * @param a - First number
   * @param b - Second number
   * @returns Least common multiple
   * @example
   * ```typescript
   * MathUtils.lcm(12, 18); // 36
   * MathUtils.lcm(5, 7); // 35
   * ```
   */
  lcm(a: number, b: number): number {
    return Math.abs(a * b) / this.gcd(a, b);
  },

  /**
   * Linear interpolation between two numbers
   * @param start - Start value
   * @param end - End value
   * @param t - Interpolation factor (0-1)
   * @returns Interpolated value
   * @example
   * ```typescript
   * MathUtils.lerp(0, 100, 0.5); // 50
   * MathUtils.lerp(0, 100, 0.25); // 25
   * ```
   */
  lerp(start: number, end: number, t: number): number {
    return start + (end - start) * this.clamp(t, 0, 1);
  },

  /**
   * Calculates the natural logarithm of a number
   * @param value - Number to calculate logarithm for
   * @returns Natural logarithm
   * @example
   * ```typescript
   * MathUtils.log(Math.E); // 1
   * MathUtils.log(10); // 2.3025...
   * ```
   */
  log(value: number): number {
    return Math.log(value);
  },

  /**
   * Calculates the base-10 logarithm of a number
   * @param value - Number to calculate logarithm for
   * @returns Base-10 logarithm
   * @example
   * ```typescript
   * MathUtils.log10(100); // 2
   * MathUtils.log10(1000); // 3
   * ```
   */
  log10(value: number): number {
    return Math.log10(value);
  },

  /**
   * Calculates the base-2 logarithm of a number
   * @param value - Number to calculate logarithm for
   * @returns Base-2 logarithm
   * @example
   * ```typescript
   * MathUtils.log2(8); // 3
   * MathUtils.log2(16); // 4
   * ```
   */
  log2(value: number): number {
    return Math.log2(value);
  },

  /**
   * Maps a number from one range to another
   * @param value - Number to map
   * @param inMin - Input range minimum
   * @param inMax - Input range maximum
   * @param outMin - Output range minimum
   * @param outMax - Output range maximum
   * @returns Mapped number
   * @example
   * ```typescript
   * // Map a value from 0-100 range to 0-255 range
   * MathUtils.map(50, 0, 100, 0, 255); // 127.5
   *
   * // Map a percentage to a color value
   * MathUtils.map(0.75, 0, 1, 0, 255); // 191.25
   * ```
   */
  map(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
  ): number {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  },

  /**
   * Finds the maximum value in an array of numbers
   * @param numbers - Array of numbers
   * @returns Maximum value
   * @throws {Error} If array is empty
   * @example
   * ```typescript
   * MathUtils.max([1, 2, 3, 4, 5]); // 5
   * MathUtils.max([-1, -2, -3]); // -1
   * MathUtils.max([0, 0, 0]); // 0
   * ```
   */
  max(numbers: number[]): number {
    if (numbers.length === 0) {
      throw new Error("Cannot find maximum of empty array");
    }
    return Math.max(...numbers);
  },

  /**
   * Calculates the median of an array of numbers
   * @param numbers - Array of numbers
   * @returns Median value
   * @throws {Error} If array is empty
   * @example
   * ```typescript
   * // Odd number of elements
   * MathUtils.median([1, 2, 3, 4, 5]); // 3
   *
   * // Even number of elements (average of middle two)
   * MathUtils.median([1, 2, 3, 4]); // 2.5
   * ```
   */
  median(numbers: number[]): number {
    if (numbers.length === 0) {
      throw new Error("Cannot calculate median of empty array");
    }
    const sorted = [...numbers].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
  },

  /**
   * Finds the minimum value in an array of numbers
   * @param numbers - Array of numbers
   * @returns Minimum value
   * @throws {Error} If array is empty
   * @example
   * ```typescript
   * MathUtils.min([1, 2, 3, 4, 5]); // 1
   * MathUtils.min([-1, -2, -3]); // -3
   * MathUtils.min([0, 0, 0]); // 0
   * ```
   */
  min(numbers: number[]): number {
    if (numbers.length === 0) {
      throw new Error("Cannot find minimum of empty array");
    }
    return Math.min(...numbers);
  },

  /**
   * Calculates the mode(s) of an array of numbers
   * @param numbers - Array of numbers
   * @returns Array of mode values (most frequently occurring numbers)
   * @example
   * ```typescript
   * // Single mode
   * MathUtils.mode([1, 2, 2, 3, 3, 3]); // [3]
   *
   * // Multiple modes
   * MathUtils.mode([1, 1, 2, 2]); // [1, 2]
   *
   * // All numbers appear once
   * MathUtils.mode([1, 2, 3]); // [1, 2, 3]
   * ```
   */
  mode(numbers: number[]): number[] {
    const counts = new Map<number, number>();
    let maxCount = 0;

    numbers.forEach((num) => {
      const count = (counts.get(num) || 0) + 1;
      counts.set(num, count);
      maxCount = Math.max(maxCount, count);
    });

    return Array.from(counts.entries())
      .filter(([_, count]) => count === maxCount)
      .map(([num]) => num);
  },

  /**
   * Calculates the percentile of a value in an array of numbers
   * @param numbers - Array of numbers
   * @param value - Value to find percentile for
   * @returns Percentile (0-100)
   * @example
   * ```typescript
   * const scores = [1, 2, 3, 4, 5];
   * MathUtils.percentile(scores, 3); // 40
   * MathUtils.percentile(scores, 5); // 100
   * MathUtils.percentile(scores, 1); // 0
   * ```
   */
  percentile(numbers: number[], value: number): number {
    const sorted = [...numbers].sort((a, b) => a - b);
    const index = sorted.findIndex((num) => num >= value);
    return (index / sorted.length) * 100;
  },

  /**
   * Calculates the product of an array of numbers
   * @param numbers - Array of numbers
   * @returns Product
   * @example
   * ```typescript
   * MathUtils.product([1, 2, 3, 4]); // 24
   * MathUtils.product([2, 3, 4]); // 24
   * MathUtils.product([-1, -2, -3]); // -6
   * ```
   */
  product(numbers: number[]): number {
    return numbers.reduce((a, b) => a * b, 1);
  },

  /**
   * Calculates a number raised to a power
   * @param base - Base number
   * @param exponent - Exponent
   * @returns Result
   * @example
   * ```typescript
   * MathUtils.pow(2, 3); // 8
   * MathUtils.pow(5, 2); // 25
   * MathUtils.pow(2, -1); // 0.5
   * ```
   */
  pow(base: number, exponent: number): number {
    return Math.pow(base, exponent);
  },

  /**
   * Calculates the quartiles of an array of numbers
   * @param numbers - Array of numbers
   * @returns Object containing quartiles (q1, q2, q3)
   * @example
   * ```typescript
   * const { q1, q2, q3 } = MathUtils.quartiles([1, 2, 3, 4, 5, 6, 7, 8]);
   * // q1 = 2.5 (25th percentile)
   * // q2 = 4.5 (50th percentile/median)
   * // q3 = 6.5 (75th percentile)
   * ```
   */
  quartiles(numbers: number[]): { q1: number; q2: number; q3: number } {
    const sorted = [...numbers].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    const q2 = this.median(sorted);
    const q1 = this.median(sorted.slice(0, middle));
    const q3 = this.median(
      sorted.slice(middle + (sorted.length % 2 === 0 ? 0 : 1))
    );

    return { q1, q2, q3 };
  },

  /**
   * Generates a random number between min and max (inclusive)
   * @param min - Minimum value
   * @param max - Maximum value
   * @returns Random number
   * @example
   * ```typescript
   * // Random number between 0 and 1
   * MathUtils.random(0, 1); // e.g., 0.2345
   *
   * // Random number between -10 and 10
   * MathUtils.random(-10, 10); // e.g., 3.4567
   * ```
   */
  random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  },

  /**
   * Generates a random integer between min and max (inclusive)
   * @param min - Minimum value
   * @param max - Maximum value
   * @returns Random integer
   * @example
   * ```typescript
   * // Random integer between 1 and 6 (dice roll)
   * MathUtils.randomInt(1, 6); // e.g., 4
   *
   * // Random integer between 0 and 100
   * MathUtils.randomInt(0, 100); // e.g., 42
   * ```
   */
  randomInt(min: number, max: number): number {
    return Math.floor(this.random(min, max + 1));
  },

  /**
   * Calculates the range of an array of numbers
   * @param numbers - Array of numbers
   * @returns Range (difference between max and min)
   * @example
   * ```typescript
   * MathUtils.range([1, 2, 3, 4, 5]); // 4
   * MathUtils.range([-1, 0, 1]); // 2
   * MathUtils.range([5, 5, 5]); // 0
   * ```
   */
  range(numbers: number[]): number {
    return this.max(numbers) - this.min(numbers);
  },

  /**
   * Rounds a number to a specified number of decimal places
   * @param value - Number to round
   * @param decimals - Number of decimal places
   * @returns Rounded number
   * @example
   * ```typescript
   * MathUtils.round(3.14159, 2); // 3.14
   * MathUtils.round(3.14159, 3); // 3.142
   * MathUtils.round(3.14159, 0); // 3
   * ```
   */
  round(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  },

  /**
   * Calculates the sign of a number
   * @param value - Number to calculate sign for
   * @returns Sign (-1 for negative, 0 for zero, 1 for positive)
   * @example
   * ```typescript
   * MathUtils.sign(-5); // -1
   * MathUtils.sign(0); // 0
   * MathUtils.sign(5); // 1
   * ```
   */
  sign(value: number): number {
    return Math.sign(value);
  },

  /**
   * Calculates the sine of an angle
   * @param angle - Angle in radians
   * @returns Sine value (-1 to 1)
   * @example
   * ```typescript
   * MathUtils.sin(0); // 0
   * MathUtils.sin(Math.PI / 2); // 1
   * MathUtils.sin(Math.PI); // 0
   * ```
   */
  sin(angle: number): number {
    return Math.sin(angle);
  },

  /**
   * Calculates the hyperbolic sine of a number
   * @param value - Number to calculate hyperbolic sine for
   * @returns Hyperbolic sine
   * @example
   * ```typescript
   * MathUtils.sinh(0); // 0
   * MathUtils.sinh(1); // 1.1752...
   * MathUtils.sinh(-1); // -1.1752...
   * ```
   */
  sinh(value: number): number {
    return Math.sinh(value);
  },

  /**
   * Calculates the square root of a number
   * @param value - Number to calculate square root for
   * @returns Square root
   * @example
   * ```typescript
   * MathUtils.sqrt(4); // 2
   * MathUtils.sqrt(2); // 1.4142...
   * MathUtils.sqrt(0); // 0
   * ```
   */
  sqrt(value: number): number {
    return Math.sqrt(value);
  },

  /**
   * Calculates the standard deviation of an array of numbers
   * @param numbers - Array of numbers
   * @returns Standard deviation
   * @example
   * ```typescript
   * MathUtils.standardDeviation([1, 2, 3, 4, 5]); // 1.4142...
   * MathUtils.standardDeviation([2, 4, 4, 4, 6]); // 1.4142...
   * MathUtils.standardDeviation([1, 1, 1, 1]); // 0
   * ```
   */
  standardDeviation(numbers: number[]): number {
    const avg = this.average(numbers);
    const squareDiffs = numbers.map((num) => Math.pow(num - avg, 2));
    return Math.sqrt(this.average(squareDiffs));
  },

  /**
   * Calculates the sum of an array of numbers
   * @param numbers - Array of numbers
   * @returns Sum
   * @example
   * ```typescript
   * MathUtils.sum([1, 2, 3, 4, 5]); // 15
   * MathUtils.sum([-1, -2, -3]); // -6
   * MathUtils.sum([0, 0, 0]); // 0
   * ```
   */
  sum(numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0);
  },

  /**
   * Calculates the tangent of an angle
   * @param angle - Angle in radians
   * @returns Tangent value
   * @example
   * ```typescript
   * MathUtils.tan(0); // 0
   * MathUtils.tan(Math.PI / 4); // 1
   * MathUtils.tan(Math.PI / 2); // Infinity
   * ```
   */
  tan(angle: number): number {
    return Math.tan(angle);
  },

  /**
   * Calculates the hyperbolic tangent of a number
   * @param value - Number to calculate hyperbolic tangent for
   * @returns Hyperbolic tangent (-1 to 1)
   * @example
   * ```typescript
   * MathUtils.tanh(0); // 0
   * MathUtils.tanh(1); // 0.7615...
   * MathUtils.tanh(-1); // -0.7615...
   * ```
   */
  tanh(value: number): number {
    return Math.tanh(value);
  },

  /**
   * Converts degrees to radians
   * @param degrees - Angle in degrees
   * @returns Angle in radians
   * @example
   * ```typescript
   * MathUtils.toRadians(180); // π
   * MathUtils.toRadians(90); // π/2
   * MathUtils.toRadians(360); // 2π
   * ```
   */
  toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  },

  /**
   * Converts radians to degrees
   * @param radians - Angle in radians
   * @returns Angle in degrees
   * @example
   * ```typescript
   * MathUtils.toDegrees(Math.PI); // 180
   * MathUtils.toDegrees(Math.PI / 2); // 90
   * MathUtils.toDegrees(2 * Math.PI); // 360
   * ```
   */
  toDegrees(radians: number): number {
    return (radians * 180) / Math.PI;
  },

  /**
   * Calculates the variance of an array of numbers
   * @param numbers - Array of numbers
   * @returns Variance
   * @example
   * ```typescript
   * MathUtils.variance([1, 2, 3, 4, 5]); // 2
   * MathUtils.variance([2, 4, 4, 4, 6]); // 2
   * MathUtils.variance([1, 1, 1, 1]); // 0
   * ```
   */
  variance(numbers: number[]): number {
    const avg = this.average(numbers);
    const squareDiffs = numbers.map((num) => Math.pow(num - avg, 2));
    return this.average(squareDiffs);
  },
};
