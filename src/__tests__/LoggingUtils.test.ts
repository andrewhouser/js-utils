import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { LoggingUtils } from "../LoggingUtils";

describe("LoggingUtils", () => {
  // Mock console methods
  const consoleMock = {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    group: vi.fn(),
    groupCollapsed: vi.fn(),
    groupEnd: vi.fn(),
  };

  // Mock performance API
  const performanceMock = {
    now: vi.fn(),
    memory: {
      totalJSHeapSize: 1000000,
      usedJSHeapSize: 500000,
      jsHeapSizeLimit: 2000000,
    },
  };

  beforeEach(() => {
    // Replace console methods with mocks
    Object.assign(console, consoleMock);
    // Replace performance API with mock
    Object.assign(global, { performance: performanceMock });
    // Reset all mocks
    vi.clearAllMocks();
    // Clear log entries
    LoggingUtils.clearLogEntries();
  });

  afterEach(() => {
    // Restore console methods
    vi.restoreAllMocks();
  });

  describe("log", () => {
    it("should log a message with default options", () => {
      LoggingUtils.log("Test message");
      expect(console.info).toHaveBeenCalledWith("Test message", "");
    });

    it("should log a message with custom options", () => {
      LoggingUtils.log("Test message", {
        level: "error",
        prefix: "Test",
        data: { test: true },
      });
      expect(console.error).toHaveBeenCalledWith("[Test] Test message", {
        test: true,
      });
    });

    it("should include stack trace for error logs", () => {
      LoggingUtils.log("Test error", { level: "error", stackTrace: true });
      expect(console.error).toHaveBeenCalledTimes(2); // Message and stack trace
    });

    it("should group logs when requested", () => {
      LoggingUtils.log("Grouped message", { group: true });
      expect(console.group).toHaveBeenCalledWith("Grouped message");
      expect(console.groupEnd).toHaveBeenCalled();
    });

    it("should use collapsed groups when specified", () => {
      LoggingUtils.log("Collapsed message", {
        group: true,
        groupCollapsed: true,
      });
      expect(console.groupCollapsed).toHaveBeenCalledWith("Collapsed message");
      expect(console.groupEnd).toHaveBeenCalled();
    });
  });

  describe("log level methods", () => {
    it("should log debug messages", () => {
      LoggingUtils.debug("Debug message");
      expect(console.debug).toHaveBeenCalledWith("Debug message", "");
    });

    it("should log info messages", () => {
      LoggingUtils.info("Info message");
      expect(console.info).toHaveBeenCalledWith("Info message", "");
    });

    it("should log warning messages", () => {
      LoggingUtils.warn("Warning message");
      expect(console.warn).toHaveBeenCalledWith("Warning message", "");
    });

    it("should log error messages with stack trace", () => {
      LoggingUtils.error("Error message");
      expect(console.error).toHaveBeenCalledWith("Error message", "");
      expect(console.error).toHaveBeenCalledTimes(2); // Message and stack trace
    });
  });

  describe("log entries management", () => {
    it("should store log entries", () => {
      LoggingUtils.log("Test message");
      expect(LoggingUtils.getLogEntries()).toHaveLength(1);
    });

    it("should limit number of stored entries", () => {
      const maxEntries = LoggingUtils.maxLogEntries;
      for (let i = 0; i < maxEntries + 10; i++) {
        LoggingUtils.log(`Message ${i}`);
      }
      expect(LoggingUtils.getLogEntries()).toHaveLength(maxEntries);
    });

    it("should filter entries by level", () => {
      LoggingUtils.debug("Debug message");
      LoggingUtils.info("Info message");
      LoggingUtils.warn("Warning message");
      LoggingUtils.error("Error message");

      expect(LoggingUtils.getLogEntriesByLevel("debug")).toHaveLength(1);
      expect(LoggingUtils.getLogEntriesByLevel("info")).toHaveLength(1);
      expect(LoggingUtils.getLogEntriesByLevel("warn")).toHaveLength(1);
      expect(LoggingUtils.getLogEntriesByLevel("error")).toHaveLength(1);
    });

    it("should filter entries by time range", () => {
      const startTime = new Date("2024-01-01T00:00:00.000Z");
      const endTime = new Date("2024-01-02T00:00:00.000Z");

      // Mock Date to return fixed timestamps
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2024-01-01T12:00:00.000Z"));
      LoggingUtils.log("Message 1");
      vi.setSystemTime(new Date("2024-01-02T12:00:00.000Z"));
      LoggingUtils.log("Message 2");
      vi.useRealTimers();

      const entries = LoggingUtils.getLogEntriesByTimeRange(startTime, endTime);
      expect(entries).toHaveLength(1);
      expect(entries[0].message).toBe("Message 1");
    });

    it("should clear log entries", () => {
      LoggingUtils.log("Test message");
      LoggingUtils.clearLogEntries();
      expect(LoggingUtils.getLogEntries()).toHaveLength(0);
    });
  });

  describe("export/import", () => {
    it("should export log entries as JSON", () => {
      LoggingUtils.log("Test message");
      const json = LoggingUtils.exportLogEntries();
      const parsed = JSON.parse(json);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].message).toBe("Test message");
    });

    it("should import log entries from JSON", () => {
      const json = JSON.stringify([
        {
          timestamp: "2024-01-01T00:00:00.000Z",
          level: "info",
          message: "Imported message",
        },
      ]);
      LoggingUtils.importLogEntries(json);
      expect(LoggingUtils.getLogEntries()).toHaveLength(1);
      expect(LoggingUtils.getLogEntries()[0].message).toBe("Imported message");
    });

    it("should handle invalid JSON in import", () => {
      LoggingUtils.importLogEntries("invalid json");
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("formatBytes", () => {
    it("should format bytes correctly", () => {
      expect(LoggingUtils.formatBytes(0)).toBe("0.00 B");
      expect(LoggingUtils.formatBytes(1024)).toBe("1.00 KB");
      expect(LoggingUtils.formatBytes(1024 * 1024)).toBe("1.00 MB");
      expect(LoggingUtils.formatBytes(1024 * 1024 * 1024)).toBe("1.00 GB");
    });

    it("should handle large numbers", () => {
      expect(LoggingUtils.formatBytes(1024 * 1024 * 1024 * 1024)).toBe(
        "1.00 TB"
      );
    });
  });

  describe("performance measurement", () => {
    it("should measure performance", () => {
      performanceMock.now.mockReturnValueOnce(0).mockReturnValueOnce(100);
      const endMeasurement = LoggingUtils.measurePerformance("Test");
      endMeasurement();
      expect(console.debug).toHaveBeenCalledWith("Performance: Test", {
        duration: "100.00ms",
      });
    });

    it("should measure async performance", async () => {
      performanceMock.now.mockReturnValueOnce(0).mockReturnValueOnce(100);
      const result = await LoggingUtils.measureAsyncPerformance(
        "Test",
        async () => {
          return "success";
        }
      );
      expect(result).toBe("success");
      expect(console.debug).toHaveBeenCalledWith("Performance: Test", {
        duration: "100.00ms",
      });
    });

    it("should handle async performance errors", async () => {
      performanceMock.now.mockReturnValueOnce(0).mockReturnValueOnce(100);
      const error = new Error("Test error");
      await expect(
        LoggingUtils.measureAsyncPerformance("Test", async () => {
          throw error;
        })
      ).rejects.toThrow("Test error");
      expect(console.error).toHaveBeenCalledWith("Performance: Test", {
        duration: "100.00ms",
        error,
      });
    });
  });

  describe("memory measurement", () => {
    it("should log memory usage", () => {
      LoggingUtils.measureMemory("Test");
      expect(console.debug).toHaveBeenCalledWith("Memory: Test", {
        used: "488.28 KB",
        total: "976.56 KB",
        limit: "1.91 MB",
      });
    });

    it("should handle missing memory API", () => {
      // @ts-ignore - Testing missing memory API
      delete performance.memory;
      LoggingUtils.measureMemory("Test");
      expect(console.debug).not.toHaveBeenCalled();
    });
  });
});
