/**
 * @module RandomUtils
 * @description A comprehensive collection of utility functions for random number generation.
 * Implements functionality proposed in TC39 Random API proposals including seeded pseudo-random
 * number generation, various distribution methods, and utility functions for common randomness needs.
 * @example
 * ```typescript
 * import { RandomUtils } from 'houser-js-utils';
 *
 * // Generate random integer in range
 * const dice = RandomUtils.int(1, 6);
 *
 * // Create seeded generator for reproducible sequences
 * const seeded = RandomUtils.Seeded.fromFixed(42);
 * const value = seeded.random();
 *
 * // Generate random bytes
 * const bytes = RandomUtils.bytes(16);
 * ```
 */

/**
 * Simple Linear Congruential Generator (LCG) implementation for seeded random numbers.
 * Uses the same constants as Numerical Recipes: a = 1664525, c = 1013904223, m = 2^32
 */
class SimpleLCG {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0; // Ensure 32-bit unsigned integer
  }

  /**
   * Generate next random value and update state
   * @returns Random number between 0 and 1 (exclusive)
   */
  next(): number {
    this.state = (1664525 * this.state + 1013904223) >>> 0;
    return this.state / 0x100000000; // Convert to [0,1)
  }

  /**
   * Get current state
   */
  getState(): number {
    return this.state;
  }

  /**
   * Set state
   */
  setState(state: number): void {
    this.state = state >>> 0;
  }
}

/**
 * A seeded pseudo-random number generator that produces reproducible sequences.
 * Based on the TC39 Seeded Random proposal.
 */
export class SeededRandom {
  private readonly prng: SimpleLCG;

  /**
   * Creates a new seeded random generator
   * @param seed - Seed value or Uint8Array (up to 32 bytes)
   */
  constructor(seed: number | Uint8Array) {
    if (typeof seed === "number") {
      this.prng = new SimpleLCG(seed);
    } else if (seed instanceof Uint8Array) {
      if (seed.length > 32) {
        throw new RangeError("Seed must be 32 bytes or less");
      }
      // Convert Uint8Array to number by taking first 4 bytes
      let numSeed = 0;
      for (let i = 0; i < Math.min(4, seed.length); i++) {
        numSeed = (numSeed << 8) | seed[i];
      }
      this.prng = new SimpleLCG(numSeed);
    } else {
      throw new TypeError("Seed must be a number or Uint8Array");
    }
  }

  /**
   * Factory method that requires exact 32-byte seed
   * @param seed - Exactly 32 bytes of seed data
   * @returns New SeededRandom instance
   */
  static fromSeed(seed: Uint8Array): SeededRandom {
    if (!(seed instanceof Uint8Array)) {
      throw new TypeError("Seed must be a Uint8Array");
    }
    if (seed.length !== 32) {
      throw new RangeError("Seed must be exactly 32 bytes");
    }
    return new SeededRandom(seed);
  }

  /**
   * Factory method that creates generator from state
   * @param state - State data (simplified to number for this implementation)
   * @returns New SeededRandom instance
   */
  static fromState(state: number): SeededRandom {
    const instance = new SeededRandom(0);
    instance.prng.setState(state);
    return instance;
  }

  /**
   * Factory method for simple integer seeds
   * @param byte - Integer between 0-255
   * @returns New SeededRandom instance
   */
  static fromFixed(byte: number): SeededRandom {
    if (
      typeof byte !== "number" ||
      !Number.isInteger(byte) ||
      byte < 0 ||
      byte > 255
    ) {
      throw new RangeError("Byte must be an integer between 0 and 255");
    }
    return new SeededRandom(byte);
  }

  /**
   * Generate a random number between 0 and 1 (exclusive)
   * @returns Random number in [0,1)
   */
  random(): number {
    return this.prng.next();
  }

