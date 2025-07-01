/**
 * @module ObjectUtils
 * @description A comprehensive collection of utility functions for object manipulation, transformation, and analysis.
 * @example
 * ```typescript
 * import { ObjectUtils } from 'houser-js-utils';
 *
 * // Deep clone an object
 * const cloned = ObjectUtils.cloneObject(originalObject);
 *
 * // Merge multiple objects
 * const merged = ObjectUtils.merge(obj1, obj2, obj3);
 *
 * // Get nested property safely
 * const value = ObjectUtils.getNestedProp(obj, 'user', 'profile', 'name');
 * ```
 */

export const ObjectUtils = {
  /**
   * Creates a deep clone of an object, including nested objects and arrays.
   * @template T - The type of the object to clone
   * @param obj - The object to clone
   * @returns A deeply cloned copy of the object
   * @example
   * ```typescript
   * const original = { user: { name: 'John', hobbies: ['reading'] } };
   * const cloned = ObjectUtils.cloneObject(original);
   * cloned.user.name = 'Jane'; // Original remains unchanged
   * ```
   */
  cloneObject<T>(obj: T): T {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.cloneObject(item)) as unknown as T;
    }

    const clonedObj: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = this.cloneObject(
          (obj as Record<string, unknown>)[key]
        );
      }
    }

    return clonedObj as T;
  },

  /**
   * Performs a deep equality check between two values, comparing all nested properties.
   * @param obj1 - The first value to compare
   * @param obj2 - The second value to compare
   * @returns True if the values are deeply equal, false otherwise
   * @example
   * ```typescript
   * ObjectUtils.deepEqual({ a: { b: 1 } }, { a: { b: 1 } }); // Returns true
   * ObjectUtils.deepEqual({ a: 1 }, { a: 2 }); // Returns false
   * ObjectUtils.deepEqual([1, 2, 3], [1, 2, 3]); // Returns true
   * ```
   */
  deepEqual(obj1: unknown, obj2: unknown): boolean {
    if (obj1 === obj2) {
      return true;
    }

    if (
      typeof obj1 !== "object" ||
      obj1 === null ||
      typeof obj2 !== "object" ||
      obj2 === null
    ) {
      return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    return !keys1.some(
      (key) =>
        !Object.prototype.hasOwnProperty.call(obj2, key) ||
        !this.deepEqual((obj1 as any)[key], (obj2 as any)[key])
    );
  },

  /**
   * Filters an array of objects to unique values based on a specified property.
   * @template T - The type of objects in the array
   * @param objects - The array of objects to filter
   * @param prop - The property to use for uniqueness comparison
   * @returns An array containing only unique objects based on the specified property
   * @example
   * ```typescript
   * const users = [
   *   { id: 1, name: 'John' },
   *   { id: 2, name: 'Jane' },
   *   { id: 1, name: 'John Doe' }
   * ];
   * ObjectUtils.filterUniqueByProp(users, 'id'); // Returns first two objects
   * ```
   */
  filterUniqueByProp<T extends Record<string, unknown>>(
    objects: T[],
    prop: keyof T
  ): T[] {
    if (!objects?.length) return [];

    const flags: Record<string, boolean> = {};
    return objects.filter((o) => {
      if (flags[String(o[prop])]) return false;
      flags[String(o[prop])] = true;
      return true;
    });
  },

  /**
   * Filters an object to only include the specified keys.
   * @param obj - The object to filter
   * @param keys - An array of keys to include in the filtered object
   * @returns A new object containing only the specified keys
   * @example
   * ```typescript
   * const user = { id: 1, name: 'John', email: 'john@example.com', password: 'secret' };
   * ObjectUtils.filterByKeys(user, ['id', 'name']); // Returns { id: 1, name: 'John' }
   * ```
   */
  filterByKeys(
    obj: Record<string, unknown>,
    keys: string[]
  ): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(obj).filter(([key]) => keys.includes(key))
    );
  },

  /**
   * Finds the index of the first non-zero value in an object of numbers.
   * @param data - An object containing numeric values
   * @returns The index of the first non-zero value, or -1 if all values are zero
   * @example
   * ```typescript
   * ObjectUtils.findFirstNonZeroIndex({ a: 0, b: 0, c: 5, d: 2 }); // Returns 2
   * ObjectUtils.findFirstNonZeroIndex({ a: 0, b: 0 }); // Returns -1
   * ```
   */
  findFirstNonZeroIndex(data: Record<string, number>): number {
    return Object.entries(data).findIndex(([_, value]) => value !== 0);
  },

  /**
   * Flattens a nested object into a single-level object with dot-notation keys.
   * @param obj - The object to flatten
   * @param prefix - The prefix to use for nested keys (default: empty string)
   * @returns A flattened object with dot-notation keys
   * @example
   * ```typescript
   * const nested = { user: { profile: { name: 'John', age: 30 } } };
   * ObjectUtils.flatten(nested);
   * // Returns { 'user.profile.name': 'John', 'user.profile.age': 30 }
   * ```
   */
  flatten(obj: Record<string, unknown>, prefix = ""): Record<string, unknown> {
    return Object.keys(obj).reduce(
      (acc: Record<string, unknown>, key: string) => {
        const prefixedKey = prefix ? `${prefix}.${key}` : key;
        if (
          typeof obj[key] === "object" &&
          obj[key] !== null &&
          !Array.isArray(obj[key])
        ) {
          Object.assign(
            acc,
            this.flatten(obj[key] as Record<string, unknown>, prefixedKey)
          );
        } else {
          acc[prefixedKey] = obj[key];
        }
        return acc;
      },
      {}
    );
  },

  /**
   * Converts a Map to a plain object
   * @param map - Map to convert
   * @returns Plain object
   */
  fromMap<T>(map: Map<string, T> | Record<string, T>): Record<string, T> {
    if (!map) return {};
    return map instanceof Map ? Object.fromEntries(map) : map;
  },

  /**
   * Gets a nested property from an object
   * @param obj - Object to get property from
   * @param path - Path to property
   * @returns Property value or null if not found
   */
  getNestedProp<T>(obj: Record<string, unknown>, ...path: string[]): T | null {
    if (!obj || path.length === 0 || Object.keys(obj).length === 0) {
      return null;
    }

    let value: unknown = obj;

    for (const prop of path) {
      if (
        !value ||
        typeof (value as Record<string, unknown>)[prop] === "undefined"
      ) {
        return null;
      }
      value = (value as Record<string, unknown>)[prop];
    }

    if (this.isObject(value) && Object.keys(value as object).length === 0) {
      return null;
    }

    return value as T;
  },

  /**
   * Groups objects by a property value
   * @param objects - Array of objects to group
   * @param propPath - Path to property to group by
   * @returns Object with grouped arrays
   */
  groupByProp<T extends Record<string, unknown>>(
    objects: T[],
    ...propPath: string[]
  ): Record<string, T[]> {
    const grouping: Record<string, T[]> = {};

    if (!objects) {
      return grouping;
    }

    objects.forEach((obj) => {
      const val = this.getNestedProp(obj, ...propPath);

      if (typeof val === "undefined" || val === null) {
        return;
      }

      const key = String(val);
      if (!grouping[key]) {
        grouping[key] = [];
      }

      grouping[key].push(obj);
    });

    return grouping;
  },

  /**
   * Checks if an object has a nested property
   * @param obj - Object to check
   * @param path - Path to property
   * @returns True if property exists
   */
  hasNestedProp(obj: Record<string, unknown>, ...path: string[]): boolean {
    if (!obj || path.length === 0 || Object.keys(obj).length === 0)
      return false;

    let value: unknown = obj;

    for (const prop of path) {
      if (
        !value ||
        typeof (value as Record<string, unknown>)[prop] === "undefined"
      ) {
        return false;
      }
      value = (value as Record<string, unknown>)[prop];
    }

    return true;
  },

  /**
   * Checks if an object is empty
   * @param obj - Object to check
   * @returns True if object is empty
   */
  isEmpty(obj: unknown): boolean {
    return (
      [Object, Array].includes((obj || {}).constructor as any) &&
      !Object.entries(obj || {}).length
    );
  },

  /**
   * Checks if a value is a function
   * @param value - Value to check
   * @returns True if value is a function
   */
  isFunction(value: unknown): value is Function {
    return value instanceof Function;
  },

  /**
   * Checks if two objects are equal using JSON stringification
   * @param obj1 - First object to compare
   * @param obj2 - Second object to compare
   * @returns True if objects are equal
   */
  isEqual(obj1: unknown, obj2: unknown): boolean {
    if (!obj1 || !obj2) return false;
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  },

  /**
   * Compares objects based on specified keys
   * @param obj1 - First object to compare
   * @param obj2 - Second object to compare
   * @param keys - Array of keys to compare
   * @returns True if objects are equal on specified keys
   */
  isEqualOnKeys(
    obj1: Record<string, unknown>,
    obj2: Record<string, unknown>,
    keys: string[]
  ): boolean {
    return this.deepEqual(
      this.filterByKeys(obj1, keys),
      this.filterByKeys(obj2, keys)
    );
  },

  /**
   * Checks if a value is an object
   * @param value - Value to check
   * @returns True if value is an object
   */
  isObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object";
  },

  /**
   * Maps objects by a property value
   * @param objects - Array of objects to map
   * @param propPath - Path to property to map by
   * @returns Object with mapped values
   */
  mapByProp<T extends Record<string, unknown>>(
    objects: T[],
    ...propPath: string[]
  ): Record<string, T> {
    if (!objects) {
      return {};
    }

    const groups = this.groupByProp(objects, ...propPath);
    const result: Record<string, T> = {};

    Object.keys(groups).forEach((k) => {
      result[k] = groups[k][0];
    });

    return result;
  },

  /**
   * Checks if an object conforms to a set of rules
   * @param obj - Object to check
   * @param ruleSet - Object containing validation functions
   * @returns True if object conforms to all rules
   */
  matchesRules<T extends Record<string, unknown>>(
    obj: T,
    ruleSet: Record<keyof T, (value: unknown) => boolean>
  ): boolean {
    return Object.keys(ruleSet).every((key) =>
      ruleSet[key as keyof T](obj[key])
    );
  },

  /**
   * Deep merges two or more objects
   * @param objects - Objects to merge
   * @returns Merged object
   */
  merge<T extends Record<string, unknown>>(...objects: T[]): T {
    return objects.reduce((result, current) => {
      Object.keys(current).forEach((key) => {
        const typedKey = key as keyof T;
        if (
          this.isObject(current[typedKey]) &&
          this.isObject(result[typedKey])
        ) {
          result[typedKey] = this.merge(
            result[typedKey] as Record<string, unknown>,
            current[typedKey] as Record<string, unknown>
          ) as T[keyof T];
        } else {
          result[typedKey] = current[typedKey];
        }
      });
      return result;
    }, {} as T);
  },

  /**
   * Creates a new object with specified keys omitted
   * @param obj - Object to omit keys from
   * @param keys - Keys to omit
   * @returns New object without specified keys
   */
  omit<T extends Record<string, unknown>>(obj: T, keys: string[]): Partial<T> {
    const result: Partial<T> = {};
    Object.keys(obj).forEach((key) => {
      if (!keys.includes(key)) {
        result[key as keyof T] = obj[key as keyof T];
      }
    });
    return result;
  },

  /**
   * Creates a new object with only the specified keys
   * @param obj - Object to pick from
   * @param keys - Keys to pick
   * @returns New object with only specified keys
   */
  pick<T extends Record<string, unknown>>(obj: T, keys: string[]): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([key]) => keys.includes(key))
    ) as Partial<T>;
  },

  /**
   * Removes null, undefined, and optionally empty string values from an object
   * @param obj - Object to clean
   * @param noEmptyStrings - Whether to remove empty strings
   * @returns Cleaned object
   */
  removeNullishValues<T extends Record<string, unknown>>(
    obj: T,
    noEmptyStrings = false
  ): Partial<T> {
    const result = { ...obj };
    Object.keys(result).forEach((key) => {
      if (
        result[key] === null ||
        result[key] === undefined ||
        (noEmptyStrings && result[key] === "")
      ) {
        delete result[key];
      }
    });
    return result;
  },

  /**
   * Replaces empty strings with null in an object
   * @param obj - Object to process
   * @param deep - Whether to process nested objects
   * @returns Processed object
   */
  replaceEmptyStringsWithNull(
    obj: Record<string, unknown>,
    deep = false
  ): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        value === ""
          ? null
          : deep && typeof value === "object" && value !== null
          ? Array.isArray(value)
            ? value.map((item) =>
                typeof item === "object" && item !== null
                  ? this.replaceEmptyStringsWithNull(
                      item as Record<string, unknown>,
                      deep
                    )
                  : item === ""
                  ? null
                  : item
              )
            : this.replaceEmptyStringsWithNull(
                value as Record<string, unknown>,
                deep
              )
          : value,
      ])
    );
  },

  /**
   * Replaces a key in an object
   * @param obj - Object to modify
   * @param oldKey - Key to replace
   * @param newKey - New key name
   * @returns New object with replaced key
   */
  replaceKey<T extends Record<string, unknown>>(
    obj: T,
    oldKey: keyof T,
    newKey: string
  ): Record<string, unknown> {
    const newObj: Record<string, unknown> = {};
    for (const key in obj) {
      if (key === oldKey) {
        newObj[newKey] = obj[oldKey];
      } else {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  },

  /**
   * Replaces null values with empty strings in an object
   * @param obj - Object to process
   * @param fields - Optional array of fields to process
   * @returns Processed object
   */
  replaceNullWithEmptyString(
    obj: Record<string, unknown>,
    fields?: string[]
  ): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        (!fields && value === null) || (fields?.includes(key) && value === null)
          ? ""
          : value,
      ])
    );
  },

  /**
   * Sets a nested property in an object
   * @param obj - Object to modify
   * @param path - Path to property
   * @param value - Value to set
   * @returns New object with set property
   */
  setNestedProp<T extends Record<string, unknown>>(
    obj: T,
    ...path: [...string[], unknown]
  ): T | null {
    if (!obj) {
      return null;
    }

    const value = path.pop();
    const props = path as string[];

    const localSet = (
      objParam: Record<string, unknown>,
      props: string[]
    ): Record<string, unknown> => {
      const first = props.shift()!;
      const newObj = { ...objParam };

      if (props.length === 0) {
        newObj[first] = value;
      } else {
        newObj[first] = localSet(
          (newObj[first] as Record<string, unknown>) || {},
          props
        );
      }

      return newObj;
    };

    return localSet(obj, props) as T;
  },

  /**
   * Sorts an array of objects by a property
   * @param objects - Array of objects to sort
   * @param prop - Property to sort by
   * @param direction - Sort direction
   * @returns Sorted array
   */
  sortByProp<T extends Record<string, unknown>>({
    objects,
    prop,
    direction = "asc",
  }: {
    objects: T[];
    prop: keyof T;
    direction?: "asc" | "desc";
  }): T[] {
    if (!objects) return [];
    return [...objects].sort((a, b) => {
      const aVal = String(a[prop]);
      const bVal = String(b[prop]);
      return direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  },

  /**
   * Converts an object to a Map
   * @param obj - Object to convert
   * @returns Map
   */
  toMap<T>(obj: Record<string, T>): Map<string, T> {
    if (!obj) return new Map();
    return new Map(Object.entries(obj));
  },

  /**
   * Transforms an object's keys and/or values
   * @param obj - Object to transform
   * @param keyTransform - Function to transform keys
   * @param valueTransform - Function to transform values
   * @returns Transformed object
   */
  transform<T extends Record<string, unknown>>(
    obj: T,
    keyTransform?: (key: string) => string,
    valueTransform?: (value: unknown) => unknown
  ): Record<string, unknown> {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const newKey = keyTransform ? keyTransform(key) : key;
      const newValue = valueTransform ? valueTransform(value) : value;
      acc[newKey] = newValue;
      return acc;
    }, {} as Record<string, unknown>);
  },
};
