/**
 * @module ArrayUtils
 * @description A collection of utility functions for array manipulation and operations.
 * @example
 * ```typescript
 * import { ArrayUtils } from 'houser-js-utils';
 *
 * // Get unique values from an array
 * const unique = ArrayUtils.deduplicate([1, 2, 2, 3]);
 *
 * // Find maximum value
 * const max = ArrayUtils.findMax([1, 5, 3, 2]);
 * ```
 */

/**
 * Options for array comparison operations
 */
type CompareOptions = {
  /** If true, elements must be in the same order. Defaults to false */
  ordered?: boolean;

  /** If true, performs deep equality comparison. Defaults to false */
  deep?: boolean;
};

/**
 * Represents an entity with an ID field
 */
type EmbeddedEntity = {
  /** Unique identifier for the entity */
  id: string;
  /** Additional properties of the entity */
  [key: string]: any;
};

/**
 * Types that can be compared using standard comparison operators
 */
type Comparable = string | number | boolean;

/**
 * Collection of array utility functions
 */
export const ArrayUtils = {
  /**
   * Calculates the average of all numbers in an array
   * @param arr - Array of numbers to calculate average from
   * @returns The average of all numbers, or 0 if array is empty
   * @example
   * ```typescript
   * const avg = ArrayUtils.average([1, 2, 3, 4, 5]); // Returns 3
   * ```
   */
  average(arr: number[]): number {
    if (!Array.isArray(arr) || arr.length === 0) return 0;
    return this.sumArray(arr) / arr.length;
  },

  /**
   * Compares two arrays for equality by sorting and comparing elements
   * @param a1 - First array to compare
   * @param a2 - Second array to compare
   * @returns True if arrays contain the same elements in any order
   * @example
   * ```typescript
   * const equal = ArrayUtils.arrayEquals([1, 2, 3], [3, 2, 1]); // Returns true
   * ```
   */
  arrayEquals<T extends Comparable>(a1: T[], a2: T[]): boolean {
    if (!Array.isArray(a1) || !Array.isArray(a2)) return false;
    if (a1.length !== a2.length) return false;

    const sortedA1 = [...a1].sort(this.sortCompare);
    const sortedA2 = [...a2].sort(this.sortCompare);
    return sortedA1.every((v, i) => v === sortedA2[i]);
  },

  /**
   * Splits an array into chunks of specified size
   * @param arr - Array to split into chunks
   * @param size - Size of each chunk (must be positive)
   * @returns Array of arrays, each of size 'size'
   * @throws Error if size is not positive
   */
  chunks<T>(arr: T[], size: number): T[][] {
    if (!Number.isInteger(size) || size <= 0) {
      throw new Error("Chunk size must be a positive integer");
    }
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  },

  /**
   * Compares two arrays for equality based on the given options
   * @param arr1 - First array to compare
   * @param arr2 - Second array to compare
   * @param options - Comparison options
   * @returns True if arrays are equal based on the options
   */
  compareArrays<T>(
    arr1: T[],
    arr2: T[],
    options: CompareOptions = {}
  ): boolean {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    const { ordered = false, deep = false } = options;

    if (arr1.length !== arr2.length) return false;

    if (ordered) {
      return arr1.every((item, index) =>
        deep ? this.deepEqual(item, arr2[index]) : item === arr2[index]
      );
    } else {
      const visited: boolean[] = new Array(arr2.length).fill(false);

      return arr1.every((item1) => {
        const index = arr2.findIndex(
          (item2, i) =>
            !visited[i] &&
            (deep ? this.deepEqual(item1, item2) : item1 === item2)
        );
        if (index === -1) return false;
        visited[index] = true;
        return true;
      });
    }
  },

  /**
   * Returns a new array with unique values
   * @param array - Array to make unique
   * @returns Array with duplicate values removed
   */
  deduplicate<T>(array: T[]): T[] {
    if (!Array.isArray(array)) return [];
    return Array.from(new Set(array));
  },

  /**
   * Deep equality comparison between two values
   * @param a - First value
   * @param b - Second value
   * @returns True if values are deeply equal
   */
  deepEqual(a: unknown, b: unknown): boolean {
    if (a === b) return true;

    if (typeof a !== typeof b) return false;

    if (typeof a === "object" && a !== null && b !== null) {
      if (Array.isArray(a) !== Array.isArray(b)) return false;

      if (Array.isArray(a)) {
        if (a.length !== (b as unknown[]).length) return false;
        return a.every((val, i) => this.deepEqual(val, (b as unknown[])[i]));
      }

      const keysA = Object.keys(a);
      const keysB = Object.keys(b as Record<string, unknown>);

      if (keysA.length !== keysB.length) return false;

      return keysA.every((key) =>
        this.deepEqual(
          (a as Record<string, unknown>)[key],
          (b as Record<string, unknown>)[key]
        )
      );
    }

    return false;
  },

  /**
   * Returns elements from array a that are not in array b based on id property
   * @param a - First array
   * @param b - Second array
   * @param getId - Optional function to extract id from items
   * @returns Array of elements from a that are not in b
   */
  difference<T>(
    a: T[],
    b: T[],
    getId: (item: T) => string | number = (item: any) => item.id
  ): T[] {
    const bIds = new Set(b.map(getId));
    return a.filter((item) => !bIds.has(getId(item)));
  },

  /**
   * Returns the maximum value in an array
   * @param arr - Array of comparable values
   * @returns Maximum value or undefined if array is empty
   */
  findMax<T extends Comparable>(arr: T[]): T | undefined {
    if (!Array.isArray(arr) || arr.length === 0) return undefined;
    return arr.reduce((max, val) => (val > max ? val : max), arr[0]);
  },

  /**
   * Returns the minimum value in an array
   * @param arr - Array of comparable values
   * @returns Minimum value or undefined if array is empty
   */
  findMin<T extends Comparable>(arr: T[]): T | undefined {
    if (!Array.isArray(arr) || arr.length === 0) return undefined;
    return arr.reduce((min, val) => (val < min ? val : min), arr[0]);
  },

  /**
   * Finds and updates an item in a collection based on id
   * @param collection - Collection to update
   * @param item - Item to update
   * @returns Updated collection
   * @throws Error if item is not found
   */
  findAndUpdate(
    collection: EmbeddedEntity[],
    item: EmbeddedEntity
  ): EmbeddedEntity[] {
    const index = collection.findIndex((b) => b.id === item.id);
    if (index === -1) {
      throw new Error(`Item with id ${item.id} not found in collection`);
    }
    return collection.map((element, i) => (i === index ? item : element));
  },

  /**
   * Flattens a nested array to a specified depth
   * @param arr - Array to flatten
   * @param depth - Maximum depth to flatten (default: Infinity)
   * @returns Flattened array
   */
  flatten<T>(arr: T[], depth = Infinity): T[] {
    if (depth <= 0) return arr.slice();
    if (!Array.isArray(arr)) return [arr];

    return arr.reduce<T[]>((acc, val) => {
      if (Array.isArray(val)) {
        acc.push(...this.flatten(val, depth - 1));
      } else {
        acc.push(val);
      }
      return acc;
    }, []);
  },

  /**
   * Groups array elements by a key or function
   * @param arr - Array to group
   * @param keyOrFn - Key to group by or function that returns the group key
   * @returns Object with grouped arrays
   */
  groupBy<T>(
    arr: T[],
    keyOrFn: keyof T | ((item: T) => string | number)
  ): Record<string, T[]> {
    if (!Array.isArray(arr)) return {};

    return arr.reduce((groups, item) => {
      const key =
        typeof keyOrFn === "function" ? keyOrFn(item) : String(item[keyOrFn]);

      groups[key] = groups[key] || [];
      groups[key].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },

  /**
   * Checks if two arrays have any common elements
   * @param array1 - First array
   * @param array2 - Second array
   * @returns True if arrays share at least one common element
   */
  hasCommonElement<T>(array1: T[], array2: T[]): boolean {
    if (!array1?.length || !array2?.length) return false;

    const [smaller, larger] =
      array1.length < array2.length ? [array1, array2] : [array2, array1];

    const set = new Set(smaller);
    return larger.some((element) => set.has(element));
  },

  /**
   * Returns the intersection of two arrays
   * @param arr1 - First array
   * @param arr2 - Second array
   * @returns Array containing elements present in both arrays
   */
  intersection<T>(arr1: T[], arr2: T[]): T[] {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return [];
    const set = new Set(arr2);
    return arr1.filter((item) => set.has(item));
  },

  /**
   * Moves an item from one position to another in an array
   * @param arr - Array to modify
   * @param from - Source index
   * @param to - Destination index
   * @returns New array with item moved
   * @throws Error if indices are out of bounds
   */
  moveItem<T>(arr: T[], from: number, to: number): T[] {
    if (!Array.isArray(arr)) {
      throw new Error("First argument must be an array");
    }
    if (from < 0 || from >= arr.length) {
      throw new Error(`Source index ${from} is out of bounds`);
    }
    if (to < 0 || to >= arr.length) {
      throw new Error(`Destination index ${to} is out of bounds`);
    }

    const newArr = [...arr];
    const [item] = newArr.splice(from, 1);
    newArr.splice(to, 0, item);
    return newArr;
  },

  /**
   * Returns a random element from the array
   * @param arr - Array to get element from
   * @returns Random element or undefined if array is empty
   */
  random<T>(arr: T[]): T | undefined {
    if (!Array.isArray(arr) || arr.length === 0) return undefined;
    return arr[Math.floor(Math.random() * arr.length)];
  },

  /**
   * Removes elements from an array that match a predicate
   * @param arr - Array to remove elements from
   * @param predicate - Function that returns true for elements to remove
   * @returns New array with matching elements removed
   */
  remove<T>(arr: T[], predicate: (item: T) => boolean): T[] {
    if (!Array.isArray(arr)) return [];
    return arr.filter((item) => !predicate(item));
  },

  /**
   * Returns a new array with elements in random order
   * @param arr - Array to shuffle
   * @returns New array with elements in random order
   */
  shuffle<T>(arr: T[]): T[] {
    if (!Array.isArray(arr)) return [];
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  },

  /**
   * Compares two values for sorting
   * @param x - First value to compare
   * @param y - Second value to compare
   * @returns -1 if x < y, 0 if equal, 1 if x > y
   */
  sortCompare(x: Comparable, y: Comparable): number {
    const pre = ["string", "number", "bool"];

    if (typeof x !== typeof y) {
      return pre.indexOf(typeof y) - pre.indexOf(typeof x);
    }

    if (x === y) {
      return 0;
    }
    return x > y ? 1 : -1;
  },

  /**
   * Returns the sum of all numbers in an array
   * @param arr - Array of numbers
   * @returns Sum of all numbers
   */
  sumArray(arr: number[]): number {
    if (!Array.isArray(arr)) return 0;
    return arr.reduce((sum, num) => sum + (Number(num) || 0), 0);
  },

  /**
   * Returns the first n elements of an array
   * @param arr - Array to get elements from
   * @param n - Number of elements to get (default: 1)
   * @returns Array containing the first n elements
   */
  takeFirst<T>(arr: T[], n = 1): T[] {
    if (!Array.isArray(arr)) return [];
    return arr.slice(0, n);
  },

  /**
   * Returns the last n elements of an array
   * @param arr - Array to get elements from
   * @param n - Number of elements to get (default: 1)
   * @returns Array containing the last n elements
   */
  takeLast<T>(arr: T[], n = 1): T[] {
    if (!Array.isArray(arr)) return [];
    return arr.slice(-n);
  },

  /**
   * Returns the union of multiple arrays
   * @param arrays - Arrays to union
   * @returns Array containing unique elements from all arrays
   */
  union<T>(...arrays: T[][]): T[] {
    return this.deduplicate(arrays.flat());
  },
};
