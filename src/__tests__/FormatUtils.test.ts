import { describe, it, expect } from "vitest";
import { FormatUtils } from "../FormatUtils";

describe("FormatUtils", () => {
  describe("formatAddress", () => {
    it("should format a complete address", () => {
      const address = {
        street: "123 Main St",
        city: "Springfield",
        state: "IL",
        zip: "62701",
        country: "USA",
      };
      expect(FormatUtils.formatAddress(address)).toBe(
        "123 Main St, Springfield, IL, 62701, USA"
      );
    });

    it("should handle partial address", () => {
      const address = {
        city: "Springfield",
        state: "IL",
      };
      expect(FormatUtils.formatAddress(address)).toBe("Springfield, IL");
    });

    it("should handle empty address", () => {
      expect(FormatUtils.formatAddress({})).toBe("");
    });
  });

  describe("formatCreditCard", () => {
    it("should format a valid credit card number", () => {
      expect(FormatUtils.formatCreditCard("4111111111111111")).toBe(
        "4111 1111 1111 1111"
      );
    });

    it("should handle non-numeric characters", () => {
      expect(FormatUtils.formatCreditCard("4111-1111-1111-1111")).toBe(
        "4111 1111 1111 1111"
      );
    });

    it("should return original string if no valid groups", () => {
      expect(FormatUtils.formatCreditCard("123")).toBe("123");
    });
  });

  describe("formatCurrency", () => {
    it("should format USD currency", () => {
      expect(FormatUtils.formatCurrency(99.99)).toBe("$99.99");
    });

    it("should format EUR currency", () => {
      expect(FormatUtils.formatCurrency(99.99, "EUR", "de-DE")).toMatch(
        /^99,99\s*€$/
      );
    });

    it("should handle zero", () => {
      expect(FormatUtils.formatCurrency(0)).toBe("$0.00");
    });

    it("should handle negative numbers", () => {
      expect(FormatUtils.formatCurrency(-99.99)).toBe("-$99.99");
    });
  });

  describe("formatFileSize", () => {
    it("should format bytes", () => {
      expect(FormatUtils.formatFileSize(500)).toBe("500 Bytes");
    });

    it("should format kilobytes", () => {
      expect(FormatUtils.formatFileSize(1024)).toBe("1 KB");
    });

    it("should format megabytes", () => {
      expect(FormatUtils.formatFileSize(1024 * 1024)).toBe("1 MB");
    });

    it("should handle custom decimals", () => {
      expect(FormatUtils.formatFileSize(1024 * 1.5, 1)).toBe("1.5 KB");
    });

    it("should handle zero", () => {
      expect(FormatUtils.formatFileSize(0)).toBe("0 Bytes");
    });
  });

  describe("formatNumber", () => {
    it("should format large numbers with commas", () => {
      expect(FormatUtils.formatNumber(1000000)).toBe("1,000,000");
    });

    it("should handle small numbers", () => {
      expect(FormatUtils.formatNumber(123)).toBe("123");
    });

    it("should handle zero", () => {
      expect(FormatUtils.formatNumber(0)).toBe("0");
    });

    it("should handle negative numbers", () => {
      expect(FormatUtils.formatNumber(-1000000)).toBe("-1,000,000");
    });
  });

  describe("formatPercent", () => {
    it("should format percentage with default decimals", () => {
      expect(FormatUtils.formatPercent(75.5)).toBe("75.5%");
    });

    it("should format percentage with custom decimals", () => {
      expect(FormatUtils.formatPercent(75.555, 2)).toBe("75.56%");
    });

    it("should handle zero", () => {
      expect(FormatUtils.formatPercent(0)).toBe("0.0%");
    });

    it("should handle negative numbers", () => {
      expect(FormatUtils.formatPercent(-75.5)).toBe("-75.5%");
    });
  });

  describe("formatPhoneNumber", () => {
    it("should format US phone number", () => {
      expect(FormatUtils.formatPhoneNumber("1234567890", "US")).toBe(
        "(123) 456-7890"
      );
    });

    it("should format EU phone number", () => {
      expect(FormatUtils.formatPhoneNumber("1234567890", "EU")).toBe(
        "12 34 56 78 90"
      );
    });

    it("should handle non-numeric characters", () => {
      expect(FormatUtils.formatPhoneNumber("123-456-7890", "US")).toBe(
        "(123) 456-7890"
      );
    });

    it("should return original string if invalid format", () => {
      expect(FormatUtils.formatPhoneNumber("123")).toBe("123");
    });
  });

  describe("formatDuration", () => {
    it("should format short duration", () => {
      expect(FormatUtils.formatDuration(3661000, "short")).toBe("1h");
    });

    it("should format long duration", () => {
      const result = FormatUtils.formatDuration(3661000, "long");
      expect(result).toMatch(/^1 hour, 1 minute, 1 second$/);
    });

    it("should handle plural forms", () => {
      const result = FormatUtils.formatDuration(7200000, "long");
      expect(result).toMatch(/^2 hours$/);
    });

    it("should handle zero duration", () => {
      const result = FormatUtils.formatDuration(0, "long");
      expect(result).toMatch(/^0 seconds$/);
    });

    it("should handle single units", () => {
      const result = FormatUtils.formatDuration(60000, "long");
      expect(result).toMatch(/^1 minute$/);
    });

    it("should handle multiple units", () => {
      const result = FormatUtils.formatDuration(3661000, "long");
      expect(result).toMatch(/^1 hour, 1 minute, 1 second$/);
    });
  });

  describe("formatSSN", () => {
    it("should format valid SSN", () => {
      expect(FormatUtils.formatSSN("123456789")).toBe("123-45-6789");
    });

    it("should handle non-numeric characters", () => {
      expect(FormatUtils.formatSSN("123-45-6789")).toBe("123-45-6789");
    });

    it("should return original string if invalid format", () => {
      expect(FormatUtils.formatSSN("123")).toBe("123");
    });
  });
});
