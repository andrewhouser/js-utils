/**
 * @module InternationalizationUtils
 * @description A comprehensive collection of utility functions for internationalization and localization.
 * Provides methods for formatting dates, numbers, currencies, lists, handling plurals, relative time,
 * and accessing user locale preferences using the Intl API.
 * @example
 * ```typescript
 * import { InternationalizationUtils } from 'houser-js-utils';
 *
 * // Format currency
 * const price = InternationalizationUtils.formatCurrency(99.99, 'USD', 'en-US'); // "$99.99"
 *
 * // Format date
 * const date = InternationalizationUtils.formatDate(new Date(), 'en-US'); // "1/1/2024"
 *
 * // Get user's locale
 * const locale = InternationalizationUtils.getUserLocale(); // "en-US"
 * ```
 */
export const InternationalizationUtils = {
  /**
   * Formats a currency amount according to the specified locale and currency code.
   * @param amount - The numeric amount to format
   * @param currency - The currency code (e.g., 'USD', 'EUR', 'JPY')
   * @param locale - The locale to use for formatting (default: user's locale)
   * @param options - Additional Intl.NumberFormat options for customization
   * @returns The formatted currency string
   * @example
   * ```typescript
   * InternationalizationUtils.formatCurrency(99.99, 'USD', 'en-US'); // "$99.99"
   * InternationalizationUtils.formatCurrency(99.99, 'EUR', 'fr-FR'); // "99,99 €"
   * InternationalizationUtils.formatCurrency(1234.56, 'JPY', 'ja-JP'); // "¥1,235"
   * ```
   */
  formatCurrency(
    amount: number,
    currency: string = "USD",
    locale: string = InternationalizationUtils.getUserLocale(),
    options: Intl.NumberFormatOptions = {}
  ): string {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      ...options,
    }).format(amount);
  },

  /**
   * Formats a date according to the specified locale and formatting options.
   * @param date - The date to format (Date object, timestamp, or date string)
   * @param locale - The locale to use for formatting (default: user's locale)
   * @param options - Intl.DateTimeFormat options for customization
   * @returns The formatted date string
   * @example
   * ```typescript
   * InternationalizationUtils.formatDate(new Date(), 'en-US'); // "1/1/2024"
   * InternationalizationUtils.formatDate(new Date(), 'fr-FR', { dateStyle: 'full' }); // "lundi 1 janvier 2024"
   * InternationalizationUtils.formatDate(Date.now(), 'de-DE', { year: 'numeric', month: 'long' }); // "Januar 2024"
   * ```
   */
  formatDate(
    date: Date | number | string,
    locale: string = InternationalizationUtils.getUserLocale(),
    options: Intl.DateTimeFormatOptions = {}
  ): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  },

  /**
   * Formats a date using a specific pattern string for custom date formats.
   * @param date - The date to format (Date object, timestamp, or date string)
   * @param format - The format pattern string (e.g., 'YYYY-MM-DD', 'DD/MM/YYYY')
   * @param locale - The locale to use (default: user's locale)
   * @returns The formatted date string according to the pattern
   * @example
   * ```typescript
   * InternationalizationUtils.formatDateWithPattern(new Date(), 'YYYY-MM-DD'); // "2024-01-01"
   * InternationalizationUtils.formatDateWithPattern(new Date(), 'DD/MM/YYYY'); // "01/01/2024"
   * InternationalizationUtils.formatDateWithPattern(new Date(), 'YYYY-MM-DD HH:mm:ss'); // "2024-01-01 14:30:45"
   * ```
   */
  formatDateWithPattern(
    date: Date | string | number,
    format: string = "YYYY-MM-DD",
    locale: string = navigator.language
  ): string {
    const d = new Date(date);

    // Create a formatter with the specified locale
    const formatter = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "UTC",
    });

    // Get the parts from the formatter
    let values: Record<string, string>;
    try {
      const parts = formatter.formatToParts(d);
      values = {};
      parts.forEach((part) => {
        values[part.type] = part.value;
      });
    } catch (e) {
      // Fallback for environments where formatToParts is not available
      const year = d.getUTCFullYear().toString();
      const month = (d.getUTCMonth() + 1).toString().padStart(2, "0");
      const day = d.getUTCDate().toString().padStart(2, "0");
      const hour = d.getUTCHours().toString().padStart(2, "0");
      const minute = d.getUTCMinutes().toString().padStart(2, "0");
      const second = d.getUTCSeconds().toString().padStart(2, "0");

      values = {
        year,
        month,
        day,
        hour,
        minute,
        second,
      };
    }

    // Map the parts to the format tokens
    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (match) => {
      switch (match) {
        case "YYYY":
          return values.year;
        case "MM":
          return values.month;
        case "DD":
          return values.day;
        case "HH":
          return values.hour;
        case "mm":
          return values.minute;
        case "ss":
          return values.second;
        default:
          return match;
      }
    });
  },

  /**
   * Formats a list of items according to locale-specific list formatting rules.
   * @param list - Array of strings to format into a list
   * @param locale - The locale to use for formatting (default: user's locale)
   * @param options - ListFormat options for type and style
   * @param options.type - The type of list: 'conjunction' (and), 'disjunction' (or), or 'unit'
   * @param options.style - The style: 'long', 'short', or 'narrow'
   * @returns The formatted list string
   * @example
   * ```typescript
   * InternationalizationUtils.formatList(['apple', 'banana', 'orange'], 'en-US'); // "apple, banana, and orange"
   * InternationalizationUtils.formatList(['red', 'blue'], 'en-US', { type: 'disjunction' }); // "red or blue"
   * InternationalizationUtils.formatList(['Jan', 'Feb', 'Mar'], 'fr-FR'); // "Jan, Feb et Mar"
   * ```
   */
  formatList(
    list: string[],
    locale: string = InternationalizationUtils.getUserLocale(),
    options: {
      type?: "conjunction" | "disjunction" | "unit";
      style?: "long" | "short" | "narrow";
    } = {}
  ): string {
    return (Intl as any).ListFormat(locale, options).format(list);
  },

  /**
   * Formats a number according to the specified locale and formatting options.
   * @param number - The number to format
   * @param locale - The locale to use for formatting (default: user's locale)
   * @param options - Intl.NumberFormat options for customization
   * @returns The formatted number string
   * @example
   * ```typescript
   * InternationalizationUtils.formatNumber(1234.56, 'en-US'); // "1,234.56"
   * InternationalizationUtils.formatNumber(1234.56, 'fr-FR'); // "1 234,56"
   * InternationalizationUtils.formatNumber(0.75, 'en-US', { style: 'percent' }); // "75%"
   * ```
   */
  formatNumber(
    number: number,
    locale: string = InternationalizationUtils.getUserLocale(),
    options: Intl.NumberFormatOptions = {}
  ): string {
    return new Intl.NumberFormat(locale, options).format(number);
  },

  /**
   * Determines the plural rule category for a given count according to locale rules.
   * @param count - The number to determine plural category for
   * @param locale - The locale to use for plural rules (default: user's locale)
   * @param options - Intl.PluralRules options
   * @returns The plural category: 'zero', 'one', 'two', 'few', 'many', or 'other'
   * @example
   * ```typescript
   * InternationalizationUtils.formatPlural(0, 'en-US'); // "other"
   * InternationalizationUtils.formatPlural(1, 'en-US'); // "one"
   * InternationalizationUtils.formatPlural(2, 'en-US'); // "other"
   * InternationalizationUtils.formatPlural(1, 'ru-RU'); // "one"
   * ```
   */
  formatPlural(
    count: number,
    locale: string = InternationalizationUtils.getUserLocale(),
    options: Intl.PluralRulesOptions = {}
  ): string {
    return new Intl.PluralRules(locale, options).select(count);
  },

  /**
   * Formats a relative time string (e.g., "2 hours ago", "in 3 days") for a given date.
   * @param date - The date to format relative to now (Date object, timestamp, or date string)
   * @param locale - The locale to use for formatting (default: user's locale)
   * @param options - Intl.RelativeTimeFormat options
   * @returns The formatted relative time string
   * @example
   * ```typescript
   * const now = new Date();
   * const anHourAgo = new Date(now.getTime() - 3600000);
   * InternationalizationUtils.formatRelativeTime(anHourAgo, 'en-US'); // "1 hour ago"
   *
   * const tomorrow = new Date(now.getTime() + 86400000);
   * InternationalizationUtils.formatRelativeTime(tomorrow, 'en-US'); // "in 1 day"
   * ```
   */
  formatRelativeTime(
    date: Date | number | string,
    locale: string = InternationalizationUtils.getUserLocale(),
    options: Intl.RelativeTimeFormatOptions = {}
  ): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diff =
      (dateObj instanceof Date ? dateObj.getTime() : dateObj) - now.getTime();
    const diffInSeconds = Math.round(diff / 1000);
    const diffInMinutes = Math.round(diffInSeconds / 60);
    const diffInHours = Math.round(diffInMinutes / 60);
    const diffInDays = Math.round(diffInHours / 24);

    const rtf = new Intl.RelativeTimeFormat(locale, options);

    if (Math.abs(diffInSeconds) < 60) {
      return rtf.format(diffInSeconds, "second");
    }
    if (Math.abs(diffInMinutes) < 60) {
      return rtf.format(diffInMinutes, "minute");
    }
    if (Math.abs(diffInHours) < 24) {
      return rtf.format(diffInHours, "hour");
    }
    return rtf.format(diffInDays, "day");
  },

  /**
   * Gets the localized display name for a calendar system.
   * @param calendar - The calendar code (e.g., 'gregory', 'buddhist', 'islamic')
   * @param locale - The locale to use for formatting (default: user's locale)
   * @param options - Additional DisplayNames options for customization
   * @returns The localized calendar display name
   * @example
   * ```typescript
   * InternationalizationUtils.getCalendarDisplayName('gregory', 'en-US'); // "Gregorian Calendar"
   * InternationalizationUtils.getCalendarDisplayName('buddhist', 'th-TH'); // "ปฏิทินพุทธ"
   * InternationalizationUtils.getCalendarDisplayName('islamic', 'ar-SA'); // "التقويم الهجري"
   * ```
   */
  getCalendarDisplayName(
    calendar: string,
    locale: string = InternationalizationUtils.getUserLocale(),
    options: Omit<Intl.DisplayNamesOptions, "type"> = {}
  ): string {
    return (
      new Intl.DisplayNames(locale, {
        type: "calendar",
        ...options,
      }).of(calendar) || calendar
    );
  },

  /**
   * Gets the localized display name for a currency.
   * @param currency - The currency code (e.g., 'USD', 'EUR', 'JPY')
   * @param locale - The locale to use for formatting (default: user's locale)
   * @param options - Additional DisplayNames options for customization
   * @returns The localized currency display name
   * @example
   * ```typescript
   * InternationalizationUtils.getCurrencyDisplayName('USD', 'en-US'); // "US Dollar"
   * InternationalizationUtils.getCurrencyDisplayName('EUR', 'fr-FR'); // "euro"
   * InternationalizationUtils.getCurrencyDisplayName('JPY', 'ja-JP'); // "日本円"
   * ```
   */
  getCurrencyDisplayName(
    currency: string,
    locale: string = InternationalizationUtils.getUserLocale(),
    options: Omit<Intl.DisplayNamesOptions, "type"> = {}
  ): string {
    return (
      new Intl.DisplayNames(locale, {
        type: "currency",
        ...options,
      }).of(currency) || currency
    );
  },

  /**
   * Gets the localized display name for a date/time field.
   * @param field - The field code (e.g., 'year', 'month', 'day', 'hour', 'minute')
   * @param locale - The locale to use for formatting (default: user's locale)
   * @param options - Additional DisplayNames options for customization
   * @returns The localized field display name
   * @example
   * ```typescript
   * InternationalizationUtils.getDateTimeFieldDisplayName('year', 'en-US'); // "year"
   * InternationalizationUtils.getDateTimeFieldDisplayName('month', 'fr-FR'); // "mois"
   * InternationalizationUtils.getDateTimeFieldDisplayName('day', 'es-ES'); // "día"
   * ```
   */
  getDateTimeFieldDisplayName(
    field: string,
    locale: string = InternationalizationUtils.getUserLocale(),
    options: Omit<Intl.DisplayNamesOptions, "type"> = {}
  ): string {
    return (
      new Intl.DisplayNames(locale, {
        type: "dateTimeField",
        ...options,
      }).of(field) || field
    );
  },

  /**
   * Gets the localized display name for a language.
   * @param language - The language code (e.g., 'en', 'fr', 'es', 'zh')
   * @param locale - The locale to use for formatting (default: user's locale)
   * @param options - Additional DisplayNames options for customization
   * @returns The localized language display name
   * @example
   * ```typescript
   * InternationalizationUtils.getLanguageDisplayName('en', 'en-US'); // "English"
   * InternationalizationUtils.getLanguageDisplayName('fr', 'fr-FR'); // "français"
   * InternationalizationUtils.getLanguageDisplayName('es', 'es-ES'); // "español"
   * ```
   */
  getLanguageDisplayName(
    language: string,
    locale: string = InternationalizationUtils.getUserLocale(),
    options: Omit<Intl.DisplayNamesOptions, "type"> = {}
  ): string {
    return (
      new Intl.DisplayNames(locale, {
        type: "language",
        ...options,
      }).of(language) || language
    );
  },

  /**
   * Gets the localized display name for a region/country.
   * @param region - The region/country code (e.g., 'US', 'FR', 'JP', 'GB')
   * @param locale - The locale to use for formatting (default: user's locale)
   * @param options - Additional DisplayNames options for customization
   * @returns The localized region display name
   * @example
   * ```typescript
   * InternationalizationUtils.getRegionDisplayName('US', 'en-US'); // "United States"
   * InternationalizationUtils.getRegionDisplayName('FR', 'fr-FR'); // "France"
   * InternationalizationUtils.getRegionDisplayName('JP', 'ja-JP'); // "日本"
   * ```
   */
  getRegionDisplayName(
    region: string,
    locale: string = InternationalizationUtils.getUserLocale(),
    options: Omit<Intl.DisplayNamesOptions, "type"> = {}
  ): string {
    return (
      new Intl.DisplayNames(locale, {
        type: "region",
        ...options,
      }).of(region) || region
    );
  },

  /**
   * Gets the localized display name for a writing script.
   * @param script - The script code (e.g., 'Latn', 'Cyrl', 'Arab', 'Hans')
   * @param locale - The locale to use for formatting (default: user's locale)
   * @param options - Additional DisplayNames options for customization
   * @returns The localized script display name
   * @example
   * ```typescript
   * InternationalizationUtils.getScriptDisplayName('Latn', 'en-US'); // "Latin"
   * InternationalizationUtils.getScriptDisplayName('Cyrl', 'ru-RU'); // "кириллица"
   * InternationalizationUtils.getScriptDisplayName('Arab', 'ar-SA'); // "العربية"
   * ```
   */
  getScriptDisplayName(
    script: string,
    locale: string = InternationalizationUtils.getUserLocale(),
    options: Omit<Intl.DisplayNamesOptions, "type"> = {}
  ): string {
    return (
      new Intl.DisplayNames(locale, {
        type: "script",
        ...options,
      }).of(script) || script
    );
  },

  /**
   * Gets the display names of a unit
   * @param unit - Unit code (e.g., 'meter', 'kilogram')
   * @param locale - Locale to use (e.g., 'en-US', 'fr-FR')
   * @param options - DisplayNames options
   * @returns Unit display name
   *
   * @example
   * ```typescript
   * getUnitDisplayName('meter', 'en-US') // 'meter'
   * getUnitDisplayName('kilogram', 'fr-FR') // 'kilogramme'
   * ```
   */
  getUnitDisplayName(
    unit: string,
    locale: string = InternationalizationUtils.getUserLocale(),
    options: Omit<Intl.DisplayNamesOptions, "type"> = {}
  ): string {
    return (
      new Intl.DisplayNames(locale, {
        type: "unit" as Intl.DisplayNamesOptions["type"],
        ...options,
      }).of(unit) || unit
    );
  },

  /**
   * Gets the user's locale
   * @returns User's locale (e.g., 'en-US', 'fr-FR')
   *
   * @example
   * ```typescript
   * const locale = getUserLocale(); // 'en-US'
   * ```
   */
  getUserLocale(): string {
    return Intl.DateTimeFormat().resolvedOptions().locale;
  },

  /**
   * Gets the user's preferred language
   * @returns User's preferred language code (e.g., 'en-US', 'fr-FR')
   *
   * @example
   * ```typescript
   * const language = getUserLanguage(); // 'en-US'
   * ```
   */
  getUserLanguage(): string {
    return navigator.language || "en-US";
  },

  /**
   * Gets the user's preferred languages
   * @returns Array of user's preferred language codes
   *
   * @example
   * ```typescript
   * const languages = getUserLanguages(); // ['en-US', 'en', 'fr']
   * ```
   */
  getUserLanguages(): readonly string[] {
    return navigator.languages || [navigator.language || "en-US"];
  },

  /**
   * Gets the user's timezone
   * @returns User's timezone (e.g., 'America/New_York', 'Europe/Paris')
   *
   * @example
   * ```typescript
   * const timezone = getUserTimezone(); // 'America/New_York'
   * ```
   */
  getUserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  },
};
