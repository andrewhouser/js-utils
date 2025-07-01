/**
 * @module AnimationUtils
 * @description A collection of utility functions for handling animations in web applications.
 * Provides methods for CSS transitions, requestAnimationFrame animations, keyframe animations,
 * and spring physics-based animations.
 *
 * @example
 * ```typescript
 * import { AnimationUtils } from 'js-utils';
 *
 * // Animate an element using CSS transitions
 * const element = document.querySelector('.box');
 * await AnimationUtils.animate(element, {
 *   transform: 'translateX(100px)',
 *   opacity: '0.5'
 * });
 *
 * // Create a spring animation
 * await AnimationUtils.createSpringAnimation(element, {
 *   transform: 'translateY(200px)'
 * }, {
 *   stiffness: 170,
 *   damping: 26
 * });
 * ```
 */

/**
 * Spring animation configuration options
 */
interface SpringOptions {
  /** Spring stiffness coefficient (default: 170) */
  stiffness?: number;
  /** Damping coefficient (default: 26) */
  damping?: number;
  /** Mass of the animated object (default: 1) */
  mass?: number;
  /** Maximum duration of the animation in milliseconds (default: 300) */
  duration?: number;
}

export const AnimationUtils = {
  /**
   * Animates an element using CSS transitions
   * @param element - The HTML element to animate
   * @param properties - CSS properties to animate
   * @param duration - Animation duration in milliseconds (default: 300)
   * @param easing - CSS easing function (default: 'ease')
   * @returns Promise that resolves when animation completes
   * @example
   * ```typescript
   * const element = document.querySelector('.box');
   * await AnimationUtils.animate(element, {
   *   transform: 'translateX(100px)',
   *   opacity: '0.5'
   * }, 500, 'ease-in-out');
   * ```
   */
  animate(
    element: HTMLElement,
    properties: Partial<CSSStyleDeclaration>,
    duration = 300,
    easing = "ease"
  ): Promise<void> {
    return new Promise((resolve) => {
      const startValues: { [key: string]: number } = {};
      const endValues: { [key: string]: number } = {};

      // Get start values
      Object.keys(properties).forEach((key) => {
        const value = properties[key as keyof CSSStyleDeclaration];
        if (value !== undefined) {
          const startValue = parseFloat(
            getComputedStyle(element)[
              key as keyof CSSStyleDeclaration
            ] as string
          );
          const endValue = parseFloat(value as string);
          if (!isNaN(startValue) && !isNaN(endValue)) {
            startValues[key] = startValue;
            endValues[key] = endValue;
          }
        }
      });

      // Set initial transition
      element.style.transition = `all ${duration}ms ${easing}`;

      // Set end values
      Object.keys(properties).forEach((key) => {
        const value = properties[key as keyof CSSStyleDeclaration];
        if (value !== undefined) {
          (element.style as any)[key] = value;
        }
      });

      // Handle animation end
      const handleTransitionEnd = () => {
        element.removeEventListener("transitionend", handleTransitionEnd);
        element.style.transition = "";
        resolve();
      };

      element.addEventListener("transitionend", handleTransitionEnd);

      // Fallback timeout
      setTimeout(handleTransitionEnd, duration);
    });
  },

  /**
   * Animates an element using requestAnimationFrame for smoother animations
   * @param element - The HTML element to animate
   * @param properties - CSS properties to animate
   * @param duration - Animation duration in milliseconds (default: 300)
   * @param easing - Custom easing function (default: linear)
   * @returns Promise that resolves when animation completes
   * @example
   * ```typescript
   * const element = document.querySelector('.box');
   * await AnimationUtils.animateWithRAF(element, {
   *   transform: 'translateX(100px)'
   * }, 500, (t) => t * t); // Quadratic easing
   * ```
   */
  animateWithRAF(
    element: HTMLElement,
    properties: Partial<CSSStyleDeclaration>,
    duration = 300,
    easing = (t: number) => t
  ): Promise<void> {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const startValues: { [key: string]: number } = {};
      const endValues: { [key: string]: number } = {};

      // Get start values
      Object.keys(properties).forEach((key) => {
        const value = properties[key as keyof CSSStyleDeclaration];
        if (value !== undefined) {
          const startValue = parseFloat(
            getComputedStyle(element)[
              key as keyof CSSStyleDeclaration
            ] as string
          );
          const endValue = parseFloat(value as string);
          if (!isNaN(startValue) && !isNaN(endValue)) {
            startValues[key] = startValue;
            endValues[key] = endValue;
          }
        }
      });

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easing(progress);

        Object.keys(startValues).forEach((key) => {
          const startValue = startValues[key];
          const endValue = endValues[key];
          const currentValue =
            startValue + (endValue - startValue) * easedProgress;
          (element.style as any)[key] = `${currentValue}px`;
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  },

  /**
   * Creates a keyframe animation using the Web Animations API
   * @param element - The HTML element to animate
   * @param keyframes - Array of keyframe objects
   * @param options - Animation options
   * @returns Animation object
   * @example
   * ```typescript
   * const element = document.querySelector('.box');
   * const animation = AnimationUtils.createKeyframeAnimation(element, [
   *   { transform: 'translateX(0)', opacity: 1 },
   *   { transform: 'translateX(100px)', opacity: 0.5 }
   * ], {
   *   duration: 500,
   *   easing: 'ease-in-out'
   * });
   * ```
   */
  createKeyframeAnimation(
    element: HTMLElement,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions = {}
  ): Animation {
    return element.animate(keyframes, {
      duration: 300,
      easing: "ease",
      fill: "forwards",
      ...options,
    });
  },

  /**
   * Creates a spring physics-based animation
   * @param element - The HTML element to animate
   * @param properties - CSS properties to animate
   * @param options - Spring animation configuration
   * @returns Promise that resolves when animation completes
   * @example
   * ```typescript
   * const element = document.querySelector('.box');
   * await AnimationUtils.createSpringAnimation(element, {
   *   transform: 'translateY(200px)'
   * }, {
   *   stiffness: 170,
   *   damping: 26,
   *   mass: 1
   * });
   * ```
   */
  createSpringAnimation(
    element: HTMLElement,
    properties: Partial<CSSStyleDeclaration>,
    options: SpringOptions = {}
  ): Promise<void> {
    const { stiffness = 170, damping = 26, mass = 1, duration = 300 } = options;

    return new Promise((resolve) => {
      const startTime = performance.now();
      const startValues: { [key: string]: number } = {};
      const endValues: { [key: string]: number } = {};
      const velocities: { [key: string]: number } = {};

      // Get start values
      Object.keys(properties).forEach((key) => {
        const value = properties[key as keyof CSSStyleDeclaration];
        if (value !== undefined) {
          const startValue = parseFloat(
            getComputedStyle(element)[
              key as keyof CSSStyleDeclaration
            ] as string
          );
          const endValue = parseFloat(value as string);
          if (!isNaN(startValue) && !isNaN(endValue)) {
            startValues[key] = startValue;
            endValues[key] = endValue;
            velocities[key] = 0;
          }
        }
      });

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        if (elapsed >= duration) {
          Object.keys(endValues).forEach((key) => {
            (element.style as any)[key] = `${endValues[key]}px`;
          });
          resolve();
          return;
        }

        Object.keys(startValues).forEach((key) => {
          const startValue = startValues[key];
          const endValue = endValues[key];
          const currentValue = parseFloat(
            (element.style as any)[key] || startValue
          );
          const velocity = velocities[key];

          const displacement = endValue - currentValue;
          const spring = stiffness * displacement;
          const damper = damping * velocity;
          const acceleration = (spring - damper) / mass;

          velocities[key] = velocity + acceleration * (elapsed / 1000);
          const newValue = currentValue + velocities[key] * (elapsed / 1000);
          (element.style as any)[key] = `${newValue}px`;
        });

        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    });
  },

  /**
   * Gets all animations currently running on an element
   * @param element - The HTML element to check
   * @returns Array of Animation objects
   * @example
   * ```typescript
   * const element = document.querySelector('.box');
   * const animations = AnimationUtils.getAnimations(element);
   * ```
   */
  getAnimations(element: HTMLElement): Animation[] {
    return element.getAnimations();
  },

  /**
   * Gets the current animation state of an element
   * @param element - The HTML element to check
   * @returns Current animation state: 'idle', 'running', or 'paused'
   * @example
   * ```typescript
   * const element = document.querySelector('.box');
   * const state = AnimationUtils.getAnimationState(element);
   * if (state === 'running') {
   *   console.log('Element is currently animating');
   * }
   * ```
   */
  getAnimationState(element: HTMLElement): "idle" | "running" | "paused" {
    const animations = element.getAnimations();
    if (animations.length === 0) {
      return "idle";
    }
    return animations.some((animation) => animation.playState === "running")
      ? "running"
      : "paused";
  },

  /**
   * Checks if an element has any active animations
   * @param element - The HTML element to check
   * @returns True if the element has any animations
   * @example
   * ```typescript
   * const element = document.querySelector('.box');
   * if (AnimationUtils.hasAnimations(element)) {
   *   console.log('Element has active animations');
   * }
   * ```
   */
  hasAnimations(element: HTMLElement): boolean {
    return element.getAnimations().length > 0;
  },

  /**
   * Pauses all animations on an element
   * @param element - The HTML element to pause animations on
   * @example
   * ```typescript
   * const element = document.querySelector('.box');
   * AnimationUtils.pauseAnimations(element);
   * ```
   */
  pauseAnimations(element: HTMLElement): void {
    element.getAnimations().forEach((animation) => animation.pause());
  },

  /**
   * Resumes all paused animations on an element
   * @param element - The HTML element to resume animations on
   * @example
   * ```typescript
   * const element = document.querySelector('.box');
   * AnimationUtils.resumeAnimations(element);
   * ```
   */
  resumeAnimations(element: HTMLElement): void {
    element.getAnimations().forEach((animation) => animation.play());
  },

  /**
   * Reverses the direction of all animations on an element
   * @param element - The HTML element to reverse animations on
   * @example
   * ```typescript
   * const element = document.querySelector('.box');
   * AnimationUtils.reverseAnimations(element);
   * ```
   */
  reverseAnimations(element: HTMLElement): void {
    element.getAnimations().forEach((animation) => animation.reverse());
  },

  /**
   * Stops and removes all animations from an element
   * @param element - The HTML element to stop animations on
   * @example
   * ```typescript
   * const element = document.querySelector('.box');
   * AnimationUtils.stopAnimations(element);
   * ```
   */
  stopAnimations(element: HTMLElement): void {
    element.getAnimations().forEach((animation) => animation.cancel());
  },

  /**
   * Waits for all animations on an element to complete
   * @param element - The HTML element to wait for
   * @returns Promise that resolves when all animations complete
   * @example
   * ```typescript
   * const element = document.querySelector('.box');
   * await AnimationUtils.waitForAnimations(element);
   * console.log('All animations completed');
   * ```
   */
  async waitForAnimations(element: HTMLElement): Promise<void> {
    const animations = element.getAnimations();
    await Promise.all(animations.map((animation) => animation.finished));
  },
};
