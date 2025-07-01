/**
 * @module FormatUtils
 * @description A comprehensive collection of utility functions for formatting data, text, numbers, and dates.
 * @example
 * ```typescript
 * import { FormatUtils } from 'js-utils';
 *
 * // Format phone number
 * const phone = FormatUtils.formatPhoneNumber('1234567890'); // "(123) 456-7890"
 *
 * // Format currency
 * const price = FormatUtils.formatCurrency(1234.56); // "$1,234.56"
 *
 * // Format file size
 * const size = FormatUtils.formatFileSize(1048576); // "1.0 MB"
 * ```
 */

export const FormatUtils = {
  /**
   * Formats an address into a comma-separated string.
   *
   * @param address - The address object to format
   * @param address.street - Street address
   * @param address.city - City name
   * @param address.state - State or province
   * @param address.zip - ZIP or postal code
   * @param address.country - Country name
   * @returns The formatted address string
   *
   * @example
   * ```typescript
   * const address = {
   *   street: "123 Main St",
   *   city: "Springfield",
   *   state: "IL",
   *   zip: "62701"
   * };
   * const formatted = FormatUtils.formatAddress(address);
   * // "123 Main St, Springfield, IL, 62701"
   * ```
   */
  formatAddress: (address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  }): string => {
    const parts: string[] = [];
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.zip) parts.push(address.zip);
    if (address.country) parts.push(address.country);

    return parts.join(", ");
  },

  /**
   * Formats a credit card number by adding spaces every 4 digits.
   *
   * @param cardNumber - The card number to format
   * @returns The formatted card number with spaces
   *
   * @example
   * ```typescript
   * const card = FormatUtils.formatCreditCard("4111111111111111");
   * // "4111 1111 1111 1111"
   * ```
   */
  formatCreditCard: (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\D/g, "");
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : cardNumber;
  },

  /**
   * Formats a number as currency using the Intl.NumberFormat API.
   *
   * @param amount - The amount to format
   * @param currency - The currency code (e.g., 'USD', 'EUR', 'GBP')
   * @param locale - The locale to use for formatting
   * @returns The formatted currency string
   *
   * @example
   * ```typescript
   * const price = FormatUtils.formatCurrency(99.99, "USD", "en-US");
   * // "$99.99"
   *
   * const euros = FormatUtils.formatCurrency(99.99, "EUR", "de-DE");
   * // "99,99 €"
   * ```
   */
  formatCurrency: (
    amount: number,
    currency = "USD",
    locale = "en-US"
  ): string => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount);
  },

  /**
   * Formats a file size in bytes to a human-readable string.
   *
   * @param bytes - The size in bytes
   * @param decimals - Number of decimal places to show
   * @returns The formatted file size with appropriate unit
   *
   * @example
   * ```typescript
   * const size = FormatUtils.formatFileSize(1024); // "1 KB"
   * const size2 = FormatUtils.formatFileSize(1024 * 1024, 1); // "1.0 MB"
   * ```
   */
  formatFileSize: (bytes: number, decimals = 2): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${
      sizes[i]
    }`;
  },

  /**
   * Formats a number with commas as thousands separators.
   *
   * @param num - Number to format
   * @returns Formatted number string with commas
   *
   * @example
   * ```typescript
   * const num = FormatUtils.formatNumber(1000000); // "1,000,000"
   * ```
   */
  formatNumber: (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  /**
   * Formats a number as a percentage.
   *
   * @param value - The value to format
   * @param decimals - Number of decimal places to show
   * @returns The formatted percentage string
   *
   * @example
   * ```typescript
   * const percent = FormatUtils.formatPercent(75.5); // "75.5%"
   * ```
   */
  formatPercent: (value: number, decimals = 1): string => {
    return `${value.toFixed(decimals)}%`;
  },

  /**
   * Formats a phone number according to the specified format.
   *
   * @param phone - The phone number to format
   * @param format - The format to use ('US' or 'EU')
   * @returns The formatted phone number
   *
   * @example
   * ```typescript
   * const usPhone = FormatUtils.formatPhoneNumber("1234567890", "US");
   * // "(123) 456-7890"
   *
   * const euPhone = FormatUtils.formatPhoneNumber("1234567890", "EU");
   * // "12 34 56 78 90"
   * ```
   */
  formatPhoneNumber: (phone: string, format: "US" | "EU" = "US"): string => {
    const cleaned = phone.replace(/\D/g, "");

    if (format === "US") {
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    } else if (format === "EU") {
      const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
      if (match) {
        return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
      }
    }

    return phone;
  },

  /**
   * Formats a duration in milliseconds to a human-readable string.
   *
   * @param ms - The duration in milliseconds
   * @param format - The format to use ('short' or 'long')
   * @returns The formatted duration string
   *
   * @example
   * ```typescript
   * const short = FormatUtils.formatDuration(3661000, "short"); // "1h"
   * const long = FormatUtils.formatDuration(3661000, "long");
   * // "1 hour, 1 minute, 1 second"
   * ```
   */
  formatDuration: (ms: number, format: "short" | "long" = "short"): string => {
    if (ms === 0) return format === "short" ? "0s" : "0 seconds";

    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // For short format, return the largest non-zero unit
    if (format === "short") {
      if (days > 0) return `${days}d`;
      if (hours > 0) return `${hours}h`;
      if (minutes > 0) return `${minutes}m`;
      return `${seconds}s`;
    }

    // For long format, calculate remaining time after each unit
    const remainingSeconds = seconds % 60;
    const remainingMinutes = minutes % 60;
    const remainingHours = hours % 24;

    const parts: string[] = [];

    if (days > 0) {
      parts.push(`${days} day${days === 1 ? "" : "s"}`);
    }
    if (remainingHours > 0) {
      parts.push(`${remainingHours} hour${remainingHours === 1 ? "" : "s"}`);
    }
    if (remainingMinutes > 0) {
      parts.push(
        `${remainingMinutes} minute${remainingMinutes === 1 ? "" : "s"}`
      );
    }
    if (remainingSeconds > 0) {
      parts.push(
        `${remainingSeconds} second${remainingSeconds === 1 ? "" : "s"}`
      );
    }

    return parts.join(", ");
  },

  /**
   * Formats a social security number with hyphens.
   *
   * @param ssn - The SSN to format
   * @returns The formatted SSN
   *
   * @example
   * ```typescript
   * const ssn = FormatUtils.formatSSN("123456789"); // "123-45-6789"
   * ```
   */
  formatSSN: (ssn: string): string => {
    const cleaned = ssn.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
    return match ? `${match[1]}-${match[2]}-${match[3]}` : ssn;
  },
};
