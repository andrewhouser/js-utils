/**
 * @module JwtUtils
 * @description A comprehensive collection of utility functions for working with JSON Web Tokens (JWT).
 * Provides methods for decoding, parsing, validating, and managing JWT tokens including expiration checks,
 * claim extraction, and token lifecycle management.
 * @example
 * ```typescript
 * import { JwtUtils } from 'houser-js-utils';
 *
 * // Decode a JWT token
 * const payload = JwtUtils.decodeToken(token);
 *
 * // Check if token is expired
 * const isExpired = JwtUtils.isTokenExpired(token);
 *
 * // Get specific claim
 * const userId = JwtUtils.getPayloadClaim(token, 'sub');
 * ```
 */

/**
 * Interface representing the structure of a JWT payload with standard claims.
 */
export interface JwtPayload {
  /** Subject (user ID) */
  sub?: string;
  /** Issuer */
  iss?: string;
  /** Audience */
  aud?: string;
  /** Expiration time (Unix timestamp in seconds) */
  exp?: number;
  /** Not before time (Unix timestamp in seconds) */
  nbf?: number;
  /** Issued at time (Unix timestamp in seconds) */
  iat?: number;
  /** JWT ID */
  jti?: string;
  /** Additional custom claims */
  [key: string]: any;
}

export const JwtUtils = {
  /**
   * Decodes and parses a JWT token into its payload object.
   * @param token - The JWT token string to decode
   * @returns The decoded JWT payload containing all claims
   * @throws Error if token is invalid, malformed, or cannot be parsed
   * @example
   * ```typescript
   * const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
   * const payload = JwtUtils.decodeToken(token);
   * console.log(payload.sub); // '1234567890'
   * console.log(payload.exp); // 1234567890
   * ```
   */
  decodeToken(token: string): JwtPayload {
    try {
      const base64Url = token.split(".")[1];
      if (!base64Url) {
        throw new Error("Invalid JWT token format");
      }

      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => {
            const hex = c.charCodeAt(0).toString(16);
            return "%" + ("00" + hex).slice(-2);
          })
          .join("")
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error(
        `Failed to decode JWT token: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  /**
   * Extracts a specific claim value from a JWT token's payload.
   * @param token - The JWT token string to parse
   * @param claim - The name of the claim to retrieve
   * @returns The claim value or undefined if the claim is not found
   * @throws Error if token is invalid or cannot be parsed
   * @example
   * ```typescript
   * const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
   * const userId = JwtUtils.getPayloadClaim(token, 'sub'); // "1234567890"
   * const role = JwtUtils.getPayloadClaim(token, 'role'); // "admin"
   * const email = JwtUtils.getPayloadClaim(token, 'email'); // "user@example.com"
   * ```
   */
  getPayloadClaim(token: string, claim: string): any {
    try {
      const payload = this.decodeToken(token);
      return payload[claim];
    } catch (error) {
      throw new Error(
        `Failed to get claim: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  /**
   * Calculates the time remaining until a JWT token expires.
   * @param token - The JWT token to check for expiration
   * @returns The time remaining in seconds, or null if no expiration time is set
   * @throws Error if token is invalid or cannot be parsed
   * @example
   * ```typescript
   * const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
   * const timeRemaining = JwtUtils.getTokenTimeRemaining(token);
   * if (timeRemaining !== null) {
   *   console.log(`Token expires in ${timeRemaining} seconds`);
   * } else {
   *   console.log('Token has no expiration time');
   * }
   * ```
   */
  getTokenTimeRemaining(token: string): number | null {
    try {
      const payload = this.decodeToken(token);
      if (!payload.exp) return null;

      const currentTime = Math.floor(Date.now() / 1000);
      return Math.max(0, payload.exp - currentTime);
    } catch (error) {
      throw new Error(
        `Failed to get token time remaining: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  /**
   * Validates if a string follows the correct JWT token format (three base64url-encoded parts).
   * @param token - The string to validate as a JWT token
   * @returns True if the string follows JWT format, false otherwise
   * @example
   * ```typescript
   * const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature';
   * const invalidToken = 'not.a.jwt.token';
   *
   * JwtUtils.isJwt(validToken); // true
   * JwtUtils.isJwt(invalidToken); // false
   * JwtUtils.isJwt('invalid'); // false
   * ```
   */
  isJwt(token: string): boolean {
    // JWT format: header.payload.signature
    // Each part must be valid base64url encoded
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    // Each part must be non-empty and contain only base64url characters
    const base64UrlPattern = /^[A-Za-z0-9-_]+$/;
    return parts.every(
      (part) => part.length > 0 && base64UrlPattern.test(part)
    );
  },

  /**
   * Checks if the JWT token stored in localStorage will expire within the next hour.
   * @returns True if token will expire within an hour, false if not expiring soon, null if no token exists
   * @example
   * ```typescript
   * const result = JwtUtils.isTokenExpiringSoon();
   * if (result === null) {
   *   console.log('No token found in localStorage');
   * } else if (result) {
   *   console.log('Token expires soon - consider refreshing');
   * } else {
   *   console.log('Token is still valid for more than an hour');
   * }
   * ```
   */
  isTokenExpiringSoon(): boolean | null {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    try {
      const payload = this.decodeToken(token);
      if (!payload.exp) return false;

      const secondsDiff =
        (new Date(payload.exp * 1000).getTime() - Date.now()) / 1000;
      return secondsDiff > 0 && secondsDiff < 3600; // 3600 seconds = 1 hour
    } catch (error) {
      console.error("Error checking JWT expiration:", error);
      return false;
    }
  },

  /**
   * Determines if a JWT token has expired based on its expiration time claim.
   * @param token - The JWT token string to check
   * @returns True if the token is expired, false if still valid or has no expiration
   * @throws Error if token is invalid or cannot be parsed
   * @example
   * ```typescript
   * const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
   *
   * if (JwtUtils.isTokenExpired(token)) {
   *   console.log('Token has expired - please authenticate again');
   * } else {
   *   console.log('Token is still valid');
   * }
   * ```
   */
  isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      if (!payload.exp) return false;

      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      throw new Error(
        `Failed to check token expiration: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  /**
   * Performs comprehensive validation of a JWT token including expiration and required claims.
   * @param token - The JWT token string to validate
   * @param requiredClaims - Array of claim names that must be present in the token
   * @returns True if token is valid, not expired, and contains all required claims
   * @throws Error if token is invalid or cannot be parsed
   * @example
   * ```typescript
   * const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
   *
   * // Basic validation (just check expiration)
   * const isValid = JwtUtils.isValidToken(token);
   *
   * // Validation with required claims
   * const isValidWithClaims = JwtUtils.isValidToken(token, ['sub', 'role', 'email']);
   *
   * if (isValidWithClaims) {
   *   console.log('Token is valid and has all required claims');
   * }
   * ```
   */
  isValidToken(token: string, requiredClaims: string[] = []): boolean {
    try {
      const payload = this.decodeToken(token);

      // Check expiration
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return false;
      }

      // Check required claims
      return requiredClaims.every((claim) => payload[claim] !== undefined);
    } catch (error) {
      throw new Error(
        `Failed to validate token: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
};
