import { describe, it, expect, vi } from "vitest";
import { KeyboardUtils } from "../KeyboardUtils";

describe("KeyboardUtils", () => {
  describe("getKeyCategory", () => {
    it("should categorize alphanumeric keys", () => {
      expect(KeyboardUtils.getKeyCategory("a")).toBe("alphanumeric");
      expect(KeyboardUtils.getKeyCategory("1")).toBe("alphanumeric");
      expect(KeyboardUtils.getKeyCategory("Z")).toBe("alphanumeric");
      expect(KeyboardUtils.getKeyCategory("9")).toBe("alphanumeric");
    });

    it("should categorize arrow keys", () => {
      expect(KeyboardUtils.getKeyCategory("ArrowUp")).toBe("arrow");
      expect(KeyboardUtils.getKeyCategory("ArrowDown")).toBe("arrow");
    });

    it("should categorize function keys", () => {
      expect(KeyboardUtils.getKeyCategory("F1")).toBe("function");
      expect(KeyboardUtils.getKeyCategory("F12")).toBe("function");
    });

    it("should categorize modifier keys", () => {
      expect(KeyboardUtils.getKeyCategory("Control")).toBe("modifier");
      expect(KeyboardUtils.getKeyCategory("Shift")).toBe("modifier");
    });

    it("should categorize navigation keys", () => {
      expect(KeyboardUtils.getKeyCategory("Home")).toBe("navigation");
      expect(KeyboardUtils.getKeyCategory("End")).toBe("navigation");
    });

    it("should categorize punctuation keys", () => {
      expect(KeyboardUtils.getKeyCategory("!")).toBe("punctuation");
      expect(KeyboardUtils.getKeyCategory("@")).toBe("punctuation");
    });

    it("should categorize special keys", () => {
      expect(KeyboardUtils.getKeyCategory("Insert")).toBe("special");
      expect(KeyboardUtils.getKeyCategory("PrintScreen")).toBe("special");
    });
  });

  describe("getKeyCombination", () => {
    it("should return single key for non-modifier key", () => {
      const event = new KeyboardEvent("keydown", { key: "a" });
      expect(KeyboardUtils.getKeyCombination(event)).toBe("A");
    });

    it("should return modifier combination", () => {
      const event = new KeyboardEvent("keydown", {
        key: "a",
        ctrlKey: true,
        shiftKey: true,
      });
      expect(KeyboardUtils.getKeyCombination(event)).toBe("Ctrl+Shift+A");
    });

    it("should handle all modifier keys", () => {
      const event = new KeyboardEvent("keydown", {
        key: "a",
        ctrlKey: true,
        altKey: true,
        shiftKey: true,
        metaKey: true,
      });
      expect(KeyboardUtils.getKeyCombination(event)).toBe(
        "Ctrl+Alt+Shift+Meta+A"
      );
    });
  });

  describe("isAlphanumericKey", () => {
    it("should return true for letters", () => {
      expect(KeyboardUtils.isAlphanumericKey("a")).toBe(true);
      expect(KeyboardUtils.isAlphanumericKey("Z")).toBe(true);
    });

    it("should return true for numbers", () => {
      expect(KeyboardUtils.isAlphanumericKey("0")).toBe(true);
      expect(KeyboardUtils.isAlphanumericKey("9")).toBe(true);
    });

    it("should return false for special characters", () => {
      expect(KeyboardUtils.isAlphanumericKey("!")).toBe(false);
      expect(KeyboardUtils.isAlphanumericKey("@")).toBe(false);
    });
  });

  describe("isArrowKey", () => {
    it("should return true for arrow keys", () => {
      const event = new KeyboardEvent("keydown", { key: "ArrowUp" });
      expect(KeyboardUtils.isArrowKey(event)).toBe(true);
    });

    it("should return false for non-arrow keys", () => {
      const event = new KeyboardEvent("keydown", { key: "a" });
      expect(KeyboardUtils.isArrowKey(event)).toBe(false);
    });
  });

  describe("isBackspaceKey", () => {
    it("should return true for Backspace key", () => {
      const event = new KeyboardEvent("keydown", { key: "Backspace" });
      expect(KeyboardUtils.isBackspaceKey(event)).toBe(true);
    });

    it("should return false for other keys", () => {
      const event = new KeyboardEvent("keydown", { key: "a" });
      expect(KeyboardUtils.isBackspaceKey(event)).toBe(false);
    });
  });

  describe("isDeleteKey", () => {
    it("should return true for Delete key", () => {
      const event = new KeyboardEvent("keydown", { key: "Delete" });
      expect(KeyboardUtils.isDeleteKey(event)).toBe(true);
    });

    it("should return false for other keys", () => {
      const event = new KeyboardEvent("keydown", { key: "a" });
      expect(KeyboardUtils.isDeleteKey(event)).toBe(false);
    });
  });

  describe("isEnterKey", () => {
    it("should return true for Enter key", () => {
      const event = new KeyboardEvent("keydown", { key: "Enter" });
      expect(KeyboardUtils.isEnterKey(event)).toBe(true);
    });

    it("should return false for other keys", () => {
      const event = new KeyboardEvent("keydown", { key: "a" });
      expect(KeyboardUtils.isEnterKey(event)).toBe(false);
    });
  });

  describe("isEscapeKey", () => {
    it("should return true for Escape key", () => {
      const event = new KeyboardEvent("keydown", { key: "Escape" });
      expect(KeyboardUtils.isEscapeKey(event)).toBe(true);
    });

    it("should return false for other keys", () => {
      const event = new KeyboardEvent("keydown", { key: "a" });
      expect(KeyboardUtils.isEscapeKey(event)).toBe(false);
    });
  });

  describe("isFunctionKey", () => {
    it("should return true for function keys", () => {
      expect(KeyboardUtils.isFunctionKey("F1")).toBe(true);
      expect(KeyboardUtils.isFunctionKey("F12")).toBe(true);
    });

    it("should return false for non-function keys", () => {
      expect(KeyboardUtils.isFunctionKey("a")).toBe(false);
      expect(KeyboardUtils.isFunctionKey("1")).toBe(false);
    });
  });

  describe("isModifierKey", () => {
    it("should return true for modifier keys", () => {
      const event = new KeyboardEvent("keydown", { key: "Control" });
      expect(KeyboardUtils.isModifierKey(event)).toBe(true);
    });

    it("should return false for non-modifier keys", () => {
      const event = new KeyboardEvent("keydown", { key: "a" });
      expect(KeyboardUtils.isModifierKey(event)).toBe(false);
    });
  });

  describe("isNavigationKey", () => {
    it("should return true for navigation keys", () => {
      expect(KeyboardUtils.isNavigationKey("Home")).toBe(true);
      expect(KeyboardUtils.isNavigationKey("End")).toBe(true);
    });

    it("should return false for non-navigation keys", () => {
      expect(KeyboardUtils.isNavigationKey("a")).toBe(false);
      expect(KeyboardUtils.isNavigationKey("1")).toBe(false);
    });
  });

  describe("isNumericKey", () => {
    it("should return true for numeric keys", () => {
      expect(KeyboardUtils.isNumericKey("0")).toBe(true);
      expect(KeyboardUtils.isNumericKey("9")).toBe(true);
    });

    it("should return false for non-numeric keys", () => {
      expect(KeyboardUtils.isNumericKey("a")).toBe(false);
      expect(KeyboardUtils.isNumericKey("!")).toBe(false);
    });
  });

  describe("isPunctuationKey", () => {
    it("should return true for punctuation keys", () => {
      expect(KeyboardUtils.isPunctuationKey("!")).toBe(true);
      expect(KeyboardUtils.isPunctuationKey("@")).toBe(true);
    });

    it("should return false for non-punctuation keys", () => {
      expect(KeyboardUtils.isPunctuationKey("a")).toBe(false);
      expect(KeyboardUtils.isPunctuationKey("1")).toBe(false);
    });
  });

  describe("isSpaceKey", () => {
    it("should return true for Space key", () => {
      const event = new KeyboardEvent("keydown", { key: " " });
      expect(KeyboardUtils.isSpaceKey(event)).toBe(true);
    });

    it("should return false for other keys", () => {
      const event = new KeyboardEvent("keydown", { key: "a" });
      expect(KeyboardUtils.isSpaceKey(event)).toBe(false);
    });
  });

  describe("isTabKey", () => {
    it("should return true for Tab key", () => {
      const event = new KeyboardEvent("keydown", { key: "Tab" });
      expect(KeyboardUtils.isTabKey(event)).toBe(true);
    });

    it("should return false for other keys", () => {
      const event = new KeyboardEvent("keydown", { key: "a" });
      expect(KeyboardUtils.isTabKey(event)).toBe(false);
    });
  });

  describe("simulateClickOnEnter", () => {
    it("should simulate click on Enter key", () => {
      const mockClick = vi.fn();
      const element = { click: mockClick };
      const event = new KeyboardEvent("keydown", { key: "Enter" });
      Object.defineProperty(event, "target", { value: element });

      KeyboardUtils.simulateClickOnEnter(event);
      expect(mockClick).toHaveBeenCalled();
    });

    it("should not simulate click on other keys", () => {
      const mockClick = vi.fn();
      const element = { click: mockClick };
      const event = new KeyboardEvent("keydown", { key: "a" });
      Object.defineProperty(event, "target", { value: element });

      KeyboardUtils.simulateClickOnEnter(event);
      expect(mockClick).not.toHaveBeenCalled();
    });
  });

  describe("stopEvent", () => {
    it("should prevent default and stop propagation", () => {
      const event = new KeyboardEvent("keydown", { key: "a" });
      const preventDefault = vi.spyOn(event, "preventDefault");
      const stopPropagation = vi.spyOn(event, "stopPropagation");

      KeyboardUtils.stopEvent(event);
      expect(preventDefault).toHaveBeenCalled();
      expect(stopPropagation).toHaveBeenCalled();
    });
  });
});
