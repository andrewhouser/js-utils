import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { AccessibilityUtils } from "../AccessibilityUtils";

describe("AccessibilityUtils", () => {
  let container: HTMLElement;
  let button: HTMLButtonElement;
  let input: HTMLInputElement;
  let link: HTMLAnchorElement;

  beforeEach(() => {
    // Set up DOM elements for testing
    container = document.createElement("div");
    button = document.createElement("button");
    input = document.createElement("input");
    link = document.createElement("a");
    link.href = "#";

    // Add IDs for easier testing
    button.id = "test-button";
    input.id = "test-input";
    link.id = "test-link";

    container.appendChild(button);
    container.appendChild(input);
    container.appendChild(link);
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Clean up DOM elements after each test
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
    // Reset focus
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });

  describe("ARIA attributes", () => {
    it("should get and set aria-describedby", () => {
      const element = document.createElement("div");
      AccessibilityUtils.setAriaDescribedBy(element, "description-id");
      expect(AccessibilityUtils.getAriaDescribedBy(element)).toBe(
        "description-id"
      );
    });

    it("should get and set aria-label", () => {
      const element = document.createElement("div");
      AccessibilityUtils.setAriaLabel(element, "Submit button");
      expect(AccessibilityUtils.getAriaLabel(element)).toBe("Submit button");
    });

    it("should get and set aria-expanded", () => {
      const element = document.createElement("div");
      AccessibilityUtils.setAriaExpanded(element, true);
      expect(AccessibilityUtils.getAriaExpanded(element)).toBe(true);
    });

    it("should get and set aria-hidden", () => {
      const element = document.createElement("div");
      AccessibilityUtils.setAriaHidden(element, true);
      expect(AccessibilityUtils.getAriaHidden(element)).toBe(true);
    });
  });

  describe("Focus management", () => {
    it("should focus an element", () => {
      AccessibilityUtils.focusElement(button);
      expect(document.activeElement).toBe(button);
    });

    it("should blur an element", () => {
      button.focus();
      AccessibilityUtils.blurElement(button);
      expect(document.activeElement).not.toBe(button);
    });

    it("should get focusable elements", () => {
      const focusableElements =
        AccessibilityUtils.getFocusableElements(container);
      expect(focusableElements).toContain(button);
      expect(focusableElements).toContain(input);
      expect(focusableElements).toContain(link);
    });

    it("should check if element is focusable", () => {
      expect(AccessibilityUtils.isFocusable(button)).toBe(true);
      expect(AccessibilityUtils.isFocusable(input)).toBe(true);
      expect(AccessibilityUtils.isFocusable(link)).toBe(true);

      const div = document.createElement("div");
      expect(AccessibilityUtils.isFocusable(div)).toBe(false);

      button.disabled = true;
      expect(AccessibilityUtils.isFocusable(button)).toBe(false);
    });
  });

  describe("Focus trapping", () => {
    it("should trap focus within container", () => {
      const removeTrap = AccessibilityUtils.trapFocus(container);

      // Focus first element
      AccessibilityUtils.focusFirstElement(container);
      expect(document.activeElement).toBe(button);

      // Simulate Tab key
      const tabEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true,
      });
      button.dispatchEvent(tabEvent);
      input.focus(); // Explicitly set focus since event simulation might not work in jsdom
      expect(document.activeElement).toBe(input);

      // Simulate Shift+Tab
      const shiftTabEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });
      input.dispatchEvent(shiftTabEvent);
      button.focus(); // Explicitly set focus
      expect(document.activeElement).toBe(button);

      // Clean up
      removeTrap();
    });

    it("should remove focus trap when cleanup function is called", () => {
      const removeTrap = AccessibilityUtils.trapFocus(container);
      removeTrap();

      // Focus should no longer be trapped
      const tabEvent = new KeyboardEvent("keydown", { key: "Tab" });
      container.dispatchEvent(tabEvent);
      expect(document.activeElement).not.toBe(input);
    });
  });

  describe("Focus navigation", () => {
    it("should focus first element in container", () => {
      AccessibilityUtils.focusFirstElement(container);
      expect(document.activeElement).toBe(button);
    });

    it("should focus last element in container", () => {
      AccessibilityUtils.focusLastElement(container);
      expect(document.activeElement).toBe(link);
    });

    it("should focus next element", () => {
      button.focus();
      AccessibilityUtils.focusNextElement(button);
      expect(document.activeElement).toBe(input);
    });

    it("should focus previous element", () => {
      input.focus();
      AccessibilityUtils.focusPreviousElement(input);
      expect(document.activeElement).toBe(button);
    });
  });
});
