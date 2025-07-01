import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { JwtUtils } from "../JwtUtils";

describe("JwtUtils", () => {
  const mockToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  // Token with expiration time in the past (1516239021 < 1516239022)
  const mockExpiredToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjF9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  const mockInvalidToken = "invalid@token#format"; // Contains invalid base64url characters
  const mockTokenWithoutExp =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

  beforeEach(() => {
    // Mock localStorage
    const mockLocalStorage = {
      getItem: vi.fn().mockImplementation((key: string) => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
      writable: true,
    });

    // Mock Date.now() to return a fixed timestamp
    vi.spyOn(Date, "now").mockImplementation(() => 1516239022000);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("decodeToken", () => {
    it("should decode a valid JWT token", () => {
      const result = JwtUtils.decodeToken(mockToken);
      expect(result).toEqual({
        sub: "1234567890",
        name: "John Doe",
        iat: 1516239022,
        exp: 1516239022,
      });
    });

    it("should throw error for invalid token format", () => {
      expect(() => JwtUtils.decodeToken(mockInvalidToken)).toThrow(
        "Failed to decode JWT token"
      );
    });

    it("should throw error for malformed token", () => {
      expect(() => JwtUtils.decodeToken("invalid.base64.format")).toThrow(
        "Failed to decode JWT token"
      );
    });
  });

  describe("getPayloadClaim", () => {
    it("should get a specific claim from token", () => {
      const result = JwtUtils.getPayloadClaim(mockToken, "sub");
      expect(result).toBe("1234567890");
    });

    it("should return undefined for non-existent claim", () => {
      const result = JwtUtils.getPayloadClaim(mockToken, "nonexistent");
      expect(result).toBeUndefined();
    });

    it("should throw error for invalid token", () => {
      expect(() => JwtUtils.getPayloadClaim(mockInvalidToken, "sub")).toThrow(
        "Failed to get claim"
      );
    });
  });

  describe("getTokenTimeRemaining", () => {
    it("should return time remaining for valid token", () => {
      const result = JwtUtils.getTokenTimeRemaining(mockToken);
      expect(result).toBe(0); // Token expires at current time
    });

    it("should return null for token without expiration", () => {
      const result = JwtUtils.getTokenTimeRemaining(mockTokenWithoutExp);
      expect(result).toBeNull();
    });

    it("should throw error for invalid token", () => {
      expect(() => JwtUtils.getTokenTimeRemaining(mockInvalidToken)).toThrow(
        "Failed to get token time remaining"
      );
    });
  });

  describe("isJwt", () => {
    it("should return true for valid JWT format", () => {
      expect(JwtUtils.isJwt(mockToken)).toBe(true);
    });

    it("should return false for invalid JWT format", () => {
      expect(JwtUtils.isJwt(mockInvalidToken)).toBe(false);
    });

    it("should return false for empty string", () => {
      expect(JwtUtils.isJwt("")).toBe(false);
    });
  });

  describe("isTokenExpiringSoon", () => {
    it("should return true when token expires within an hour", () => {
      const mockTokenExpiringSoon =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzk2MjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      (localStorage.getItem as Mock).mockReturnValue(mockTokenExpiringSoon);
      expect(JwtUtils.isTokenExpiringSoon()).toBe(true);
    });

    it("should return false when token expires after an hour", () => {
      const mockTokenExpiringLater =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      (localStorage.getItem as Mock).mockReturnValue(mockTokenExpiringLater);
      expect(JwtUtils.isTokenExpiringSoon()).toBe(false);
    });

    it("should return null when no token exists", () => {
      (localStorage.getItem as Mock).mockReturnValue(null);
      expect(JwtUtils.isTokenExpiringSoon()).toBeNull();
    });
  });

  describe("isTokenExpired", () => {
    it("should return true for expired token", () => {
      expect(JwtUtils.isTokenExpired(mockExpiredToken)).toBe(true);
    });

    it("should return false for valid token", () => {
      const mockValidToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      expect(JwtUtils.isTokenExpired(mockValidToken)).toBe(false);
    });

    it("should return false for token without expiration", () => {
      expect(JwtUtils.isTokenExpired(mockTokenWithoutExp)).toBe(false);
    });

    it("should throw error for invalid token", () => {
      expect(() => JwtUtils.isTokenExpired(mockInvalidToken)).toThrow(
        "Failed to check token expiration"
      );
    });
  });

  describe("isValidToken", () => {
    it("should return true for valid token with required claims", () => {
      expect(JwtUtils.isValidToken(mockToken, ["sub", "name"])).toBe(true);
    });

    it("should return false for expired token", () => {
      expect(JwtUtils.isValidToken(mockExpiredToken, ["sub"])).toBe(false);
    });

    it("should return false for token missing required claims", () => {
      expect(JwtUtils.isValidToken(mockToken, ["sub", "role"])).toBe(false);
    });

    it("should throw error for invalid token", () => {
      expect(() => JwtUtils.isValidToken(mockInvalidToken, ["sub"])).toThrow(
        "Failed to validate token"
      );
    });
  });
});
