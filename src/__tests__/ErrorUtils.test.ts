import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  ErrorUtils,
  AuthenticationError,
  AuthorizationError,
  NetworkError,
  NotFoundError,
  TimeoutError,
  ValidationError,
} from "../ErrorUtils";

describe("ErrorUtils", () => {
  // Mock DataDog
  const mockDDLogs = {
    logger: {
      error: vi.fn(),
    },
  };

  beforeEach(() => {
    // Setup DataDog mock
    if (typeof window !== "undefined") {
      window.DD_LOGS = mockDDLogs;
    }
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Custom Error Classes", () => {
    it("should create AuthenticationError with correct name and message", () => {
      const error = new AuthenticationError("Invalid credentials");
      expect(error.name).toBe("AuthenticationError");
      expect(error.message).toBe("Invalid credentials");
    });

    it("should create AuthorizationError with correct name and message", () => {
      const error = new AuthorizationError("Access denied");
      expect(error.name).toBe("AuthorizationError");
      expect(error.message).toBe("Access denied");
    });

    it("should create NetworkError with correct name and message", () => {
      const error = new NetworkError("Connection failed");
      expect(error.name).toBe("NetworkError");
      expect(error.message).toBe("Connection failed");
    });

    it("should create NotFoundError with correct name and message", () => {
      const error = new NotFoundError("Resource not found");
      expect(error.name).toBe("NotFoundError");
      expect(error.message).toBe("Resource not found");
    });

    it("should create TimeoutError with correct name and message", () => {
      const error = new TimeoutError("Request timed out");
      expect(error.name).toBe("TimeoutError");
      expect(error.message).toBe("Request timed out");
    });

    it("should create ValidationError with correct name and message", () => {
      const error = new ValidationError("Invalid input");
      expect(error.name).toBe("ValidationError");
      expect(error.message).toBe("Invalid input");
    });
  });

  describe("Error Capture", () => {
    it("should capture and report error to DataDog", () => {
      const error = new Error("Test error");
      ErrorUtils.captureError(error, {
        tags: { component: "Test" },
        context: { test: true },
      });

      expect(mockDDLogs.logger.error).toHaveBeenCalledWith(
        "Test error",
        expect.objectContaining({
          error,
          test: true,
          tags: expect.objectContaining({
            error_name: "Error",
            component: "Test",
          }),
        })
      );
    });

    it("should handle non-Error objects", () => {
      ErrorUtils.captureError("String error");
      expect(mockDDLogs.logger.error).toHaveBeenCalled();
    });

    it("should not log to console when log option is false", () => {
      ErrorUtils.captureError(new Error("Test error"), { log: false });
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe("Error Type Checking", () => {
    it("should correctly identify error types", () => {
      const authError = new AuthenticationError("Test");
      const networkError = new NetworkError("Test");

      expect(ErrorUtils.isErrorType(authError, AuthenticationError)).toBe(true);
      expect(ErrorUtils.isErrorType(networkError, AuthenticationError)).toBe(
        false
      );
    });

    it("should handle non-Error objects", () => {
      expect(ErrorUtils.isErrorType("string", Error)).toBe(false);
      expect(ErrorUtils.isErrorType(null, Error)).toBe(false);
      expect(ErrorUtils.isErrorType(undefined, Error)).toBe(false);
    });
  });

  describe("Validation Functions", () => {
    describe("validateEmail", () => {
      it("should validate correct email addresses", () => {
        expect(() =>
          ErrorUtils.validateEmail("test@example.com")
        ).not.toThrow();
      });

      it("should throw ValidationError for invalid email addresses", () => {
        expect(() => ErrorUtils.validateEmail("invalid-email")).toThrow(
          ValidationError
        );
        expect(() => ErrorUtils.validateEmail("test@")).toThrow(
          ValidationError
        );
        expect(() => ErrorUtils.validateEmail("@example.com")).toThrow(
          ValidationError
        );
      });
    });

    describe("validatePassword", () => {
      it("should validate passwords meeting all requirements", () => {
        expect(() =>
          ErrorUtils.validatePassword("Test123!@#", {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumber: true,
            requireSpecialChar: true,
          })
        ).not.toThrow();
      });

      it("should throw ValidationError for passwords not meeting requirements", () => {
        expect(() =>
          ErrorUtils.validatePassword("weak", {
            minLength: 8,
          })
        ).toThrow(ValidationError);
      });
    });

    describe("validateUrl", () => {
      it("should validate correct URLs", () => {
        expect(() =>
          ErrorUtils.validateUrl("https://example.com")
        ).not.toThrow();
        expect(() =>
          ErrorUtils.validateUrl("http://localhost:3000")
        ).not.toThrow();
      });

      it("should throw ValidationError for invalid URLs", () => {
        expect(() => ErrorUtils.validateUrl("not-a-url")).toThrow(
          ValidationError
        );
        expect(() => ErrorUtils.validateUrl("http://")).toThrow(
          ValidationError
        );
      });
    });
  });

  describe("Error Handling Wrappers", () => {
    describe("withErrorHandling", () => {
      it("should execute function and return result", () => {
        const fn = vi.fn().mockReturnValue("success");
        const errorHandler = vi.fn();
        const wrapped = ErrorUtils.withErrorHandling(fn, errorHandler);

        expect(wrapped()).toBe("success");
        expect(errorHandler).not.toHaveBeenCalled();
      });

      it("should call error handler when function throws", () => {
        const error = new Error("Test error");
        const fn = vi.fn().mockImplementation(() => {
          throw error;
        });
        const errorHandler = vi.fn();
        const wrapped = ErrorUtils.withErrorHandling(fn, errorHandler);

        expect(() => wrapped()).toThrow(error);
        expect(errorHandler).toHaveBeenCalledWith(error);
      });
    });

    describe("withAsyncErrorHandling", () => {
      it("should execute async function and return result", async () => {
        const fn = vi.fn().mockResolvedValue("success");
        const errorHandler = vi.fn();
        const wrapped = ErrorUtils.withAsyncErrorHandling(fn, errorHandler);

        await expect(wrapped()).resolves.toBe("success");
        expect(errorHandler).not.toHaveBeenCalled();
      });

      it("should call error handler when async function throws", async () => {
        const error = new Error("Test error");
        const fn = vi.fn().mockRejectedValue(error);
        const errorHandler = vi.fn();
        const wrapped = ErrorUtils.withAsyncErrorHandling(fn, errorHandler);

        await expect(wrapped()).rejects.toThrow(error);
        expect(errorHandler).toHaveBeenCalledWith(error);
      });
    });
  });
});
