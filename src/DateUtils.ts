/**
 * @module DateUtils
 * @description Utility functions for date manipulation and calculations.
 *
 * This module provides a comprehensive set of functions for working with dates,
 * including date arithmetic, comparisons, formatting, and validation.
 *
 * @example
 * ```typescript
 * import { DateUtils } from 'houser-js-utils';
 *
 * // Add 2 days to current date
 * const tomorrow = DateUtils.add({ days: 2 });
 *
 * // Calculate age
 * const age = DateUtils.calculateAge(new Date('1990-01-01'));
 *
 * // Check if date is weekend
 * const isWeekend = DateUtils.isWeekend(new Date());
 * ```
 */

export type DateArg = Date | number | string;

/**
 * Supported time units for date calculations
 */
export type TimeUnit =
  | "years"
  | "months"
  | "weeks"
  | "days"
  | "hours"
  | "minutes"
  | "seconds";

/**
 * Object type for specifying time units and their values
 */
export type TimeUnitArgs = {
  [K in TimeUnit]?: number;
};

// Constants for time calculations
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

export const DateUtils = {
  /**
   * Adds specified time units to a date.
   * @param args - Object containing time units to add
   * @param date - Date to add to (defaults to current date)
   * @returns New date with added time units
   * @throws {Error} If any time unit is negative
   * @example
   * ```typescript
   * DateUtils.add({ days: 7, hours: 2 }); // Add 7 days and 2 hours to now
   * DateUtils.add({ months: 1 }, new Date('2023-01-15')); // Add 1 month to specific date
   * ```
   */
  add(args: TimeUnitArgs, date: DateArg = new Date()): Date {
    this.validateTimeUnits(args);
    const dt = this.convertToDate(date);
    return this.adjustDate(args, dt, 1);
  },

  /**
   * Internal helper for modifying a date by adding or subtracting time units
   * @param args - Object containing time units
   * @param date - Date to modify
   * @param direction - 1 for addition, -1 for subtraction
   * @returns New date with modified time units
   */
  adjustDate(args: TimeUnitArgs, date: DateArg, direction: 1 | -1): Date {
    const result = new Date(date.valueOf());

    if (args.years)
      result.setFullYear(result.getFullYear() + args.years * direction);
    if (args.months)
      result.setMonth(result.getMonth() + args.months * direction);
    if (args.weeks)
      result.setDate(result.getDate() + args.weeks * 7 * direction);
    if (args.days) result.setDate(result.getDate() + args.days * direction);
    if (args.hours) result.setHours(result.getHours() + args.hours * direction);
    if (args.minutes)
      result.setMinutes(result.getMinutes() + args.minutes * direction);
    if (args.seconds)
      result.setSeconds(result.getSeconds() + args.seconds * direction);

    return result;
  },

  /**
   * Calculates age based on birth date
   * @param date - Birth date to calculate age from
   * @returns Age in years or null if date is invalid
   */
  calculateAge(date: Date | string | null): number | null {
    if (!date) {
      return null;
    }
    const now = new Date();
    const dateOfBirth = date instanceof Date ? date : new Date(date);

    let yearDif = now.getFullYear() - dateOfBirth.getFullYear();
    const monthDif = now.getMonth() - dateOfBirth.getMonth();
    const dateDif = now.getDate() - dateOfBirth.getDate();

    if (monthDif < 0 || (monthDif === 0 && dateDif < 0)) {
      yearDif--;
    }

    return yearDif;
  },

  /**
   * Calculates the number of days between two dates
   * @param first - First date
   * @param second - Second date
   * @returns Number of days between dates
   */
  calculateDaysBetween(first: DateArg, second: DateArg): number {
    const a = this.convertToDate(first);
    const b = this.convertToDate(second);

    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.abs(Math.floor((utc2 - utc1) / MS_PER_DAY));
  },

  /**
   * Compares two dates and returns the result based on order parameter
   * @param a - First date to compare
   * @param b - Second date to compare
   * @param order - Sort order ('asc' or 'desc')
   * @returns Comparison result (-1, 0, or 1)
   */
  compareDates(a: DateArg, b: DateArg, order: "asc" | "desc" = "asc"): number {
    const dateA = this.normalizeDate(a);
    const dateB = this.normalizeDate(b);

    if (!dateA && !dateB) return 0;
    if (!dateA) return order === "asc" ? 1 : -1;
    if (!dateB) return order === "asc" ? -1 : 1;

    const diff = dateA.getTime() - dateB.getTime();
    return order === "asc" ? diff : -diff;
  },

  /**
   * Converts various date formats to a Date object
   * @param dateStr - Date to convert (Date, number, or string)
   * @returns Date object
   * @throws Error if date string is invalid
   */
  convertToDate(dateStr: DateArg): Date {
    if (dateStr instanceof Date) {
      return new Date(dateStr.valueOf());
    }

    if (typeof dateStr === "number") {
      if (dateStr.toString().length === 10) {
        return new Date(dateStr * MS_PER_SECOND);
      }
      return new Date(dateStr);
    }

    if (typeof dateStr === "string") {
      const parsed = new Date(dateStr);
      if (isNaN(parsed.getTime())) {
        throw new Error(`Invalid date string: ${dateStr}`);
      }
      return parsed;
    }

    throw new Error("Invalid date argument");
  },

  /**
   * Copies time from one date to another
   * @param fromDate - Source date to copy time from
   * @param toDate - Target date to copy time to
   * @returns New date with copied time
   */
  copyTimeToDate(fromDate: DateArg, toDate: DateArg): Date {
    const from = this.convertToDate(fromDate);
    const to = this.convertToDate(toDate);

    to.setHours(
      from.getHours(),
      from.getMinutes(),
      from.getSeconds(),
      from.getMilliseconds()
    );
    return to;
  },

  /**
   * Returns the age in years between two dates
   * @param birthDate - Birth date
   * @param referenceDate - Reference date (defaults to current date)
   * @returns Age in years
   */
  getAge(birthDate: DateArg, referenceDate: DateArg = new Date()): number {
    const birth = this.convertToDate(birthDate);
    const reference = this.convertToDate(referenceDate);

    let age = reference.getFullYear() - birth.getFullYear();
    const monthDiff = reference.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && reference.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  },

  /**
   * Returns the number of days in a given month
   * @param year - Year to check
   * @param month - Month to check (0-11)
   * @returns Number of days in the month
   */
  getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  },

  /**
   * Returns the number of days between two dates, inclusive
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Number of days between dates, inclusive
   */
  getDaysBetweenInclusive(startDate: DateArg, endDate: DateArg): number {
    return this.calculateDaysBetween(startDate, endDate) + 1;
  },

  /**
   * Returns the first day of the month
   * @param date - Date to get first day of month for (defaults to current date)
   * @returns Date set to first day of month
   */
  getFirstDayOfMonth(date: DateArg = new Date()): Date {
    const newDate = this.convertToDate(date);
    newDate.setDate(1);
    return this.getStartOfDay(newDate);
  },

  /**
   * Returns the first day of the quarter
   * @param date - Date to get first day of quarter for (defaults to current date)
   * @returns Date set to first day of quarter
   */
  getFirstDayOfQuarter(date: DateArg = new Date()): Date {
    const newDate = this.convertToDate(date);
    const quarter = this.getQuarter(newDate);
    newDate.setMonth((quarter - 1) * 3, 1);
    return this.getStartOfDay(newDate);
  },

  /**
   * Returns the first day of the week (Sunday)
   * @param date - Date to get first day of week for (defaults to current date)
   * @returns Date set to first day of week
   */
  getFirstDayOfWeek(date: DateArg = new Date()): Date {
    const newDate = this.convertToDate(date);
    const day = newDate.getDay();
    newDate.setDate(newDate.getDate() - day);
    return this.getStartOfDay(newDate);
  },

  /**
   * Returns the first day of the year
   * @param date - Date to get first day of year for (defaults to current date)
   * @returns Date set to first day of year
   */
  getFirstDayOfYear(date: DateArg = new Date()): Date {
    const newDate = this.convertToDate(date);
    newDate.setMonth(0, 1);
    return this.getStartOfDay(newDate);
  },

  /**
   * Returns the end of the day (23:59:59.999)
   * @param date - Date to get end of day for (defaults to current date)
   * @returns Date set to end of day
   */
  getEndOfDay(date?: DateArg): Date {
    const newDate = this.convertToDate(date || new Date());
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  },

  /**
   * Returns the last day of the month
   * @param date - Date to get last day of month for (defaults to current date)
   * @returns Date set to last day of month
   */
  getLastDayOfMonth(date: DateArg = new Date()): Date {
    const newDate = this.convertToDate(date);
    newDate.setMonth(newDate.getMonth() + 1);
    newDate.setDate(0);
    return this.getEndOfDay(newDate);
  },

  /**
   * Returns the last day of the quarter
   * @param date - Date to get last day of quarter for (defaults to current date)
   * @returns Date set to last day of quarter
   */
  getLastDayOfQuarter(date: DateArg = new Date()): Date {
    const newDate = this.convertToDate(date);
    const quarter = this.getQuarter(newDate);
    newDate.setMonth(quarter * 3, 0);
    return this.getEndOfDay(newDate);
  },

  /**
   * Returns the last day of the week (Saturday)
   * @param date - Date to get last day of week for (defaults to current date)
   * @returns Date set to last day of week
   */
  getLastDayOfWeek(date: DateArg = new Date()): Date {
    const newDate = this.convertToDate(date);
    const day = newDate.getDay();
    newDate.setDate(newDate.getDate() + (6 - day));
    return this.getEndOfDay(newDate);
  },

  /**
   * Returns the last day of the year
   * @param date - Date to get last day of year for (defaults to current date)
   * @returns Date set to last day of year
   */
  getLastDayOfYear(date: DateArg = new Date()): Date {
    const newDate = this.convertToDate(date);
    newDate.setMonth(11, 31);
    return this.getEndOfDay(newDate);
  },

  /**
   * Returns the quarter (1-4) of the year
   * @param date - Date to get quarter for (defaults to current date)
   * @returns Quarter number
   */
  getQuarter(date: DateArg = new Date()): number {
    const month = this.convertToDate(date).getMonth();
    return Math.floor(month / 3) + 1;
  },

  /**
   * Returns the start of the day (00:00:00.000)
   * @param date - Date to get start of day for (defaults to current date)
   * @returns Date set to start of day
   */
  getStartOfDay(date?: DateArg): Date {
    const newDate = this.convertToDate(date || new Date());
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  },

  /**
   * Returns the week number of the year (1-53)
   * @param date - Date to get week number for (defaults to current date)
   * @returns Week number
   */
  getWeekNumber(date: DateArg = new Date()): number {
    const newDate = this.convertToDate(date);
    const firstDayOfYear = new Date(newDate.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (newDate.getTime() - firstDayOfYear.getTime()) / MS_PER_DAY;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  },

  /**
   * Checks if a date is after another date
   * @param date1 - First date to compare
   * @param date2 - Second date to compare
   * @returns True if date1 is after date2
   */
  isAfter(date1: DateArg, date2: DateArg): boolean {
    return (
      this.convertToDate(date1).valueOf() > this.convertToDate(date2).valueOf()
    );
  },

  /**
   * Checks if a date is before another date
   * @param date1 - First date to compare
   * @param date2 - Second date to compare
   * @returns True if date1 is before date2
   */
  isBefore(date1: DateArg, date2: DateArg): boolean {
    return (
      this.convertToDate(date1).valueOf() < this.convertToDate(date2).valueOf()
    );
  },

  /**
   * Checks if a date is in the past
   * @param date - Date to check
   * @returns True if date is in the past
   */
  isDateInThePast(date: DateArg): boolean {
    const dateObj = this.convertToDate(date);
    return dateObj <= new Date();
  },

  /**
   * Checks if two dates are the same day
   * @param date1 - First date to compare
   * @param date2 - Second date to compare
   * @returns True if dates are the same day
   */
  isSameDay(date1: DateArg, date2: DateArg): boolean {
    const date1Obj = this.convertToDate(date1);
    const date2Obj = this.convertToDate(date2);
    return (
      date1Obj.getDate() === date2Obj.getDate() &&
      date1Obj.getMonth() === date2Obj.getMonth() &&
      date1Obj.getFullYear() === date2Obj.getFullYear()
    );
  },

  /**
   * Checks if two dates have the same time
   * @param date1 - First date to compare
   * @param date2 - Second date to compare
   * @returns True if dates have the same time
   */
  isSameTime(date1: DateArg, date2: DateArg): boolean {
    return (
      this.convertToDate(date1).valueOf() ===
      this.convertToDate(date2).valueOf()
    );
  },

  /**
   * Checks if a date is today
   * @param date - Date to check
   * @returns True if date is today
   */
  isToday(date: DateArg): boolean {
    const convertedDate = this.convertToDate(date);
    return (
      !convertedDate ||
      convertedDate.toLocaleDateString() === new Date().toLocaleDateString()
    );
  },

  /**
   * Checks if a date is tomorrow
   * @param date - Date to check
   * @returns True if date is tomorrow
   */
  isTomorrow(date: DateArg): boolean {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.isSameDay(date, tomorrow);
  },

  /**
   * Checks if a date is valid
   * @param date - Date to check
   * @returns True if date is valid
   */
  isValidDate(date: DateArg): boolean {
    try {
      return !Number.isNaN(this.convertToDate(date).getTime());
    } catch {
      return false;
    }
  },

  /**
   * Checks if a date falls on a weekday
   * @param date - Date to check
   * @returns True if the date is a weekday
   */
  isWeekday(date: DateArg): boolean {
    return !this.isWeekend(date);
  },

  /**
   * Checks if a date falls on a weekend
   * @param date - Date to check
   * @returns True if the date is a weekend
   */
  isWeekend(date: DateArg): boolean {
    const day = this.convertToDate(date).getUTCDay();
    return day === 0 || day === 6;
  },

  /**
   * Checks if a date is yesterday
   * @param date - Date to check
   * @returns True if date is yesterday
   */
  isYesterday(date: DateArg): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return this.isSameDay(date, yesterday);
  },

  /**
   * Normalizes a date to UTC midnight
   * @param date - Date to normalize
   * @returns Normalized date or null if invalid
   */
  normalizeDate(date: DateArg): Date | null {
    if (!date) return null;

    try {
      // Handle MM/YYYY format first
      if (typeof date === "string") {
        const parts = date.split("/");
        if (
          parts.length === 2 &&
          parts[0].length === 2 &&
          parts[1].length === 4
        ) {
          const month = parseInt(parts[0], 10);
          const year = parseInt(parts[1], 10);
          if (!isNaN(month) && !isNaN(year) && month >= 1 && month <= 12) {
            return new Date(Date.UTC(year, month - 1, 1));
          }
        }
      }

      // Handle other date formats
      const parsedDate = this.convertToDate(date);
      if (!isNaN(parsedDate.valueOf())) {
        return new Date(
          Date.UTC(
            parsedDate.getUTCFullYear(),
            parsedDate.getUTCMonth(),
            parsedDate.getUTCDate()
          )
        );
      }
    } catch {
      // Invalid date, return null
    }

    return null;
  },

  /**
   * Subtracts specified time units from a date
   * @param args - Object containing time units to subtract
   * @param date - Date to subtract from (defaults to current date)
   * @returns New date with subtracted time units
   * @throws Error if any time unit is negative
   */
  subtract(args: TimeUnitArgs, date: DateArg = new Date()): Date {
    this.validateTimeUnits(args);
    const dt = this.convertToDate(date);
    return this.adjustDate(args, dt, -1);
  },

  /**
   * Converts a date to a local ISO string
   * @param date - Date to convert
   * @returns Local ISO string representation
   */
  toLocalISOString(date: Date): string {
    const pad = (num: number): string => String(num).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}.${String(date.getMilliseconds()).padStart(3, "0")}`;
  },

  /**
   * Validates time unit arguments
   * @param args - Time unit arguments to validate
   * @throws Error if any time unit is negative
   */
  validateTimeUnits(args: TimeUnitArgs): void {
    for (const [unit, value] of Object.entries(args)) {
      if (value !== undefined && value < 0) {
        throw new Error(
          `Negative values are not allowed for time unit: ${unit}`
        );
      }
    }
  },
};
