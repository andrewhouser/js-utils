/**
 * @module LoggingUtils
 * @description A comprehensive collection of utility functions for logging, performance monitoring, and debugging.
 * Provides methods for logging messages with different severity levels (debug, info, warn, error),
 * managing log entries with storage, filtering, and export/import capabilities,
 * measuring performance and memory usage, and formatting console output with grouping.
 * @example
 * ```typescript
 * import { LoggingUtils } from 'houser-js-utils';
 *
 * // Basic logging with different levels
 * LoggingUtils.debug("Processing started", { prefix: "DataService" });
 * LoggingUtils.info("User logged in", { data: { userId: "123" } });
 * LoggingUtils.warn("High memory usage", { data: { usage: "85%" } });
 * LoggingUtils.error("API call failed", { data: error, stackTrace: true });
 *
 * // Performance measurement
 * const endMeasurement = LoggingUtils.measurePerformance("Data processing");
 * // ... do some work ...
 * endMeasurement();
 *
 * // Memory usage tracking
 * LoggingUtils.measureMemory("After data load");
 * ```
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogOptions {
  level?: LogLevel;
  timestamp?: boolean;
  prefix?: string;
  group?: boolean;
  groupCollapsed?: boolean;
  stackTrace?: boolean;
  data?: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
  stack?: string;
}

interface PerformanceMemory {
  totalJSHeapSize: number;
  usedJSHeapSize: number;
  jsHeapSizeLimit: number;
}

declare global {
  interface Performance {
    memory?: PerformanceMemory;
  }
}

export const LoggingUtils = {
  /**
   * Default configuration options for logging.
   * @default
   * ```typescript
   * {
   *   level: "info",
   *   timestamp: true,
   *   prefix: "",
   *   group: false,
   *   groupCollapsed: false,
   *   stackTrace: false
   * }
   * ```
   */
  defaultOptions: {
    level: "info" as LogLevel,
    timestamp: true,
    prefix: "",
    group: false,
    groupCollapsed: false,
    stackTrace: false,
  },

  /**
   * Internal storage for all log entries.
   * @default []
   */
  logEntries: [] as LogEntry[],

  /**
   * Maximum number of log entries to store before removing oldest entries.
   * @default 1000
   */
  maxLogEntries: 1000,

  /**
   * Clears all stored log entries from memory.
   * @example
   * ```typescript
   * // Clear all stored logs
   * LoggingUtils.clearLogEntries();
   * console.log("Logs cleared");
   *
   * // Clear logs after exporting
   * const logs = LoggingUtils.exportLogEntries();
   * LoggingUtils.clearLogEntries();
   * ```
   */
  clearLogEntries(): void {
    this.logEntries = [];
  },

  /**
   * Logs a debug message with optional metadata.
   * @param message - The debug message to log
   * @param options - Optional configuration for the log entry
   * @example
   * ```typescript
   * // Simple debug message
   * LoggingUtils.debug("Processing started");
   *
   * // Debug with data and prefix
   * LoggingUtils.debug("Data processed", {
   *   prefix: "DataService",
   *   data: { count: 100, status: "success" }
   * });
   *
   * // Debug with grouping
   * LoggingUtils.debug("Complex operation", {
   *   group: true,
   *   groupCollapsed: true,
   *   data: { steps: ["step1", "step2"] }
   * });
   * ```
   */
  debug(message: string, options: Omit<LogOptions, "level"> = {}): void {
    this.log(message, { ...options, level: "debug" });
  },

  /**
   * Logs an error message with optional stack trace and metadata.
   * @param message - The error message to log
   * @param options - Optional configuration for the log entry
   * @example
   * ```typescript
   * try {
   *   // ... some code that might throw
   * } catch (error) {
   *   LoggingUtils.error("Failed to process data", {
   *     data: error,
   *     prefix: "DataService",
   *     stackTrace: true
   *   });
   * }
   *
   * // Error with custom data
   * LoggingUtils.error("API request failed", {
   *   data: {
   *     status: 500,
   *     endpoint: "/api/data",
   *     response: "Internal Server Error"
   *   }
   * });
   * ```
   */
  error(message: string, options: Omit<LogOptions, "level"> = {}): void {
    this.log(message, { ...options, level: "error", stackTrace: true });
  },

  /**
   * Exports all stored log entries as a formatted JSON string.
   * @returns A JSON string containing all log entries
   * @example
   * ```typescript
   * // Export logs to file
   * const logs = LoggingUtils.exportLogEntries();
   * const blob = new Blob([logs], { type: 'application/json' });
   * const url = URL.createObjectURL(blob);
   *
   * // Export logs to server
   * const logs = LoggingUtils.exportLogEntries();
   * await fetch('/api/logs', {
   *   method: 'POST',
   *   body: logs,
   *   headers: { 'Content-Type': 'application/json' }
   * });
   * ```
   */
  exportLogEntries(): string {
    return JSON.stringify(this.logEntries, null, 2);
  },

  /**
   * Formats a number of bytes into a human-readable string with appropriate unit.
   * @param bytes - The number of bytes to format
   * @returns A formatted string with appropriate unit (B, KB, MB, GB, TB)
   * @example
   * ```typescript
   * const size = LoggingUtils.formatBytes(1024 * 1024);
   * console.log(size); // "1.00 MB"
   *
   * const smallSize = LoggingUtils.formatBytes(500);
   * console.log(smallSize); // "500.00 B"
   *
   * const largeSize = LoggingUtils.formatBytes(1024 * 1024 * 1024 * 2);
   * console.log(largeSize); // "2.00 GB"
   * ```
   */
  formatBytes(bytes: number): string {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  },

  /**
   * Gets a copy of all stored log entries.
   * @returns An array of log entries
   * @example
   * ```typescript
   * // Get all logs
   * const allLogs = LoggingUtils.getLogEntries();
   * console.log(`Total logs: ${allLogs.length}`);
   *
   * // Filter logs in memory
   * const errorLogs = LoggingUtils.getLogEntries()
   *   .filter(log => log.level === 'error');
   * ```
   */
  getLogEntries(): LogEntry[] {
    return [...this.logEntries];
  },

  /**
   * Gets log entries filtered by a specific log level.
   * @param level - The log level to filter by
   * @returns An array of filtered log entries
   * @example
   * ```typescript
   * // Get all error logs
   * const errorLogs = LoggingUtils.getLogEntriesByLevel("error");
   * console.log(`Error count: ${errorLogs.length}`);
   *
   * // Get all debug logs
   * const debugLogs = LoggingUtils.getLogEntriesByLevel("debug");
   * console.log(`Debug count: ${debugLogs.length}`);
   * ```
   */
  getLogEntriesByLevel(level: LogLevel): LogEntry[] {
    return this.logEntries.filter((entry) => entry.level === level);
  },

  /**
   * Gets log entries within a specific time range.
   * @param startTime - The start time of the range
   * @param endTime - The end time of the range
   * @returns An array of filtered log entries
   * @example
   * ```typescript
   * // Get logs from today
   * const today = new Date();
   * const yesterday = new Date(today);
   * yesterday.setDate(yesterday.getDate() - 1);
   *
   * const todayLogs = LoggingUtils.getLogEntriesByTimeRange(yesterday, today);
   * console.log(`Logs in last 24 hours: ${todayLogs.length}`);
   *
   * // Get logs from specific time period
   * const startDate = new Date("2024-01-01");
   * const endDate = new Date("2024-01-02");
   * const periodLogs = LoggingUtils.getLogEntriesByTimeRange(startDate, endDate);
   * ```
   */
  getLogEntriesByTimeRange(startTime: Date, endTime: Date): LogEntry[] {
    return this.logEntries.filter(
      (entry) =>
        new Date(entry.timestamp) >= startTime &&
        new Date(entry.timestamp) <= endTime
    );
  },

  /**
   * Logs an informational message with optional metadata.
   * @param message - The info message to log
   * @param options - Optional configuration for the log entry
   * @example
   * ```typescript
   * // Simple info message
   * LoggingUtils.info("Application started");
   *
   * // Info with data and prefix
   * LoggingUtils.info("User logged in", {
   *   prefix: "Auth",
   *   data: { userId: "123", role: "admin" }
   * });
   *
   * // Info with grouping
   * LoggingUtils.info("Configuration loaded", {
   *   group: true,
   *   data: { settings: { theme: "dark", language: "en" } }
   * });
   * ```
   */
  info(message: string, options: Omit<LogOptions, "level"> = {}): void {
    this.log(message, { ...options, level: "info" });
  },

  /**
   * Imports log entries from a JSON string.
   * @param json - The JSON string containing log entries
   * @throws {Error} If the JSON string is invalid or cannot be parsed
   * @example
   * ```typescript
   * // Import logs from file
   * const json = await fetch('/logs.json').then(r => r.text());
   * LoggingUtils.importLogEntries(json);
   *
   * // Import logs from server
   * const response = await fetch('/api/logs');
   * const json = await response.text();
   * LoggingUtils.importLogEntries(json);
   * ```
   */
  importLogEntries(json: string): void {
    try {
      const entries = JSON.parse(json) as LogEntry[];
      this.logEntries = entries.slice(-this.maxLogEntries);
    } catch (error) {
      this.error("Failed to import log entries", { data: error });
    }
  },

  /**
   * Logs a message with the specified options.
   * @param message - The message to log
   * @param options - Configuration options for the log entry
   * @example
   * ```typescript
   * // Custom log with all options
   * LoggingUtils.log("Custom message", {
   *   level: "info",
   *   prefix: "Custom",
   *   group: true,
   *   groupCollapsed: true,
   *   stackTrace: true,
   *   data: { custom: "data" }
   * });
   *
   * // Simple log with default options
   * LoggingUtils.log("Simple message");
   * ```
   */
  log(message: string, options: LogOptions = {}): void {
    const opts = { ...this.defaultOptions, ...options };
    const timestamp = new Date().toISOString();
    const prefix = opts.prefix ? `[${opts.prefix}] ` : "";
    const fullMessage = `${prefix}${message}`;

    // Create log entry
    const entry: LogEntry = {
      timestamp,
      level: opts.level || "info",
      message: fullMessage,
      data: opts.data,
    };

    // Add stack trace if requested
    if (opts.stackTrace) {
      entry.stack = new Error().stack;
    }

    // Store log entry
    this.logEntries.push(entry);
    if (this.logEntries.length > this.maxLogEntries) {
      this.logEntries.shift();
    }

    // Group logs if requested
    if (opts.group) {
      if (opts.groupCollapsed) {
        console.groupCollapsed(fullMessage);
      } else {
        console.group(fullMessage);
      }
    }

    // Log with appropriate console method
    switch (opts.level) {
      case "debug":
        console.debug(fullMessage, opts.data || "");
        break;
      case "info":
        console.info(fullMessage, opts.data || "");
        break;
      case "warn":
        console.warn(fullMessage, opts.data || "");
        break;
      case "error":
        console.error(fullMessage, opts.data || "");
        if (entry.stack) {
          console.error(entry.stack);
        }
        break;
    }

    // End group if started
    if (opts.group) {
      console.groupEnd();
    }
  },

  /**
   * Logs memory usage information if available in the browser.
   * @param label - The label for the memory measurement
   * @example
   * ```typescript
   * // Log memory usage
   * LoggingUtils.measureMemory("After data load");
   * // Output: Memory: After data load { used: "50.2 MB", total: "100.0 MB", limit: "500.0 MB" }
   *
   * // Track memory usage over time
   * setInterval(() => {
   *   LoggingUtils.measureMemory("Periodic check");
   * }, 60000);
   * ```
   */
  measureMemory(label: string): void {
    if (performance.memory) {
      const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } =
        performance.memory;
      this.debug(`Memory: ${label}`, {
        data: {
          used: this.formatBytes(usedJSHeapSize),
          total: this.formatBytes(totalJSHeapSize),
          limit: this.formatBytes(jsHeapSizeLimit),
        },
      });
    }
  },

  /**
   * Creates a performance measurement for synchronous operations.
   * @param label - The label for the performance measurement
   * @returns A function to end the measurement and log the duration
   * @example
   * ```typescript
   * // Measure a synchronous operation
   * const endMeasurement = LoggingUtils.measurePerformance("Data processing");
   * // ... do some work ...
   * endMeasurement();
   * // Output: Performance: Data processing { duration: "123.45ms" }
   *
   * // Measure multiple operations
   * const endTotal = LoggingUtils.measurePerformance("Total processing");
   *
   * const endStep1 = LoggingUtils.measurePerformance("Step 1");
   * // ... do step 1 ...
   * endStep1();
   *
   * const endStep2 = LoggingUtils.measurePerformance("Step 2");
   * // ... do step 2 ...
   * endStep2();
   *
   * endTotal();
   * ```
   */
  measurePerformance(label: string): () => void {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.debug(`Performance: ${label}`, {
        data: { duration: `${duration.toFixed(2)}ms` },
      });
    };
  },

  /**
   * Measures the performance of an asynchronous function.
   * @param label - The label for the performance measurement
   * @param fn - The async function to measure
   * @returns A Promise with the function result
   * @example
   * ```typescript
   * // Measure an API call
   * const result = await LoggingUtils.measureAsyncPerformance(
   *   "API call",
   *   async () => await fetchData()
   * );
   *
   * // Measure multiple async operations
   * const results = await Promise.all([
   *   LoggingUtils.measureAsyncPerformance("API 1", () => fetchData1()),
   *   LoggingUtils.measureAsyncPerformance("API 2", () => fetchData2())
   * ]);
   * ```
   */
  async measureAsyncPerformance<T>(
    label: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    try {
      const result = await fn();
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.debug(`Performance: ${label}`, {
        data: { duration: `${duration.toFixed(2)}ms` },
      });
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.error(`Performance: ${label}`, {
        data: { duration: `${duration.toFixed(2)}ms`, error },
      });
      throw error;
    }
  },

  /**
   * Logs a warning message with optional metadata.
   * @param message - The warning message to log
   * @param options - Optional configuration for the log entry
   * @example
   * ```typescript
   * // Simple warning
   * LoggingUtils.warn("Resource usage high");
   *
   * // Warning with data and prefix
   * LoggingUtils.warn("High memory usage", {
   *   prefix: "System",
   *   data: { cpu: "80%", memory: "75%" }
   * });
   *
   * // Warning with grouping
   * LoggingUtils.warn("Multiple issues detected", {
   *   group: true,
   *   data: { issues: ["CPU", "Memory", "Disk"] }
   * });
   * ```
   */
  warn(message: string, options: Omit<LogOptions, "level"> = {}): void {
    this.log(message, { ...options, level: "warn" });
  },
};
