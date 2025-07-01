/**
 * @module KeyboardUtils
 * @description A collection of utility functions for keyboard event handling, key detection, and input management.
 * @example
 * ```typescript
 * import { KeyboardUtils } from 'houser-js-utils';
 *
 * // Check if key is pressed
 * const isEnter = KeyboardUtils.isEnterKey(event);
 *
 * // Handle keyboard shortcuts
 * KeyboardUtils.onKeyboardShortcut('Ctrl+S', () => saveDocument());
 *
 * // Get key combination
 * const combo = KeyboardUtils.getKeyCombo(event); // "Ctrl+Shift+A"
 * ```
 */

/**
 * Type for keyboard key categories
 */
export type KeyCategory =
  | "alphanumeric"
  | "arrow"
  | "function"
  | "modifier"
  | "navigation"
  | "numeric"
  | "punctuation"
  | "special";

/**
 * Type for keyboard event types
 */
export type KeyboardEventType = "keydown" | "keyup" | "keypress";

export const KeyboardUtils = {
  /**
   * Gets the category of a keyboard key
   * @param key - The key to categorize
   * @returns The category of the key
   *
   * @example
   * ```typescript
   * const category = KeyboardUtils.getKeyCategory('a'); // 'alphanumeric'
   * const arrowCategory = KeyboardUtils.getKeyCategory('ArrowUp'); // 'arrow'
   * const modifierCategory = KeyboardUtils.getKeyCategory('Control'); // 'modifier'
   * ```
   */
  getKeyCategory(key: string): KeyCategory {
    if (this.isAlphanumericKey(key)) return "alphanumeric";
    if (this.isArrowKey({ key } as KeyboardEvent)) return "arrow";
    if (this.isFunctionKey(key)) return "function";
    if (this.isModifierKey({ key } as KeyboardEvent)) return "modifier";
    if (this.isNavigationKey(key)) return "navigation";
    if (this.isPunctuationKey(key)) return "punctuation";
    return "special";
  },

  /**
   * Gets the key combination string for a keyboard event (e.g., "Ctrl+Shift+A")
   * @param event - The keyboard event to analyze
   * @returns A string representing the key combination
   *
   * @example
   * ```typescript
   * // For a Ctrl+Shift+A event
   * const combo = KeyboardUtils.getKeyCombination(event); // 'Ctrl+Shift+A'
   *
   * // For a single key press
   * const singleKey = KeyboardUtils.getKeyCombination(event); // 'A'
   * ```
   */
  getKeyCombination(event: KeyboardEvent): string {
    const modifiers: string[] = [];

    if (event.ctrlKey) modifiers.push("Ctrl");
    if (event.altKey) modifiers.push("Alt");
    if (event.shiftKey) modifiers.push("Shift");
    if (event.metaKey) modifiers.push("Meta");

    const key = event.key.length === 1 ? event.key.toUpperCase() : event.key;

    return modifiers.length > 0 ? `${modifiers.join("+")}+${key}` : key;
  },

  /**
   * Checks if the given keyboard event is for an alphanumeric key
   * @param key - The key to check
   * @returns True if the key is alphanumeric
   *
   * @example
   * ```typescript
   * const isAlpha = KeyboardUtils.isAlphanumericKey('a'); // true
   * const isNum = KeyboardUtils.isAlphanumericKey('1'); // true
   * const isSpecial = KeyboardUtils.isAlphanumericKey('@'); // false
   * ```
   */
  isAlphanumericKey(key: string): boolean {
    return /^[a-zA-Z0-9]$/.test(key);
  },

  /**
   * Checks if the given keyboard event is for an arrow key
   * @param event - The keyboard event to check
   * @returns True if the event is for an arrow key
   *
   * @example
   * ```typescript
   * const isArrow = KeyboardUtils.isArrowKey(event); // true for ArrowUp, ArrowDown, etc.
   * ```
   */
  isArrowKey(event: KeyboardEvent): boolean {
    return ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
      event.key
    );
  },

  /**
   * Checks if the given keyboard event is for the Backspace key
   * @param event - The keyboard event to check
   * @returns True if the event is for the Backspace key
   *
   * @example
   * ```typescript
   * const isBackspace = KeyboardUtils.isBackspaceKey(event); // true for Backspace key
   * ```
   */
  isBackspaceKey(event: KeyboardEvent): boolean {
    return event.key === "Backspace" || event.keyCode === 8;
  },

  /**
   * Checks if the given keyboard event is for the Delete key
   * @param event - The keyboard event to check
   * @returns True if the event is for the Delete key
   *
   * @example
   * ```typescript
   * const isDelete = KeyboardUtils.isDeleteKey(event); // true for Delete key
   * ```
   */
  isDeleteKey(event: KeyboardEvent): boolean {
    return event.key === "Delete" || event.keyCode === 46;
  },

  /**
   * Checks if the given keyboard event is for the Enter key
   * @param event - The keyboard event to check
   * @returns True if the event is for the Enter key
   *
   * @example
   * ```typescript
   * const isEnter = KeyboardUtils.isEnterKey(event); // true for Enter key
   * ```
   */
  isEnterKey(event: KeyboardEvent): boolean {
    return (
      event.key === "Enter" || event.keyCode === 13 || event.charCode === 13
    );
  },

  /**
   * Checks if the given keyboard event is for the Escape key
   * @param event - The keyboard event to check
   * @returns True if the event is for the Escape key
   *
   * @example
   * ```typescript
   * const isEscape = KeyboardUtils.isEscapeKey(event); // true for Escape key
   * ```
   */
  isEscapeKey(event: KeyboardEvent): boolean {
    return event.key === "Escape" || event.keyCode === 27;
  },

  /**
   * Checks if the given keyboard event is for a function key (F1-F12)
   * @param key - The key to check
   * @returns True if the key is a function key
   *
   * @example
   * ```typescript
   * const isFunction = KeyboardUtils.isFunctionKey('F1'); // true
   * const isNotFunction = KeyboardUtils.isFunctionKey('A'); // false
   * ```
   */
  isFunctionKey(key: string): boolean {
    return /^F[1-9]|F1[0-2]$/.test(key);
  },

  /**
   * Checks if the given keyboard event is for a modifier key
   * @param event - The keyboard event to check
   * @returns True if the event is for a modifier key
   *
   * @example
   * ```typescript
   * const isModifier = KeyboardUtils.isModifierKey(event); // true for Control, Alt, Shift, Meta
   * ```
   */
  isModifierKey(event: KeyboardEvent): boolean {
    return ["Control", "Alt", "Shift", "Meta"].includes(event.key);
  },

  /**
   * Checks if the given keyboard event is for a navigation key
   * @param key - The key to check
   * @returns True if the key is a navigation key
   *
   * @example
   * ```typescript
   * const isNav = KeyboardUtils.isNavigationKey('Home'); // true
   * const isNotNav = KeyboardUtils.isNavigationKey('A'); // false
   * ```
   */
  isNavigationKey(key: string): boolean {
    return [
      "Home",
      "End",
      "PageUp",
      "PageDown",
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
    ].includes(key);
  },

  /**
   * Checks if the given keyboard event is for a numeric key
   * @param key - The key to check
   * @returns True if the key is numeric
   *
   * @example
   * ```typescript
   * const isNum = KeyboardUtils.isNumericKey('1'); // true
   * const isNotNum = KeyboardUtils.isNumericKey('A'); // false
   * ```
   */
  isNumericKey(key: string): boolean {
    return /^[0-9]$/.test(key);
  },

  /**
   * Checks if the given keyboard event is for a punctuation key
   * @param key - The key to check
   * @returns True if the key is punctuation
   *
   * @example
   * ```typescript
   * const isPunct = KeyboardUtils.isPunctuationKey('!'); // true
   * const isNotPunct = KeyboardUtils.isPunctuationKey('A'); // false
   * ```
   */
  isPunctuationKey(key: string): boolean {
    return /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]$/.test(key);
  },

  /**
   * Checks if the given keyboard event is for the Space key
   * @param event - The keyboard event to check
   * @returns True if the event is for the Space key
   *
   * @example
   * ```typescript
   * const isSpace = KeyboardUtils.isSpaceKey(event); // true for Space key
   * ```
   */
  isSpaceKey(event: KeyboardEvent): boolean {
    return event.key === " " || event.keyCode === 32;
  },

  /**
   * Checks if the given keyboard event is for the Tab key
   * @param event - The keyboard event to check
   * @returns True if the event is for the Tab key
   *
   * @example
   * ```typescript
   * const isTab = KeyboardUtils.isTabKey(event); // true for Tab key
   * ```
   */
  isTabKey(event: KeyboardEvent): boolean {
    return event.key === "Tab" || event.keyCode === 9;
  },

  /**
   * Simulates a click event on the target element when Enter key is pressed
   * @param event - The keyboard event to handle
   *
   * @example
   * ```typescript
   * // Add to a button's keydown event
   * button.addEventListener('keydown', (event) => {
   *   KeyboardUtils.simulateClickOnEnter(event);
   * });
   * ```
   */
  simulateClickOnEnter(event: KeyboardEvent): void {
    if (this.isEnterKey(event)) {
      (event.target as HTMLElement).click();
    }
  },

  /**
   * Stops the default action and prevents event propagation
   * @param event - The keyboard event to handle
   *
   * @example
   * ```typescript
   * // Prevent default behavior and stop propagation
   * element.addEventListener('keydown', (event) => {
   *   KeyboardUtils.stopEvent(event);
   * });
   * ```
   */
  stopEvent(event: KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();
  },
};
