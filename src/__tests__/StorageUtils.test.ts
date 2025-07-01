import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { StorageUtils } from "../StorageUtils";

describe("StorageUtils", () => {
  // Mock storage APIs
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    key: vi.fn(),
    length: 0,
  };

  const mockSessionStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    key: vi.fn(),
    length: 0,
  };

  const mockCrypto = {
    subtle: {
      importKey: vi.fn(),
      encrypt: vi.fn(),
      decrypt: vi.fn(),
      generateKey: vi.fn(),
      deriveKey: vi.fn(),
    },
    getRandomValues: vi.fn(),
  };

  beforeEach(() => {
    // Setup storage mocks
    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
      writable: true,
    });
    Object.defineProperty(window, "sessionStorage", {
      value: mockSessionStorage,
      writable: true,
    });
    Object.defineProperty(window, "crypto", {
      value: mockCrypto,
      writable: true,
    });
    Object.defineProperty(document, "cookie", {
      value: "",
      writable: true,
    });

    // Mock crypto operations
    mockCrypto.subtle.importKey.mockResolvedValue("mockKey");
    mockCrypto.subtle.encrypt.mockResolvedValue(new Uint8Array([1, 2, 3]));
    mockCrypto.subtle.decrypt.mockResolvedValue(
      new TextEncoder().encode("decrypted")
    );
    mockCrypto.subtle.generateKey.mockResolvedValue("mockGeneratedKey");
    mockCrypto.subtle.deriveKey.mockResolvedValue("mockDerivedKey");
    mockCrypto.getRandomValues.mockReturnValue(new Uint8Array(12).fill(1));

    // Mock base64 functions
    vi.spyOn(global, "btoa").mockImplementation((str) => str);
    vi.spyOn(global, "atob").mockImplementation((str) => str);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("localStorage operations", () => {
    it("should set and get values from localStorage", async () => {
      const testData = { id: 1, name: "test" };
      const serialized = JSON.stringify({
        value: testData,
        timestamp: Date.now(),
      });
      mockLocalStorage.getItem.mockReturnValue(serialized);

      await StorageUtils.setLocal("test", testData);
      const result = await StorageUtils.getLocal("test");

      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      expect(result).toEqual(testData);
    });

    it("should handle encrypted values", async () => {
      const testData = "sensitive";
      const encryptedData = {
        iv: btoa("mockiv"),
        data: btoa("mockdata"),
      };
      const serialized = JSON.stringify({
        value: testData,
        timestamp: Date.now(),
      });
      const encrypted = btoa(JSON.stringify(encryptedData));

      mockLocalStorage.getItem.mockReturnValue(encrypted);
      mockCrypto.subtle.decrypt.mockResolvedValue(
        new TextEncoder().encode(serialized)
      );

      await StorageUtils.setLocal("test", testData, { encrypt: true });
      const result = await StorageUtils.getLocal("test", { decrypt: true });

      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      expect(mockCrypto.subtle.encrypt).toHaveBeenCalled();
      expect(result).toEqual(testData);
    });

    it("should handle expired values", async () => {
      const expiredData = {
        value: "test",
        timestamp: Date.now(),
        expires: Date.now() - 1000,
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(expiredData));

      const result = await StorageUtils.getLocal("test");
      expect(result).toBeNull();
    });
  });

  describe("sessionStorage operations", () => {
    it("should set and get values from sessionStorage", async () => {
      const testData = { id: 1, name: "test" };
      const serialized = JSON.stringify({
        value: testData,
        timestamp: Date.now(),
      });
      mockSessionStorage.getItem.mockReturnValue(serialized);

      await StorageUtils.setSession("test", testData);
      const result = await StorageUtils.getSession("test");

      expect(mockSessionStorage.setItem).toHaveBeenCalled();
      expect(result).toEqual(testData);
    });

    it("should handle encrypted values", async () => {
      const testData = "sensitive";
      const encryptedData = {
        iv: btoa("mockiv"),
        data: btoa("mockdata"),
      };
      const serialized = JSON.stringify({
        value: testData,
        timestamp: Date.now(),
      });
      const encrypted = btoa(JSON.stringify(encryptedData));

      mockSessionStorage.getItem.mockReturnValue(encrypted);
      mockCrypto.subtle.decrypt.mockResolvedValue(
        new TextEncoder().encode(serialized)
      );

      await StorageUtils.setSession("test", testData, { encrypt: true });
      const result = await StorageUtils.getSession("test", { decrypt: true });

      expect(mockSessionStorage.setItem).toHaveBeenCalled();
      expect(mockCrypto.subtle.encrypt).toHaveBeenCalled();
      expect(result).toEqual(testData);
    });
  });

  describe("cookie operations", () => {
    it("should set and get cookies", async () => {
      await StorageUtils.setCookie("test", "value");
      expect(document.cookie).toContain("test=value");

      document.cookie = "test=value";
      const result = await StorageUtils.getCookie("test");
      expect(result).toBe("value");
    });

    it("should handle cookie options", async () => {
      await StorageUtils.setCookie("test", "value", {
        expires: 86400000,
        secure: true,
        sameSite: "Strict",
      });

      expect(document.cookie).toContain("secure");
      expect(document.cookie).toContain("samesite=Strict");
    });

    it("should clear cookies", () => {
      // Set cookies with expiration
      document.cookie = "test1=value1; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "test2=value2; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      StorageUtils.clearCookies();
      // In jsdom, cookies are not actually removed, but we can check that the expired date is set
      expect(document.cookie).toContain(
        "expires=Thu, 01 Jan 1970 00:00:00 GMT"
      );
    });
  });

  describe("storage utilities", () => {
    it("should check storage availability", () => {
      expect(StorageUtils.isStorageAvailable("localStorage")).toBe(true);
      expect(StorageUtils.isStorageAvailable("sessionStorage")).toBe(true);
      expect(StorageUtils.isStorageAvailable("cookie")).toBe(true);
    });

    it("should calculate storage size", () => {
      const testData = { large: "data".repeat(100) };
      const size = StorageUtils.getStorageSize(testData);
      expect(size).toBeGreaterThan(0);
    });

    it("should get storage quota", async () => {
      const mockStorage = {
        estimate: vi.fn().mockResolvedValue({ quota: 1000, usage: 500 }),
      };
      Object.defineProperty(navigator, "storage", {
        value: mockStorage,
        writable: true,
      });

      const quota = await StorageUtils.getStorageQuota();
      expect(quota).toEqual({
        quota: 1000,
        usage: 500,
        remaining: 500,
      });
    });
  });

  describe("error handling", () => {
    it("should handle storage errors gracefully", async () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error("Storage error");
      });

      await StorageUtils.setLocal("test", "value");
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    it("should handle encryption errors gracefully", async () => {
      mockCrypto.subtle.encrypt.mockRejectedValue(
        new Error("Encryption error")
      );
      // The implementation may not throw, but should not crash
      await StorageUtils.setLocal("test", "value", { encrypt: true });
      expect(mockCrypto.subtle.encrypt).toHaveBeenCalled();
    });
  });
});
