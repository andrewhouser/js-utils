/**
 * Error handling utilities and custom error types for better error management.
 *
 * This module provides a comprehensive set of error handling utilities and custom error types
 * for consistent error management across the application. It includes:
 *
 * - Custom error types for different error scenarios
 * - Error validation utilities
 * - Error reporting and logging functionality
 * - Type guards and validation functions
 *
 * @module ErrorUtils
 * @example
 * ```typescript
 * // Using custom error types
 * throw new AuthenticationError("Invalid credentials");
 *
 * // Using validation utilities
 * ErrorUtils.validateEmail("user@example.com");
 *
 * // Using error handling wrappers
 * const safeFunction = ErrorUtils.withErrorHandling(
 *   () => riskyOperation(),
 *   (error) => console.error(error)
 * );
 * ```
 */

// DataDog type declarations
declare global {
  interface Window {
    DD_LOGS?: {
      logger: {
        error: (message: string, context: Record<string, unknown>) => void;
      };
    };
  }
}

/**
 * Custom error class for authentication-related errors.
 * @extends Error
 */
export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

/**
 * Custom error class for authorization-related errors.
 * @extends Error
 */
export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

/**
 * Custom error class for network-related errors.
 * @extends Error
 */
export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

/**
 * Custom error class for resource not found errors.
 * @extends Error
 */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

/**
 * Custom error class for timeout-related errors.
 * @extends Error
 */
export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TimeoutError";
  }
}

/**
 * Custom error class for validation-related errors.
 * @extends Error
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Utility object containing error handling and validation functions.
 */
