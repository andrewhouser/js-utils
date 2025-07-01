import { describe, it, expect, vi, beforeEach } from "vitest";
import { TimeZoneUtils } from "../TimeZoneUtils";

describe("TimeZoneUtils", () => {
  // Mock Intl.DateTimeFormat
  const mockDateTimeFormat = {
    resolvedOptions: vi.fn(),
    formatToParts: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock Intl.DateTimeFormat constructor
    global.Intl = {
      DateTimeFormat: vi.fn().mockImplementation(() => mockDateTimeFormat),
    } as any;
  });

  describe("getTimeZoneDetails", () => {
    it("should return time zone details for a valid time zone", () => {
      mockDateTimeFormat.resolvedOptions.mockReturnValue({
        timeZone: "America/New_York",
      });
      mockDateTimeFormat.formatToParts.mockReturnValue([
        { type: "timeZoneName", value: "EDT" },
      ]);

      const result = TimeZoneUtils.getTimeZoneDetails("America/New_York");
      expect(result).toEqual({
        name: "America/New_York",
        shortName: "EDT",
      });
    });

    it("should handle missing time zone name in format parts", () => {
      mockDateTimeFormat.resolvedOptions.mockReturnValue({
        timeZone: "America/New_York",
      });
      mockDateTimeFormat.formatToParts.mockReturnValue([]);

      const result = TimeZoneUtils.getTimeZoneDetails("America/New_York");
      expect(result).toEqual({
        name: "America/New_York",
        shortName: "",
      });
    });
  });

  describe("getTimeZones", () => {
    it("should return all time zones when no filters provided", () => {
      const result = TimeZoneUtils.getTimeZones();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("name");
      expect(result[0]).toHaveProperty("shortName");
    });

    it("should filter time zones based on provided filters", () => {
      // Mock time zone details for both time zones
      mockDateTimeFormat.resolvedOptions
        .mockReturnValueOnce({ timeZone: "America/New_York" })
        .mockReturnValueOnce({ timeZone: "Europe/London" });
      mockDateTimeFormat.formatToParts
        .mockReturnValueOnce([{ type: "timeZoneName", value: "EDT" }])
        .mockReturnValueOnce([{ type: "timeZoneName", value: "GMT" }]);

      const filters = ["America/New_York", "Europe/London"];
      const result = TimeZoneUtils.getTimeZones(filters, false);
      expect(result.length).toBe(2);
      expect(result.map((tz) => tz.name)).toEqual(
        expect.arrayContaining(filters)
      );
    });

    it("should handle invalid time zone filters", () => {
      mockDateTimeFormat.resolvedOptions.mockReturnValue({
        timeZone: "America/New_York",
      });
      mockDateTimeFormat.formatToParts.mockReturnValue([
        { type: "timeZoneName", value: "EDT" },
      ]);

      const filters = ["Invalid/TimeZone", "America/New_York"];
      const result = TimeZoneUtils.getTimeZones(filters);
      expect(result.length).toBe(1);
      expect(result[0].name).toBe("America/New_York");
    });
  });

  describe("getTimeZonesOptions", () => {
    it("should return HTML option elements for time zones", () => {
      // Robust mock: return correct values based on the input timeZone
      let resolvedOptionsCallCount = 0;
      let formatToPartsCallCount = 0;
      mockDateTimeFormat.resolvedOptions.mockImplementation(() => {
        const call = resolvedOptionsCallCount++;
        return call % 2 === 0
          ? { timeZone: "America/New_York" }
          : { timeZone: "Europe/London" };
      });
      mockDateTimeFormat.formatToParts.mockImplementation(() => {
        const call = formatToPartsCallCount++;
        return call % 2 === 0
          ? [{ type: "timeZoneName", value: "EDT" }]
          : [{ type: "timeZoneName", value: "GMT" }];
      });

      const filters = ["America/New_York", "Europe/London"];
      const result = TimeZoneUtils.getTimeZonesOptions(...filters);
      expect(result.length).toBe(2);
      // Check that both options are present, regardless of order
      expect(result).toEqual(
        expect.arrayContaining([
          expect.stringContaining('<option value="America/New_York"'),
          expect.stringContaining('<option value="Europe/London"'),
        ])
      );
    });
  });

  describe("getUsersTimeZone", () => {
    it("should return user time zone details", () => {
      mockDateTimeFormat.resolvedOptions.mockReturnValue({
        timeZone: "America/New_York",
      });
      mockDateTimeFormat.formatToParts.mockReturnValue([
        { type: "timeZoneName", value: "EDT" },
      ]);

      const result = TimeZoneUtils.getUsersTimeZone();
      expect(result).toEqual({
        name: "America/New_York",
        shortName: "EDT",
      });
    });
  });

  describe("getUsersTimeZoneName", () => {
    it("should return user time zone name", () => {
      mockDateTimeFormat.resolvedOptions.mockReturnValue({
        timeZone: "America/New_York",
      });
      const result = TimeZoneUtils.getUsersTimeZoneName();
      expect(result).toBe("America/New_York");
    });
  });

  describe("isValidTimeZone", () => {
    it("should return true for valid time zone", () => {
      expect(TimeZoneUtils.isValidTimeZone("America/New_York")).toBe(true);
    });

    it("should return false for invalid time zone", () => {
      expect(TimeZoneUtils.isValidTimeZone("Invalid/TimeZone")).toBe(false);
    });
  });
});
