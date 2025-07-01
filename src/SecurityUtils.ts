/**
 * @module SecurityUtils
 * @description A collection of utility functions for security operations including hashing, encryption, and validation.
 * @example
 * ```typescript
 * import { SecurityUtils } from 'houser-js-utils';
 *
 * // Generate secure hash
 * const hash = await SecurityUtils.hashString('password123');
 *
 * // Generate random token
 * const token = SecurityUtils.generateRandomToken(32);
 *
 * // Sanitize user input
 * const clean = SecurityUtils.sanitizeInput('<script>alert("xss")</script>');
 * ```
 */

export const SecurityUtils = {
  /**
   * Decrypts a string using AES-GCM
   * @param encryptedData - Data to decrypt
   * @param key - Decryption key
   * @returns Decrypted data
   */
  async decrypt(encryptedData: string, key: string): Promise<string> {
    const decoder = new TextDecoder();
    const keyBuffer = new TextEncoder().encode(key);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyBuffer,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    const data = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));
    const iv = data.slice(0, 12);
    const encrypted = data.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      encrypted
    );

    return decoder.decode(decrypted);
  },

  /**
   * Encrypts a string using AES-GCM
   * @param data - Data to encrypt
   * @param key - Encryption key
   * @returns Encrypted data
   */
  async encrypt(data: string, key: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const keyBuffer = encoder.encode(key);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyBuffer,
      { name: "AES-GCM" },
      false,
      ["encrypt"]
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      dataBuffer
    );

    const result = new Uint8Array(iv.length + encrypted.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...result));
  },

  /**
   * Generates a CSRF token
   * @returns CSRF token
   */
  async generateCsrfToken(): Promise<string> {
    return this.generateRandomString(32);
  },

  /**
   * Generates a random number between min and max
   * @param min - Minimum value (inclusive)
   * @param max - Maximum value (inclusive)
   * @returns Random number
   */
  async generateRandomNumber(min: number, max: number): Promise<number> {
    const range = max - min + 1;
    const bytesNeeded = Math.ceil(Math.log2(range) / 8);
    const maxNum = Math.pow(256, bytesNeeded);
    const maxRange = maxNum - (maxNum % range);

    let value;
    do {
      const buffer = new Uint8Array(bytesNeeded);
      crypto.getRandomValues(buffer);
      value = buffer.reduce((acc, byte) => (acc << 8) + byte, 0);
    } while (value >= maxRange);

    return min + (value % range);
  },

  /**
   * Generates a random string of specified length
   * @param length - Length of the random string
   * @returns Random string
   */
  async generateRandomString(length: number): Promise<string> {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    return result;
  },

  /**
   * Generates a secure password
   * @param length - Length of the password
   * @returns Generated password
   */
  async generateSecurePassword(length = 16): Promise<string> {
    const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const specialChars = '!@#$%^&*(),.?":{}|<>';
    const allChars = upperChars + lowerChars + numberChars + specialChars;

    let password = "";
    password +=
      upperChars[await this.generateRandomNumber(0, upperChars.length - 1)];
    password +=
      lowerChars[await this.generateRandomNumber(0, lowerChars.length - 1)];
    password +=
      numberChars[await this.generateRandomNumber(0, numberChars.length - 1)];
    password +=
      specialChars[await this.generateRandomNumber(0, specialChars.length - 1)];

    for (let i = password.length; i < length; i++) {
      password +=
        allChars[await this.generateRandomNumber(0, allChars.length - 1)];
    }

    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  },

  /**
   * Hashes a string using SHA-256
   * @param input - String to hash
   * @returns Hashed string
   */
  async hashString(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  },

  /**
   * Sanitizes HTML input to prevent XSS attacks
   * @param input - Input string to sanitize
   * @returns Sanitized string
   */
  sanitizeHtml: (input: string): string => {
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  /**
   * Validates a CSRF token
   * @param token - Token to validate
   * @param storedToken - Stored token to compare against
   * @returns True if tokens match
   */
  validateCsrfToken: (token: string, storedToken: string): boolean => {
    return token === storedToken;
  },

  /**
   * Checks if a password meets security requirements
   * @param password - Password to check
   * @returns Object containing validation results
   */
  validatePassword: (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= minLength;

    return {
      isValid:
        isLongEnough &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar,
      requirements: {
        minLength: isLongEnough,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar,
      },
    };
  },
};
