/**
 * @module AccessibilityUtils
 * @description A collection of utility functions for improving web accessibility, ARIA management, and inclusive design.
 * Provides methods for handling ARIA attributes, focus management, and keyboard navigation.
 *
 * @example
 * ```typescript
 * import { AccessibilityUtils } from 'houser-js-utils';
 *
 * // Set ARIA attributes
 * AccessibilityUtils.setAriaLabel(element, 'Close dialog');
 *
 * // Manage focus
 * AccessibilityUtils.trapFocus(modalElement);
 *
 * // Check accessibility
 * const isAccessible = AccessibilityUtils.hasValidAriaLabels(form);
 * ```
 */

export const AccessibilityUtils = {
  /**
   * Gets the ARIA described by attribute of an element
   * @param element - The DOM element to check
   * @returns The value of aria-describedby attribute or null if not set
   * @example
   * ```typescript
   * const element = document.querySelector('.input');
   * const describedBy = AccessibilityUtils.getAriaDescribedBy(element);
   * ```
   */
  getAriaDescribedBy(element: Element): string | null {
    return element.getAttribute("aria-describedby");
  },

  /**
   * Sets the ARIA described by attribute of an element
   * @param element - The DOM element to modify
   * @param describedBy - The ID(s) of the element(s) that describe this element
   * @example
   * ```typescript
   * const input = document.querySelector('.input');
   * const helpText = document.querySelector('.help-text');
   * AccessibilityUtils.setAriaDescribedBy(input, helpText.id);
   * ```
   */
  setAriaDescribedBy(element: Element, describedBy: string): void {
    element.setAttribute("aria-describedby", describedBy);
  },

  /**
   * Gets the ARIA expanded state of an element
   * @param element - Element to check
   * @returns ARIA expanded state
   */
  getAriaExpanded(element: Element): boolean | null {
    const expanded = element.getAttribute("aria-expanded");
    return expanded === null ? null : expanded === "true";
  },

  /**
   * Sets the ARIA expanded state of an element
   * @param element - Element to modify
   * @param expanded - ARIA expanded state to set
   */
  setAriaExpanded(element: Element, expanded: boolean): void {
    element.setAttribute("aria-expanded", expanded.toString());
  },

  /**
   * Gets the ARIA hidden state of an element
   * @param element - Element to check
   * @returns ARIA hidden state
   */
  getAriaHidden(element: Element): boolean | null {
    const hidden = element.getAttribute("aria-hidden");
    return hidden === null ? null : hidden === "true";
  },

  /**
   * Sets the ARIA hidden state of an element
   * @param element - Element to modify
   * @param hidden - ARIA hidden state to set
   */
  setAriaHidden(element: Element, hidden: boolean): void {
    element.setAttribute("aria-hidden", hidden.toString());
  },

  /**
   * Gets the ARIA invalid state of an element
   * @param element - Element to check
   * @returns ARIA invalid state
   */
  getAriaInvalid(element: Element): boolean | null {
    const invalid = element.getAttribute("aria-invalid");
    return invalid === null ? null : invalid === "true";
  },

  /**
   * Sets the ARIA invalid state of an element
   * @param element - Element to modify
   * @param invalid - ARIA invalid state to set
   */
  setAriaInvalid(element: Element, invalid: boolean): void {
    element.setAttribute("aria-invalid", invalid.toString());
  },

  /**
   * Gets the ARIA label of an element
   * @param element - Element to check
   * @returns ARIA label
   */
  getAriaLabel(element: Element): string | null {
    return element.getAttribute("aria-label");
  },

  /**
   * Sets the ARIA label of an element
   * @param element - Element to modify
   * @param label - ARIA label to set
   */
  setAriaLabel(element: Element, label: string): void {
    element.setAttribute("aria-label", label);
  },

  /**
   * Gets the ARIA required state of an element
   * @param element - Element to check
   * @returns ARIA required state
   */
  getAriaRequired(element: Element): boolean | null {
    const required = element.getAttribute("aria-required");
    return required === null ? null : required === "true";
  },

  /**
   * Sets the ARIA required state of an element
   * @param element - Element to modify
   * @param required - ARIA required state to set
   */
  setAriaRequired(element: Element, required: boolean): void {
    element.setAttribute("aria-required", required.toString());
  },

  /**
   * Gets the ARIA role of an element
   * @param element - Element to check
   * @returns ARIA role
   */
  getAriaRole(element: Element): string | null {
    return element.getAttribute("role");
  },

  /**
   * Sets the ARIA role of an element
   * @param element - Element to modify
   * @param role - ARIA role to set
   */
  setAriaRole(element: Element, role: string): void {
    element.setAttribute("role", role);
  },

  /**
   * Removes focus from an element
   * @param element - Element to blur
   */
  blurElement(element: Element): void {
    if (element instanceof HTMLElement) {
      element.blur();
    }
  },

  /**
   * Sets focus to an element
   * @param element - Element to focus
   */
  focusElement(element: Element): void {
    if (element instanceof HTMLElement) {
      element.focus();
    }
  },

  /**
   * Sets focus to the first focusable element in a container
   * @param container - Container element
   */
  focusFirstElement(container: Element): void {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }
  },

  /**
   * Sets focus to the last focusable element in a container
   * @param container - Container element
   */
  focusLastElement(container: Element): void {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length > 0) {
      (focusableElements[focusableElements.length - 1] as HTMLElement).focus();
    }
  },

  /**
   * Sets focus to the next focusable element
   * @param currentElement - Current element
   */
  focusNextElement(currentElement: Element): void {
    const focusableElements = this.getFocusableElements(document.body);
    const currentIndex = focusableElements.indexOf(currentElement);
    if (currentIndex < focusableElements.length - 1) {
      (focusableElements[currentIndex + 1] as HTMLElement).focus();
    }
  },

  /**
   * Sets focus to the previous focusable element
   * @param currentElement - Current element
   */
  focusPreviousElement(currentElement: Element): void {
    const focusableElements = this.getFocusableElements(document.body);
    const currentIndex = focusableElements.indexOf(currentElement);
    if (currentIndex > 0) {
      (focusableElements[currentIndex - 1] as HTMLElement).focus();
    }
  },

  /**
   * Gets all focusable elements within a container
   * @param container - Container element
   * @returns Array of focusable elements
   */
  getFocusableElements(container: Element): Element[] {
    const elements = container.querySelectorAll("*");
    return Array.from(elements).filter((element) => this.isFocusable(element));
  },

  /**
   * Gets the current focus element
   * @returns Currently focused element
   */
  getFocusedElement(): Element | null {
    return document.activeElement;
  },

  /**
   * Checks if an element is focusable
   * @param element - Element to check
   * @returns True if element is focusable
   */
  isFocusable(element: Element): boolean {
    if (!(element instanceof HTMLElement)) {
      return false;
    }

    if (element.tabIndex < 0) {
      return false;
    }

    if ("disabled" in element && element.disabled) {
      return false;
    }

    switch (element.tagName.toLowerCase()) {
      case "a":
      case "button":
      case "input":
      case "select":
      case "textarea":
        return true;
      default:
        return false;
    }
  },

  /**
   * Traps focus within a container element, typically used for modals or dialogs
   * @param container - The container element to trap focus within
   * @returns A function that removes the focus trap when called
   * @example
   * ```typescript
   * const modal = document.querySelector('.modal');
   * const removeTrap = AccessibilityUtils.trapFocus(modal);
   *
   * // Later, when the modal is closed:
   * removeTrap();
   * ```
   */
  trapFocus(container: Element): () => void {
    const focusableElements = this.getFocusableElements(container);
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement =
      focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event: Event) => {
      if (!(event instanceof KeyboardEvent) || event.key !== "Tab") {
        return;
      }

      if (event.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          event.preventDefault();
          (lastFocusableElement as HTMLElement).focus();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          event.preventDefault();
          (firstFocusableElement as HTMLElement).focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown as EventListener);
    return () =>
      container.removeEventListener("keydown", handleKeyDown as EventListener);
  },
};
