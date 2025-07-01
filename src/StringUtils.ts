/**
 * @module StringUtils
 * @description A comprehensive collection of utility functions for string manipulation, formatting, and validation.
 * @example
 * ```typescript
 * import { StringUtils } from 'houser-js-utils';
 *
 * // Convert camelCase to sentence
 * const sentence = StringUtils.camelCaseToSentence('myVariableName'); // "My Variable Name"
 *
 * // Capitalize words
 * const title = StringUtils.capitalizeWords('hello world'); // "Hello World"
 *
 * // Format bytes
 * const size = StringUtils.formatBytes(1024); // "1 KB"
 * ```
 */

export const StringUtils = {
  /**
   * Converts a camelCase string to a sentence with proper capitalization.
   * @param str - The camelCase string to convert
   * @returns The converted sentence with proper spacing and capitalization
   * @example
   * ```typescript
   * StringUtils.camelCaseToSentence('myVariableName'); // Returns "My Variable Name"
   * StringUtils.camelCaseToSentence('XMLHttpRequest'); // Returns "XML Http Request"
   * ```
   */
  camelCaseToSentence: (str: string): string => {
    if (!StringUtils.isString(str)) {
      return "";
    }

    const result = str
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Add spaces between camelCased words
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2") // Handle special cases for acronyms
      .replace(/(\d+)([A-Z][a-z]*)/, "$1 $2") // Add space between numbers and following camelCase words
      .replace(/(\d+)/g, " $1") // Add spaces before numbers
      .trim();

    return StringUtils.capitalizeWords(result);
  },

  /**
   * Converts a string to camelCase format.
   * @param str - The string to convert to camelCase
   * @returns The camelCased string
   * @example
   * ```typescript
   * StringUtils.camelize('hello world'); // Returns "helloWorld"
   * StringUtils.camelize('my-variable-name'); // Returns "myVariableName"
   * ```
   */
  camelize: (str: string): string => {
    return str
      .toLowerCase()
      .replace(/^([a-zA-Z0-9]+)|[\s-_]+(\w)/g, (_match, p1, p2) => {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();
      });
  },

  /**
   * Capitalizes the first letter of a string.
   * @param str - The string to capitalize
   * @returns The string with the first letter capitalized
   * @example
   * ```typescript
   * StringUtils.capitalize('hello'); // Returns "Hello"
   * StringUtils.capitalize('WORLD'); // Returns "WORLD"
   * ```
   */
  capitalize: (str: string): string => {
    if (!StringUtils.isString(str)) {
      return "";
    }

    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  /**
   * Capitalizes the first letter of each word in a string.
   * @param str - The string to convert to title case
   * @returns The string with each word capitalized
   * @example
   * ```typescript
   * StringUtils.capitalizeWords('hello world'); // Returns "Hello World"
   * StringUtils.capitalizeWords('the quick brown fox'); // Returns "The Quick Brown Fox"
   * ```
   */
  capitalizeWords: (str: string): string => {
    if (!StringUtils.isString(str)) {
      return "";
    }

    return str
      .toLowerCase()
      .replace(/\s+/g, " ") // Normalize multiple spaces into single spaces
      .split(" ")
      .map((word) => StringUtils.capitalize(word))
      .join(" ");
  },

  /**
   * Checks if a string contains another string (case-insensitive).
   * @param haystack - The string to search in
   * @param needle - The string to search for
   * @returns True if the haystack contains the needle, false otherwise
   * @example
   * ```typescript
   * StringUtils.contains('Hello World', 'world'); // Returns true
   * StringUtils.contains('JavaScript', 'script'); // Returns true
   * StringUtils.contains('TypeScript', 'python'); // Returns false
   * ```
   */
  contains: (haystack: unknown, needle: unknown): boolean => {
    const hayStackStr = StringUtils.toString(haystack);
    const needleStr = StringUtils.toString(needle);

    if (!hayStackStr) return false;
    if (!needleStr) return true;

    return hayStackStr.toLowerCase().includes(needleStr.toLowerCase());
  },

  /**
   * Formats a number of bytes into a human-readable string with appropriate units.
   * @param bytes - The number of bytes to format
   * @param decimals - The number of decimal places to include (default: 0)
   * @returns A formatted string with appropriate byte units
   * @example
   * ```typescript
   * StringUtils.formatBytes(1024); // Returns "1 KB"
   * StringUtils.formatBytes(1536, 1); // Returns "1.5 KB"
   * StringUtils.formatBytes(1048576); // Returns "1 MB"
   * ```
   */
  formatBytes: (bytes: number, decimals = 0): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
  },

  /**
   * Type guard to check if a value is a string.
   * @param value - The value to check
   * @returns True if the value is a string, false otherwise
   * @example
   * ```typescript
   * StringUtils.isString('hello'); // Returns true
   * StringUtils.isString(123); // Returns false
   * StringUtils.isString(null); // Returns false
   * ```
   */
  isString: (value: unknown): value is string => typeof value === "string",

  /**
   * Gets the length of a string safely.
   * @param str - The string to measure
   * @returns The length of the string, or 0 if the string is null/undefined
   * @example
   * ```typescript
   * StringUtils.length('hello'); // Returns 5
   * StringUtils.length(''); // Returns 0
   * StringUtils.length(null); // Returns 0
   * ```
   */
  length: (str: string): number => {
    return str ? str.length : 0;
  },

  /**
   * Truncates a string in the middle with ellipsis if it exceeds the maximum length.
   * @param str - The string to truncate (default: empty string)
   * @param maxLength - The maximum length before truncation (default: 20)
   * @returns The truncated string with ellipsis in the middle
   * @example
   * ```typescript
   * StringUtils.middleEllipsify('verylongfilename.txt', 15); // Returns "veryl...me.txt"
   * StringUtils.middleEllipsify('short.txt', 20); // Returns "short.txt"
   * ```
   */
  middleEllipsify: (str: string = "", maxLength = 20): string => {
    const strParam = StringUtils.toString(str);

    if (strParam.length > maxLength && maxLength > 5) {
      return `${strParam.substr(0, maxLength / 2 - 3)}...${strParam.substr(
        strParam.length - maxLength / 2,
        strParam.length
      )}`;
    }

    return strParam;
  },

  /**
   * Pads a string with a specified character to reach a target length.
   * @param str - The string or number to pad
   * @param length - The target length after padding
   * @param char - The character to use for padding
   * @param right - Whether to pad on the right side (default: false, pads left)
   * @returns The padded string
   * @example
   * ```typescript
   * StringUtils.pad('5', 3, '0'); // Returns "005"
   * StringUtils.pad('hello', 8, '*', true); // Returns "hello***"
   * ```
   */
  pad: (
    str: string | number,
    length: number,
    char: string,
    right = false
  ): string => {
    if ((!str && str !== 0) || !length || !char) return String(str);

    const pad = new Array(length + 1).join(char);
    return right
      ? String(str) + pad.substring(0, pad.length - String(str).length)
      : pad.substring(0, pad.length - String(str).length) + String(str);
  },

  /**
   * Replaces all occurrences of a substring in a string.
   * @param str - The string to modify
   * @param find - The substring to find and replace
   * @param replace - The substring to replace with
   * @returns The modified string with all occurrences replaced
   * @example
   * ```typescript
   * StringUtils.replaceAll('hello world hello', 'hello', 'hi'); // Returns "hi world hi"
   * StringUtils.replaceAll('foo-bar-baz', '-', '_'); // Returns "foo_bar_baz"
   * ```
   */
  replaceAll: (str: string, find: string, replace: string): string => {
    if (!str) return str;
    const re = new RegExp(find, "g");
    return str.replace(re, replace);
  },

  /**
   * Sorts two values as strings with specified direction.
   * @param val1 - The first value to compare
   * @param val2 - The second value to compare
   * @param direction - The sort direction: 'asc' for ascending, 'desc' for descending (default: 'asc')
   * @returns A number indicating the sort order (-1, 0, or 1)
   * @example
   * ```typescript
   * StringUtils.sort('apple', 'banana'); // Returns -1 (apple comes before banana)
   * StringUtils.sort('zebra', 'apple', 'desc'); // Returns -1 (zebra comes before apple in desc order)
   * ```
   */
  sort: (
    val1: unknown,
    val2: unknown,
    direction: "asc" | "desc" = "asc"
  ): number => {
    const [a, b] = direction === "asc" ? [val1, val2] : [val2, val1];
    if (!(a && b)) return 0;
    return StringUtils.toString(a).localeCompare(StringUtils.toString(b));
  },

  /**
   * Sorts two values as strings in ascending order.
   * @param val1 - The first value to compare
   * @param val2 - The second value to compare
   * @returns A number indicating the sort order (-1, 0, or 1)
   * @example
   * ```typescript
   * StringUtils.sortAsc('banana', 'apple'); // Returns 1
   * ```
   */
  sortAsc: (val1: unknown, val2: unknown): number => {
    return StringUtils.sort(val1, val2);
  },

  /**
   * Sorts two values as strings in descending order.
   * @param val1 - The first value to compare
   * @param val2 - The second value to compare
   * @returns A number indicating the sort order (-1, 0, or 1)
   * @example
   * ```typescript
   * StringUtils.sortDesc('apple', 'banana'); // Returns 1
   * ```
   */
  sortDesc: (val1: unknown, val2: unknown): number => {
    return StringUtils.sort(val1, val2, "desc");
  },

  /**
   * Converts a value to lowercase string.
   * @param val - The value to convert to lowercase
   * @returns The lowercase string representation, or empty string if not a string
   * @example
   * ```typescript
   * StringUtils.toLowerCase('HELLO WORLD'); // Returns "hello world"
   * StringUtils.toLowerCase('MixedCase'); // Returns "mixedcase"
   * StringUtils.toLowerCase(123); // Returns ""
   * ```
   */
  toLowerCase: (val: unknown): string => {
    return typeof val === "string" ? val.toLowerCase() : "";
  },

  /**
   * Extracts only numeric characters from a string.
   * @param val - The string to extract numbers from
   * @returns A string containing only the numeric characters
   * @example
   * ```typescript
   * StringUtils.toNumbers('abc123def456'); // Returns "123456"
   * StringUtils.toNumbers('phone: (555) 123-4567'); // Returns "5551234567"
   * StringUtils.toNumbers('no numbers here'); // Returns ""
   * ```
   */
  toNumbers: (val: unknown): string => {
    if (!val || !StringUtils.isString(val)) return "";
    return val.replace(/[^\d]/g, "");
  },

  /**
   * Converts any value to its string representation.
   * @param val - The value to convert to string
   * @returns The string representation of the value
   * @example
   * ```typescript
   * StringUtils.toString(123); // Returns "123"
   * StringUtils.toString(true); // Returns "true"
   * StringUtils.toString(null); // Returns "null"
   * ```
   */
  toString: (val: unknown): string => {
    return String(val);
  },

  /**
   * Truncates a string with ellipsis if it exceeds the maximum length.
   * @param str - The string to truncate
   * @param maxLength - The maximum length before truncation (default: 100)
   * @returns The truncated string with ellipsis appended if needed
   * @example
   * ```typescript
   * StringUtils.truncateWithEllipsis('This is a very long string', 10); // Returns "This is..."
   * StringUtils.truncateWithEllipsis('Short', 10); // Returns "Short"
   * ```
   */
  truncateWithEllipsis: (str: string, maxLength = 100): string => {
    if (!str) {
      return "";
    }

    if (str.length > maxLength) {
      return `${str.substring(0, maxLength - 3)}...`;
    }

    return str;
  },

  /**
   * Converts the first letter of a string to lowercase.
   * @param str - The string to convert
   * @returns The string with the first letter in lowercase
   * @example
   * ```typescript
   * StringUtils.uncapitalize('Hello World'); // Returns "hello World"
   * StringUtils.uncapitalize('UPPERCASE'); // Returns "uPPERCASE"
   * ```
   */
  uncapitalize: (str: string): string => {
    if (!StringUtils.isString(str)) {
      return "";
    }
    return str.charAt(0).toLowerCase() + str.slice(1);
  },
};
