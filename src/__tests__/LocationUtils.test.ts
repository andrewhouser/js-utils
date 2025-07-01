import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { LocationUtils } from "../LocationUtils";

describe("LocationUtils", () => {
  // Mock geolocation API
  const mockGeolocation = {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  };

  beforeEach(() => {
    // Mock navigator.geolocation
    Object.defineProperty(global.navigator, "geolocation", {
      value: mockGeolocation,
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("calculateBearing", () => {
    it("should calculate bearing between two points", () => {
      const bearing = LocationUtils.calculateBearing(
        40.7128,
        -74.006,
        51.5074,
        -0.1278
      );
      expect(bearing).toBeCloseTo(51.21, 2);
    });

    it("should return 0 for same point", () => {
      const bearing = LocationUtils.calculateBearing(
        40.7128,
        -74.006,
        40.7128,
        -74.006
      );
      expect(bearing).toBe(0);
    });

    it("should handle negative coordinates", () => {
      const bearing = LocationUtils.calculateBearing(
        -40.7128,
        -74.006,
        -51.5074,
        -0.1278
      );
      expect(bearing).toBeCloseTo(128.79, 2);
    });
  });

  describe("calculateDestination", () => {
    it("should calculate destination point", () => {
      const destination = LocationUtils.calculateDestination(
        40.7128,
        -74.006,
        100,
        45
      );
      expect(destination.latitude).toBeCloseTo(41.35, 2);
      expect(destination.longitude).toBeCloseTo(-73.159, 3);
    });

    it("should return same point for zero distance", () => {
      const destination = LocationUtils.calculateDestination(
        40.7128,
        -74.006,
        0,
        45
      );
      expect(destination.latitude).toBe(40.7128);
      expect(destination.longitude).toBe(-74.006);
    });
  });

  describe("calculateDistance", () => {
    it("should calculate distance between two points", () => {
      const distance = LocationUtils.calculateDistance(
        40.7128,
        -74.006,
        51.5074,
        -0.1278
      );
      expect(distance).toBeCloseTo(5570.2, 1);
    });

    it("should return 0 for same point", () => {
      const distance = LocationUtils.calculateDistance(
        40.7128,
        -74.006,
        40.7128,
        -74.006
      );
      expect(distance).toBe(0);
    });
  });

  describe("clearWatch", () => {
    it("should clear watch position", () => {
      LocationUtils.clearWatch(123);
      expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(123);
    });

    it("should throw error if geolocation is not supported", () => {
      Object.defineProperty(global.navigator, "geolocation", {
        value: undefined,
      });
      expect(() => LocationUtils.clearWatch(123)).toThrow(
        "Geolocation is not supported"
      );
    });
  });

  describe("formatCoordinate", () => {
    it("should format coordinate in DD format", () => {
      const formatted = LocationUtils.formatCoordinate(40.7128, -74.006, "DD");
      expect(formatted).toBe("40.712800, -74.006000");
    });

    it("should format coordinate in DMS format", () => {
      const formatted = LocationUtils.formatCoordinate(40.7128, -74.006, "DMS");
      expect(formatted).toBe("40° 42' 46.08\" N, 74° 0' 21.60\" W");
    });

    it("should handle negative coordinates in DMS format", () => {
      const formatted = LocationUtils.formatCoordinate(
        -40.7128,
        -74.006,
        "DMS"
      );
      expect(formatted).toBe("40° 42' 46.08\" S, 74° 0' 21.60\" W");
    });
  });

  describe("getCurrentPosition", () => {
    it("should get current position", async () => {
      const mockPosition = {
        coords: {
          latitude: 40.7128,
          longitude: -74.006,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      };

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });

      const position = await LocationUtils.getCurrentPosition();
      expect(position).toEqual(mockPosition);
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
    });

    it("should throw error if geolocation is not supported", async () => {
      Object.defineProperty(global.navigator, "geolocation", {
        value: undefined,
      });
      await expect(LocationUtils.getCurrentPosition()).rejects.toThrow(
        "Geolocation is not supported"
      );
    });
  });

  describe("getBoundsCenter", () => {
    it("should calculate center of bounds", () => {
      const center = LocationUtils.getBoundsCenter({
        north: 41.0,
        south: 40.0,
        east: -73.0,
        west: -74.0,
      });
      expect(center).toEqual({ latitude: 40.5, longitude: -73.5 });
    });
  });

  describe("getBoundsForRadius", () => {
    it("should calculate bounds for radius", () => {
      const bounds = LocationUtils.getBoundsForRadius(40.7128, -74.006, 10);
      expect(bounds.north).toBeCloseTo(40.8027, 4);
      expect(bounds.south).toBeCloseTo(40.6229, 4);
      expect(bounds.east).toBeCloseTo(-73.887, 3);
      expect(bounds.west).toBeCloseTo(-74.125, 3);
    });

    it("should return same bounds for zero radius", () => {
      const bounds = LocationUtils.getBoundsForRadius(40.7128, -74.006, 0);
      expect(bounds.north).toBe(40.7128);
      expect(bounds.south).toBe(40.7128);
      expect(bounds.east).toBe(-74.006);
      expect(bounds.west).toBe(-74.006);
    });
  });

  describe("isWithinBounds", () => {
    it("should return true for point within bounds", () => {
      const isInside = LocationUtils.isWithinBounds(40.7128, -74.006, {
        north: 41.0,
        south: 40.0,
        east: -73.0,
        west: -75.0,
      });
      expect(isInside).toBe(true);
    });

    it("should return false for point outside bounds", () => {
      const isInside = LocationUtils.isWithinBounds(42.0, -72.0, {
        north: 41.0,
        south: 40.0,
        east: -73.0,
        west: -75.0,
      });
      expect(isInside).toBe(false);
    });
  });

  describe("parseCoordinate", () => {
    it("should parse coordinate string", () => {
      const coord = LocationUtils.parseCoordinate("40.7128, -74.0060");
      expect(coord).toEqual({ latitude: 40.7128, longitude: -74.006 });
    });

    it("should throw error for invalid format", () => {
      expect(() => LocationUtils.parseCoordinate("invalid")).toThrow(
        "Invalid coordinate format"
      );
    });

    it("should throw error for invalid values", () => {
      expect(() => LocationUtils.parseCoordinate("abc, def")).toThrow(
        "Invalid coordinate values"
      );
    });
  });

  describe("toDeg and toRad", () => {
    it("should convert between degrees and radians", () => {
      expect(LocationUtils.toDeg(Math.PI)).toBe(180);
      expect(LocationUtils.toRad(180)).toBe(Math.PI);
    });

    it("should handle zero", () => {
      expect(LocationUtils.toDeg(0)).toBe(0);
      expect(LocationUtils.toRad(0)).toBe(0);
    });
  });

  describe("watchPosition", () => {
    it("should watch position", () => {
      const callback = vi.fn();
      mockGeolocation.watchPosition.mockReturnValue(123);

      const watchId = LocationUtils.watchPosition(callback);
      expect(watchId).toBe(123);
      expect(mockGeolocation.watchPosition).toHaveBeenCalledWith(
        callback,
        undefined,
        expect.any(Object)
      );
    });

    it("should throw error if geolocation is not supported", () => {
      Object.defineProperty(global.navigator, "geolocation", {
        value: undefined,
      });
      expect(() => LocationUtils.watchPosition(vi.fn())).toThrow(
        "Geolocation is not supported"
      );
    });
  });
});
