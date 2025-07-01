/**
 * @module ValidationUtils
 * @description A comprehensive collection of validation functions for common data types and formats.
 * @example
 * ```typescript
 * import { ValidationUtils } from 'js-utils';
 *
 * // Validate email address
 * const isValid = ValidationUtils.isEmail('user@example.com'); // true
 *
 * // Validate credit card number
 * const isValidCard = ValidationUtils.isCreditCard('4111111111111111'); // true
 *
 * // Validate password strength
 * const isStrongPassword = ValidationUtils.isPassword('MyP@ssw0rd123'); // true
 * ```
 */

/**
 * Validation utility functions for common data types and formats
 */
export const ValidationUtils = {
  /**
   * Checks if a value is a valid base64 encoded string.
   * @param base64 - The base64 string to validate
   * @returns True if the string is valid base64, false otherwise
   * @example
   * ```typescript
   * ValidationUtils.isBase64('SGVsbG8gV29ybGQ='); // Returns true
   * ValidationUtils.isBase64('invalid-base64'); // Returns false
   * ```
   */
  isBase64(base64: string): boolean {
    try {
      return btoa(atob(base64)) === base64;
    } catch {
      return false;
    }
  },

  /**
   * Validates a credit card number using the Luhn algorithm.
   * @param number - The credit card number to validate (can include spaces, dashes, etc.)
   * @returns True if the credit card number is valid, false otherwise
   * @example
   * ```typescript
   * ValidationUtils.isCreditCard('4111111111111111'); // Returns true (Visa test number)
   * ValidationUtils.isCreditCard('4111-1111-1111-1111'); // Returns true (with dashes)
   * ValidationUtils.isCreditCard('1234567890123456'); // Returns false (invalid)
   * ```
   */
  isCreditCard(number: string): boolean {
    const cleanNumber = number.replace(/\D/g, "");
    if (cleanNumber.length < 13 || cleanNumber.length > 19) return false;

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

    return sum % 10 === 0;
  },

  /**
   * Validates a credit card CVV (Card Verification Value).
   * @param cvv - The CVV to validate (3 or 4 digits)
   * @returns True if the CVV format is valid, false otherwise
   * @example
   * ```typescript
   * ValidationUtils.isCreditCardCvv('123'); // Returns true
   * ValidationUtils.isCreditCardCvv('1234'); // Returns true (Amex)
   * ValidationUtils.isCreditCardCvv('12'); // Returns false (too short)
   * ```
   */
  isCreditCardCvv(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv);
  },

  /**
   * Validates a credit card expiry date in MM/YY format.
   * @param expiry - The expiry date to validate in MM/YY format
   * @returns True if the expiry date is valid and not in the past, false otherwise
   * @example
   * ```typescript
   * ValidationUtils.isCreditCardExpiry('12/25'); // Returns true (if current date is before Dec 2025)
   * ValidationUtils.isCreditCardExpiry('01/20'); // Returns false (expired)
   * ValidationUtils.isCreditCardExpiry('13/25'); // Returns false (invalid month)
   * ```
   */
  isCreditCardExpiry(expiry: string): boolean {
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(expiry)) return false;

    const [month, year] = expiry.split("/");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expiryYear = parseInt(year);
    const expiryMonth = parseInt(month);

    if (expiryYear < currentYear) return false;
    if (expiryYear === currentYear && expiryMonth < currentMonth) return false;

    return true;
  },

  /**
   * Validates a domain name format.
   * @param domain - The domain name to validate
   * @returns True if the domain name format is valid, false otherwise
   * @example
   * ```typescript
   * ValidationUtils.isDomain('example.com'); // Returns true
   * ValidationUtils.isDomain('sub.example.org'); // Returns true
   * ValidationUtils.isDomain('invalid..domain'); // Returns false
   * ```
   */
  isDomain(domain: string): boolean {
    const domainRegex =
      /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  },

  /**
   * Validates an email address format.
   * @param email - The email address to validate
   * @returns True if the email format is valid, false otherwise
   * @example
   * ```typescript
   * ValidationUtils.isEmail('user@example.com'); // Returns true
   * ValidationUtils.isEmail('test.email+tag@domain.co.uk'); // Returns true
   * ValidationUtils.isEmail('invalid-email'); // Returns false
   * ```
   */
  isEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  },

  /**
   * Validates a hostname format.
   * @param hostname - The hostname to validate
   * @returns True if the hostname format is valid, false otherwise
   * @example
   * ```typescript
   * ValidationUtils.isHostname('localhost'); // Returns true
   * ValidationUtils.isHostname('web-server-01'); // Returns true
   * ValidationUtils.isHostname('invalid_hostname'); // Returns false
   * ```
   */
  isHostname(hostname: string): boolean {
    const hostnameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
    return hostnameRegex.test(hostname);
  },

  /**
   * Checks if a value is empty (null, undefined, empty string, empty array, or empty object).
   * @param value - The value to check for emptiness
   * @returns True if the value is considered empty, false otherwise
   * @example
   * ```typescript
   * ValidationUtils.isEmpty(null); // Returns true
   * ValidationUtils.isEmpty(''); // Returns true
   * ValidationUtils.isEmpty([]); // Returns true
   * ValidationUtils.isEmpty({}); // Returns true
   * ValidationUtils.isEmpty('hello'); // Returns false
   * ```
   */
  isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value).length === 0;
    return false;
  },

  /**
   * Validates an IP address (IPv4 or IPv6).
   * @param ip - The IP address to validate
   * @returns True if the IP address format is valid, false otherwise
   * @example
   * ```typescript
   * ValidationUtils.isIpAddress('192.168.1.1'); // Returns true (IPv4)
   * ValidationUtils.isIpAddress('2001:0db8:85a3:0000:0000:8a2e:0370:7334'); // Returns true (IPv6)
   * ValidationUtils.isIpAddress('256.1.1.1'); // Returns false (invalid IPv4)
   * ```
   */
  isIpAddress(ip: string): boolean {
    const ipv4Regex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  },

  /**
   * Validates if a string is valid JSON.
   * @param json - The JSON string to validate
   * @returns True if the string is valid JSON, false otherwise
   * @example
   * ```typescript
   * ValidationUtils.isJson('{"name": "John", "age": 30}'); // Returns true
   * ValidationUtils.isJson('[1, 2, 3]'); // Returns true
   * ValidationUtils.isJson('invalid json'); // Returns false
   * ```
   */
  isJson(json: string): boolean {
    try {
      JSON.parse(json);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validates a MIME type format.
   * @param mimeType - The MIME type to validate
   * @returns True if the MIME type format is valid, false otherwise
   * @example
   * ```typescript
   * ValidationUtils.isMimeType('text/html'); // Returns true
   * ValidationUtils.isMimeType('application/json'); // Returns true
   * ValidationUtils.isMimeType('invalid-mime'); // Returns false
   * ```
   */
  isMimeType(mimeType: string): boolean {
    const mimeTypeRegex = /^[a-z]+\/[a-z0-9-+.]+$/;
    return mimeTypeRegex.test(mimeType);
  },

  /**
   * Validates password strength based on configurable criteria.
   * @param password - The password to validate
   * @param options - Password validation options
   * @param options.minLength - Minimum password length (default: 8)
   * @param options.requireUppercase - Require uppercase letters (default: true)
   * @param options.requireLowercase - Require lowercase letters (default: true)
   * @param options.requireNumbers - Require numbers (default: true)
   * @param options.requireSpecialChars - Require special characters (default: true)
   * @returns True if the password meets all criteria, false otherwise
   * @example
   * ```typescript
   * ValidationUtils.isPassword('MyP@ssw0rd123'); // Returns true
   * ValidationUtils.isPassword('weak', { minLength: 4, requireSpecialChars: false }); // Returns false
   * ValidationUtils.isPassword('StrongPass123!'); // Returns true
   * ```
   */
  isPassword(
    password: string,
    options: {
      minLength?: number;
      requireUppercase?: boolean;
      requireLowercase?: boolean;
      requireNumbers?: boolean;
      requireSpecialChars?: boolean;
    } = {}
  ): boolean {
    const {
      minLength = 8,
      requireUppercase = true,
      requireLowercase = true,
      requireNumbers = true,
      requireSpecialChars = true,
    } = options;

    if (password.length < minLength) return false;
    if (requireUppercase && !/[A-Z]/.test(password)) return false;
    if (requireLowercase && !/[a-z]/.test(password)) return false;
    if (requireNumbers && !/\d/.test(password)) return false;
    if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return false;

    return true;
  },

  /**
   * Validates a phone number format.
   * @param phone - The phone number to validate
   * @returns True if the phone number format is valid, false otherwise
   * @example
   * ```typescript
   * ValidationUtils.isPhoneNumber('+1 (555) 123-4567'); // Returns true
   * ValidationUtils.isPhoneNumber('555-123-4567'); // Returns true
   * ValidationUtils.isPhoneNumber('123'); // Returns false (too short)
   * ```
   */
  isPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  },

  /**
   * Checks if a value is a valid port number
   * @param port - Port number to validate
   * @returns True if valid, false otherwise
   */
  isPort(port: number): boolean {
    return Number.isInteger(port) && port >= 0 && port <= 65535;
  },

  /**
   * Checks if a value is a valid postal code
   * @param postalCode - Postal code to validate
   * @param country - Country code (ISO 3166-1 alpha-2)
   * @returns True if valid, false otherwise
   */
  isPostalCode(postalCode: string, country: string): boolean {
    const patterns: Record<string, RegExp> = {
      US: /^\d{5}(-\d{4})?$/,
      CA: /^[A-Z]\d[A-Z] \d[A-Z]\d$/,
      GB: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/,
      DE: /^\d{5}$/,
      FR: /^\d{5}$/,
      IT: /^\d{5}$/,
      ES: /^\d{5}$/,
      NL: /^\d{4} ?[A-Z]{2}$/,
      BE: /^\d{4}$/,
      CH: /^\d{4}$/,
      AT: /^\d{4}$/,
      SE: /^\d{3} ?\d{2}$/,
      NO: /^\d{4}$/,
      DK: /^\d{4}$/,
      FI: /^\d{5}$/,
      PL: /^\d{2}-\d{3}$/,
      PT: /^\d{4}-\d{3}$/,
      GR: /^\d{3} ?\d{2}$/,
      CZ: /^\d{3} ?\d{2}$/,
      HU: /^\d{4}$/,
      SK: /^\d{3} ?\d{2}$/,
      RO: /^\d{6}$/,
      BG: /^\d{4}$/,
      HR: /^\d{5}$/,
      RS: /^\d{5}$/,
      KZ: /^\d{6}$/,
      TR: /^\d{5}$/,
      IL: /^\d{5}$/,
      AE: /^\d{5}$/,
      SA: /^\d{5}$/,
      IN: /^\d{6}$/,
      CN: /^\d{6}$/,
      JP: /^\d{3}-\d{4}$/,
      KR: /^\d{5}$/,
      SG: /^\d{6}$/,
      MY: /^\d{5}$/,
      ID: /^\d{5}$/,
      PH: /^\d{4}$/,
      VN: /^\d{6}$/,
      AU: /^\d{4}$/,
      NZ: /^\d{4}$/,
      ZA: /^\d{4}$/,
    };

    const pattern = patterns[country.toUpperCase()];
    if (!pattern) return false;

    return pattern.test(postalCode);
  },

  /**
   * Checks if a value is a valid semver version
   * @param version - Version string to validate
   * @returns True if valid, false otherwise
   */
  isSemver(version: string): boolean {
    const semverRegex =
      /^\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
    return semverRegex.test(version);
  },

  /**
   * Checks if a value is a valid social security number
   * @param ssn - Social security number to validate
   * @param country - Country code (ISO 3166-1 alpha-2)
   * @returns True if valid, false otherwise
   */
  isSocialSecurityNumber(ssn: string, country: string): boolean {
    const patterns: Record<string, RegExp> = {
      US: /^(?!000|666)[0-8][0-9]{2}-(?!00)[0-9]{2}-(?!0000)[0-9]{4}$/,
      GB: /^[A-Z]{2}\d{6}[A-Z]{1}$/,
      DE: /^\d{11}$/,
      FR: /^\d{15}$/,
      IT: /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/,
      ES: /^\d{8}[A-Z]$/,
      NL: /^\d{9}$/,
      BE: /^\d{11}$/,
      CH: /^\d{13}$/,
      AT: /^\d{10}$/,
      SE: /^\d{12}$/,
      NO: /^\d{11}$/,
      DK: /^\d{10}$/,
      FI: /^\d{11}$/,
    };

    const pattern = patterns[country.toUpperCase()];
    if (!pattern) return false;

    return pattern.test(ssn);
  },

  /**
   * Checks if a value is a valid tax identification number
   * @param tin - Tax identification number to validate
   * @param country - Country code (ISO 3166-1 alpha-2)
   * @returns True if valid, false otherwise
   */
  isTaxIdentificationNumber(tin: string, country: string): boolean {
    const patterns: Record<string, RegExp> = {
      US: /^\d{2}-\d{7}$/, // EIN
      GB: /^\d{10}$/, // VAT
      DE: /^DE\d{9}$/, // VAT
      FR: /^FR\d{11}$/, // VAT
      IT: /^IT\d{11}$/, // VAT
      ES: /^ES[A-Z0-9]{9}$/, // VAT
      NL: /^NL\d{9}B\d{2}$/, // VAT
      BE: /^BE\d{10}$/, // VAT
      CH: /^CHE-\d{3}\.\d{3}\.\d{3}$/, // VAT
      AT: /^ATU\d{8}$/, // VAT
      SE: /^SE\d{12}$/, // VAT
      NO: /^\d{9}MVA$/, // VAT
      DK: /^DK\d{8}$/, // VAT
      FI: /^FI\d{8}$/, // VAT
    };

    const pattern = patterns[country.toUpperCase()];
    if (!pattern) return false;

    return pattern.test(tin);
  },

  /**
   * Checks if a value is a valid URL
   * @param url - URL to validate
   * @returns True if valid, false otherwise
   */
  isUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Checks if a value is a valid username
   * @param username - Username to validate
   * @param options - Username validation options
   * @returns True if valid, false otherwise
   */
  isUsername(
    username: string,
    options: {
      minLength?: number;
      maxLength?: number;
      allowSpecialChars?: boolean;
    } = {}
  ): boolean {
    const {
      minLength = 3,
      maxLength = 20,
      allowSpecialChars = false,
    } = options;

    if (username.length < minLength || username.length > maxLength)
      return false;

    const pattern = allowSpecialChars
      ? /^[a-zA-Z0-9_\-\.]+$/
      : /^[a-zA-Z0-9_]+$/;

    return pattern.test(username);
  },

  /**
   * Checks if a value is a valid UUID
   * @param uuid - UUID to validate
   * @returns True if valid, false otherwise
   */
  isUuid(uuid: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      uuid
    );
  },
};
