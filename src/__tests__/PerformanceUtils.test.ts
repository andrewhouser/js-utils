import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { PerformanceUtils } from "../PerformanceUtils";

describe("PerformanceUtils", () => {
  let originalPerformance: typeof globalThis.performance;

  beforeEach(() => {
    // Mock the performance API
    originalPerformance = globalThis.performance;
    globalThis.performance = {
      clearMarks: vi.fn(),
      clearMeasures: vi.fn(),
      mark: vi.fn(),
      measure: vi.fn(),
      getEntriesByType: vi.fn(),
      getEntriesByName: vi.fn(),
      now: vi.fn(() => 100),
    } as any;
  });

  afterEach(() => {
    globalThis.performance = originalPerformance;
    vi.restoreAllMocks();
  });

  it("clearMarksAndMeasures should call clearMarks and clearMeasures", () => {
    PerformanceUtils.clearMarksAndMeasures();
    expect(performance.clearMarks).toHaveBeenCalled();
    expect(performance.clearMeasures).toHaveBeenCalled();
  });

  it("createPerformanceObserver should create and observe", () => {
    const observe = vi.fn();
    const callback = vi.fn();
    const PerfObs = vi.fn().mockImplementation((cb) => {
      expect(cb).toBe(callback);
      return { observe };
    });
    (globalThis as any).PerformanceObserver = PerfObs;
    const entryTypes = ["mark"];
    const observer = PerformanceUtils.createPerformanceObserver(
      callback,
      entryTypes
    );
    expect(PerfObs).toHaveBeenCalledWith(callback);
    expect(observe).toHaveBeenCalledWith({ entryTypes });
    expect(observer.observe).toBe(observe);
  });

  it("getCumulativeLayoutShift should sum layout-shift values", async () => {
    (performance.getEntriesByType as any).mockReturnValue([
      { value: 0.1 },
      { value: 0.2 },
    ]);
    const result = await PerformanceUtils.getCumulativeLayoutShift();
    expect(result).toBeCloseTo(0.3);
  });

  it("getDomContentLoadedTime should return correct time", async () => {
    (performance.getEntriesByType as any).mockReturnValue([
      { domContentLoadedEventEnd: 150, startTime: 50 },
    ]);
    const result = await PerformanceUtils.getDomContentLoadedTime();
    expect(result).toBe(100);
  });

  it("getFirstContentfulPaint should return FCP time", async () => {
    (performance.getEntriesByType as any).mockReturnValue([
      { name: "first-paint", startTime: 10 },
      { name: "first-contentful-paint", startTime: 42 },
    ]);
    const result = await PerformanceUtils.getFirstContentfulPaint();
    expect(result).toBe(42);
  });

  it("getFirstInputDelay should return FID time", async () => {
    (performance.getEntriesByType as any).mockReturnValue([{ startTime: 77 }]);
    const result = await PerformanceUtils.getFirstInputDelay();
    expect(result).toBe(77);
    (performance.getEntriesByType as any).mockReturnValue([]);
    const result2 = await PerformanceUtils.getFirstInputDelay();
    expect(result2).toBe(0);
  });

  it("getLargestContentfulPaint should return LCP time", async () => {
    (performance.getEntriesByType as any).mockReturnValue([
      { startTime: 10 },
      { startTime: 99 },
    ]);
    const result = await PerformanceUtils.getLargestContentfulPaint();
    expect(result).toBe(99);
    (performance.getEntriesByType as any).mockReturnValue([]);
    const result2 = await PerformanceUtils.getLargestContentfulPaint();
    expect(result2).toBe(0);
  });

  it("getPageLoadTime should return page load time", async () => {
    (performance.getEntriesByType as any).mockReturnValue([
      { loadEventEnd: 200, startTime: 50 },
    ]);
    const result = await PerformanceUtils.getPageLoadTime();
    expect(result).toBe(150);
  });

  it("getTimeToFirstByte should return TTFB", async () => {
    (performance.getEntriesByType as any).mockReturnValue([
      { responseStart: 120, requestStart: 100 },
    ]);
    const result = await PerformanceUtils.getTimeToFirstByte();
    expect(result).toBe(20);
  });

  it("mark should call performance.mark", () => {
    PerformanceUtils.mark("foo");
    expect(performance.mark).toHaveBeenCalledWith("foo");
  });

  it("measureExecutionTime should measure function execution", () => {
    (performance.now as any).mockReturnValueOnce(100).mockReturnValueOnce(200);
    const fn = vi.fn(() => 42);
    const result = PerformanceUtils.measureExecutionTime(fn, 2);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(result.result).toBe(42);
    expect(result.time).toBe(100);
    expect(result.averageTime).toBe(50);
  });

  it("measure should call performance.measure and return entry", () => {
    const entry = { duration: 123 };
    (performance.getEntriesByName as any).mockReturnValue([entry]);
    const result = PerformanceUtils.measure("start", "end");
    expect(performance.measure).toHaveBeenCalledWith(
      "start-end",
      "start",
      "end"
    );
    expect(result).toBe(entry);
  });

  it("measure should handle errors gracefully", () => {
    (performance.measure as any).mockImplementation(() => {
      throw new Error("fail");
    });
    const result = PerformanceUtils.measure("start", "end");
    expect(result).toBeNull();
  });

  it("throttle should throttle function calls", async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const throttled = PerformanceUtils.throttle(fn, 100);
    throttled("a");
    throttled("b");
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(100);
    throttled("c");
    expect(fn).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });
});
