/**
 * Utility functions for function manipulation and optimization.
 *
 * This module provides a collection of utility functions for working with functions,
 * including composition, debouncing, throttling, and more.
 *
 * @module FunctionUtils
 * @example
 * ```typescript
 * // Compose multiple functions
 * const addOne = (x: number) => x + 1;
 * const double = (x: number) => x * 2;
 * const addOneAndDouble = FunctionUtils.compose(double, addOne);
 *
 * // Debounce a function
 * const debouncedSearch = FunctionUtils.debounce(searchFunction, 300);
 *
 * // Throttle a function
 * const throttledScroll = FunctionUtils.throttle(handleScroll, 100);
 * ```
 */

export const FunctionUtils = {
  /**
   * Composes multiple functions into a single function, where the output
   * of each function is passed as input to the next function.
   *
   * @template T - The type of the input to the first function
   * @template R - The type of the output of the last function
   * @param funcs - The functions to compose
   * @returns A function that is the composition of all provided functions
   *
   * @example
   * ```typescript
   * const addOne = (x: number) => x + 1;
   * const double = (x: number) => x * 2;
   * const addOneAndDouble = FunctionUtils.compose(double, addOne);
   * addOneAndDouble(5); // Returns 12 (5 + 1 = 6, then 6 * 2 = 12)
   * ```
   */
  compose<T, R>(...funcs: Array<(arg: any) => any>): (arg: T) => R {
    return function (this: any, arg: T): R {
      return funcs.reduceRight(
        (result, func) => func(result),
        arg as unknown
      ) as R;
    };
  },

  /**
   * Creates a debounced function that delays invoking the provided function
   * until after the specified wait time has elapsed since the last time it was invoked.
   *
   * @template T - The type of the function's arguments
   * @template R - The return type of the function
   * @param func - The function to debounce
   * @param waitTime - The number of milliseconds to delay
   * @param immediate - If true, the function will be called on the leading edge instead of the trailing edge
   * @returns A debounced version of the provided function
   *
   * @example
   * ```typescript
   * const debouncedSearch = FunctionUtils.debounce((query: string) => {
   *   // Perform search
   * }, 300);
   *
   * // Will only execute after 300ms of no calls
   * debouncedSearch("test");
   * ```
   */
  debounce<T extends any[], R>(
    func: (...args: T) => R,
    waitTime: number = 1000,
    immediate: boolean = false
  ): (...args: T) => R | undefined {
    let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

    return function (this: any, ...args: T): R | undefined {
      const context = this;

      const later = function (): void {
        debounceTimeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };

      const callNow = immediate && !debounceTimeout;

      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      debounceTimeout = setTimeout(later, waitTime);

      if (callNow) {
        return func.apply(context, args);
      }
    };
  },

  /**
   * Creates a function that delays invoking the provided function
   * until the current call stack has cleared.
   *
   * @template T - The type of the function's arguments
   * @template R - The return type of the function
   * @param func - The function to defer
   * @returns A deferred version of the provided function
   *
   * @example
   * ```typescript
   * const deferredLog = FunctionUtils.defer((message: string) => {
   *   console.log(message);
   * });
   *
   * // Will execute after current execution context
   * deferredLog("Hello");
   * ```
   */
  defer<T extends any[], R>(func: (...args: T) => R): (...args: T) => void {
    return function (this: any, ...args: T): void {
      setTimeout(() => func.apply(this, args), 0);
    };
  },

  /**
   * Creates a function that can only be called once. Subsequent calls
   * will return the result of the first call.
   *
   * @template T - The type of the function's arguments
   * @template R - The return type of the function
   * @param func - The function to make callable only once
   * @returns A function that can only be called once
   *
   * @example
   * ```typescript
   * const initialize = FunctionUtils.once(() => {
   *   // Expensive initialization
   *   return "initialized";
   * });
   *
   * initialize(); // Returns "initialized"
   * initialize(); // Returns "initialized" without executing the function again
   * ```
   */
  once<T extends any[], R>(func: (...args: T) => R): (...args: T) => R {
    let called = false;
    let result: R;

    return function (this: any, ...args: T): R {
      if (!called) {
        called = true;
        result = func.apply(this, args);
      }
      return result;
    };
  },

  /**
   * Creates a throttled function that only invokes the provided function
   * at most once per every wait milliseconds.
   *
   * @template T - The type of the function's arguments
   * @template R - The return type of the function
   * @param func - The function to throttle
   * @param waitTime - The number of milliseconds to throttle invocations to
   * @returns A throttled version of the provided function
   *
   * @example
   * ```typescript
   * const throttledScroll = FunctionUtils.throttle(() => {
   *   // Handle scroll event
   * }, 100);
   *
   * // Will execute at most once every 100ms
   * window.addEventListener('scroll', throttledScroll);
   * ```
   */
  throttle<T extends any[], R>(
    func: (...args: T) => R,
    waitTime: number = 1000
  ): (...args: T) => R | undefined {
    let lastCall = 0;

    return function (this: any, ...args: T): R | undefined {
      const now = Date.now();
      if (now - lastCall >= waitTime) {
        lastCall = now;
        return func.apply(this, args);
      }
    };
  },
};
