import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { DateUtils } from "../DateUtils";
import { vi } from "vitest";

describe("DateUtils", () => {
  let testDate: Date;

  beforeEach(() => {
    // Set a fixed date for consistent testing
    testDate = new Date("2024-01-15T12:00:00.000Z");
    // Mock the current date to be fixed
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-15T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("add", () => {
    it("should add days to date", () => {
      const result = DateUtils.add({ days: 2 }, testDate);
      expect(result.getDate()).toBe(17);
    });

    it("should add multiple time units", () => {
      const result = DateUtils.add(
        { days: 2, hours: 3, minutes: 30 },
        testDate
      );
      expect(result.getDate()).toBe(17);
      expect(result.getUTCHours()).toBe(15); // Use UTC hours
      expect(result.getUTCMinutes()).toBe(30); // Use UTC minutes
    });

    it("should throw error for negative values", () => {
      expect(() => DateUtils.add({ days: -1 }, testDate)).toThrow();
    });
  });

  describe("calculateAge", () => {
    it("should calculate age correctly", () => {
      const birthDate = new Date("1990-01-01T00:00:00.000Z");
      const age = DateUtils.calculateAge(birthDate);
      expect(age).toBe(34);
    });

    it("should handle future dates", () => {
      const futureDate = new Date("2025-01-01T00:00:00.000Z");
      const age = DateUtils.calculateAge(futureDate);
      expect(age).toBe(-1);
    });

    it("should return null for null input", () => {
      expect(DateUtils.calculateAge(null)).toBeNull();
    });
  });

  describe("calculateDaysBetween", () => {
    it("should calculate days between dates", () => {
      const date1 = new Date("2024-01-01");
      const date2 = new Date("2024-01-10");
      expect(DateUtils.calculateDaysBetween(date1, date2)).toBe(9);
    });

    it("should handle dates in reverse order", () => {
      const date1 = new Date("2024-01-10");
      const date2 = new Date("2024-01-01");
      expect(DateUtils.calculateDaysBetween(date1, date2)).toBe(9);
    });
  });

  describe("compareDates", () => {
    it("should compare dates in ascending order", () => {
      const date1 = new Date("2024-01-01");
      const date2 = new Date("2024-01-02");
      expect(DateUtils.compareDates(date1, date2, "asc")).toBeLessThan(0);
    });

    it("should compare dates in descending order", () => {
      const date1 = new Date("2024-01-01");
      const date2 = new Date("2024-01-02");
      expect(DateUtils.compareDates(date1, date2, "desc")).toBeGreaterThan(0);
    });
  });

  describe("convertToDate", () => {
    it("should convert string to date", () => {
      const result = DateUtils.convertToDate("2024-01-15");
      expect(result instanceof Date).toBe(true);
      expect(result.getFullYear()).toBe(2024);
    });

    it("should convert timestamp to date", () => {
      const timestamp = testDate.getTime();
      const result = DateUtils.convertToDate(timestamp);
      expect(result instanceof Date).toBe(true);
      expect(result.getTime()).toBe(timestamp);
    });

    it("should throw error for invalid date string", () => {
      expect(() => DateUtils.convertToDate("invalid")).toThrow();
    });
  });

  describe("getAge", () => {
    it("should calculate age correctly", () => {
      const birthDate = new Date("1990-01-01");
      const referenceDate = new Date("2024-01-01");
      expect(DateUtils.getAge(birthDate, referenceDate)).toBe(34);
    });

    it("should handle birthday not yet occurred", () => {
      const birthDate = new Date("1990-12-31");
      const referenceDate = new Date("2024-01-01");
      expect(DateUtils.getAge(birthDate, referenceDate)).toBe(33);
    });
  });

  describe("getDaysInMonth", () => {
    it("should return correct days for regular months", () => {
      expect(DateUtils.getDaysInMonth(2024, 0)).toBe(31); // January
      expect(DateUtils.getDaysInMonth(2024, 3)).toBe(30); // April
    });

    it("should handle leap year February", () => {
      expect(DateUtils.getDaysInMonth(2024, 1)).toBe(29); // February 2024
      expect(DateUtils.getDaysInMonth(2023, 1)).toBe(28); // February 2023
    });
  });

  describe("getFirstDayOfMonth", () => {
    it("should return first day of month", () => {
      const result = DateUtils.getFirstDayOfMonth(testDate);
      expect(result.getDate()).toBe(1);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
    });
  });

  describe("getLastDayOfMonth", () => {
    it("should return last day of month", () => {
      const result = DateUtils.getLastDayOfMonth(testDate);
      expect(result.getDate()).toBe(31);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
    });
  });

  describe("getQuarter", () => {
    it("should return correct quarter", () => {
      expect(DateUtils.getQuarter(new Date("2024-01-15"))).toBe(1);
      expect(DateUtils.getQuarter(new Date("2024-04-15"))).toBe(2);
      expect(DateUtils.getQuarter(new Date("2024-07-15"))).toBe(3);
      expect(DateUtils.getQuarter(new Date("2024-10-15"))).toBe(4);
    });
  });

  describe("isAfter", () => {
    it("should check if date is after another", () => {
      const date1 = new Date("2024-01-02");
      const date2 = new Date("2024-01-01");
      expect(DateUtils.isAfter(date1, date2)).toBe(true);
    });
  });

  describe("isBefore", () => {
    it("should check if date is before another", () => {
      const date1 = new Date("2024-01-01");
      const date2 = new Date("2024-01-02");
      expect(DateUtils.isBefore(date1, date2)).toBe(true);
    });
  });

  describe("isDateInThePast", () => {
    it("should check if date is in the past", () => {
      const pastDate = new Date("2023-01-01T00:00:00.000Z");
      expect(DateUtils.isDateInThePast(pastDate)).toBe(true);
    });

    it("should handle future dates", () => {
      const futureDate = new Date("2025-01-01T00:00:00.000Z");
      expect(DateUtils.isDateInThePast(futureDate)).toBe(false);
    });
  });

  describe("isSameDay", () => {
    it("should check if dates are same day", () => {
      const date1 = new Date("2024-01-15T12:00:00");
      const date2 = new Date("2024-01-15T18:00:00");
      expect(DateUtils.isSameDay(date1, date2)).toBe(true);
    });

    it("should handle different days", () => {
      const date1 = new Date("2024-01-15");
      const date2 = new Date("2024-01-16");
      expect(DateUtils.isSameDay(date1, date2)).toBe(false);
    });
  });

  describe("isWeekend", () => {
    it("should identify weekend days", () => {
      const saturday = new Date("2024-01-13T00:00:00.000Z"); // Saturday
      const sunday = new Date("2024-01-14T00:00:00.000Z"); // Sunday
      expect(DateUtils.isWeekend(saturday)).toBe(true);
      expect(DateUtils.isWeekend(sunday)).toBe(true);
    });

    it("should identify weekdays", () => {
      const monday = new Date("2024-01-15T00:00:00.000Z"); // Monday
      expect(DateUtils.isWeekend(monday)).toBe(false);
    });
  });

  describe("isToday", () => {
    it("should check if date is today", () => {
      const today = new Date();
      expect(DateUtils.isToday(today)).toBe(true);
    });

    it("should handle non-today dates", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(DateUtils.isToday(tomorrow)).toBe(false);
    });
  });

  describe("isTomorrow", () => {
    it("should check if date is tomorrow", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(DateUtils.isTomorrow(tomorrow)).toBe(true);
    });
  });

  describe("isYesterday", () => {
    it("should check if date is yesterday", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(DateUtils.isYesterday(yesterday)).toBe(true);
    });
  });

  describe("normalizeDate", () => {
    it("should normalize date to UTC midnight", () => {
      const result = DateUtils.normalizeDate(testDate);
      expect(result?.getUTCHours()).toBe(0);
      expect(result?.getUTCMinutes()).toBe(0);
      expect(result?.getUTCSeconds()).toBe(0);
    });

    it("should handle MM/YYYY format", () => {
      const result = DateUtils.normalizeDate("01/2024");
      console.log("Result:", result);
      console.log("Result type:", typeof result);
      console.log("Result value:", result?.valueOf());
      console.log("Result UTC year:", result?.getUTCFullYear());
      expect(result).not.toBeNull();
      expect(result?.getUTCFullYear()).toBe(2024);
      expect(result?.getUTCMonth()).toBe(0);
    });

    it("should return null for invalid date", () => {
      expect(DateUtils.normalizeDate("invalid")).toBeNull();
    });
  });

  describe("subtract", () => {
    it("should subtract days from date", () => {
      const result = DateUtils.subtract({ days: 2 }, testDate);
      expect(result.getDate()).toBe(13);
    });

    it("should subtract multiple time units", () => {
      const result = DateUtils.subtract(
        { days: 2, hours: 3, minutes: 30 },
        testDate
      );
      expect(result.getDate()).toBe(13);
      expect(result.getUTCHours()).toBe(8); // Use UTC hours
      expect(result.getUTCMinutes()).toBe(30); // Use UTC minutes
    });

    it("should throw error for negative values", () => {
      expect(() => DateUtils.subtract({ days: -1 }, testDate)).toThrow();
    });
  });

  describe("toLocalISOString", () => {
    it("should convert date to local ISO string", () => {
      const result = DateUtils.toLocalISOString(testDate);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/);
    });
  });
});
