import { describe, it, expect } from "vitest";
import { StringUtils } from "../StringUtils";

describe("StringUtils", () => {
  describe("camelCaseToSentence", () => {
    it("should convert camelCase to sentence", () => {
      expect(StringUtils.camelCaseToSentence("myVariableName")).toBe(
        "My Variable Name"
      );
      expect(StringUtils.camelCaseToSentence("XMLHttpRequest")).toBe(
        "Xml Http Request"
      );
      expect(StringUtils.camelCaseToSentence("myXMLHttpRequest")).toBe(
        "My Xml Http Request"
      );
      expect(StringUtils.camelCaseToSentence("test123Value")).toBe(
        "Test 123 Value"
      );
      expect(StringUtils.camelCaseToSentence("")).toBe("");
      expect(StringUtils.camelCaseToSentence(null as any)).toBe("");
    });
  });

  describe("camelize", () => {
    it("should convert string to camelCase", () => {
      expect(StringUtils.camelize("hello world")).toBe("helloWorld");
      expect(StringUtils.camelize("my-variable-name")).toBe("myVariableName");
      expect(StringUtils.camelize("My_variable_name")).toBe("myVariableName");
      expect(StringUtils.camelize("alreadyCamelCase")).toBe("alreadycamelcase");
    });
  });

  describe("capitalize", () => {
    it("should capitalize the first letter", () => {
      expect(StringUtils.capitalize("hello")).toBe("Hello");
      expect(StringUtils.capitalize("WORLD")).toBe("WORLD");
      expect(StringUtils.capitalize("")).toBe("");
      expect(StringUtils.capitalize(null as any)).toBe("");
    });
  });

  describe("capitalizeWords", () => {
    it("should capitalize each word", () => {
      expect(StringUtils.capitalizeWords("hello world")).toBe("Hello World");
      expect(StringUtils.capitalizeWords("the quick brown fox")).toBe(
        "The Quick Brown Fox"
      );
      expect(StringUtils.capitalizeWords("MULTIPLE   SPACES")).toBe(
        "Multiple Spaces"
      );
      expect(StringUtils.capitalizeWords("")).toBe("");
      expect(StringUtils.capitalizeWords(null as any)).toBe("");
    });
  });

  describe("contains", () => {
    it("should check if haystack contains needle (case-insensitive)", () => {
      expect(StringUtils.contains("Hello World", "world")).toBe(true);
      expect(StringUtils.contains("JavaScript", "script")).toBe(true);
      expect(StringUtils.contains("TypeScript", "python")).toBe(false);
      expect(StringUtils.contains("abc", "")).toBe(true);
      expect(StringUtils.contains("", "abc")).toBe(false);
      expect(StringUtils.contains(null, "abc")).toBe(false);
      expect(StringUtils.contains("abc", null)).toBe(false);
    });
  });

  describe("formatBytes", () => {
    it("should format bytes to human-readable string", () => {
      expect(StringUtils.formatBytes(0)).toBe("0 Bytes");
      expect(StringUtils.formatBytes(1024)).toBe("1 KB");
      expect(StringUtils.formatBytes(1536, 1)).toBe("1.5 KB");
      expect(StringUtils.formatBytes(1048576)).toBe("1 MB");
      expect(StringUtils.formatBytes(123456789, 2)).toBe("117.74 MB");
    });
  });

  describe("isString", () => {
    it("should check if value is a string", () => {
      expect(StringUtils.isString("hello")).toBe(true);
      expect(StringUtils.isString(123)).toBe(false);
      expect(StringUtils.isString(null)).toBe(false);
      expect(StringUtils.isString(undefined)).toBe(false);
    });
  });

  describe("length", () => {
    it("should return string length or 0", () => {
      expect(StringUtils.length("hello")).toBe(5);
      expect(StringUtils.length("")).toBe(0);
      expect(StringUtils.length(null as any)).toBe(0);
    });
  });

  describe("middleEllipsify", () => {
    it("should ellipsify long strings in the middle", () => {
      expect(StringUtils.middleEllipsify("verylongfilename.txt", 15)).toBe(
        "very...name.txt"
      );
      expect(StringUtils.middleEllipsify("short.txt", 20)).toBe("short.txt");
      expect(StringUtils.middleEllipsify("", 10)).toBe("");
    });
  });

  describe("pad", () => {
    it("should pad string on the left or right", () => {
      expect(StringUtils.pad("5", 3, "0")).toBe("005");
      expect(StringUtils.pad("hello", 8, "*", true)).toBe("hello***");
      expect(StringUtils.pad(42, 5, "0")).toBe("00042");
      expect(StringUtils.pad("", 3, "x")).toBe("");
      expect(StringUtils.pad(null as any, 3, "x")).toBe("null");
    });
  });

  describe("replaceAll", () => {
    it("should replace all occurrences", () => {
      expect(StringUtils.replaceAll("hello world hello", "hello", "hi")).toBe(
        "hi world hi"
      );
      expect(StringUtils.replaceAll("foo-bar-baz", "-", "_")).toBe(
        "foo_bar_baz"
      );
      expect(StringUtils.replaceAll("", "a", "b")).toBe("");
    });
  });

  describe("sort", () => {
    it("should sort strings asc/desc", () => {
      expect(StringUtils.sort("apple", "banana")).toBeLessThan(0);
      expect(StringUtils.sort("zebra", "apple", "desc")).toBeLessThan(0);
      expect(StringUtils.sort("apple", "apple")).toBe(0);
      expect(StringUtils.sort(null, "apple")).toBe(0);
    });
  });

  describe("sortAsc", () => {
    it("should sort ascending", () => {
      expect(StringUtils.sortAsc("banana", "apple")).toBeGreaterThan(0);
    });
  });

  describe("sortDesc", () => {
    it("should sort descending", () => {
      expect(StringUtils.sortDesc("apple", "banana")).toBeGreaterThan(0);
    });
  });

  describe("toLowerCase", () => {
    it("should convert to lowercase", () => {
      expect(StringUtils.toLowerCase("HELLO WORLD")).toBe("hello world");
      expect(StringUtils.toLowerCase("MixedCase")).toBe("mixedcase");
      expect(StringUtils.toLowerCase(123)).toBe("");
    });
  });

  describe("toNumbers", () => {
    it("should extract only numbers", () => {
      expect(StringUtils.toNumbers("abc123def456")).toBe("123456");
      expect(StringUtils.toNumbers("phone: (555) 123-4567")).toBe("5551234567");
      expect(StringUtils.toNumbers("no numbers here")).toBe("");
      expect(StringUtils.toNumbers(null as any)).toBe("");
    });
  });

  describe("toString", () => {
    it("should convert any value to string", () => {
      expect(StringUtils.toString(123)).toBe("123");
      expect(StringUtils.toString(true)).toBe("true");
      expect(StringUtils.toString(null)).toBe("null");
      expect(StringUtils.toString(undefined)).toBe("undefined");
    });
  });

  describe("truncateWithEllipsis", () => {
    it("should truncate with ellipsis if too long", () => {
      expect(
        StringUtils.truncateWithEllipsis("This is a very long string", 10)
      ).toBe("This is...");
      expect(StringUtils.truncateWithEllipsis("Short", 10)).toBe("Short");
      expect(StringUtils.truncateWithEllipsis("", 10)).toBe("");
    });
  });

  describe("uncapitalize", () => {
    it("should uncapitalize the first letter", () => {
      expect(StringUtils.uncapitalize("Hello World")).toBe("hello World");
      expect(StringUtils.uncapitalize("UPPERCASE")).toBe("uPPERCASE");
      expect(StringUtils.uncapitalize("")).toBe("");
      expect(StringUtils.uncapitalize(null as any)).toBe("");
    });
  });
});
