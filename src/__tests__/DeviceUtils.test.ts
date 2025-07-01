import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { DeviceUtils } from "../DeviceUtils";

describe("DeviceUtils", () => {
  let originalNavigator: Navigator;
  let originalWindow: Window & typeof globalThis;

  beforeEach(() => {
    // Save original navigator and window
    originalNavigator = global.navigator;
    originalWindow = global.window;

    // Mock navigator
    global.navigator = {
      ...originalNavigator,
      onLine: true,
      language: "en-US",
      hardwareConcurrency: 8,
      userAgent: "Mozilla/5.0",
      maxTouchPoints: 0,
    } as Navigator;

    // Mock window with event listener methods
    const mockWindow = {
      ...originalWindow,
      innerHeight: 800,
      innerWidth: 1200,
      screen: {
        ...originalWindow.screen,
        width: 1920,
        height: 1080,
      },
      devicePixelRatio: 1,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      ontouchstart: undefined,
    };

    global.window = mockWindow as unknown as Window & typeof globalThis;
  });

  afterEach(() => {
    // Restore original navigator and window
    global.navigator = originalNavigator;
    global.window = originalWindow;
    vi.clearAllMocks();
  });

  describe("addOnlineStatusListener", () => {
    it("should add online/offline event listeners", () => {
      const callback = vi.fn();
      const removeListener = DeviceUtils.addOnlineStatusListener(callback);

      // Verify event listeners were added
      expect(window.addEventListener).toHaveBeenCalledWith(
        "online",
        expect.any(Function)
      );
      expect(window.addEventListener).toHaveBeenCalledWith(
        "offline",
        expect.any(Function)
      );

      // Get the handler function that was registered
      const onlineHandler = (window.addEventListener as any).mock.calls[0][1];
      const offlineHandler = (window.addEventListener as any).mock.calls[1][1];

      // Simulate online event
      (navigator as any).onLine = true;
      onlineHandler();
      expect(callback).toHaveBeenCalledWith(true);

      // Simulate offline event
      (navigator as any).onLine = false;
      offlineHandler();
      expect(callback).toHaveBeenCalledWith(false);

      // Test cleanup
      removeListener();
      expect(window.removeEventListener).toHaveBeenCalledWith(
        "online",
        onlineHandler
      );
      expect(window.removeEventListener).toHaveBeenCalledWith(
        "offline",
        offlineHandler
      );
    });
  });

  describe("getBatteryLevel", () => {
    it("should return battery level when available", async () => {
      const mockBattery = { level: 0.75 };
      (navigator as any).getBattery = vi.fn().mockResolvedValue(mockBattery);

      const level = await DeviceUtils.getBatteryLevel();
      expect(level).toBe(0.75);
    });

    it("should return null when battery API is not available", async () => {
      delete (navigator as any).getBattery;
      const level = await DeviceUtils.getBatteryLevel();
      expect(level).toBeNull();
    });
  });

  describe("getConnectionType", () => {
    it("should return connection type when available", () => {
      (navigator as any).connection = { effectiveType: "4g" };
      expect(DeviceUtils.getConnectionType()).toBe("4g");
    });

    it("should return null when connection API is not available", () => {
      delete (navigator as any).connection;
      expect(DeviceUtils.getConnectionType()).toBeNull();
    });
  });

  describe("getDeviceType", () => {
    it("should detect mobile device", () => {
      (navigator as any).userAgent =
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)";
      expect(DeviceUtils.getDeviceType()).toBe("mobile");
    });

    it("should detect tablet device", () => {
      (navigator as any).userAgent =
        "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)";
      expect(DeviceUtils.getDeviceType()).toBe("tablet");
    });

    it("should detect desktop device", () => {
      (navigator as any).userAgent =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";
      expect(DeviceUtils.getDeviceType()).toBe("desktop");
    });
  });

  describe("getHardwareConcurrency", () => {
    it("should return number of CPU cores", () => {
      expect(DeviceUtils.getHardwareConcurrency()).toBe(8);
    });

    it("should return 1 when hardwareConcurrency is not available", () => {
      delete (navigator as any).hardwareConcurrency;
      expect(DeviceUtils.getHardwareConcurrency()).toBe(1);
    });
  });

  describe("getLanguage", () => {
    it("should return device language", () => {
      expect(DeviceUtils.getLanguage()).toBe("en-US");
    });
  });

  describe("getMemory", () => {
    it("should return device memory when available", () => {
      (navigator as any).deviceMemory = 8;
      expect(DeviceUtils.getMemory()).toBe(8);
    });

    it("should return null when device memory is not available", () => {
      delete (navigator as any).deviceMemory;
      expect(DeviceUtils.getMemory()).toBeNull();
    });
  });

  describe("getOrientation", () => {
    it("should return portrait orientation", () => {
      (window as any).innerHeight = 1200;
      (window as any).innerWidth = 800;
      expect(DeviceUtils.getOrientation()).toBe("portrait");
    });

    it("should return landscape orientation", () => {
      (window as any).innerHeight = 800;
      (window as any).innerWidth = 1200;
      expect(DeviceUtils.getOrientation()).toBe("landscape");
    });
  });

  describe("getPixelRatio", () => {
    it("should return device pixel ratio", () => {
      (window as any).devicePixelRatio = 2;
      expect(DeviceUtils.getPixelRatio()).toBe(2);
    });

    it("should return 1 when device pixel ratio is not available", () => {
      delete (window as any).devicePixelRatio;
      expect(DeviceUtils.getPixelRatio()).toBe(1);
    });
  });

  describe("getScreenDimensions", () => {
    it("should return screen dimensions", () => {
      const dimensions = DeviceUtils.getScreenDimensions();
      expect(dimensions).toEqual({ width: 1920, height: 1080 });
    });
  });

  describe("isMacAddress", () => {
    it("should validate MAC address format", () => {
      expect(DeviceUtils.isMacAddress("00:1A:2B:3C:4D:5E")).toBe(true);
      expect(DeviceUtils.isMacAddress("00-1A-2B-3C-4D-5E")).toBe(true);
      expect(DeviceUtils.isMacAddress("invalid")).toBe(false);
    });
  });

  describe("isMobile", () => {
    it("should detect mobile device", () => {
      (navigator as any).userAgent =
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)";
      expect(DeviceUtils.isMobile()).toBe(true);
    });

    it("should detect non-mobile device", () => {
      (navigator as any).userAgent =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";
      expect(DeviceUtils.isMobile()).toBe(false);
    });
  });

  describe("isOnline", () => {
    it("should return online status", () => {
      (navigator as any).onLine = true;
      expect(DeviceUtils.isOnline()).toBe(true);

      (navigator as any).onLine = false;
      expect(DeviceUtils.isOnline()).toBe(false);
    });
  });

  describe("supportsTouch", () => {
    it("should detect touch support via ontouchstart", () => {
      (window as any).ontouchstart = true;
      (navigator as any).maxTouchPoints = 0;
      expect(DeviceUtils.supportsTouch()).toBe(true);
    });

    it("should detect touch support via maxTouchPoints", () => {
      (window as any).ontouchstart = undefined;
      (navigator as any).maxTouchPoints = 1;
      expect(DeviceUtils.supportsTouch()).toBe(true);
    });

    it("should detect no touch support", () => {
      (window as any).ontouchstart = undefined;
      (navigator as any).maxTouchPoints = 0;
      // Ensure ontouchstart is not in window
      delete (window as any).ontouchstart;
      expect(DeviceUtils.supportsTouch()).toBe(false);
    });
  });
});
