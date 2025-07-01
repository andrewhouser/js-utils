import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ImageUtils } from "../ImageUtils";

describe("ImageUtils", () => {
  // Mock canvas and context
  const mockContext = {
    drawImage: vi.fn(),
    getImageData: vi.fn(),
    putImageData: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
  };

  const mockCanvas = {
    getContext: vi.fn(() => mockContext),
    toBlob: vi.fn((callback) => callback(new Blob())),
    toDataURL: vi.fn(() => "data:image/jpeg;base64,mock"),
    width: 100,
    height: 100,
  };

  // Mock Image
  let mockImage: {
    width: number;
    height: number;
    onload: (() => void) | null;
    onerror: ((error: Error) => void) | null;
    src: string;
    decode: () => Promise<void>;
  };

  // Mock FileReader
  const mockFileReader = {
    readAsDataURL: vi.fn((blob) => {
      // Immediately trigger onload
      if (mockFileReader.onload) {
        mockFileReader.onload();
      }
    }),
    onload: null as (() => void) | null,
    onerror: null as ((error: Error) => void) | null,
    result: "data:image/jpeg;base64,mock",
  };

  beforeEach(() => {
    // Create a new mock image for each test
    mockImage = {
      width: 100,
      height: 100,
      onload: null,
      onerror: null,
      src: "",
      decode: vi.fn().mockResolvedValue(undefined),
    };

    // Setup DOM mocks
    global.Image = vi.fn(() => mockImage) as any;
    global.FileReader = vi.fn(() => mockFileReader) as any;
    global.URL.createObjectURL = vi.fn(() => "mock-url");
    global.URL.revokeObjectURL = vi.fn();
    global.document.createElement = vi.fn(() => mockCanvas) as any;
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(new Blob()),
      })
    ) as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Helper function to create a promise that resolves when the image loads
  const createImageLoadPromise = () => {
    return new Promise<void>((resolve) => {
      mockImage.onload = () => resolve();
    });
  };

  // Helper function to create a promise that resolves when the image errors
  const createImageErrorPromise = (error: Error) => {
    return new Promise<void>((resolve) => {
      mockImage.onerror = () => resolve();
    });
  };

  describe("base64ToBlob", () => {
    it("should convert base64 to blob", async () => {
      const base64 = "mock-base64";
      const type = "image/jpeg";
      const blob = await ImageUtils.base64ToBlob(base64, type);
      expect(blob).toBeInstanceOf(Blob);
    });
  });

  describe("blobToBase64", () => {
    it("should convert blob to base64", async () => {
      const blob = new Blob(["mock-data"], { type: "image/jpeg" });
      const base64 = await ImageUtils.blobToBase64(blob);
      expect(base64).toBe("mock");
    });

    it("should handle FileReader error", async () => {
      const blob = new Blob(["mock-data"], { type: "image/jpeg" });
      const error = new Error("Read error");

      // Override the mock to trigger error
      mockFileReader.readAsDataURL = vi.fn((blob: Blob) => {
        if (mockFileReader.onerror) {
          mockFileReader.onerror(error as any);
        }
      });

      await expect(ImageUtils.blobToBase64(blob)).rejects.toThrow("Read error");
    });
  });

  describe("compressImage", () => {
    it("should compress image with specified quality", async () => {
      const file = new File(["mock-data"], "test.jpg", { type: "image/jpeg" });
      const quality = 0.7;

      const promise = ImageUtils.compressImage(file, quality);
      mockImage.onload?.();
      const blob = await promise;
      expect(blob).toBeInstanceOf(Blob);
    });
  });

  describe("convertBase64ToFile", () => {
    it("should convert valid base64 to file", async () => {
      const base64 = "data:image/jpeg;base64,mock";
      const filename = "test.jpg";

      const file = await ImageUtils.convertBase64ToFile(base64, filename);
      expect(file).not.toBeNull();
      expect(file).toBeInstanceOf(File);
      expect(file!.name).toBe(filename);
    });

    it("should return null for invalid base64", () => {
      const base64 = "invalid-base64";
      const filename = "test.jpg";

      const result = ImageUtils.convertBase64ToFile(base64, filename);
      expect(result).toBeNull();
    });
  });

  describe("getImageMetadata", () => {
    it("should return image metadata", async () => {
      const file = new File(["mock-data"], "test.jpg", { type: "image/jpeg" });

      const promise = ImageUtils.getImageMetadata(file);
      mockImage.onload?.();
      const metadata = await promise;

      expect(metadata).toEqual({
        width: 100,
        height: 100,
        type: "image/jpeg",
        size: 9, // 'mock-data'.length
      });
    });
  });

  describe("isImageFile", () => {
    it("should return true for image files", () => {
      const file = new File(["mock-data"], "test.jpg", { type: "image/jpeg" });
      expect(ImageUtils.isImageFile(file)).toBe(true);
    });

    it("should return false for non-image files", () => {
      const file = new File(["mock-data"], "test.txt", { type: "text/plain" });
      expect(ImageUtils.isImageFile(file)).toBe(false);
    });
  });

  describe("loadImage", () => {
    it("should load image from URL", async () => {
      const url = "https://example.com/image.jpg";

      const promise = ImageUtils.loadImage(url);
      mockImage.onload?.();
      const img = await promise;

      expect(img).toBe(mockImage);
    });

    it("should handle image load error", async () => {
      const url = "https://example.com/image.jpg";
      const error = new Error("Load error");

      const promise = ImageUtils.loadImage(url);
      mockImage.onerror?.(error);

      await expect(promise).rejects.toThrow("Load error");
    });
  });

  describe("resizeImage", () => {
    it("should resize image with specified options", async () => {
      const file = new File(["mock-data"], "test.jpg", { type: "image/jpeg" });
      const options = {
        maxWidth: 800,
        maxHeight: 600,
        quality: 0.8,
        format: "jpeg" as const,
      };

      const promise = ImageUtils.resizeImage(file, options);
      mockImage.onload?.();
      const blob = await promise;

      expect(blob).toBeInstanceOf(Blob);
    });
  });

  describe("validateImageDimensions", () => {
    it("should validate image dimensions", () => {
      expect(ImageUtils.validateImageDimensions(100, 100, 200, 200)).toBe(true);
      expect(ImageUtils.validateImageDimensions(300, 100, 200, 200)).toBe(
        false
      );
      expect(ImageUtils.validateImageDimensions(100, 300, 200, 200)).toBe(
        false
      );
    });
  });
});