  /**
   * Generate a new seed for creating child PRNGs
   * @returns 32-byte Uint8Array suitable for seeding
   */
  seed(): Uint8Array {
    const seed = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      seed[i] = Math.floor(this.random() * 256);
    }
    return seed;
  }

  /**
   * Get current generator state
   * @returns Current state as number
   */
  getState(): number {
    return this.prng.getState();
  }

  /**
   * Set generator state
   * @param state - State to set
   * @returns This instance for chaining
   */
  setState(state: number): this {
    this.prng.setState(state);
    return this;
  }

  /**
   * Generate random number in range
   * @param lo - Lower bound
   * @param hi - Upper bound
   * @param step - Optional step size
   * @returns Random number in specified range
   */
  number(lo: number, hi: number, step?: number): number {
    return RandomUtils.number(lo, hi, step, () => this.random());
  }

  /**
   * Generate random integer in range
   * @param lo - Lower bound (inclusive)
   * @param hi - Upper bound (inclusive)
   * @param step - Optional step size
   * @returns Random integer in specified range
   */
  int(lo: number, hi: number, step?: number): number {
    return RandomUtils.int(lo, hi, step, () => this.random());
  }

  /**
   * Generate random BigInt in range
   * @param lo - Lower bound (inclusive)
   * @param hi - Upper bound (inclusive)
   * @param step - Optional step size
   * @returns Random BigInt in specified range
   */
  bigint(lo: bigint, hi: bigint, step?: bigint): bigint {
    return RandomUtils.bigint(lo, hi, step, () => this.random());
  }

  /**
   * Generate random bytes
   * @param n - Number of bytes to generate
   * @returns Uint8Array of random bytes
   */
  bytes(n: number): Uint8Array {
    return RandomUtils.bytes(n, () => this.random());
  }

  /**
   * Fill buffer with random bytes
   * @param buffer - Buffer to fill
   * @param start - Start position (optional)
   * @param end - End position (optional)
   * @returns The filled buffer
   */
  fillBytes<T extends ArrayBuffer | ArrayBufferView>(
    buffer: T,
    start?: number,
    end?: number
  ): T {
    return RandomUtils.fillBytes(buffer, start, end, () => this.random());
  }
}

/**
 * Collection of random utility functions
 */
