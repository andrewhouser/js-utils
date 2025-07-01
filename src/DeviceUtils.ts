/**
 * @module DeviceUtils
 * @description A collection of utility functions for device detection and capability checking.
 * @example
 * ```typescript
 * import { DeviceUtils } from 'houser-js-utils';
 *
 * // Check if running on mobile device
 * const isMobile = DeviceUtils.isMobile();
 *
 * // Get device type
 * const deviceType = DeviceUtils.getDeviceType();
 *
 * // Check for touch support
 * const hasTouch = DeviceUtils.isTouchDevice();
 * ```
 */

export const DeviceUtils = {
  /**
   * Adds a listener for online/offline status changes
   * @param callback - Function to call when status changes
   * @returns Function to remove the listener
   */
  addOnlineStatusListener(callback: (isOnline: boolean) => void): () => void {
    const handleChange = () => callback(navigator.onLine);
    window.addEventListener("online", handleChange);
    window.addEventListener("offline", handleChange);
    return () => {
      window.removeEventListener("online", handleChange);
      window.removeEventListener("offline", handleChange);
    };
  },

  /**
   * Gets the battery level of the device
   * @returns Promise resolving to battery level (0-1) or null if not available
   */
  async getBatteryLevel(): Promise<number | null> {
    if (!("getBattery" in navigator)) return null;
    try {
      const battery = await (navigator as any).getBattery();
      return battery.level;
    } catch {
      return null;
    }
  },

  /**
   * Gets the connection type of the device
   * @returns Connection type or null if not available
   */
  getConnectionType(): string | null {
    if (!("connection" in navigator)) return null;
    return (navigator as any).connection?.effectiveType || null;
  },

  /**
   * Gets the device type (mobile, tablet, desktop)
   * @returns Device type
   */
  getDeviceType(): "mobile" | "tablet" | "desktop" {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "tablet";
    }
    if (
      /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      return "mobile";
    }
    return "desktop";
  },

  /**
   * Gets the number of CPU cores available
   * @returns Number of CPU cores
   */
  getHardwareConcurrency(): number {
    return navigator.hardwareConcurrency || 1;
  },

  /**
   * Gets the device language
   * @returns Device language
   */
  getLanguage(): string {
    return navigator.language;
  },

  /**
   * Gets the device memory in GB
   * @returns Device memory or null if not available
   */
  getMemory(): number | null {
    if (!("deviceMemory" in navigator)) return null;
    return (navigator as any).deviceMemory || null;
  },

  /**
   * Gets the device orientation
   * @returns Device orientation
   */
  getOrientation(): "portrait" | "landscape" {
    return window.innerHeight > window.innerWidth ? "portrait" : "landscape";
  },

  /**
   * Gets the device pixel ratio
   * @returns Device pixel ratio
   */
  getPixelRatio(): number {
    return window.devicePixelRatio || 1;
  },

  /**
   * Gets the device platform
   * @returns Device platform
   */
  getPlatform(): string {
    if ("userAgentData" in navigator) {
      return (navigator as any).userAgentData.platform || "";
    }
    return navigator.userAgent;
  },

  /**
   * Gets the screen dimensions
   * @returns Object containing screen width and height
   */
  getScreenDimensions(): { width: number; height: number } {
    return {
      width: window.screen.width,
      height: window.screen.height,
    };
  },

  /**
   * Gets the device vendor
   * @returns Device vendor
   */
  getVendor(): string {
    if ("userAgentData" in navigator) {
      return (navigator as any).userAgentData.brands[0]?.brand || "";
    }
    return navigator.userAgent;
  },

  /**
   * Checks if a string is a valid MAC address
   * @param mac - MAC address to validate
   * @returns True if valid, false otherwise
   */
  isMacAddress(mac: string): boolean {
    return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(mac);
  },

  /**
   * Checks if the device is a mobile device
   * @returns True if mobile device
   */
  isMobile(): boolean {
    return this.getDeviceType() === "mobile";
  },

  /**
   * Checks if the device is online
   * @returns True if online
   */
  isOnline(): boolean {
    return navigator.onLine;
  },

  /**
   * Checks if the device supports touch events
   * @returns True if touch is supported
   */
  supportsTouch(): boolean {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  },
};
