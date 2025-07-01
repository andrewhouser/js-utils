/**
 * @module PerformanceUtils
 * @description A collection of utility functions for performance monitoring, timing, and optimization.
 * @example
 * ```typescript
 * import { PerformanceUtils } from 'js-utils';
 *
 * // Measure execution time
 * const timer = PerformanceUtils.startTimer();
 * // ... some operation
 * const elapsed = PerformanceUtils.endTimer(timer);
 *
 * // Get memory usage
 * const memoryInfo = PerformanceUtils.getMemoryUsage();
 * ```
 */

export const PerformanceUtils = {
  /**
   * Clears all performance marks and measures
   */
  clearMarksAndMeasures(): void {
    performance.clearMarks();
    performance.clearMeasures();
  },

  /**
   * Creates a performance observer
   * @param callback - Function to call when performance entries are observed
   * @param entryTypes - Types of entries to observe
   * @returns Performance observer
   */
  createPerformanceObserver(
    callback: (entries: PerformanceObserverEntryList) => void,
    entryTypes: string[]
  ): PerformanceObserver {
    const observer = new PerformanceObserver(callback);
    observer.observe({ entryTypes });
    return observer;
  },

  /**
   * Gets the cumulative layout shift
   * @returns Promise resolving to CLS score
   */
  async getCumulativeLayoutShift(): Promise<number> {
    const cls = performance.getEntriesByType("layout-shift");
    return cls.reduce((sum, entry) => sum + (entry as any).value, 0);
  },

  /**
   * Gets the DOM content loaded time
   * @returns Promise resolving to DOM content loaded time in milliseconds
   */
  async getDomContentLoadedTime(): Promise<number> {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    return navigation.domContentLoadedEventEnd - navigation.startTime;
  },

  /**
   * Gets the first contentful paint time
   * @returns Promise resolving to FCP time in milliseconds
   */
  async getFirstContentfulPaint(): Promise<number> {
    const paint = performance.getEntriesByType("paint");
    const fcp = paint.find((entry) => entry.name === "first-contentful-paint");
    return fcp ? fcp.startTime : 0;
  },

  /**
   * Gets the first input delay
   * @returns Promise resolving to FID time in milliseconds
   */
  async getFirstInputDelay(): Promise<number> {
    const fid = performance.getEntriesByType("first-input");
    return fid.length > 0 ? fid[0].startTime : 0;
  },

  /**
   * Gets the largest contentful paint time
   * @returns Promise resolving to LCP time in milliseconds
   */
  async getLargestContentfulPaint(): Promise<number> {
    const lcp = performance.getEntriesByType("largest-contentful-paint");
    return lcp.length > 0 ? lcp[lcp.length - 1].startTime : 0;
  },

  /**
   * Gets the page load time
   * @returns Promise resolving to page load time in milliseconds
   */
  async getPageLoadTime(): Promise<number> {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    return navigation.loadEventEnd - navigation.startTime;
  },

  /**
   * Gets the time to first byte (TTFB)
   * @returns Promise resolving to TTFB in milliseconds
   */
  async getTimeToFirstByte(): Promise<number> {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    return navigation.responseStart - navigation.requestStart;
  },

  /**
   * Creates a performance mark
   * @param name - Name of the mark
   */
  mark(name: string): void {
    performance.mark(name);
  },

  /**
   * Measures the execution time of a function
   * @param fn - Function to measure
   * @param iterations - Number of iterations to run
   * @returns Object containing execution time statistics
   */
  measureExecutionTime<T>(
    fn: () => T,
    iterations = 1
  ): { result: T; time: number; averageTime: number } {
    const start = performance.now();
    let result: T;

    for (let i = 0; i < iterations; i++) {
      result = fn();
    }

    const end = performance.now();
    const time = end - start;
    const averageTime = time / iterations;

    return { result: result!, time, averageTime };
  },

  /**
   * Measures the time between two marks
   * @param startMark - Name of the start mark
   * @param endMark - Name of the end mark
   * @returns Object containing measurement details
   */
  measure(startMark: string, endMark: string) {
    try {
      performance.measure(`${startMark}-${endMark}`, startMark, endMark);
      const entries = performance.getEntriesByName(`${startMark}-${endMark}`);
      return entries[entries.length - 1];
    } catch (error) {
      console.error("Error measuring performance:", error);
      return null;
    }
  },

  /**
   * Throttles a function
   * @param fn - Function to throttle
   * @param limit - Time limit in milliseconds
   * @returns Throttled function
   */
  throttle<T extends (...args: any[]) => any>(
    fn: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },
};