export const RandomUtils = {
  /**
   * The SeededRandom class for creating reproducible random sequences
   */
  Seeded: SeededRandom,

  /**
   * Generate a random number between 0 and 1 (exclusive)
   * @returns Random number in [0,1)
   */
  random(): number {
    return Math.random();
  },

  /**
   * Generate a random number in a specified range
   * @param lo - Lower bound
   * @param hi - Upper bound
   * @param step - Optional step size
   * @param randomFn - Optional custom random function
   * @returns Random number in specified range
   */
  number(
    lo: number,
    hi: number,
    step?: number,
    randomFn: () => number = Math.random
  ): number {
    if (typeof lo !== "number" || typeof hi !== "number") {
      throw new TypeError("Lower and upper bounds must be numbers");
    }
    if (lo >= hi) {
      throw new RangeError("Lower bound must be less than upper bound");
    }

    if (step === undefined) {
      // Return random float in range (lo, hi)
      return lo + randomFn() * (hi - lo);
    }

    if (typeof step !== "number" || step <= 0) {
      throw new RangeError("Step must be a positive number");
    }

    // Return random number of form lo + N*step in range [lo, hi]
    const maxN = Math.floor((hi - lo) / step);
    const N = Math.floor(randomFn() * (maxN + 1));
    const result = lo + N * step;
    return result > hi ? hi : result;
  },

  /**
   * Generate a random integer in a specified range
   * @param lo - Lower bound (inclusive)
   * @param hi - Upper bound (inclusive)
   * @param step - Optional step size
   * @param randomFn - Optional custom random function
   * @returns Random integer in specified range
   */
  int(
    lo: number,
    hi: number,
    step?: number,
    randomFn: () => number = Math.random
  ): number {
    if (!Number.isInteger(lo) || !Number.isInteger(hi)) {
      throw new TypeError("Lower and upper bounds must be integers");
    }
    if (lo > hi) {
      throw new RangeError(
        "Lower bound must be less than or equal to upper bound"
      );
    }

    if (step === undefined) {
      // Return random integer in range [lo, hi]
      return Math.floor(randomFn() * (hi - lo + 1)) + lo;
    }

    if (!Number.isInteger(step) || step <= 0) {
      throw new RangeError("Step must be a positive integer");
    }

    // Return random integer of form lo + N*step in range [lo, hi]
    const maxN = Math.floor((hi - lo) / step);
    const N = Math.floor(randomFn() * (maxN + 1));
    return lo + N * step;
  },

  /**
   * Generate a random BigInt in a specified range
   * @param lo - Lower bound (inclusive)
   * @param hi - Upper bound (inclusive)
   * @param step - Optional step size
   * @param randomFn - Optional custom random function
   * @returns Random BigInt in specified range
   */
  bigint(
    lo: bigint,
    hi: bigint,
    step?: bigint,
    randomFn: () => number = Math.random
  ): bigint {
    if (typeof lo !== "bigint" || typeof hi !== "bigint") {
      throw new TypeError("Lower and upper bounds must be BigInts");
    }
    if (lo > hi) {
      throw new RangeError(
        "Lower bound must be less than or equal to upper bound"
      );
    }

    const range = hi - lo + 1n;

    if (step === undefined) {
      // Generate random BigInt in range [lo, hi]
      const randomValue = BigInt(Math.floor(randomFn() * Number(range)));
      return lo + randomValue;
    }

    if (typeof step !== "bigint" || step <= 0n) {
      throw new RangeError("Step must be a positive BigInt");
    }

    // Return random BigInt of form lo + N*step in range [lo, hi]
    const maxN = (hi - lo) / step;
    const N = BigInt(Math.floor(randomFn() * (Number(maxN) + 1)));
    return lo + N * step;
  },

  /**
   * Generate random bytes
   * @param n - Number of bytes to generate
   * @param randomFn - Optional custom random function
   * @returns Uint8Array of random bytes
   */
  bytes(n: number, randomFn: () => number = Math.random): Uint8Array {
    if (!Number.isInteger(n) || n < 0) {
      throw new RangeError("Number of bytes must be a non-negative integer");
    }

    const bytes = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      bytes[i] = Math.floor(randomFn() * 256);
    }
    return bytes;
  },

  /**
   * Fill a buffer with random bytes
   * @param buffer - Buffer to fill (ArrayBuffer or TypedArray)
   * @param start - Start position (optional)
   * @param end - End position (optional)
   * @param randomFn - Optional custom random function
   * @returns The filled buffer
   */
  fillBytes<T extends ArrayBuffer | ArrayBufferView>(
    buffer: T,
    start?: number,
    end?: number,
    randomFn: () => number = Math.random
  ): T {
    let view: Uint8Array;

    if (buffer instanceof ArrayBuffer) {
      view = new Uint8Array(buffer);
    } else if (ArrayBuffer.isView(buffer)) {
      view = new Uint8Array(
        buffer.buffer,
        buffer.byteOffset,
        buffer.byteLength
      );
    } else {
      throw new TypeError("Buffer must be an ArrayBuffer or ArrayBufferView");
    }

    const startPos = start ?? 0;
    const endPos = end ?? view.length;

    if (startPos < 0 || endPos > view.length || startPos > endPos) {
      throw new RangeError("Invalid start or end position");
    }

    for (let i = startPos; i < endPos; i++) {
      view[i] = Math.floor(randomFn() * 256);
    }

    return buffer;
  },

  /**
   * Generate a random boolean value
   * @param probability - Probability of returning true (0-1, default: 0.5)
   * @param randomFn - Optional custom random function
   * @returns Random boolean
   */
  boolean(
    probability: number = 0.5,
    randomFn: () => number = Math.random
  ): boolean {
    if (
      typeof probability !== "number" ||
      isNaN(probability) ||
      probability < 0 ||
      probability > 1
    ) {
      throw new RangeError("Probability must be a number between 0 and 1");
    }
    return randomFn() < probability;
  },

  /**
   * Choose a random element from an array
   * @param array - Array to choose from
   * @param randomFn - Optional custom random function
   * @returns Random element from the array
   */
  choice<T>(array: T[], randomFn: () => number = Math.random): T {
    if (!Array.isArray(array)) {
      throw new TypeError("Input must be an array");
    }
    if (array.length === 0) {
      throw new RangeError("Array cannot be empty");
    }

    const index = Math.floor(randomFn() * array.length);
    return array[index];
  },

  /**
   * Choose multiple random elements from an array without replacement
   * @param array - Array to choose from
   * @param count - Number of elements to choose
   * @param randomFn - Optional custom random function
   * @returns Array of randomly chosen elements
   */
  sample<T>(
    array: T[],
    count: number,
    randomFn: () => number = Math.random
  ): T[] {
    if (!Array.isArray(array)) {
      throw new TypeError("Input must be an array");
    }
    if (!Number.isInteger(count) || count < 0) {
      throw new RangeError("Count must be a non-negative integer");
    }
    if (count > array.length) {
      throw new RangeError("Count cannot be greater than array length");
    }

    const result: T[] = [];
    const indices = new Set<number>();

    while (result.length < count) {
      const index = Math.floor(randomFn() * array.length);
      if (!indices.has(index)) {
        indices.add(index);
        result.push(array[index]);
      }
    }

    return result;
  },

  /**
   * Shuffle an array using Fisher-Yates algorithm
   * @param array - Array to shuffle
   * @param randomFn - Optional custom random function
   * @returns New shuffled array
   */
  shuffle<T>(array: T[], randomFn: () => number = Math.random): T[] {
    if (!Array.isArray(array)) {
      throw new TypeError("Input must be an array");
    }

    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(randomFn() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  },

  /**
   * Generate a random string of specified length
   * @param length - Length of the string to generate
   * @param charset - Character set to use (default: alphanumeric)
   * @param randomFn - Optional custom random function
   * @returns Random string
   */
  string(
    length: number,
    charset: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    randomFn: () => number = Math.random
  ): string {
    if (!Number.isInteger(length) || length < 0) {
      throw new RangeError("Length must be a non-negative integer");
    }
    if (typeof charset !== "string" || charset.length === 0) {
      throw new TypeError("Charset must be a non-empty string");
    }

    let result = "";
    for (let i = 0; i < length; i++) {
      result += charset[Math.floor(randomFn() * charset.length)];
    }
    return result;
  },

  /**
   * Generate a random UUID v4
   * @param randomFn - Optional custom random function
   * @returns Random UUID string
   */
  uuid(randomFn: () => number = Math.random): string {
    const hex = "0123456789abcdef";
    let uuid = "";

    for (let i = 0; i < 36; i++) {
      if (i === 8 || i === 13 || i === 18 || i === 23) {
        uuid += "-";
      } else if (i === 14) {
        uuid += "4"; // Version 4
      } else if (i === 19) {
        uuid += hex[Math.floor(randomFn() * 4) + 8]; // Variant bits
      } else {
        uuid += hex[Math.floor(randomFn() * 16)];
      }
    }

    return uuid;
  },

  /**
   * Generate a weighted random choice
   * @param items - Array of items to choose from
   * @param weights - Array of weights corresponding to items
   * @param randomFn - Optional custom random function
   * @returns Randomly chosen item based on weights
   */
  weightedChoice<T>(
    items: T[],
    weights: number[],
    randomFn: () => number = Math.random
  ): T {
    if (!Array.isArray(items) || !Array.isArray(weights)) {
      throw new TypeError("Items and weights must be arrays");
    }
    if (items.length !== weights.length) {
      throw new RangeError(
        "Items and weights arrays must have the same length"
      );
    }
    if (items.length === 0) {
      throw new RangeError("Arrays cannot be empty");
    }
    if (weights.some((w) => typeof w !== "number" || w < 0)) {
      throw new RangeError("All weights must be non-negative numbers");
    }

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    if (totalWeight === 0) {
      throw new RangeError("Total weight must be greater than 0");
    }

    const random = randomFn() * totalWeight;
    let cumulativeWeight = 0;

    for (let i = 0; i < items.length; i++) {
      cumulativeWeight += weights[i];
      if (random <= cumulativeWeight) {
        return items[i];
      }
    }

    // Fallback (should never reach here)
    return items[items.length - 1];
  },

  /**
   * Generate a random number from normal distribution (Box-Muller transform)
   * @param mean - Mean of the distribution (default: 0)
   * @param stdDev - Standard deviation (default: 1)
   * @param randomFn - Optional custom random function
   * @returns Random number from normal distribution
   */
  normal(
    mean: number = 0,
    stdDev: number = 1,
    randomFn: () => number = Math.random
  ): number {
    if (typeof mean !== "number" || typeof stdDev !== "number") {
      throw new TypeError("Mean and standard deviation must be numbers");
    }
    if (stdDev <= 0) {
      throw new RangeError("Standard deviation must be positive");
    }

    // Use a simple implementation without static variables
    const u1 = randomFn();
    const u2 = randomFn();

    // Box-Muller transform
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * stdDev + mean;
  },

  /**
   * Generate a random number from exponential distribution
   * @param rate - Rate parameter (lambda)
   * @param randomFn - Optional custom random function
   * @returns Random number from exponential distribution
   */
  exponential(rate: number = 1, randomFn: () => number = Math.random): number {
    if (typeof rate !== "number" || rate <= 0) {
      throw new RangeError("Rate must be a positive number");
    }

    return -Math.log(1 - randomFn()) / rate;
  },

  /**
   * Generate a random seed for seeding PRNGs
   * @returns 32-byte Uint8Array suitable for seeding
   */
  seed(): Uint8Array {
    return this.bytes(32);
  },
};
