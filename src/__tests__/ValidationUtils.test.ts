import { describe, it, expect } from "vitest";
import { ValidationUtils } from "../ValidationUtils";

describe("ValidationUtils", () => {
  describe("isBase64", () => {
    it("should validate correct base64 strings", () => {
      expect(ValidationUtils.isBase64("SGVsbG8gV29ybGQ=")).toBe(true);
      expect(ValidationUtils.isBase64("MTIzNDU2Nzg=")).toBe(true);
    });

    it("should reject invalid base64 strings", () => {
      expect(ValidationUtils.isBase64("invalid-base64")).toBe(false);
      expect(ValidationUtils.isBase64("SGVsbG8gV29ybGQ")).toBe(false);
    });
  });

  describe("isCreditCard", () => {
    it("should validate correct credit card numbers", () => {
      expect(ValidationUtils.isCreditCard("4111111111111111")).toBe(true); // Visa
      expect(ValidationUtils.isCreditCard("4111-1111-1111-1111")).toBe(true); // With dashes
      expect(ValidationUtils.isCreditCard("5500 0000 0000 0004")).toBe(true); // Mastercard
    });

    it("should reject invalid credit card numbers", () => {
      expect(ValidationUtils.isCreditCard("1234567890123456")).toBe(false);
      expect(ValidationUtils.isCreditCard("4111111111111112")).toBe(false);
      expect(ValidationUtils.isCreditCard("123")).toBe(false); // Too short
    });
  });

  describe("isCreditCardCvv", () => {
    it("should validate correct CVV numbers", () => {
      expect(ValidationUtils.isCreditCardCvv("123")).toBe(true);
      expect(ValidationUtils.isCreditCardCvv("1234")).toBe(true); // Amex
    });

    it("should reject invalid CVV numbers", () => {
      expect(ValidationUtils.isCreditCardCvv("12")).toBe(false); // Too short
      expect(ValidationUtils.isCreditCardCvv("12345")).toBe(false); // Too long
      expect(ValidationUtils.isCreditCardCvv("abc")).toBe(false); // Non-numeric
    });
  });

  describe("isCreditCardExpiry", () => {
    it("should validate correct expiry dates", () => {
      const currentDate = new Date();
      const nextYear = currentDate.getFullYear() + 1;
      const nextMonth = (currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const nextYearStr = nextYear.toString().slice(-2);

      expect(
        ValidationUtils.isCreditCardExpiry(`${nextMonth}/${nextYearStr}`)
      ).toBe(true);
    });

    it("should reject invalid expiry dates", () => {
      expect(ValidationUtils.isCreditCardExpiry("13/25")).toBe(false); // Invalid month
      expect(ValidationUtils.isCreditCardExpiry("00/25")).toBe(false); // Invalid month
      expect(ValidationUtils.isCreditCardExpiry("12/20")).toBe(false); // Expired
      expect(ValidationUtils.isCreditCardExpiry("12-25")).toBe(false); // Wrong format
    });
  });

  describe("isDomain", () => {
    it("should validate correct domain names", () => {
      expect(ValidationUtils.isDomain("example.com")).toBe(true);
      expect(ValidationUtils.isDomain("sub.example.org")).toBe(true);
      expect(ValidationUtils.isDomain("my-domain.co.uk")).toBe(true);
    });

    it("should reject invalid domain names", () => {
      expect(ValidationUtils.isDomain("invalid..domain")).toBe(false);
      expect(ValidationUtils.isDomain("-invalid.com")).toBe(false);
      expect(ValidationUtils.isDomain("domain-.com")).toBe(false);
    });
  });

  describe("isEmail", () => {
    it("should validate correct email addresses", () => {
      expect(ValidationUtils.isEmail("user@example.com")).toBe(true);
      expect(ValidationUtils.isEmail("test.email+tag@domain.co.uk")).toBe(true);
      expect(ValidationUtils.isEmail("user.name@sub.domain.com")).toBe(true);
    });

    it("should reject invalid email addresses", () => {
      expect(ValidationUtils.isEmail("invalid-email")).toBe(false);
      expect(ValidationUtils.isEmail("user@")).toBe(false);
      expect(ValidationUtils.isEmail("@domain.com")).toBe(false);
    });
  });

  describe("isHostname", () => {
    it("should validate correct hostnames", () => {
      expect(ValidationUtils.isHostname("localhost")).toBe(true);
      expect(ValidationUtils.isHostname("web-server-01")).toBe(true);
      expect(ValidationUtils.isHostname("server")).toBe(true);
    });

    it("should reject invalid hostnames", () => {
      expect(ValidationUtils.isHostname("invalid_hostname")).toBe(false);
      expect(ValidationUtils.isHostname("-invalid")).toBe(false);
      expect(ValidationUtils.isHostname("invalid-")).toBe(false);
    });
  });

  describe("isEmpty", () => {
    it("should identify empty values", () => {
      expect(ValidationUtils.isEmpty(null)).toBe(true);
      expect(ValidationUtils.isEmpty(undefined)).toBe(true);
      expect(ValidationUtils.isEmpty("")).toBe(true);
      expect(ValidationUtils.isEmpty([])).toBe(true);
      expect(ValidationUtils.isEmpty({})).toBe(true);
      expect(ValidationUtils.isEmpty("   ")).toBe(true);
    });

    it("should identify non-empty values", () => {
      expect(ValidationUtils.isEmpty("hello")).toBe(false);
      expect(ValidationUtils.isEmpty([1, 2, 3])).toBe(false);
      expect(ValidationUtils.isEmpty({ key: "value" })).toBe(false);
      expect(ValidationUtils.isEmpty(0)).toBe(false);
      expect(ValidationUtils.isEmpty(false)).toBe(false);
    });
  });

  describe("isIpAddress", () => {
    it("should validate correct IP addresses", () => {
      expect(ValidationUtils.isIpAddress("192.168.1.1")).toBe(true);
      expect(ValidationUtils.isIpAddress("10.0.0.1")).toBe(true);
      expect(
        ValidationUtils.isIpAddress("2001:0db8:85a3:0000:0000:8a2e:0370:7334")
      ).toBe(true);
    });

    it("should reject invalid IP addresses", () => {
      expect(ValidationUtils.isIpAddress("256.1.1.1")).toBe(false);
      expect(ValidationUtils.isIpAddress("192.168.1")).toBe(false);
      expect(ValidationUtils.isIpAddress("invalid")).toBe(false);
    });
  });

  describe("isJson", () => {
    it("should validate correct JSON strings", () => {
      expect(ValidationUtils.isJson('{"name": "John", "age": 30}')).toBe(true);
      expect(ValidationUtils.isJson("[1, 2, 3]")).toBe(true);
      expect(ValidationUtils.isJson('{"nested": {"key": "value"}}')).toBe(true);
    });

    it("should reject invalid JSON strings", () => {
      expect(ValidationUtils.isJson("invalid json")).toBe(false);
      expect(ValidationUtils.isJson("{unclosed object")).toBe(false);
      expect(ValidationUtils.isJson('["unclosed array')).toBe(false);
    });
  });

  describe("isMimeType", () => {
    it("should validate correct MIME types", () => {
      expect(ValidationUtils.isMimeType("text/html")).toBe(true);
      expect(ValidationUtils.isMimeType("application/json")).toBe(true);
      expect(ValidationUtils.isMimeType("image/png")).toBe(true);
    });

    it("should reject invalid MIME types", () => {
      expect(ValidationUtils.isMimeType("invalid-mime")).toBe(false);
      expect(ValidationUtils.isMimeType("text/")).toBe(false);
      expect(ValidationUtils.isMimeType("/json")).toBe(false);
    });
  });

  describe("isPassword", () => {
    it("should validate strong passwords", () => {
      expect(ValidationUtils.isPassword("MyP@ssw0rd123")).toBe(true);
      expect(ValidationUtils.isPassword("StrongPass123!")).toBe(true);
    });

    it("should reject weak passwords", () => {
      expect(ValidationUtils.isPassword("weak")).toBe(false);
      expect(ValidationUtils.isPassword("password")).toBe(false);
      expect(ValidationUtils.isPassword("12345678")).toBe(false);
    });

    it("should respect custom password requirements", () => {
      expect(
        ValidationUtils.isPassword("weak", {
          minLength: 4,
          requireSpecialChars: false,
        })
      ).toBe(false);
      expect(
        ValidationUtils.isPassword("Strong123", { requireSpecialChars: false })
      ).toBe(true);
    });
  });

  describe("isPhoneNumber", () => {
    it("should validate correct phone numbers", () => {
      expect(ValidationUtils.isPhoneNumber("+1 (555) 123-4567")).toBe(true);
      expect(ValidationUtils.isPhoneNumber("555-123-4567")).toBe(true);
      expect(ValidationUtils.isPhoneNumber("+44 20 7123 4567")).toBe(true);
    });

    it("should reject invalid phone numbers", () => {
      expect(ValidationUtils.isPhoneNumber("123")).toBe(false);
      expect(ValidationUtils.isPhoneNumber("invalid")).toBe(false);
      expect(ValidationUtils.isPhoneNumber("555-123")).toBe(false);
    });
  });

  describe("isPort", () => {
    it("should validate correct port numbers", () => {
      expect(ValidationUtils.isPort(80)).toBe(true);
      expect(ValidationUtils.isPort(443)).toBe(true);
      expect(ValidationUtils.isPort(65535)).toBe(true);
      expect(ValidationUtils.isPort(0)).toBe(true);
    });

    it("should reject invalid port numbers", () => {
      expect(ValidationUtils.isPort(-1)).toBe(false);
      expect(ValidationUtils.isPort(65536)).toBe(false);
      expect(ValidationUtils.isPort(1.5)).toBe(false);
    });
  });

  describe("isPostalCode", () => {
    it("should validate correct postal codes", () => {
      expect(ValidationUtils.isPostalCode("12345", "US")).toBe(true);
      expect(ValidationUtils.isPostalCode("A1A 1A1", "CA")).toBe(true);
      expect(ValidationUtils.isPostalCode("SW1A 1AA", "GB")).toBe(true);
    });

    it("should reject invalid postal codes", () => {
      expect(ValidationUtils.isPostalCode("1234", "US")).toBe(false);
      expect(ValidationUtils.isPostalCode("invalid", "CA")).toBe(false);
      expect(ValidationUtils.isPostalCode("12345", "XX")).toBe(false); // Invalid country
    });
  });

  describe("isSemver", () => {
    it("should validate correct semver versions", () => {
      expect(ValidationUtils.isSemver("1.0.0")).toBe(true);
      expect(ValidationUtils.isSemver("2.1.0-beta.1")).toBe(true);
      expect(ValidationUtils.isSemver("3.0.0+20130313144700")).toBe(true);
    });

    it("should reject invalid semver versions", () => {
      expect(ValidationUtils.isSemver("1.0")).toBe(false);
      expect(ValidationUtils.isSemver("1")).toBe(false);
      expect(ValidationUtils.isSemver("invalid")).toBe(false);
    });
  });

  describe("isSocialSecurityNumber", () => {
    it("should validate correct SSNs", () => {
      expect(ValidationUtils.isSocialSecurityNumber("123-45-6789", "US")).toBe(
        true
      );
      expect(ValidationUtils.isSocialSecurityNumber("AB123456C", "GB")).toBe(
        true
      );
    });

    it("should reject invalid SSNs", () => {
      expect(ValidationUtils.isSocialSecurityNumber("123-45-678", "US")).toBe(
        false
      );
      expect(ValidationUtils.isSocialSecurityNumber("invalid", "GB")).toBe(
        false
      );
      expect(ValidationUtils.isSocialSecurityNumber("123-45-6789", "XX")).toBe(
        false
      ); // Invalid country
    });
  });

  describe("isTaxIdentificationNumber", () => {
    it("should validate correct TINs", () => {
      expect(
        ValidationUtils.isTaxIdentificationNumber("12-3456789", "US")
      ).toBe(true);
      expect(
        ValidationUtils.isTaxIdentificationNumber("DE123456789", "DE")
      ).toBe(true);
    });

    it("should reject invalid TINs", () => {
      expect(ValidationUtils.isTaxIdentificationNumber("12-345678", "US")).toBe(
        false
      );
      expect(ValidationUtils.isTaxIdentificationNumber("invalid", "DE")).toBe(
        false
      );
      expect(
        ValidationUtils.isTaxIdentificationNumber("12-3456789", "XX")
      ).toBe(false); // Invalid country
    });
  });

  describe("isUrl", () => {
    it("should validate correct URLs", () => {
      expect(ValidationUtils.isUrl("https://example.com")).toBe(true);
      expect(ValidationUtils.isUrl("http://sub.example.co.uk/path")).toBe(true);
      expect(
        ValidationUtils.isUrl("https://example.com:8080/path?query=value")
      ).toBe(true);
    });

    it("should reject invalid URLs", () => {
      expect(ValidationUtils.isUrl("invalid")).toBe(false);
      expect(ValidationUtils.isUrl("http://")).toBe(false);
      expect(ValidationUtils.isUrl("https://")).toBe(false);
    });
  });

  describe("isUsername", () => {
    it("should validate correct usernames", () => {
      expect(ValidationUtils.isUsername("john_doe")).toBe(true);
      expect(ValidationUtils.isUsername("user123")).toBe(true);
      expect(
        ValidationUtils.isUsername("user.name", { allowSpecialChars: true })
      ).toBe(true);
    });

    it("should reject invalid usernames", () => {
      expect(ValidationUtils.isUsername("ab")).toBe(false); // Too short
      expect(ValidationUtils.isUsername("a".repeat(21))).toBe(false); // Too long
      expect(ValidationUtils.isUsername("user@name")).toBe(false); // Invalid chars
    });
  });

  describe("isUuid", () => {
    it("should validate correct UUIDs", () => {
      expect(
        ValidationUtils.isUuid("123e4567-e89b-12d3-a456-426614174000")
      ).toBe(true);
      expect(
        ValidationUtils.isUuid("550e8400-e29b-41d4-a716-446655440000")
      ).toBe(true);
    });

    it("should reject invalid UUIDs", () => {
      expect(ValidationUtils.isUuid("invalid-uuid")).toBe(false);
      expect(
        ValidationUtils.isUuid("123e4567-e89b-12d3-a456-42661417400")
      ).toBe(false); // Too short
      expect(
        ValidationUtils.isUuid("123e4567-e89b-12d3-a456-4266141740000")
      ).toBe(false); // Too long
    });
  });
});
