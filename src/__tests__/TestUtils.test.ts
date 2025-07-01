import { describe, it, expect, vi } from "vitest";
import { TestUtils } from "../TestUtils";

describe("TestUtils", () => {
  describe("Event creation utilities", () => {
    (typeof AnimationEvent !== "undefined" ? it : it.skip)(
      "should create a test AnimationEvent",
      () => {
        const evt = TestUtils.createTestAnimationEvent("animationstart", {
          bubbles: true,
        });
        expect(evt).toBeInstanceOf(AnimationEvent);
        expect(evt.type).toBe("animationstart");
        expect(evt.bubbles).toBe(true);
      }
    );

    (typeof ClipboardEvent !== "undefined" ? it : it.skip)(
      "should create a test ClipboardEvent",
      () => {
        const evt = TestUtils.createTestClipboardEvent("copy", {
          bubbles: true,
        });
        expect(evt).toBeInstanceOf(ClipboardEvent);
        expect(evt.type).toBe("copy");
        expect(evt.bubbles).toBe(true);
      }
    );

    (typeof DragEvent !== "undefined" ? it : it.skip)(
      "should create a test DragEvent",
      () => {
        const evt = TestUtils.createTestDragEvent("dragstart", {
          bubbles: true,
        });
        expect(evt).toBeInstanceOf(DragEvent);
        expect(evt.type).toBe("dragstart");
        expect(evt.bubbles).toBe(true);
      }
    );

    it("should create a test Event", () => {
      const evt = TestUtils.createTestEvent("custom", { bubbles: true });
      expect(evt).toBeInstanceOf(Event);
      expect(evt.type).toBe("custom");
      expect(evt.bubbles).toBe(true);
    });

    it("should create a test FocusEvent", () => {
      const evt = TestUtils.createTestFocusEvent("focus", { bubbles: true });
      expect(evt).toBeInstanceOf(FocusEvent);
      expect(evt.type).toBe("focus");
      expect(evt.bubbles).toBe(true);
    });

    it("should create a test InputEvent", () => {
      const evt = TestUtils.createTestInputEvent("input", { bubbles: true });
      expect(evt).toBeInstanceOf(InputEvent);
      expect(evt.type).toBe("input");
      expect(evt.bubbles).toBe(true);
    });

    it("should create a test KeyboardEvent", () => {
      const evt = TestUtils.createTestKeyboardEvent("keydown", { key: "a" });
      expect(evt).toBeInstanceOf(KeyboardEvent);
      expect(evt.type).toBe("keydown");
      expect(evt.key).toBe("a");
    });

    it("should create a test MouseEvent", () => {
      const evt = TestUtils.createTestMouseEvent("click", { bubbles: true });
      expect(evt).toBeInstanceOf(MouseEvent);
      expect(evt.type).toBe("click");
      expect(evt.bubbles).toBe(true);
    });

    it("should create a test TouchEvent", () => {
      const evt = TestUtils.createTestTouchEvent("touchstart", {
        bubbles: true,
      });
      expect(evt).toBeInstanceOf(TouchEvent);
      expect(evt.type).toBe("touchstart");
      expect(evt.bubbles).toBe(true);
    });

    (typeof TransitionEvent !== "undefined" ? it : it.skip)(
      "should create a test TransitionEvent",
      () => {
        const evt = TestUtils.createTestTransitionEvent("transitionend", {
          bubbles: true,
        });
        expect(evt).toBeInstanceOf(TransitionEvent);
        expect(evt.type).toBe("transitionend");
        expect(evt.bubbles).toBe(true);
      }
    );
  });

  describe("Test data generators", () => {
    it("should create a test data generator", () => {
      const gen = TestUtils.createTestDataGenerator({ name: "John", age: 30 });
      expect(gen()).toEqual({ name: "John", age: 30 });
      expect(gen({ age: 40 })).toEqual({ name: "John", age: 40 });
    });

    it("should create a test data array generator", () => {
      const arrGen = TestUtils.createTestDataArrayGenerator({ foo: 1, bar: 2 });
      expect(arrGen(3)).toEqual([
        { foo: 1, bar: 2 },
        { foo: 1, bar: 2 },
        { foo: 1, bar: 2 },
      ]);
      expect(arrGen(2, { bar: 5 })).toEqual([
        { foo: 1, bar: 5 },
        { foo: 1, bar: 5 },
      ]);
    });
  });

  describe("Mock utilities", () => {
    it("should create a mock function", () => {
      const mock = TestUtils.createMock();
      expect(typeof mock).toBe("function");
      expect(mock()).toBeUndefined();
    });

    it("should create a mock function with implementation", () => {
      const impl = vi.fn((x: number) => x * 2);
      const mock = TestUtils.createMock(impl);
      expect(mock(2)).toBe(4);
      expect(impl).toHaveBeenCalledWith(2);
    });

    it("should create a mock object", () => {
      const obj = { foo: 1, bar: 2 };
      const mockObj = TestUtils.createMockObject(obj);
      expect(mockObj).toBe(obj);
    });

    it("should create a mock promise", async () => {
      const promise = TestUtils.createMockPromise("value");
      await expect(promise).resolves.toBe("value");
    });

    it("should create a mock error promise", async () => {
      const promise = TestUtils.createMockErrorPromise(new Error("fail"));
      await expect(promise).rejects.toThrow("fail");
    });
  });

  describe("Async utilities", () => {
    it("should wait for a number of milliseconds", async () => {
      const start = Date.now();
      await TestUtils.wait(50);
      expect(Date.now() - start).toBeGreaterThanOrEqual(50);
    });

    it("should wait for a condition to be true", async () => {
      let flag = false;
      setTimeout(() => (flag = true), 30);
      await TestUtils.waitFor(() => flag, 100, 10);
      expect(flag).toBe(true);
    });

    it("should throw if waitFor times out", async () => {
      await expect(TestUtils.waitFor(() => false, 50, 10)).rejects.toThrow(
        "Timeout waiting for condition"
      );
    });
  });
});
