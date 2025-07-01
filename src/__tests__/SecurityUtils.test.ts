import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SecurityUtils } from "../SecurityUtils";

describe("SecurityUtils", () => {
  // Mock crypto API
  const mockCrypto = {
    subtle: {
      importKey: vi.fn(),
      encrypt: vi.fn(),
      decrypt: vi.fn(),
      digest: vi.fn(),
    },
    getRandomValues: vi.fn(),
  };

  beforeEach(() => {
    // Setup crypto mocks using Object.defineProperty
    Object.defineProperty(global, "crypto", {
      value: mockCrypto,
      writable: true,
      configurable: true,
    });

    vi.spyOn(global, "btoa").mockImplementation((str) => str);
    vi.spyOn(global, "atob").mockImplementation((str) => str);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Restore original crypto
    Object.defineProperty(global, "crypto", {
      value: global.crypto,
      writable: true,
      configurable: true,
    });
  });

  describe("encrypt/decrypt", () => {
    it("should encrypt and decrypt data correctly", async () => {
      const testData = "test data";
      const testKey = "test key";
      const mockIv = new Uint8Array(12).fill(1);
      const mockEncrypted = new Uint8Array([2, 3, 4]);
      const mockDecrypted = new TextEncoder().encode(testData);

      // Mock getRandomValues to return our IV
      mockCrypto.getRandomValues.mockReturnValue(mockIv);

      // Mock the crypto operations
      mockCrypto.subtle.importKey.mockResolvedValue("mockKey");
      mockCrypto.subtle.encrypt.mockResolvedValue(mockEncrypted);
      mockCrypto.subtle.decrypt.mockResolvedValue(mockDecrypted);

      const encrypted = await SecurityUtils.encrypt(testData, testKey);
      const decrypted = await SecurityUtils.decrypt(encrypted, testKey);

      expect(decrypted).toBe(testData);
      expect(mockCrypto.subtle.importKey).toHaveBeenCalledTimes(2);
      expect(mockCrypto.subtle.encrypt).toHaveBeenCalledTimes(1);
      expect(mockCrypto.subtle.decrypt).toHaveBeenCalledTimes(1);
    });
  });

  describe("generateRandomString", () => {
    it("should generate a string of specified length", async () => {
      const length = 32;
      mockCrypto.getRandomValues.mockReturnValue(
        new Uint32Array(length).fill(1)
      );

      const result = await SecurityUtils.generateRandomString(length);
      expect(result.length).toBe(length);
    });
  });

  describe("generateRandomNumber", () => {
    it("should generate a number within the specified range", async () => {
      const min = 1;
      const max = 10;
      mockCrypto.getRandomValues.mockReturnValue(new Uint8Array([5]));

      const result = await SecurityUtils.generateRandomNumber(min, max);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });
  });

  describe("generateSecurePassword", () => {
    it("should generate a password with required characteristics", async () => {
      const length = 16;
      mockCrypto.getRandomValues.mockReturnValue(new Uint8Array([5]));

      const password = await SecurityUtils.generateSecurePassword(length);
      expect(password.length).toBe(length);
      expect(/[A-Z]/.test(password)).toBe(true);
      expect(/[a-z]/.test(password)).toBe(true);
      expect(/[0-9]/.test(password)).toBe(true);
      expect(/[!@#$%^&*(),.?":{}|<>]/.test(password)).toBe(true);
    });
  });

  describe("hashString", () => {
    it("should hash a string using SHA-256", async () => {
      const input = "test string";
      const mockHash = new Uint8Array(32).fill(1);
      mockCrypto.subtle.digest.mockResolvedValue(mockHash);

      const hash = await SecurityUtils.hashString(input);
      expect(hash).toBe("01".repeat(32));
    });
  });

  describe("sanitizeHtml", () => {
    it("should sanitize HTML input", () => {
      const input = '<script>alert("xss")</script>';
      const expected = "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;";

      const result = SecurityUtils.sanitizeHtml(input);
      expect(result).toBe(expected);
    });
  });

  describe("validateCsrfToken", () => {
    it("should validate matching tokens", () => {
      const token = "test-token";
      expect(SecurityUtils.validateCsrfToken(token, token)).toBe(true);
    });

    it("should reject non-matching tokens", () => {
      expect(SecurityUtils.validateCsrfToken("token1", "token2")).toBe(false);
    });
  });

  describe("validatePassword", () => {
    it("should validate a strong password", () => {
      const password = "StrongP@ss123";
      const result = SecurityUtils.validatePassword(password);

      expect(result.isValid).toBe(true);
      expect(result.requirements).toEqual({
        minLength: true,
        hasUpperCase: true,
        hasLowerCase: true,
        hasNumbers: true,
        hasSpecialChar: true,
      });
    });

    it("should reject a weak password", () => {
      const password = "weak";
      const result = SecurityUtils.validatePassword(password);

      expect(result.isValid).toBe(false);
      expect(result.requirements).toEqual({
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: true,
        hasNumbers: false,
        hasSpecialChar: false,
      });
    });
  });
});
