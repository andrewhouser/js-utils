import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { InternationalizationUtils } from "../InternationalizationUtils";

describe("InternationalizationUtils", () => {
  const originalNavigator = global.navigator;
  const originalIntl = global.Intl;

  beforeEach(() => {
    // Mock navigator
    const mockNavigator = {
      ...originalNavigator,
      language: "en-US",
      languages: ["en-US", "en", "fr"],
    };
    Object.defineProperty(global, "navigator", {
      value: mockNavigator,
      writable: true,
    });

    // Mock Intl.DateTimeFormat
    const mockDateTimeFormat = vi.fn().mockImplementation(() => ({
      format: vi.fn().mockReturnValue("1/1/2024"),
      resolvedOptions: vi.fn().mockReturnValue({
        locale: "en-US",
        timeZone: "America/New_York",
      }),
    }));
    (mockDateTimeFormat as any).supportedLocalesOf = vi
      .fn()
      .mockReturnValue(["en-US"]);
    Object.defineProperty(global.Intl, "DateTimeFormat", {
      value: mockDateTimeFormat,
      writable: true,
    });

    // Mock Intl.NumberFormat
    const mockNumberFormat = vi.fn().mockImplementation(() => ({
      format: vi.fn().mockReturnValue("$99.99"),
    }));
    (mockNumberFormat as any).supportedLocalesOf = vi
      .fn()
      .mockReturnValue(["en-US"]);
    Object.defineProperty(global.Intl, "NumberFormat", {
      value: mockNumberFormat,
      writable: true,
    });

    // Mock Intl.ListFormat
    const mockListFormat = vi.fn().mockImplementation(() => ({
      format: vi.fn().mockReturnValue("apple, banana, and orange"),
    }));
    (mockListFormat as any).supportedLocalesOf = vi
      .fn()
      .mockReturnValue(["en-US"]);
    Object.defineProperty(global.Intl, "ListFormat", {
      value: mockListFormat,
      writable: true,
    });

    // Mock Intl.PluralRules
    const mockPluralRules = vi.fn().mockImplementation(() => ({
      select: vi.fn().mockReturnValue("other"),
    }));
    (mockPluralRules as any).supportedLocalesOf = vi
      .fn()
      .mockReturnValue(["en-US"]);
    Object.defineProperty(global.Intl, "PluralRules", {
      value: mockPluralRules,
      writable: true,
    });

    // Mock Intl.RelativeTimeFormat
    const mockRelativeTimeFormat = vi.fn().mockImplementation(() => ({
      format: vi.fn().mockReturnValue("1 hour ago"),
    }));
    (mockRelativeTimeFormat as any).supportedLocalesOf = vi
      .fn()
      .mockReturnValue(["en-US"]);
    Object.defineProperty(global.Intl, "RelativeTimeFormat", {
      value: mockRelativeTimeFormat,
      writable: true,
    });

    // Mock Intl.DisplayNames
    const mockDisplayNames = vi.fn().mockImplementation(() => ({
      of: vi.fn().mockReturnValue("English"),
    }));
    (mockDisplayNames as any).supportedLocalesOf = vi
      .fn()
      .mockReturnValue(["en-US"]);
    Object.defineProperty(global.Intl, "DisplayNames", {
      value: mockDisplayNames,
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
    });
    Object.defineProperty(global, "Intl", {
      value: originalIntl,
      writable: true,
    });
  });

  describe("formatCurrency", () => {
    it("should format currency with default options", () => {
      const result = InternationalizationUtils.formatCurrency(99.99);
      expect(result).toBe("$99.99");
      expect(Intl.NumberFormat).toHaveBeenCalledWith("en-US", {
        style: "currency",
        currency: "USD",
      });
    });

    it("should format currency with custom options", () => {
      const result = InternationalizationUtils.formatCurrency(
        99.99,
        "EUR",
        "fr-FR",
        {
          minimumFractionDigits: 2,
        }
      );
      expect(result).toBe("$99.99");
      expect(Intl.NumberFormat).toHaveBeenCalledWith("fr-FR", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
      });
    });
  });

  describe("formatDate", () => {
    it("should format date with default options", () => {
      const result = InternationalizationUtils.formatDate(new Date());
      expect(result).toBe("1/1/2024");
      expect(Intl.DateTimeFormat).toHaveBeenCalledWith("en-US", {});
    });

    it("should format date with custom options", () => {
      const result = InternationalizationUtils.formatDate(new Date(), "fr-FR", {
        dateStyle: "full",
      });
      expect(result).toBe("1/1/2024");
      expect(Intl.DateTimeFormat).toHaveBeenCalledWith("fr-FR", {
        dateStyle: "full",
      });
    });

    it("should handle string date input", () => {
      const result = InternationalizationUtils.formatDate("2024-01-01");
      expect(result).toBe("1/1/2024");
    });

    it("should handle number date input", () => {
      const result = InternationalizationUtils.formatDate(1704067200000);
      expect(result).toBe("1/1/2024");
    });
  });

  describe("formatDateWithPattern", () => {
    // Use UTC date to avoid timezone issues
    const fixedDate = new Date(Date.UTC(2024, 0, 1, 0, 0, 0, 0));

    it("should format date with default pattern", () => {
      const result = InternationalizationUtils.formatDateWithPattern(fixedDate);
      expect(result).toBe("2024-01-01");
    });

    it("should format date with custom pattern", () => {
      const result = InternationalizationUtils.formatDateWithPattern(
        fixedDate,
        "DD/MM/YYYY"
      );
      expect(result).toBe("01/01/2024");
    });

    it("should handle string date input", () => {
      // Use UTC date string
      const result = InternationalizationUtils.formatDateWithPattern(
        "2024-01-01T00:00:00.000Z"
      );
      expect(result).toBe("2024-01-01");
    });

    it("should handle number date input", () => {
      // Use UTC timestamp for January 1, 2024
      const result =
        InternationalizationUtils.formatDateWithPattern(1704067200000);
      expect(result).toBe("2024-01-01");
    });
  });

  describe("formatList", () => {
    it("should format list with default options", () => {
      const result = InternationalizationUtils.formatList([
        "apple",
        "banana",
        "orange",
      ]);
      expect(result).toBe("apple, banana, and orange");
      expect(Intl.ListFormat).toHaveBeenCalledWith("en-US", {});
    });

    it("should format list with custom options", () => {
      const result = InternationalizationUtils.formatList(
        ["apple", "banana", "orange"],
        "fr-FR",
        { type: "conjunction", style: "long" }
      );
      expect(result).toBe("apple, banana, and orange");
      expect(Intl.ListFormat).toHaveBeenCalledWith("fr-FR", {
        type: "conjunction",
        style: "long",
      });
    });
  });

  describe("formatNumber", () => {
    it("should format number with default options", () => {
      const result = InternationalizationUtils.formatNumber(1234.56);
      expect(result).toBe("$99.99");
      expect(Intl.NumberFormat).toHaveBeenCalledWith("en-US", {});
    });

    it("should format number with custom options", () => {
      const result = InternationalizationUtils.formatNumber(1234.56, "fr-FR", {
        minimumFractionDigits: 2,
      });
      expect(result).toBe("$99.99");
      expect(Intl.NumberFormat).toHaveBeenCalledWith("fr-FR", {
        minimumFractionDigits: 2,
      });
    });
  });

  describe("formatPlural", () => {
    it("should format plural with default options", () => {
      const result = InternationalizationUtils.formatPlural(2);
      expect(result).toBe("other");
      expect(Intl.PluralRules).toHaveBeenCalledWith("en-US", {});
    });

    it("should format plural with custom options", () => {
      const result = InternationalizationUtils.formatPlural(2, "fr-FR", {
        type: "cardinal",
      });
      expect(result).toBe("other");
      expect(Intl.PluralRules).toHaveBeenCalledWith("fr-FR", {
        type: "cardinal",
      });
    });
  });

  describe("formatRelativeTime", () => {
    it("should format relative time with default options", () => {
      const result = InternationalizationUtils.formatRelativeTime(new Date());
      expect(result).toBe("1 hour ago");
      expect(Intl.RelativeTimeFormat).toHaveBeenCalledWith("en-US", {});
    });

    it("should format relative time with custom options", () => {
      const result = InternationalizationUtils.formatRelativeTime(
        new Date(),
        "fr-FR",
        {
          numeric: "auto",
        }
      );
      expect(result).toBe("1 hour ago");
      expect(Intl.RelativeTimeFormat).toHaveBeenCalledWith("fr-FR", {
        numeric: "auto",
      });
    });
  });

  describe("getCalendarDisplayName", () => {
    it("should get calendar display name", () => {
      const result =
        InternationalizationUtils.getCalendarDisplayName("gregory");
      expect(result).toBe("English");
      expect(Intl.DisplayNames).toHaveBeenCalledWith("en-US", {
        type: "calendar",
      });
    });

    it("should return calendar code if display name is not available", () => {
      (Intl.DisplayNames as any).mockImplementationOnce(() => ({
        of: vi.fn().mockReturnValue(undefined),
      }));
      const result =
        InternationalizationUtils.getCalendarDisplayName("invalid");
      expect(result).toBe("invalid");
    });
  });

  describe("getCurrencyDisplayName", () => {
    it("should get currency display name", () => {
      const result = InternationalizationUtils.getCurrencyDisplayName("USD");
      expect(result).toBe("English");
      expect(Intl.DisplayNames).toHaveBeenCalledWith("en-US", {
        type: "currency",
      });
    });

    it("should return currency code if display name is not available", () => {
      (Intl.DisplayNames as any).mockImplementationOnce(() => ({
        of: vi.fn().mockReturnValue(undefined),
      }));
      const result =
        InternationalizationUtils.getCurrencyDisplayName("invalid");
      expect(result).toBe("invalid");
    });
  });

  describe("getDateTimeFieldDisplayName", () => {
    it("should get date/time field display name", () => {
      const result =
        InternationalizationUtils.getDateTimeFieldDisplayName("year");
      expect(result).toBe("English");
      expect(Intl.DisplayNames).toHaveBeenCalledWith("en-US", {
        type: "dateTimeField",
      });
    });

    it("should return field code if display name is not available", () => {
      (Intl.DisplayNames as any).mockImplementationOnce(() => ({
        of: vi.fn().mockReturnValue(undefined),
      }));
      const result =
        InternationalizationUtils.getDateTimeFieldDisplayName("invalid");
      expect(result).toBe("invalid");
    });
  });

  describe("getLanguageDisplayName", () => {
    it("should get language display name", () => {
      const result = InternationalizationUtils.getLanguageDisplayName("en");
      expect(result).toBe("English");
      expect(Intl.DisplayNames).toHaveBeenCalledWith("en-US", {
        type: "language",
      });
    });

    it("should return language code if display name is not available", () => {
      (Intl.DisplayNames as any).mockImplementationOnce(() => ({
        of: vi.fn().mockReturnValue(undefined),
      }));
      const result =
        InternationalizationUtils.getLanguageDisplayName("invalid");
      expect(result).toBe("invalid");
    });
  });

  describe("getRegionDisplayName", () => {
    it("should get region display name", () => {
      const result = InternationalizationUtils.getRegionDisplayName("US");
      expect(result).toBe("English");
      expect(Intl.DisplayNames).toHaveBeenCalledWith("en-US", {
        type: "region",
      });
    });

    it("should return region code if display name is not available", () => {
      (Intl.DisplayNames as any).mockImplementationOnce(() => ({
        of: vi.fn().mockReturnValue(undefined),
      }));
      const result = InternationalizationUtils.getRegionDisplayName("invalid");
      expect(result).toBe("invalid");
    });
  });

  describe("getScriptDisplayName", () => {
    it("should get script display name", () => {
      const result = InternationalizationUtils.getScriptDisplayName("Latn");
      expect(result).toBe("English");
      expect(Intl.DisplayNames).toHaveBeenCalledWith("en-US", {
        type: "script",
      });
    });

    it("should return script code if display name is not available", () => {
      (Intl.DisplayNames as any).mockImplementationOnce(() => ({
        of: vi.fn().mockReturnValue(undefined),
      }));
      const result = InternationalizationUtils.getScriptDisplayName("invalid");
      expect(result).toBe("invalid");
    });
  });

  describe("getUnitDisplayName", () => {
    it("should get unit display name", () => {
      const result = InternationalizationUtils.getUnitDisplayName("meter");
      expect(result).toBe("English");
      expect(Intl.DisplayNames).toHaveBeenCalledWith("en-US", {
        type: "unit",
      });
    });

    it("should return unit code if display name is not available", () => {
      (Intl.DisplayNames as any).mockImplementationOnce(() => ({
        of: vi.fn().mockReturnValue(undefined),
      }));
      const result = InternationalizationUtils.getUnitDisplayName("invalid");
      expect(result).toBe("invalid");
    });
  });

  describe("getUserLocale", () => {
    it("should get user locale", () => {
      const result = InternationalizationUtils.getUserLocale();
      expect(result).toBe("en-US");
      expect(Intl.DateTimeFormat).toHaveBeenCalled();
    });
  });

  describe("getUserLanguage", () => {
    it("should get user language", () => {
      const result = InternationalizationUtils.getUserLanguage();
      expect(result).toBe("en-US");
    });

    it("should return default language if navigator.language is not available", () => {
      const mockNavigator = {
        ...originalNavigator,
        language: undefined,
      };
      Object.defineProperty(global, "navigator", {
        value: mockNavigator,
        writable: true,
      });
      const result = InternationalizationUtils.getUserLanguage();
      expect(result).toBe("en-US");
    });
  });

  describe("getUserLanguages", () => {
    it("should get user languages", () => {
      const result = InternationalizationUtils.getUserLanguages();
      expect(result).toEqual(["en-US", "en", "fr"]);
    });

    it("should return default language array if navigator.languages is not available", () => {
      const mockNavigator = {
        ...originalNavigator,
        languages: undefined,
      };
      Object.defineProperty(global, "navigator", {
        value: mockNavigator,
        writable: true,
      });
      const result = InternationalizationUtils.getUserLanguages();
      expect(result).toEqual(["en-US"]);
    });
  });

  describe("getUserTimezone", () => {
    it("should get user timezone", () => {
      const result = InternationalizationUtils.getUserTimezone();
      expect(result).toBe("America/New_York");
      expect(Intl.DateTimeFormat).toHaveBeenCalled();
    });
  });
});