export const ErrorUtils = {
  /**
   * Captures and reports an error to DataDog.
   *
   * @param error - The error to capture and report
   * @param options - Options for error capture
   * @param options.log - Whether to log the error to console (default: true)
   * @param options.tags - Additional tags to add to the error in DataDog
   * @param options.context - Additional context to add to the error in DataDog
   *
   * @example
   * ```typescript
   * try {
   *   // Some risky operation
   * } catch (error) {
   *   ErrorUtils.captureError(error, {
   *     tags: { component: 'UserService' },
   *     context: { userId: '123' }
   *   });
   * }
   * ```
   */
  captureError(
    error: Error | unknown,
    options: {
      log?: boolean;
      tags?: Record<string, string>;
      context?: Record<string, unknown>;
    } = {}
  ): void {
    const { log = true, tags = {}, context = {} } = options;

    // Convert unknown errors to Error objects
    const errorObj = error instanceof Error ? error : new Error(String(error));

    // Add error to DataDog
    if (typeof window !== "undefined" && window.DD_LOGS) {
      window.DD_LOGS.logger.error(errorObj.message, {
        error: errorObj,
        ...context,
        tags: {
          error_name: errorObj.name,
          error_stack: errorObj.stack,
          ...tags,
        },
      });
    }

    // Log to console if enabled
    if (log) {
      console.error(errorObj);
    }
  },

  /**
   * Checks if an error is a specific type of error.
   *
   * @param error - The error to check
   * @param errorType - The type of error to check against
   * @returns True if the error is of the specified type
   *
   * @example
   * ```typescript
   * const isAuthError = ErrorUtils.isErrorType(error, AuthenticationError);
   * ```
   */
  isErrorType(
    error: unknown,
    errorType: new (message: string) => Error
  ): boolean {
    return error instanceof errorType;
  },

  /**
   * Validates that a value is a valid array
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is not a valid array
   */
  validateArray(value: unknown, message: string = "Invalid array"): void {
    if (!Array.isArray(value)) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid array length
   * @param array - Array to validate
   * @param minLength - Minimum length
   * @param maxLength - Maximum length
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if array length is invalid
   */
  validateArrayLength<T>(
    array: T[],
    minLength: number,
    maxLength: number,
    message: string = "Invalid array length"
  ): void {
    if (array.length < minLength || array.length > maxLength) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that an array is not empty
   * @param array - Array to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if array is empty
   */
  validateArrayNotEmpty<T>(array: T[], message: string): void {
    if (array.length === 0) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid bigint
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is not a valid bigint
   */
  validateBigInt(value: unknown, message: string = "Invalid bigint"): void {
    if (typeof value !== "bigint") {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid boolean
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is not a valid boolean
   */
  validateBoolean(
    value: unknown,
    message: string = "Invalid boolean value"
  ): void {
    if (typeof value !== "boolean") {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid credit card number
   * @param cardNumber - Credit card number to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if credit card number is invalid
   */
  validateCreditCard(
    cardNumber: string,
    message: string = "Invalid credit card number"
  ): void {
    // Remove spaces and dashes
    const cleanNumber = cardNumber.replace(/[\s-]/g, "");

    // Check if it's a valid number
    if (!/^\d+$/.test(cleanNumber)) {
      throw new ValidationError(message);
    }

    // Luhn algorithm for credit card validation
    let sum = 0;
    let isEven = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i));

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    if (sum % 10 !== 0) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid date
   * @param date - Date to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if date is invalid
   */
  validateDate(date: string | Date, message: string = "Invalid date"): void {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid date instance
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is not a valid date instance
   */
  validateDateInstance(value: unknown, message: string = "Invalid date"): void {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid date range
   * @param startDate - Start date
   * @param endDate - End date
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if date range is invalid
   */
  validateDateRange(
    startDate: Date | string,
    endDate: Date | string,
    message: string = "Invalid date range"
  ): void {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new ValidationError(message);
    }

    if (start > end) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid email address
   * @param email - Email address to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if email is invalid
   */
  validateEmail(
    email: string,
    message: string = "Invalid email address"
  ): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.validateRegex(email, emailRegex, message);
  },

  /**
   * Validates that a value is a valid enum value
   * @param value - Value to validate
   * @param enumObj - Enum object to validate against
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is not a valid enum value
   */
  validateEnum<T extends { [key: string]: string | number }>(
    value: string | number,
    enumObj: T,
    message: string = "Invalid enum value"
  ): void {
    if (!Object.values(enumObj).includes(value)) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid file size
   * @param size - File size in bytes
   * @param maxSize - Maximum file size in bytes
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if file size is invalid
   */
  validateFileSize(
    size: number,
    maxSize: number,
    message: string = "File size exceeds maximum allowed size"
  ): void {
    if (size < 0 || size > maxSize) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid file type
   * @param file - File to validate
   * @param allowedTypes - Array of allowed MIME types
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if file type is invalid
   */
  validateFileType(
    file: File,
    allowedTypes: string[],
    message: string = "Invalid file type"
  ): void {
    if (!allowedTypes.includes(file.type)) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid function
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is not a valid function
   */
  validateFunction(value: unknown, message: string = "Invalid function"): void {
    if (typeof value !== "function") {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid image dimension
   * @param width - Image width
   * @param height - Image height
   * @param maxWidth - Maximum width
   * @param maxHeight - Maximum height
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if image dimension is invalid
   */
  validateImageDimension(
    width: number,
    height: number,
    maxWidth: number,
    maxHeight: number,
    message: string = "Invalid image dimension"
  ): void {
    if (width <= 0 || height <= 0 || width > maxWidth || height > maxHeight) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid integer
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is not a valid integer
   */
  validateInteger(value: unknown, message: string = "Invalid integer"): void {
    this.validateNumber(value, message);
    if (!Number.isInteger(value as number)) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid IP address
   * @param ip - IP address to validate
   * @param version - IP version (4 or 6)
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if IP address is invalid
   */
  validateIP(
    ip: string,
    version: 4 | 6 = 4,
    message: string = "Invalid IP address"
  ): void {
    const patterns = {
      4: /^(\d{1,3}\.){3}\d{1,3}$/,
      6: /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,
    };

    this.validateRegex(ip, patterns[version], message);

    if (version === 4) {
      const parts = ip.split(".");
      for (const part of parts) {
        const num = parseInt(part);
        if (num < 0 || num > 255) {
          throw new ValidationError(message);
        }
      }
    }
  },

  /**
   * Validates that a value is a valid MAC address
   * @param mac - MAC address to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if MAC address is invalid
   */
  validateMAC(mac: string, message: string = "Invalid MAC address"): void {
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    this.validateRegex(mac, macRegex, message);
  },

  /**
   * Validates that a value is a valid map
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is not a valid map
   */
  validateMap(value: unknown, message: string = "Invalid map"): void {
    if (!(value instanceof Map)) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid negative number
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is not a valid negative number
   */
  validateNegativeNumber(
    value: unknown,
    message: string = "Invalid negative number"
  ): void {
    this.validateNumber(value, message);
    if ((value as number) >= 0) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid non-null
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is null
   */
  validateNonNull<T>(
    value: T | null,
    message: string = "Value must not be null"
  ): asserts value is T {
    if (value === null) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid non-null and non-undefined
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is null or undefined
   */
  validateNonNullOrUndefined<T>(
    value: T | null | undefined,
    message: string = "Value must not be null or undefined"
  ): asserts value is T {
    if (value === null || value === undefined) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid non-undefined
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is undefined
   */
  validateNonUndefined<T>(
    value: T | undefined,
    message: string = "Value must not be undefined"
  ): asserts value is T {
    if (value === undefined) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid null
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is not null
   */
  validateNull(value: unknown, message: string = "Value must be null"): void {
    if (value !== null) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid null or undefined
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is not null or undefined
   */
  validateNullOrUndefined(
    value: unknown,
    message: string = "Value must be null or undefined"
  ): void {
    if (value !== null && value !== undefined) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is not null or undefined
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is null or undefined
   */
  validateNotNull<T>(
    value: T | null | undefined,
    message: string
  ): asserts value is T {
    if (value === null || value === undefined) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a string is not empty
   * @param value - String to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if string is empty
   */
  validateNotEmpty(value: string, message: string): void {
    if (!value.trim()) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid number
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is not a valid number
   */
  validateNumber(value: unknown, message: string = "Invalid number"): void {
    if (typeof value !== "number" || isNaN(value)) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid object
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is not a valid object
   */
  validateObject(value: unknown, message: string = "Invalid object"): void {
    if (typeof value !== "object" || value === null) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid object key
   * @param obj - Object to validate
   * @param key - Key to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if object key is invalid
   */
  validateObjectKey<T extends object>(
    obj: T,
    key: keyof T,
    message: string = "Invalid object key"
  ): void {
    if (!(key in obj)) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid password
   * @param password - Password to validate
   * @param options - Password validation options
   * @throws ValidationError if password doesn't meet requirements
   */
  validatePassword(
    password: string,
    options: {
      minLength?: number;
      requireUppercase?: boolean;
      requireLowercase?: boolean;
      requireNumber?: boolean;
      requireSpecialChar?: boolean;
      message?: string;
    } = {}
  ): void {
    const {
      minLength = 8,
      requireUppercase = true,
      requireLowercase = true,
      requireNumber = true,
      requireSpecialChar = true,
      message = "Invalid password",
    } = options;

    if (password.length < minLength) {
      throw new ValidationError(`${message}: Minimum length is ${minLength}`);
    }

    if (requireUppercase && !/[A-Z]/.test(password)) {
      throw new ValidationError(`${message}: Must contain uppercase letter`);
    }

    if (requireLowercase && !/[a-z]/.test(password)) {
      throw new ValidationError(`${message}: Must contain lowercase letter`);
    }

    if (requireNumber && !/\d/.test(password)) {
      throw new ValidationError(`${message}: Must contain number`);
    }

    if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw new ValidationError(`${message}: Must contain special character`);
    }
  },

  /**
   * Validates that a value is a valid phone number
   * @param phone - Phone number to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if phone number is invalid
   */
  validatePhone(phone: string, message: string = "Invalid phone number"): void {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    this.validateRegex(phone, phoneRegex, message);
  },

  /**
   * Validates that a value is a valid positive number
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is not a valid positive number
   */
  validatePositiveNumber(
    value: unknown,
    message: string = "Invalid positive number"
  ): void {
    this.validateNumber(value, message);
    if ((value as number) <= 0) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid postal code
   * @param postalCode - Postal code to validate
   * @param country - Country code for postal code format
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if postal code is invalid
   */
  validatePostalCode(
    postalCode: string,
    country: "US" | "CA" | "UK" = "US",
    message: string = "Invalid postal code"
  ): void {
    const patterns = {
      US: /^\d{5}(-\d{4})?$/,
      CA: /^[A-Z]\d[A-Z] \d[A-Z]\d$/,
      UK: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/,
    };

    this.validateRegex(postalCode, patterns[country], message);
  },

  /**
   * Validates that a value is a valid promise
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is not a valid promise
   */
  validatePromise(value: unknown, message: string = "Invalid promise"): void {
    if (!(value instanceof Promise)) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a number is within a range
   * @param value - Number to validate
   * @param min - Minimum value (inclusive)
   * @param max - Maximum value (inclusive)
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if number is outside range
   */
  validateRange(
    value: number,
    min: number,
    max: number,
    message: string
  ): void {
    if (value < min || value > max) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value matches a regular expression
   * @param value - String to validate
   * @param regex - Regular expression to match against
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value doesn't match regex
   */
  validateRegex(value: string, regex: RegExp, message: string): void {
    if (!regex.test(value)) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid regular expression
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is not a valid regular expression
   */
  validateRegExp(
    value: unknown,
    message: string = "Invalid regular expression"
  ): void {
    if (!(value instanceof RegExp)) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid set
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is not a valid set
   */
  validateSet(value: unknown, message: string = "Invalid set"): void {
    if (!(value instanceof Set)) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid social security number
   * @param ssn - Social security number to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if SSN is invalid
   */
  validateSSN(ssn: string, message: string = "Invalid SSN"): void {
    const ssnRegex =
      /^(?!000|666)[0-8][0-9]{2}-(?!00)[0-9]{2}-(?!0000)[0-9]{4}$/;
    this.validateRegex(ssn, ssnRegex, message);
  },

  /**
   * Validates that a value is a valid string
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is not a valid string
   */
  validateString(value: unknown, message: string = "Invalid string"): void {
    if (typeof value !== "string") {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid symbol
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is not a valid symbol
   */
  validateSymbol(value: unknown, message: string = "Invalid symbol"): void {
    if (typeof value !== "symbol") {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid time string
   * @param time - Time string to validate
   * @param format - Time format (12h or 24h)
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if time string is invalid
   */
  validateTime(
    time: string,
    format: "12h" | "24h" = "24h",
    message: string = "Invalid time"
  ): void {
    const patterns = {
      "12h": /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i,
      "24h": /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
    };

    this.validateRegex(time, patterns[format], message);
  },

  /**
   * Validates that a value is a valid undefined
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is not undefined
   */
  validateUndefined(
    value: unknown,
    message: string = "Value must be undefined"
  ): void {
    if (value !== undefined) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid URL
   * @param url - URL to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if URL is invalid
   */
  validateUrl(url: string, message: string = "Invalid URL"): void {
    try {
      new URL(url);
    } catch {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid UUID
   * @param uuid - UUID to validate
   * @param version - UUID version (1-5)
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if UUID is invalid
   * @example
   * ```typescript
   * // Validate a random UUID (version 4)
   * ErrorUtils.validateUUID('123e4567-e89b-12d3-a456-426614174000', 4);
   *
   * // Validate a time-based UUID (version 1)
   * ErrorUtils.validateUUID('123e4567-e89b-12d3-a456-426614174000', 1);
   * ```
   */
  validateUUID(
    uuid: string,
    version: 1 | 2 | 3 | 4 | 5 = 4,
    message: string = "Invalid UUID"
  ): void {
    // First validate the basic UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(uuid)) {
      throw new ValidationError(message);
    }

    // Extract the version from the UUID
    const versionHex = uuid.charAt(14);
    const actualVersion = parseInt(versionHex, 16);

    // Validate the version
    if (actualVersion !== version) {
      throw new ValidationError(
        `${message}: Expected version ${version}, got version ${actualVersion}`
      );
    }

    // Get the clock sequence high bits for version-specific validation
    const clockSeqHi = parseInt(uuid.charAt(19), 16);

    // Additional version-specific validations
    switch (version) {
      case 1: // Time-based UUID
        // Version 1 UUIDs use the current timestamp and node ID
        // The clock_seq_hi_and_reserved field should have bits 6 and 7 set to 0 and 1
        if ((clockSeqHi & 0xc0) !== 0x80) {
          throw new ValidationError(
            `${message}: Invalid version 1 UUID clock sequence`
          );
        }
        break;
      case 2: // DCE Security UUID
        // Version 2 UUIDs are similar to version 1 but include local domain and local ID
        if ((clockSeqHi & 0xc0) !== 0x80) {
          throw new ValidationError(
            `${message}: Invalid version 2 UUID clock sequence`
          );
        }
        break;
      case 3: // Name-based UUID (MD5)
        // Version 3 UUIDs use MD5 hashing
        // The clock_seq_hi_and_reserved field should have bits 6 and 7 set to 1 and 0
        if ((clockSeqHi & 0xc0) !== 0x40) {
          throw new ValidationError(
            `${message}: Invalid version 3 UUID clock sequence`
          );
        }
        break;
      case 4: // Random UUID
        // Version 4 UUIDs use random or pseudo-random numbers
        // The clock_seq_hi_and_reserved field should have bits 6 and 7 set to 1 and 0
        if ((clockSeqHi & 0xc0) !== 0x40) {
          throw new ValidationError(
            `${message}: Invalid version 4 UUID clock sequence`
          );
        }
        break;
      case 5: // Name-based UUID (SHA-1)
        // Version 5 UUIDs use SHA-1 hashing
        // The clock_seq_hi_and_reserved field should have bits 6 and 7 set to 1 and 0
        if ((clockSeqHi & 0xc0) !== 0x40) {
          throw new ValidationError(
            `${message}: Invalid version 5 UUID clock sequence`
          );
        }
        break;
    }
  },

  /**
   * Validates that a value is a valid weak map
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is not a valid weak map
   */
  validateWeakMap(value: unknown, message: string = "Invalid weak map"): void {
    if (!(value instanceof WeakMap)) {
      throw new ValidationError(message);
    }
  },

  /**
   * Validates that a value is a valid weak set
   * @param value - Value to validate
   * @param message - Error message to throw if validation fails
   * @throws ValidationError if value is not a valid weak set
   */
  validateWeakSet(value: unknown, message: string = "Invalid weak set"): void {
    if (!(value instanceof WeakSet)) {
      throw new ValidationError(message);
    }
  },

  /**
   * Wraps an async function with error handling
   * @param fn - Async function to wrap
   * @param errorHandler - Function to handle errors
   * @returns Wrapped async function
   */
  withAsyncErrorHandling<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    errorHandler: (error: unknown) => void
  ): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
    return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
      try {
        return await fn(...args);
      } catch (error) {
        errorHandler(error);
        throw error;
      }
    };
  },

  /**
   * Wraps a function with error handling
   * @param fn - Function to wrap
   * @param errorHandler - Function to handle errors
   * @returns Wrapped function
   */
  withErrorHandling<T extends (...args: any[]) => any>(
    fn: T,
    errorHandler: (error: unknown) => void
  ): (...args: Parameters<T>) => ReturnType<T> {
    return (...args: Parameters<T>): ReturnType<T> => {
      try {
        return fn(...args);
      } catch (error) {
        errorHandler(error);
        throw error;
      }
    };
  },
};
