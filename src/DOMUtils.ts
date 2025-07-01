/**
 * @module DOMUtils
 * @description A collection of utility functions for DOM manipulation, element queries, and browser interactions.
 * @example
 * ```typescript
 * import { DOMUtils } from 'js-utils';
 *
 * // Query elements safely
 * const element = DOMUtils.querySelector('.my-class');
 *
 * // Check element visibility
 * const isVisible = DOMUtils.isElementVisible(element);
 *
 * // Scroll to element
 * DOMUtils.scrollToElement(element);
 * ```
 */

export const DOMUtils = {
  /**
   * Adds a class to an element if it doesn't already have it.
   * @param element - The DOM element to modify
   * @param className - The class name to add
   * @throws {TypeError} If element is not a valid DOM element
   */
  addClass(element: Element | null, className: string): void {
    if (!element) return;
    if (!element.classList.contains(className)) {
      element.classList.add(className);
    }
  },

  /**
   * Gets the computed style of an element.
   * @param element - The DOM element to check
   * @param property - The CSS property to get (e.g., 'width', 'color')
   * @returns The computed value of the property or empty string if element is null
   */
  getComputedStyle(element: Element | null, property: string): string {
    if (!element) return "";
    return window.getComputedStyle(element).getPropertyValue(property);
  },

  /**
   * Gets the dimensions of an element including margins.
   * @param element - The DOM element to measure
   * @returns Object containing width and height, or {width: 0, height: 0} if element is null
   */
  getElementDimensions(element: Element | null): {
    width: number;
    height: number;
  } {
    if (!element) return { width: 0, height: 0 };
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return {
      width:
        rect.width +
        parseFloat(style.marginLeft) +
        parseFloat(style.marginRight),
      height:
        rect.height +
        parseFloat(style.marginTop) +
        parseFloat(style.marginBottom),
    };
  },

  /**
   * Gets the offset position of an element relative to the document.
   * @param element - The DOM element to measure
   * @returns Object containing top and left offsets, or {top: 0, left: 0} if element is null
   */
  getElementOffset(element: Element | null): { top: number; left: number } {
    if (!element) return { top: 0, left: 0 };
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    };
  },

  /**
   * Gets the scroll position of an element.
   * @param element - The DOM element to check
   * @returns Object containing scrollTop and scrollLeft values, or {scrollTop: 0, scrollLeft: 0} if element is null
   */
  getScrollPosition(element: Element | null): {
    scrollTop: number;
    scrollLeft: number;
  } {
    if (!element) {
      return { scrollTop: 0, scrollLeft: 0 };
    }
    return {
      scrollTop: element.scrollTop,
      scrollLeft: element.scrollLeft,
    };
  },

  /**
   * Checks if an element has a specific class.
   * @param element - The DOM element to check
   * @param className - The class name to check for
   * @returns True if the element has the class, false otherwise
   */
  hasClass(element: Element | null, className: string): boolean {
    return element?.classList.contains(className) ?? false;
  },

  /**
   * Checks if an element is currently fully visible in the viewport.
   * @param element - The DOM element to check
   * @returns True if the element is fully visible in the viewport, false otherwise
   */
  isElementInViewport(element: Element | null): boolean {
    if (!element) {
      return false;
    }

    const rect = element.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= viewportHeight &&
      rect.right <= viewportWidth
    );
  },

  /**
   * Checks if an element is partially visible in the viewport.
   * @param element - The DOM element to check
   * @returns True if any part of the element is visible in the viewport, false otherwise
   */
  isElementPartiallyVisible(element: Element | null): boolean {
    if (!element) {
      return false;
    }

    const rect = element.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;

    return !(
      rect.bottom < 0 ||
      rect.top > viewportHeight ||
      rect.right < 0 ||
      rect.left > viewportWidth
    );
  },

  /**
   * Removes a class from an element if it has it.
   * @param element - The DOM element to modify
   * @param className - The class name to remove
   */
  removeClass(element: Element | null, className: string): void {
    if (!element) return;
    if (element.classList.contains(className)) {
      element.classList.remove(className);
    }
  },

  /**
   * Scrolls an element into view with smooth behavior.
   * @param element - The DOM element to scroll into view
   * @param options - ScrollIntoViewOptions for customizing scroll behavior
   */
  scrollIntoView(
    element: Element | null,
    options: ScrollIntoViewOptions = { behavior: "smooth" }
  ): void {
    element?.scrollIntoView(options);
  },

  /**
   * Sets the scroll position of an element.
   * @param element - The DOM element to modify
   * @param position - Object containing scrollTop and scrollLeft values
   */
  setScrollPosition(
    element: Element | null,
    position: { scrollTop: number; scrollLeft: number }
  ): void {
    if (!element) return;
    element.scrollTop = position.scrollTop;
    element.scrollLeft = position.scrollLeft;
  },

  /**
   * Sets a CSS property on an element.
   * @param element - The DOM element to modify
   * @param property - The CSS property to set (e.g., 'width', 'color')
   * @param value - The value to set
   */
  setStyle(element: Element | null, property: string, value: string): void {
    if (!element) return;
    (element as HTMLElement).style.setProperty(property, value);
  },

  /**
   * Toggles a class on an element.
   * @param element - The DOM element to modify
   * @param className - The class name to toggle
   * @param force - Optional boolean to force add or remove the class
   */
  toggleClass(
    element: Element | null,
    className: string,
    force?: boolean
  ): void {
    if (!element) return;
    element.classList.toggle(className, force);
  },

  /**
   * Waits for an element to be present in the DOM.
   * @param selector - CSS selector for the element
   * @param timeout - Maximum time to wait in milliseconds (default: 5000)
   * @returns Promise that resolves with the element or null if not found within timeout
   */
  waitForElement(selector: string, timeout = 5000): Promise<Element | null> {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeout);
    });
  },
};
