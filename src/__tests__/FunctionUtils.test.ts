import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { FunctionUtils } from "../FunctionUtils";

describe("FunctionUtils", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("compose", () => {
    it("should compose multiple functions", () => {
      const addOne = (x: number) => x + 1;
      const double = (x: number) => x * 2;
      const addOneAndDouble = FunctionUtils.compose(double, addOne);

      expect(addOneAndDouble(5)).toBe(12); // (5 + 1) * 2 = 12
    });

    it("should handle single function", () => {
      const double = (x: number) => x * 2;
      const composed = FunctionUtils.compose(double);

      expect(composed(5)).toBe(10);
    });

    it("should handle empty function list", () => {
      const composed = FunctionUtils.compose();
      expect(composed(5)).toBe(5);
    });
  });

  describe("debounce", () => {
    it("should debounce function calls", () => {
      const mockFn = vi.fn();
      const debouncedFn = FunctionUtils.debounce(mockFn, 1000);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should handle immediate execution", () => {
      const mockFn = vi.fn();
      const debouncedFn = FunctionUtils.debounce(mockFn, 1000, true);

      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      debouncedFn();
      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1000);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should maintain function context", () => {
      const context = { value: 42 };
      const mockFn = vi.fn(function (this: typeof context) {
        expect(this.value).toBe(42);
      });

      const debouncedFn = FunctionUtils.debounce(mockFn, 1000);
      debouncedFn.call(context);
      vi.advanceTimersByTime(1000);
    });
  });

  describe("defer", () => {
    it("should defer function execution", () => {
      const mockFn = vi.fn();
      const deferredFn = FunctionUtils.defer(mockFn);

      deferredFn();
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(0);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should maintain function context", () => {
      const context = { value: 42 };
      const mockFn = vi.fn(function (this: typeof context) {
        expect(this.value).toBe(42);
      });

      const deferredFn = FunctionUtils.defer(mockFn);
      deferredFn.call(context);
      vi.advanceTimersByTime(0);
    });
  });

  describe("once", () => {
    it("should call function only once", () => {
      const mockFn = vi.fn().mockReturnValue(42);
      const onceFn = FunctionUtils.once(mockFn);

      expect(onceFn()).toBe(42);
      expect(onceFn()).toBe(42);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should maintain function context", () => {
      const context = { value: 42 };
      const mockFn = vi.fn(function (this: typeof context) {
        expect(this.value).toBe(42);
        return this.value;
      });

      const onceFn = FunctionUtils.once(mockFn);
      expect(onceFn.call(context)).toBe(42);
      expect(onceFn.call(context)).toBe(42);
    });

    it("should handle different arguments", () => {
      const mockFn = vi.fn((x: number) => x * 2);
      const onceFn = FunctionUtils.once(mockFn);

      expect(onceFn(2)).toBe(4);
      expect(onceFn(3)).toBe(4); // Still returns first result
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("throttle", () => {
    it("should throttle function calls", () => {
      const mockFn = vi.fn();
      const throttledFn = FunctionUtils.throttle(mockFn, 1000);

      // First call should execute immediately
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      // Subsequent calls within throttle period should be ignored
      throttledFn();
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      // After throttle period, next call should execute
      vi.advanceTimersByTime(1000);
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it("should maintain function context", () => {
      const context = { value: 42 };
      const mockFn = vi.fn(function (this: typeof context) {
        expect(this.value).toBe(42);
      });

      const throttledFn = FunctionUtils.throttle(mockFn, 1000);
      throttledFn.call(context);
      vi.advanceTimersByTime(1000);
    });

    it("should handle rapid calls", () => {
      const mockFn = vi.fn();
      const throttledFn = FunctionUtils.throttle(mockFn, 1000);

      // First call should execute immediately
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      // Rapid calls within throttle period should be ignored
      for (let i = 0; i < 5; i++) {
        throttledFn();
        vi.advanceTimersByTime(200);
      }

      // Should still only have been called once
      expect(mockFn).toHaveBeenCalledTimes(1);

      // After throttle period, next call should execute
      vi.advanceTimersByTime(1000);
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it("should handle edge cases", () => {
      const mockFn = vi.fn();
      const throttledFn = FunctionUtils.throttle(mockFn, 1000);

      // First call should execute immediately
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      // Call exactly at throttle boundary
      vi.advanceTimersByTime(1000);
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);

      // Call slightly before throttle boundary
      vi.advanceTimersByTime(999);
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);

      // Call after throttle boundary
      vi.advanceTimersByTime(1);
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it("should handle multiple throttle periods", () => {
      const mockFn = vi.fn();
      const throttledFn = FunctionUtils.throttle(mockFn, 1000);

      // First call
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      // Wait for throttle period
      vi.advanceTimersByTime(1000);

      // Second call
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);

      // Wait for throttle period
      vi.advanceTimersByTime(1000);

      // Third call
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(3);
    });
  });
});
