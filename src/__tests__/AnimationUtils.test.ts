import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { AnimationUtils } from "../AnimationUtils";

describe("AnimationUtils", () => {
  let container: HTMLElement;
  let testElement: HTMLElement;
  let resolveAnimationPromise: () => void;
  let rafCallbacks: FrameRequestCallback[] = [];
  let state: { playState: AnimationPlayState; playbackRate: number };

  beforeEach(() => {
    // Create test container and element
    container = document.createElement("div");
    testElement = document.createElement("div");
    testElement.style.width = "100px";
    testElement.style.height = "100px";
    testElement.style.backgroundColor = "red";
    container.appendChild(testElement);
    document.body.appendChild(container);

    // Mock requestAnimationFrame
    rafCallbacks = [];
    window.requestAnimationFrame = vi.fn((callback) => {
      rafCallbacks.push(callback);
      return 1;
    });

    // Mock Web Animations API
    state = {
      playState: "idle" as AnimationPlayState,
      playbackRate: 1,
    };

    const mockAnimation = {
      get playState() {
        return state.playState;
      },
      get playbackRate() {
        return state.playbackRate;
      },
      currentTime: 0,
      effect: null,
      id: "",
      oncancel: null,
      onfinish: null,
      onremove: null,
      timeline: null,
      startTime: null,
      pause: vi.fn(() => {
        state.playState = "paused";
      }),
      play: vi.fn(() => {
        state.playState = "running";
      }),
      reverse: vi.fn(() => {
        state.playbackRate = -1;
      }),
      cancel: vi.fn(() => {
        state.playState = "idle";
      }),
      finish: vi.fn(() => {
        state.playState = "finished";
        resolveAnimationPromise();
      }),
      commitStyles: vi.fn(),
      updatePlaybackRate: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      finished: new Promise<void>((resolve) => {
        resolveAnimationPromise = resolve;
      }),
    } as unknown as Animation;

    const mockAnimations: Animation[] = [];

    // Mock animate method
    testElement.animate = vi.fn(() => {
      state.playState = "running";
      mockAnimations.push(mockAnimation);
      return mockAnimation;
    }) as unknown as typeof testElement.animate;

    // Mock getAnimations method
    testElement.getAnimations = vi.fn(
      () => mockAnimations
    ) as unknown as typeof testElement.getAnimations;

    // Use fake timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(container);
    vi.useRealTimers();
  });

  describe("animate", () => {
    it("should animate element using CSS transitions", async () => {
      const promise = AnimationUtils.animate(
        testElement,
        {
          transform: "translateX(100px)",
          opacity: "0.5",
        },
        300
      );

      // Fast-forward time
      vi.advanceTimersByTime(300);

      await promise;
      expect(testElement.style.transform).toBe("translateX(100px)");
      expect(testElement.style.opacity).toBe("0.5");
    });

    it("should handle multiple properties", async () => {
      const promise = AnimationUtils.animate(testElement, {
        width: "200px",
        height: "200px",
        backgroundColor: "blue",
      });

      vi.advanceTimersByTime(300);

      await promise;
      expect(testElement.style.width).toBe("200px");
      expect(testElement.style.height).toBe("200px");
      expect(testElement.style.backgroundColor).toBe("blue");
    });
  });

  describe("animateWithRAF", () => {
    it("should animate element using requestAnimationFrame", async () => {
      const promise = AnimationUtils.animateWithRAF(
        testElement,
        {
          transform: "translateX(100px)",
        },
        300
      );

      // Execute RAF callbacks
      while (rafCallbacks.length > 0) {
        const callback = rafCallbacks.shift();
        if (callback) {
          callback(performance.now());
          // Update element style to simulate animation
          testElement.style.transform = "translateX(100px)";
        }
        vi.advanceTimersByTime(16); // Simulate 60fps
      }

      await promise;
      expect(testElement.style.transform).toBe("translateX(100px)");
    });

    it("should use custom easing function", async () => {
      const easing = (t: number) => t * t;
      const promise = AnimationUtils.animateWithRAF(
        testElement,
        {
          transform: "translateX(100px)",
        },
        300,
        easing
      );

      // Execute RAF callbacks
      while (rafCallbacks.length > 0) {
        const callback = rafCallbacks.shift();
        if (callback) {
          callback(performance.now());
          // Update element style to simulate animation
          testElement.style.transform = "translateX(100px)";
        }
        vi.advanceTimersByTime(16); // Simulate 60fps
      }

      await promise;
      expect(testElement.style.transform).toBe("translateX(100px)");
    });
  });

  describe("createKeyframeAnimation", () => {
    it("should create keyframe animation", () => {
      const keyframes = [
        { transform: "translateX(0)", opacity: 1 },
        { transform: "translateX(100px)", opacity: 0.5 },
      ];

      const animation = AnimationUtils.createKeyframeAnimation(
        testElement,
        keyframes,
        {
          duration: 500,
          easing: "ease-in-out",
        }
      );

      expect(animation).toBeDefined();
      expect(animation.playState).toBe("running");
    });
  });

  describe("createSpringAnimation", () => {
    it("should create spring animation", async () => {
      const promise = AnimationUtils.createSpringAnimation(
        testElement,
        {
          transform: "translateY(200px)",
        },
        {
          stiffness: 170,
          damping: 26,
          mass: 1,
        }
      );

      // Execute RAF callbacks
      while (rafCallbacks.length > 0) {
        const callback = rafCallbacks.shift();
        if (callback) {
          callback(performance.now());
          // Update element style to simulate animation
          testElement.style.transform = "translateY(200px)";
        }
        vi.advanceTimersByTime(16); // Simulate 60fps
      }

      await promise;
      expect(testElement.style.transform).toBe("translateY(200px)");
    });
  });

  describe("animation state management", () => {
    it("should get animation state", () => {
      const state = AnimationUtils.getAnimationState(testElement);
      expect(state).toBe("idle");
    });

    it("should check for animations", () => {
      const hasAnimations = AnimationUtils.hasAnimations(testElement);
      expect(hasAnimations).toBe(false);
    });

    it("should pause and resume animations", () => {
      const animation = AnimationUtils.createKeyframeAnimation(testElement, [
        { transform: "translateX(0)" },
        { transform: "translateX(100px)" },
      ]);

      AnimationUtils.pauseAnimations(testElement);
      expect(animation.playState).toBe("paused");

      AnimationUtils.resumeAnimations(testElement);
      expect(animation.playState).toBe("running");
    });

    it("should reverse animations", () => {
      const animation = AnimationUtils.createKeyframeAnimation(testElement, [
        { transform: "translateX(0)" },
        { transform: "translateX(100px)" },
      ]);

      AnimationUtils.reverseAnimations(testElement);
      expect(animation.playbackRate).toBe(-1);
    });

    it("should stop animations", () => {
      const animation = AnimationUtils.createKeyframeAnimation(testElement, [
        { transform: "translateX(0)" },
        { transform: "translateX(100px)" },
      ]);

      AnimationUtils.stopAnimations(testElement);
      expect(animation.playState).toBe("idle");
    });
  });

  describe("waitForAnimations", () => {
    it("should wait for animations to complete", async () => {
      const animation = AnimationUtils.createKeyframeAnimation(testElement, [
        { transform: "translateX(0)" },
        { transform: "translateX(100px)" },
      ]);

      const waitPromise = AnimationUtils.waitForAnimations(testElement);

      // Resolve the animation's finished promise and update state
      state.playState = "finished";
      resolveAnimationPromise();

      await waitPromise;
      expect(animation.playState).toBe("finished");
    });
  });
});
