import { describe, it, expect } from "vitest";
import { RandomUtils, SeededRandom } from "../RandomUtils";

describe("RandomUtils", () => {
  describe("basic random functions", () => {
    it("random() returns values between 0 and 1", () => {
      for (let i = 0; i < 100; i++) {
        const value = RandomUtils.random();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });

    it("boolean() returns boolean values", () => {
      const results = new Set();
      for (let i = 0; i < 100; i++) {
        const value = RandomUtils.boolean();
        expect(typeof value).toBe("boolean");
        results.add(value);
      }
      // Should have both true and false (with high probability)
      expect(results.size).toBeGreaterThan(1);
    });

    it("boolean() with custom probability", () => {
      // Test with probability 0 (always false)
      for (let i = 0; i < 10; i++) {
        expect(RandomUtils.boolean(0)).toBe(false);
      }

      // Test with probability 1 (always true)
      for (let i = 0; i < 10; i++) {
        expect(RandomUtils.boolean(1)).toBe(true);
      }
    });

    it("boolean() throws on invalid probability", () => {
      expect(() => RandomUtils.boolean(-0.1)).toThrow(RangeError);
      expect(() => RandomUtils.boolean(1.1)).toThrow(RangeError);
      expect(() => RandomUtils.boolean(NaN)).toThrow(RangeError);
    });
  });

  describe("number() function", () => {
    it("generates numbers in range without step", () => {
      for (let i = 0; i < 100; i++) {
        const value = RandomUtils.number(5, 10);
        expect(value).toBeGreaterThan(5);
        expect(value).toBeLessThan(10);
      }
    });

    it("generates numbers with step", () => {
      for (let i = 0; i < 100; i++) {
        const value = RandomUtils.number(0, 10, 2);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(10);
        expect(value % 2).toBeCloseTo(0, 10);
      }
    });

    it("throws on invalid parameters", () => {
      expect(() => RandomUtils.number(10, 5)).toThrow(RangeError);
      expect(() => RandomUtils.number("5" as any, 10)).toThrow(TypeError);
      expect(() => RandomUtils.number(5, 10, -1)).toThrow(RangeError);
    });
  });

  describe("int() function", () => {
    it("generates integers in range", () => {
      for (let i = 0; i < 100; i++) {
        const value = RandomUtils.int(1, 6);
        expect(Number.isInteger(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(6);
      }
    });

    it("generates integers with step", () => {
      for (let i = 0; i < 100; i++) {
        const value = RandomUtils.int(0, 20, 5);
        expect(Number.isInteger(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(20);
        expect(value % 5).toBe(0);
      }
    });

    it("throws on non-integer bounds", () => {
      expect(() => RandomUtils.int(1.5, 6)).toThrow(TypeError);
      expect(() => RandomUtils.int(1, 6.5)).toThrow(TypeError);
    });

    it("throws on invalid step", () => {
      expect(() => RandomUtils.int(1, 6, 1.5)).toThrow(RangeError);
      expect(() => RandomUtils.int(1, 6, -1)).toThrow(RangeError);
    });
  });

  describe("bigint() function", () => {
    it("generates BigInts in range", () => {
      for (let i = 0; i < 100; i++) {
        const value = RandomUtils.bigint(1n, 100n);
        expect(typeof value).toBe("bigint");
        expect(value).toBeGreaterThanOrEqual(1n);
        expect(value).toBeLessThanOrEqual(100n);
      }
    });

    it("generates BigInts with step", () => {
      for (let i = 0; i < 100; i++) {
        const value = RandomUtils.bigint(0n, 100n, 10n);
        expect(typeof value).toBe("bigint");
        expect(value).toBeGreaterThanOrEqual(0n);
        expect(value).toBeLessThanOrEqual(100n);
        expect(value % 10n).toBe(0n);
      }
    });

    it("throws on invalid parameters", () => {
      expect(() => RandomUtils.bigint(100n, 1n)).toThrow(RangeError);
      expect(() => RandomUtils.bigint(1 as any, 100n)).toThrow(TypeError);
      expect(() => RandomUtils.bigint(1n, 100n, -10n)).toThrow(RangeError);
    });
  });

  describe("bytes() function", () => {
    it("generates correct number of bytes", () => {
      const bytes = RandomUtils.bytes(16);
      expect(bytes).toBeInstanceOf(Uint8Array);
      expect(bytes.length).toBe(16);
    });

    it("generates random bytes", () => {
      const bytes1 = RandomUtils.bytes(32);
      const bytes2 = RandomUtils.bytes(32);

      // Arrays should be different (with very high probability)
      expect(bytes1).not.toEqual(bytes2);
    });

    it("throws on invalid size", () => {
      expect(() => RandomUtils.bytes(-1)).toThrow(RangeError);
      expect(() => RandomUtils.bytes(1.5)).toThrow(RangeError);
    });
  });

  describe("fillBytes() function", () => {
    it("fills ArrayBuffer with random bytes", () => {
      const buffer = new ArrayBuffer(16);
      const result = RandomUtils.fillBytes(buffer);

      expect(result).toBe(buffer);
      const view = new Uint8Array(buffer);
      // Check that buffer was modified (not all zeros)
      const hasNonZero = Array.from(view).some((byte) => byte !== 0);
      expect(hasNonZero).toBe(true);
    });

    it("fills TypedArray with random bytes", () => {
      const array = new Uint8Array(16);
      const result = RandomUtils.fillBytes(array);

      expect(result).toBe(array);
      // Check that array was modified (not all zeros)
      const hasNonZero = Array.from(array).some((byte) => byte !== 0);
      expect(hasNonZero).toBe(true);
    });

    it("fills partial range", () => {
      const array = new Uint8Array(10);
      array.fill(255); // Fill with known value

      RandomUtils.fillBytes(array, 2, 8);

      // First 2 and last 2 bytes should be unchanged
      expect(array[0]).toBe(255);
      expect(array[1]).toBe(255);
      expect(array[8]).toBe(255);
      expect(array[9]).toBe(255);

      // Middle bytes should be changed
      const middleHasChange = Array.from(array.slice(2, 8)).some(
        (byte) => byte !== 255
      );
      expect(middleHasChange).toBe(true);
    });

    it("throws on invalid buffer type", () => {
      expect(() => RandomUtils.fillBytes({} as any)).toThrow(TypeError);
    });

    it("throws on invalid range", () => {
      const array = new Uint8Array(10);
      expect(() => RandomUtils.fillBytes(array, -1, 5)).toThrow(RangeError);
      expect(() => RandomUtils.fillBytes(array, 5, 15)).toThrow(RangeError);
      expect(() => RandomUtils.fillBytes(array, 8, 5)).toThrow(RangeError);
    });
  });

  describe("choice() function", () => {
    it("chooses elements from array", () => {
      const array = [1, 2, 3, 4, 5];
      for (let i = 0; i < 100; i++) {
        const choice = RandomUtils.choice(array);
        expect(array).toContain(choice);
      }
    });

    it("throws on empty array", () => {
      expect(() => RandomUtils.choice([])).toThrow(RangeError);
    });

    it("throws on non-array", () => {
      expect(() => RandomUtils.choice("not array" as any)).toThrow(TypeError);
    });
  });

  describe("sample() function", () => {
    it("samples elements without replacement", () => {
      const array = [1, 2, 3, 4, 5];
      const sample = RandomUtils.sample(array, 3);

      expect(sample.length).toBe(3);
      expect(new Set(sample).size).toBe(3); // All unique
      sample.forEach((item) => expect(array).toContain(item));
    });

    it("throws on invalid count", () => {
      const array = [1, 2, 3];
      expect(() => RandomUtils.sample(array, 5)).toThrow(RangeError);
      expect(() => RandomUtils.sample(array, -1)).toThrow(RangeError);
      expect(() => RandomUtils.sample(array, 1.5)).toThrow(RangeError);
    });

    it("throws on non-array", () => {
      expect(() => RandomUtils.sample("not array" as any, 1)).toThrow(
        TypeError
      );
    });
  });

  describe("shuffle() function", () => {
    it("shuffles array", () => {
      const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      // Test multiple shuffles to ensure at least one is different
      let shuffled = RandomUtils.shuffle(original);
      let attempts = 0;
      const maxAttempts = 100;

      while (
        JSON.stringify(shuffled) === JSON.stringify(original) &&
        attempts < maxAttempts
      ) {
        shuffled = RandomUtils.shuffle(original);
        attempts++;
      }

      expect(shuffled.length).toBe(original.length);
      expect(shuffled.sort()).toEqual(original.sort());
      // With a 10-element array, the probability of not shuffling is extremely low after 100 attempts
      expect(attempts).toBeLessThan(maxAttempts);
    });

    it("does not modify original array", () => {
      const original = [1, 2, 3, 4, 5];
      const originalCopy = [...original];
      const shuffled = RandomUtils.shuffle(original);

      expect(original).toEqual(originalCopy);
      expect(shuffled).not.toBe(original);
    });

    it("throws on non-array", () => {
      expect(() => RandomUtils.shuffle("not array" as any)).toThrow(TypeError);
    });
  });

  describe("string() function", () => {
    it("generates string of correct length", () => {
      const str = RandomUtils.string(10);
      expect(typeof str).toBe("string");
      expect(str.length).toBe(10);
    });

    it("uses custom charset", () => {
      const str = RandomUtils.string(100, "abc");
      expect(str.length).toBe(100);
      for (const char of str) {
        expect("abc").toContain(char);
      }
    });

    it("throws on invalid parameters", () => {
      expect(() => RandomUtils.string(-1)).toThrow(RangeError);
      expect(() => RandomUtils.string(1.5)).toThrow(RangeError);
      expect(() => RandomUtils.string(10, "")).toThrow(TypeError);
    });
  });

  describe("uuid() function", () => {
    it("generates valid UUID v4 format", () => {
      const uuid = RandomUtils.uuid();
      expect(typeof uuid).toBe("string");
      expect(uuid.length).toBe(36);

      // Check UUID v4 format
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
      expect(uuid).toMatch(uuidRegex);
    });

    it("generates unique UUIDs", () => {
      const uuids = new Set();
      for (let i = 0; i < 100; i++) {
        uuids.add(RandomUtils.uuid());
      }
      expect(uuids.size).toBe(100);
    });
  });

  describe("weightedChoice() function", () => {
    it("chooses based on weights", () => {
      const items = ["a", "b", "c"];
      const weights = [1, 0, 0]; // Only 'a' should be chosen

      for (let i = 0; i < 10; i++) {
        const choice = RandomUtils.weightedChoice(items, weights);
        expect(choice).toBe("a");
      }
    });

    it("throws on mismatched arrays", () => {
      expect(() => RandomUtils.weightedChoice([1, 2], [1])).toThrow(RangeError);
    });

    it("throws on negative weights", () => {
      expect(() => RandomUtils.weightedChoice(["a"], [-1])).toThrow(RangeError);
    });

    it("throws on zero total weight", () => {
      expect(() => RandomUtils.weightedChoice(["a"], [0])).toThrow(RangeError);
    });

    it("throws on non-arrays", () => {
      expect(() => RandomUtils.weightedChoice("not array" as any, [1])).toThrow(
        TypeError
      );
      expect(() =>
        RandomUtils.weightedChoice(["a"], "not array" as any)
      ).toThrow(TypeError);
    });
  });

  describe("normal() function", () => {
    it("generates numbers with expected distribution properties", () => {
      const values: number[] = [];
      for (let i = 0; i < 1000; i++) {
        values.push(RandomUtils.normal(0, 1));
      }

      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      expect(mean).toBeCloseTo(0, 0); // Should be close to 0

      // Most values should be within 3 standard deviations
      const within3Sigma = values.filter((val) => Math.abs(val) <= 3).length;
      expect(within3Sigma / values.length).toBeGreaterThan(0.99);
    });

    it("throws on invalid parameters", () => {
      expect(() => RandomUtils.normal("0" as any, 1)).toThrow(TypeError);
      expect(() => RandomUtils.normal(0, "1" as any)).toThrow(TypeError);
      expect(() => RandomUtils.normal(0, -1)).toThrow(RangeError);
      expect(() => RandomUtils.normal(0, 0)).toThrow(RangeError);
    });
  });

  describe("exponential() function", () => {
    it("generates positive values", () => {
      for (let i = 0; i < 100; i++) {
        const value = RandomUtils.exponential(1);
        expect(value).toBeGreaterThan(0);
      }
    });

    it("throws on invalid rate", () => {
      expect(() => RandomUtils.exponential(-1)).toThrow(RangeError);
      expect(() => RandomUtils.exponential(0)).toThrow(RangeError);
      expect(() => RandomUtils.exponential("1" as any)).toThrow(RangeError);
    });
  });

  describe("seed() function", () => {
    it("generates 32-byte seed", () => {
      const seed = RandomUtils.seed();
      expect(seed).toBeInstanceOf(Uint8Array);
      expect(seed.length).toBe(32);
    });
  });
});

describe("SeededRandom", () => {
  describe("constructor", () => {
    it("creates instance with number seed", () => {
      const seeded = new SeededRandom(12345);
      expect(seeded).toBeInstanceOf(SeededRandom);
    });

    it("creates instance with Uint8Array seed", () => {
      const seed = new Uint8Array([1, 2, 3, 4]);
      const seeded = new SeededRandom(seed);
      expect(seeded).toBeInstanceOf(SeededRandom);
    });

    it("throws on oversized seed", () => {
      const largeSeed = new Uint8Array(33);
      expect(() => new SeededRandom(largeSeed)).toThrow(RangeError);
    });

    it("throws on invalid seed type", () => {
      expect(() => new SeededRandom("invalid" as any)).toThrow(TypeError);
    });
  });

  describe("factory methods", () => {
    it("fromSeed() requires exact size", () => {
      const seed = new Uint8Array(32);
      const seeded = SeededRandom.fromSeed(seed);
      expect(seeded).toBeInstanceOf(SeededRandom);
    });

    it("fromSeed() throws on wrong size", () => {
      const seed = new Uint8Array(16);
      expect(() => SeededRandom.fromSeed(seed)).toThrow(RangeError);
    });

    it("fromState() creates from state", () => {
      const seeded = SeededRandom.fromState(12345);
      expect(seeded).toBeInstanceOf(SeededRandom);
    });

    it("fromFixed() creates from byte", () => {
      const seeded = SeededRandom.fromFixed(42);
      expect(seeded).toBeInstanceOf(SeededRandom);
    });

    it("fromFixed() throws on invalid byte", () => {
      expect(() => SeededRandom.fromFixed(-1)).toThrow(RangeError);
      expect(() => SeededRandom.fromFixed(256)).toThrow(RangeError);
      expect(() => SeededRandom.fromFixed(1.5)).toThrow(RangeError);
    });
  });

  describe("reproducibility", () => {
    it("same seed produces same sequence", () => {
      const seeded1 = new SeededRandom(12345);
      const seeded2 = new SeededRandom(12345);

      const values1: number[] = [];
      const values2: number[] = [];

      for (let i = 0; i < 10; i++) {
        values1.push(seeded1.random());
        values2.push(seeded2.random());
      }

      expect(values1).toEqual(values2);
    });

    it("different seeds produce different sequences", () => {
      const seeded1 = new SeededRandom(12345);
      const seeded2 = new SeededRandom(54321);

      const values1: number[] = [];
      const values2: number[] = [];

      for (let i = 0; i < 10; i++) {
        values1.push(seeded1.random());
        values2.push(seeded2.random());
      }

      expect(values1).not.toEqual(values2);
    });
  });

  describe("state management", () => {
    it("getState() and setState() work correctly", () => {
      const seeded = new SeededRandom(12345);

      // Generate some values
      seeded.random();
      seeded.random();

      const state = seeded.getState();
      const nextValue1 = seeded.random();

      // Reset to saved state
      seeded.setState(state);
      const nextValue2 = seeded.random();

      expect(nextValue1).toBe(nextValue2);
    });

    it("setState() returns this for chaining", () => {
      const seeded = new SeededRandom(12345);
      const result = seeded.setState(54321);
      expect(result).toBe(seeded);
    });
  });

  describe("seeded methods", () => {
    it("all methods work with seeded generator", () => {
      const seeded = new SeededRandom(12345);

      // Test that all methods are available and work
      expect(typeof seeded.random()).toBe("number");
      expect(typeof seeded.number(1, 10)).toBe("number");
      expect(typeof seeded.int(1, 10)).toBe("number");
      expect(typeof seeded.bigint(1n, 10n)).toBe("bigint");
      expect(seeded.bytes(16)).toBeInstanceOf(Uint8Array);
      expect(seeded.seed()).toBeInstanceOf(Uint8Array);

      const buffer = new Uint8Array(16);
      expect(seeded.fillBytes(buffer)).toBe(buffer);
    });

    it("seeded methods produce reproducible results", () => {
      const seeded1 = new SeededRandom(12345);
      const seeded2 = new SeededRandom(12345);

      expect(seeded1.int(1, 100)).toBe(seeded2.int(1, 100));
      expect(seeded1.number(0, 1)).toBe(seeded2.number(0, 1));
    });
  });
});
