import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { DOMUtils } from "../DOMUtils";

describe("DOMUtils", () => {
  let testElement: HTMLElement;
  let mockElement: HTMLElement;

  beforeEach(() => {
    // Create a test element
    testElement = document.createElement("div");
    testElement.className = "test-element";
    testElement.style.width = "100px";
    testElement.style.height = "100px";
    testElement.style.margin = "10px";
    document.body.appendChild(testElement);

    // Mock getBoundingClientRect
    testElement.getBoundingClientRect = vi.fn().mockReturnValue({
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      right: 100,
      bottom: 100,
    });

    // Mock getComputedStyle
    const mockComputedStyle = {
      marginLeft: "10px",
      marginRight: "10px",
      marginTop: "10px",
      marginBottom: "10px",
      getPropertyValue: vi.fn((prop) => {
        switch (prop) {
          case "width":
            return "100px";
          case "height":
            return "100px";
          case "margin-left":
            return "10px";
          case "margin-right":
            return "10px";
          case "margin-top":
            return "10px";
          case "margin-bottom":
            return "10px";
          default:
            return "";
        }
      }),
    };
    window.getComputedStyle = vi.fn().mockReturnValue(mockComputedStyle);

    // Create a style object with getPropertyValue
    const styleObject = {
      width: "100px",
      height: "100px",
      margin: "10px",
      backgroundColor: "",
      getPropertyValue: (name: string) => {
        switch (name) {
          case "width":
            return "100px";
          case "height":
            return "100px";
          case "background-color":
            return styleObject.backgroundColor;
          default:
            return "";
        }
      },
      setProperty: (name: string, value: string) => {
        switch (name) {
          case "background-color":
            styleObject.backgroundColor = value;
            break;
          default:
            styleObject[name as any] = value;
        }
      },
    };

    // Replace the style object
    Object.defineProperty(testElement, "style", {
      value: styleObject,
      writable: true,
    });

    // Mock scrollIntoView
    testElement.scrollIntoView = vi.fn();

    // Create a mock element for testing null cases
    mockElement = document.createElement("div");
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(testElement);
    vi.clearAllMocks();
  });

  describe("Class Manipulation", () => {
    it("should add a class to an element", () => {
      DOMUtils.addClass(testElement, "new-class");
      expect(testElement.classList.contains("new-class")).toBe(true);
    });

    it("should not add a class if it already exists", () => {
      testElement.classList.add("existing-class");
      DOMUtils.addClass(testElement, "existing-class");
      expect(testElement.classList.contains("existing-class")).toBe(true);
    });

    it("should remove a class from an element", () => {
      testElement.classList.add("to-remove");
      DOMUtils.removeClass(testElement, "to-remove");
      expect(testElement.classList.contains("to-remove")).toBe(false);
    });

    it("should toggle a class on an element", () => {
      DOMUtils.toggleClass(testElement, "toggle-class");
      expect(testElement.classList.contains("toggle-class")).toBe(true);

      DOMUtils.toggleClass(testElement, "toggle-class");
      expect(testElement.classList.contains("toggle-class")).toBe(false);
    });

    it("should force toggle a class", () => {
      DOMUtils.toggleClass(testElement, "force-class", true);
      expect(testElement.classList.contains("force-class")).toBe(true);

      DOMUtils.toggleClass(testElement, "force-class", false);
      expect(testElement.classList.contains("force-class")).toBe(false);
    });

    it("should check if an element has a class", () => {
      testElement.classList.add("check-class");
      expect(DOMUtils.hasClass(testElement, "check-class")).toBe(true);
      expect(DOMUtils.hasClass(testElement, "non-existent")).toBe(false);
    });
  });

  describe("Style and Dimensions", () => {
    it("should get computed style of an element", () => {
      const width = DOMUtils.getComputedStyle(testElement, "width");
      expect(width).toBe("100px");
    });

    it("should get element dimensions including margins", () => {
      const dimensions = DOMUtils.getElementDimensions(testElement);
      expect(dimensions.width).toBe(120); // 100px + 10px margin on each side
      expect(dimensions.height).toBe(120); // 100px + 10px margin on each side
    });

    it("should get element offset", () => {
      const offset = DOMUtils.getElementOffset(testElement);
      expect(offset).toHaveProperty("top");
      expect(offset).toHaveProperty("left");
    });

    it("should set style on an element", () => {
      DOMUtils.setStyle(testElement, "backgroundColor", "red");
      expect(testElement.style.getPropertyValue("background-color")).toBe(
        "red"
      );
    });
  });

  describe("Scroll Position", () => {
    it("should get scroll position", () => {
      const position = DOMUtils.getScrollPosition(testElement);
      expect(position).toHaveProperty("scrollTop");
      expect(position).toHaveProperty("scrollLeft");
    });

    it("should set scroll position", () => {
      DOMUtils.setScrollPosition(testElement, {
        scrollTop: 100,
        scrollLeft: 50,
      });
      expect(testElement.scrollTop).toBe(100);
      expect(testElement.scrollLeft).toBe(50);
    });

    it("should scroll element into view", () => {
      DOMUtils.scrollIntoView(testElement);
      expect(testElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
      });
    });
  });

  describe("Element Visibility", () => {
    it("should check if element is in viewport", () => {
      const isVisible = DOMUtils.isElementInViewport(testElement);
      expect(typeof isVisible).toBe("boolean");
    });

    it("should check if element is partially visible", () => {
      const isPartiallyVisible =
        DOMUtils.isElementPartiallyVisible(testElement);
      expect(typeof isPartiallyVisible).toBe("boolean");
    });
  });

  describe("Element Waiting", () => {
    it("should wait for element to be present", async () => {
      const selector = "#test-wait-element";
      const promise = DOMUtils.waitForElement(selector);

      // Create element after a short delay
      setTimeout(() => {
        const element = document.createElement("div");
        element.id = "test-wait-element";
        document.body.appendChild(element);
      }, 100);

      const element = await promise;
      expect(element).not.toBeNull();
      expect(element?.id).toBe("test-wait-element");
    });

    it("should return null if element is not found within timeout", async () => {
      const element = await DOMUtils.waitForElement("#non-existent", 100);
      expect(element).toBeNull();
    });
  });

  describe("Null Element Handling", () => {
    it("should handle null element in addClass", () => {
      expect(() => DOMUtils.addClass(null, "test")).not.toThrow();
    });

    it("should handle null element in removeClass", () => {
      expect(() => DOMUtils.removeClass(null, "test")).not.toThrow();
    });

    it("should handle null element in toggleClass", () => {
      expect(() => DOMUtils.toggleClass(null, "test")).not.toThrow();
    });

    it("should handle null element in getComputedStyle", () => {
      expect(DOMUtils.getComputedStyle(null, "width")).toBe("");
    });

    it("should handle null element in getElementDimensions", () => {
      const dimensions = DOMUtils.getElementDimensions(null);
      expect(dimensions).toEqual({ width: 0, height: 0 });
    });

    it("should handle null element in getElementOffset", () => {
      const offset = DOMUtils.getElementOffset(null);
      expect(offset).toEqual({ top: 0, left: 0 });
    });

    it("should handle null element in getScrollPosition", () => {
      const position = DOMUtils.getScrollPosition(null);
      expect(position).toEqual({ scrollTop: 0, scrollLeft: 0 });
    });

    it("should handle null element in setScrollPosition", () => {
      expect(() =>
        DOMUtils.setScrollPosition(null, { scrollTop: 0, scrollLeft: 0 })
      ).not.toThrow();
    });

    it("should handle null element in setStyle", () => {
      expect(() => DOMUtils.setStyle(null, "width", "100px")).not.toThrow();
    });

    it("should handle null element in scrollIntoView", () => {
      expect(() => DOMUtils.scrollIntoView(null)).not.toThrow();
    });
  });
});
