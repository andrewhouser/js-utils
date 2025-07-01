/**
 * @module AGGridUtils
 * @description A collection of utility functions for AG Grid configuration, data manipulation, and grid management.
 * @example
 * ```typescript
 * import { AGGridUtils } from 'houser-js-utils';
 *
 * // Create column definitions
 * const columns = AGGridUtils.createColumnDefs(data);
 *
 * // Export grid data
 * AGGridUtils.exportToCsv(gridApi, 'data.csv');
 *
 * // Apply custom styling
 * AGGridUtils.applyCustomTheme(gridOptions);
 * ```
 */

import { ValueSetterParams } from "@ag-grid-community/core";

/**
 * Collection of utility functions for AG Grid integration
 */
export const AGGridUtils = {
  /**
   * Collection of value parsers for AG Grid
   */
  parsers: {
    /**
     * Parses a string value to a number
     * @param params - Object containing the new value to parse
     * @returns Parsed number or null if invalid
     * @example
     * ```typescript
     * const value = AGGridUtils.parsers.number({ newValue: '123.45' });
     * // Returns: 123.45
     * ```
     */
    number: (params: { newValue: string }): number | null => {
      if (
        typeof params.newValue === "string" &&
        params.newValue.trim() === ""
      ) {
        return null;
      }
      const parsedValue = Number(params.newValue);
      return isNaN(parsedValue) ? null : parsedValue;
    },

    /**
     * Trims a string value
     * @param params - Object containing the new value to trim
     * @returns Trimmed string or null if empty
     * @example
     * ```typescript
     * const value = AGGridUtils.parsers.string({ newValue: '  hello  ' });
     * // Returns: 'hello'
     * ```
     */
    string: (params: { newValue: string }): string | null =>
      String(params.newValue).trim(),
  },

  /**
   * Collection of value setters for AG Grid
   */
  setters: {
    /**
     * Creates a setter that rounds numbers up to the nearest integer
     * @param field - The field name to set the value on
     * @returns A value setter function
     * @example
     * ```typescript
     * const setter = AGGridUtils.setters.numberCeil('price');
     * setter({ data: {}, newValue: 123.45 });
     * // Sets data.price to 124
     * ```
     */
    numberCeil:
      (field: string) =>
      (params: ValueSetterParams): boolean => {
        params.data[field] = Math.ceil(params.newValue);
        return true;
      },

    /**
     * Creates a setter that rounds numbers down to the nearest integer
     * @param field - The field name to set the value on
     * @returns A value setter function
     * @example
     * ```typescript
     * const setter = AGGridUtils.setters.numberFloor('price');
     * setter({ data: {}, newValue: 123.45 });
     * // Sets data.price to 123
     * ```
     */
    numberFloor:
      (field: string) =>
      (params: ValueSetterParams): boolean => {
        params.data[field] = Math.floor(params.newValue);
        return true;
      },

    /**
     * Creates a setter that formats numbers to one decimal place if they're integers
     * @param field - The field name to set the value on
     * @returns A value setter function
     * @example
     * ```typescript
     * const setter = AGGridUtils.setters.numberFloat('price');
     * setter({ data: {}, newValue: 123 });
     * // Sets data.price to '123.0'
     * ```
     */
    numberFloat:
      (field: string) =>
      (params: ValueSetterParams): boolean => {
        const num = Number(params.newValue);
        params.data[field] = Number.isInteger(num) ? num.toFixed(1) : num;
        return true;
      },
  },
};
