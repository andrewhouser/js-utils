/**
 * @module TestUtils
 * @description A collection of utility functions for testing, mocking, and test data generation.
 * @example
 * ```typescript
 * import { TestUtils } from 'js-utils';
 *
 * // Generate test data
 * const testUser = TestUtils.createTestDataGenerator({ name: 'John', age: 30 });
 *
 * // Create mock function
 * const mockFn = TestUtils.createMock();
 *
 * // Wait for async operations
 * await TestUtils.waitFor(() => element.isVisible());
 * ```
 */

export const TestUtils = {
  /**
   * Creates a test animation event
   * @param type - Event type
   * @param options - Event options
   * @returns Test animation event
   */
  createTestAnimationEvent(
    type: string,
    options: AnimationEventInit = {}
  ): AnimationEvent {
    return new AnimationEvent(type, options);
  },

  /**
   * Creates a test clipboard event
   * @param type - Event type
   * @param options - Event options
   * @returns Test clipboard event
   */
  createTestClipboardEvent(
    type: string,
    options: ClipboardEventInit = {}
  ): ClipboardEvent {
    return new ClipboardEvent(type, options);
  },

  /**
   * Creates a test data array generator
   * @param template - Template object
   * @returns Function that generates an array of test data
   */
  createTestDataArrayGenerator<T extends object>(template: T) {
    return (count: number, overrides: Partial<T> = {}): T[] => {
      return Array.from({ length: count }, () => ({
        ...template,
        ...overrides,
      }));
    };
  },

  /**
   * Creates a test data generator
   * @param template - Template object
   * @returns Function that generates test data
   */
  createTestDataGenerator<T extends object>(template: T) {
    return (overrides: Partial<T> = {}): T => ({
      ...template,
      ...overrides,
    });
  },

  /**
   * Creates a test drag event
   * @param type - Event type
   * @param options - Event options
   * @returns Test drag event
   */
  createTestDragEvent(type: string, options: DragEventInit = {}): DragEvent {
    return new DragEvent(type, options);
  },

  /**
   * Creates a test event
   * @param type - Event type
   * @param options - Event options
   * @returns Test event
   */
  createTestEvent(type: string, options: EventInit = {}): Event {
    return new Event(type, options);
  },

  /**
   * Creates a test focus event
   * @param type - Event type
   * @param options - Event options
   * @returns Test focus event
   */
  createTestFocusEvent(type: string, options: FocusEventInit = {}): FocusEvent {
    return new FocusEvent(type, options);
  },

  /**
   * Creates a test input event
   * @param type - Event type
   * @param options - Event options
   * @returns Test input event
   */
  createTestInputEvent(type: string, options: InputEventInit = {}): InputEvent {
    return new InputEvent(type, options);
  },

  /**
   * Creates a test keyboard event
   * @param type - Event type
   * @param options - Event options
   * @returns Test keyboard event
   */
  createTestKeyboardEvent(
    type: string,
    options: KeyboardEventInit = {}
  ): KeyboardEvent {
    return new KeyboardEvent(type, options);
  },

  /**
   * Creates a test mouse event
   * @param type - Event type
   * @param options - Event options
   * @returns Test mouse event
   */
  createTestMouseEvent(type: string, options: MouseEventInit = {}): MouseEvent {
    return new MouseEvent(type, options);
  },

  /**
   * Creates a test touch event
   * @param type - Event type
   * @param options - Event options
   * @returns Test touch event
   */
  createTestTouchEvent(type: string, options: TouchEventInit = {}): TouchEvent {
    return new TouchEvent(type, options);
  },

  /**
   * Creates a test transition event
   * @param type - Event type
   * @param options - Event options
   * @returns Test transition event
   */
  createTestTransitionEvent(
    type: string,
    options: TransitionEventInit = {}
  ): TransitionEvent {
    return new TransitionEvent(type, options);
  },

  /**
   * Creates a mock error promise
   * @param error - Error to reject with
   * @param delay - Delay in milliseconds
   * @returns Mock error promise
   */
  createMockErrorPromise(error: Error, delay = 0): Promise<never> {
    return new Promise((_, reject) => setTimeout(() => reject(error), delay));
  },

  /**
   * Creates a mock function
   * @param implementation - Optional implementation function
   * @returns Mock function
   */
  createMock<T extends (...args: any[]) => any>(implementation?: T): T {
    return implementation || ((() => {}) as T);
  },

  /**
   * Creates a mock object
   * @param template - Template object to mock
   * @returns Mock object
   */
  createMockObject<T extends object>(template: T): T {
    return template;
  },

  /**
   * Creates a mock promise
   * @param value - Value to resolve with
   * @param delay - Delay in milliseconds
   * @returns Mock promise
   */
  createMockPromise<T>(value: T, delay = 0): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(value), delay));
  },

  /**
   * Waits for a number of milliseconds
   * @param ms - Milliseconds to wait
   * @returns Promise that resolves after the delay
   */
  async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  /**
   * Waits for a condition to be true
   * @param condition - Function that returns a boolean
   * @param timeout - Timeout in milliseconds
   * @param interval - Check interval in milliseconds
   * @returns Promise that resolves when condition is true
   */
  async waitFor(
    condition: () => boolean,
    timeout = 5000,
    interval = 100
  ): Promise<void> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (condition()) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    throw new Error("Timeout waiting for condition");
  },
};
