import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { FileUtils } from "../FileUtils";
import type { FileData } from "../FileUtils";

describe("FileUtils", () => {
  // Mock URL and Blob APIs
  const mockURL = {
    createObjectURL: vi.fn(),
    revokeObjectURL: vi.fn(),
  };

  const mockBlob = new Blob(["test"], { type: "text/plain" });

  beforeEach(() => {
    // Setup URL mock
    global.URL = mockURL as any;
    global.URL.createObjectURL = vi.fn(() => "blob:test");
    global.URL.revokeObjectURL = vi.fn();

    // Setup document mock
    document.body.innerHTML = "";
    const originalCreateElement = document.createElement;
    document.createElement = vi.fn((tag) => {
      const element = originalCreateElement.call(document, tag);
      element.click = vi.fn();
      return element;
    });

    // Setup FileReader mock
    const mockFileReader = {
      readAsDataURL: vi.fn((file: File) => {
        // Simulate async behavior
        setTimeout(() => {
          if (mockFileReader.onload) {
            const event = {
              target: { result: "data:image/png;base64,test" },
            } as ProgressEvent<FileReader>;
            mockFileReader.onload(event);
          }
        }, 0);
      }),
      onload: null as unknown as (
        this: FileReader,
        ev: ProgressEvent<FileReader>
      ) => any,
      onerror: null as unknown as (
        this: FileReader,
        ev: ProgressEvent<FileReader>
      ) => any,
      result: "data:image/png;base64,test",
      EMPTY: 0,
      LOADING: 1,
      DONE: 2,
      error: null,
      onabort: null,
      onloadend: null,
      onloadstart: null,
      onprogress: null,
      readyState: 0,
      abort: vi.fn(),
      readAsArrayBuffer: vi.fn(),
      readAsBinaryString: vi.fn(),
      readAsText: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as FileReader;

    // Mock FileReader constructor
    const MockFileReader = function () {
      return mockFileReader;
    } as unknown as typeof FileReader;
    Object.defineProperties(MockFileReader, {
      EMPTY: { value: 0, configurable: true },
      LOADING: { value: 1, configurable: true },
      DONE: { value: 2, configurable: true },
    });
    global.FileReader = MockFileReader;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("bytesToSize", () => {
    it("should convert bytes to human-readable size", () => {
      expect(FileUtils.bytesToSize(0)).toBe("0 Byte");
      expect(FileUtils.bytesToSize(1024)).toBe("1 KB");
      expect(FileUtils.bytesToSize(1024 * 1024)).toBe("1 MB");
      expect(FileUtils.bytesToSize(1024 * 1024 * 1024)).toBe("1 GB");
    });

    it("should handle large numbers", () => {
      expect(FileUtils.bytesToSize(1024 * 1024 * 1024 * 1024)).toBe("1 TB");
    });
  });

  describe("downloadBlob", () => {
    it("should download blob in modern browsers", () => {
      FileUtils.downloadBlob(mockBlob, "test.txt");

      expect(URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(document.createElement).toHaveBeenCalledWith("a");
      expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:test");
    });

    it("should use msSaveOrOpenBlob in IE", () => {
      const mockMsSaveOrOpenBlob = vi.fn();
      window.navigator.msSaveOrOpenBlob = mockMsSaveOrOpenBlob;

      FileUtils.downloadBlob(mockBlob, "test.txt");

      expect(mockMsSaveOrOpenBlob).toHaveBeenCalledWith(mockBlob, "test.txt");
    });
  });

  describe("extractBase64FromLocalUrl", () => {
    it("should extract base64 data from URL", () => {
      const url = "data:image/png;base64,test123";
      expect(FileUtils.extractBase64FromLocalUrl(url)).toBe("test123");
    });

    it("should return original URL if no base64 data", () => {
      const url = "https://example.com/image.png";
      expect(FileUtils.extractBase64FromLocalUrl(url)).toBe(url);
    });

    it("should handle empty or null URL", () => {
      expect(FileUtils.extractBase64FromLocalUrl("")).toBe("");
      expect(FileUtils.extractBase64FromLocalUrl(null as any)).toBe(null);
    });
  });

  describe("fileIsAlreadyAttached", () => {
    const files: FileData[] = [
      {
        name: "test1.jpg",
        type: "image/jpeg",
        data: { name: "test1.jpg", mediaId: undefined },
      },
      {
        name: "test2.jpg",
        type: "image/jpeg",
        data: { name: "test2.jpg", mediaId: "123" },
      },
    ];

    it("should find duplicate by name", () => {
      const file: FileData = {
        name: "test1.jpg",
        type: "image/jpeg",
        data: { name: "test1.jpg", mediaId: undefined },
      };
      expect(FileUtils.fileIsAlreadyAttached(file, files)).toBeDefined();
    });

    it("should find duplicate by mediaId", () => {
      const file: FileData = {
        name: "test3.jpg",
        type: "image/jpeg",
        data: { name: "test3.jpg", mediaId: "123" },
      };
      expect(FileUtils.fileIsAlreadyAttached(file, files)).toBeDefined();
    });

    it("should return undefined for non-duplicate", () => {
      const file: FileData = {
        name: "test3.jpg",
        type: "image/jpeg",
        data: { name: "test3.jpg", mediaId: undefined },
      };
      expect(FileUtils.fileIsAlreadyAttached(file, files)).toBeUndefined();
    });
  });

  describe("getBasicFileType", () => {
    it("should identify image files", () => {
      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      expect(FileUtils.getBasicFileType(file)).toBe("image");
    });

    it("should identify video files", () => {
      const file = new File(["test"], "test.mp4", { type: "video/mp4" });
      expect(FileUtils.getBasicFileType(file)).toBe("video");
    });

    it("should identify audio files", () => {
      const file = new File(["test"], "test.mp3", { type: "audio/mpeg" });
      expect(FileUtils.getBasicFileType(file)).toBe("audio");
    });

    it("should return document for unknown types", () => {
      const file = new File(["test"], "test.txt", { type: "text/plain" });
      expect(FileUtils.getBasicFileType(file)).toBe("document");
    });
  });

  describe("getImagePreview", () => {
    it("should return empty string for non-image files", async () => {
      const file = new File(["test"], "test.txt", { type: "text/plain" });
      const preview = await FileUtils.getImagePreview(file);
      expect(preview).toBe("");
    });

    it("should return base64 preview for image files", async () => {
      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

      // Create a synchronous mock for this test
      const syncMockFileReader = {
        readAsDataURL: vi.fn((file: File) => {
          const event = {
            target: { result: "data:image/png;base64,test" },
          } as ProgressEvent<FileReader>;
          syncMockFileReader.onload?.(event);
        }),
        onload: null as unknown as (
          this: FileReader,
          ev: ProgressEvent<FileReader>
        ) => any,
        onerror: null as unknown as (
          this: FileReader,
          ev: ProgressEvent<FileReader>
        ) => any,
        result: "data:image/png;base64,test",
        EMPTY: 0,
        LOADING: 1,
        DONE: 2,
        error: null,
        onabort: null,
        onloadend: null,
        onloadstart: null,
        onprogress: null,
        readyState: 0,
        abort: vi.fn(),
        readAsArrayBuffer: vi.fn(),
        readAsBinaryString: vi.fn(),
        readAsText: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      } as unknown as FileReader;

      // Mock img element
      const mockImg = {
        onload: null as (() => void) | null,
        onerror: null as (() => void) | null,
        src: "",
      };

      // Override document.createElement to return our mock img
      const originalCreateElement = document.createElement;
      document.createElement = vi.fn((tag) => {
        if (tag === "img") {
          return mockImg as unknown as HTMLImageElement;
        }
        return originalCreateElement.call(document, tag);
      });

      // Override the global FileReader for this test
      const originalFileReader = global.FileReader;
      global.FileReader = vi.fn(
        () => syncMockFileReader
      ) as unknown as typeof FileReader;

      try {
        const previewPromise = FileUtils.getImagePreview(file);
        // Trigger img onload immediately
        mockImg.onload?.();
        const preview = await previewPromise;
        expect(preview).toBe("data:image/png;base64,test");
      } finally {
        // Restore the original implementations
        global.FileReader = originalFileReader;
        document.createElement = originalCreateElement;
      }
    });

    it("should handle file read errors", async () => {
      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

      // Create a synchronous mock for this test
      const syncMockFileReader = {
        readAsDataURL: vi.fn((file: File) => {
          const event = new Event("error") as ProgressEvent<FileReader>;
          syncMockFileReader.onerror?.(event);
        }),
        onload: null as unknown as (
          this: FileReader,
          ev: ProgressEvent<FileReader>
        ) => any,
        onerror: null as unknown as (
          this: FileReader,
          ev: ProgressEvent<FileReader>
        ) => any,
        result: "data:image/png;base64,test",
        EMPTY: 0,
        LOADING: 1,
        DONE: 2,
        error: null,
        onabort: null,
        onloadend: null,
        onloadstart: null,
        onprogress: null,
        readyState: 0,
        abort: vi.fn(),
        readAsArrayBuffer: vi.fn(),
        readAsBinaryString: vi.fn(),
        readAsText: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      } as unknown as FileReader;

      // Override the global FileReader for this test
      const originalFileReader = global.FileReader;
      global.FileReader = vi.fn(
        () => syncMockFileReader
      ) as unknown as typeof FileReader;

      try {
        await expect(FileUtils.getImagePreview(file)).rejects.toThrow(
          "Failed to read file"
        );
      } finally {
        // Restore the original FileReader
        global.FileReader = originalFileReader;
      }
    });
  });

  describe("getLocalUrl", () => {
    it("should get local URL for file", async () => {
      const file = new File(["test"], "test.txt", { type: "text/plain" });
      const callback = vi.fn();

      FileUtils.getLocalUrl(file, callback);

      // Wait for the next tick to allow the async operation to complete
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(callback).toHaveBeenCalledWith("data:image/png;base64,test");
    });
  });

  describe("isFileExtension", () => {
    it("should validate correct file extensions", () => {
      expect(FileUtils.isFileExtension("jpg")).toBe(true);
      expect(FileUtils.isFileExtension("png")).toBe(true);
      expect(FileUtils.isFileExtension("pdf")).toBe(true);
    });

    it("should reject invalid file extensions", () => {
      expect(FileUtils.isFileExtension("jpg.")).toBe(false);
      expect(FileUtils.isFileExtension("jpg/png")).toBe(false);
      expect(FileUtils.isFileExtension("")).toBe(false);
    });
  });

  describe("sizeToBytes", () => {
    it("should convert size to bytes", () => {
      expect(FileUtils.sizeToBytes(1, "KB")).toBe(1024);
      expect(FileUtils.sizeToBytes(1, "MB")).toBe(1024 * 1024);
      expect(FileUtils.sizeToBytes(1, "GB")).toBe(1024 * 1024 * 1024);
      expect(FileUtils.sizeToBytes(1, "TB")).toBe(1024 * 1024 * 1024 * 1024);
    });

    it("should handle string inputs", () => {
      expect(FileUtils.sizeToBytes("1.5", "MB")).toBe(1.5 * 1024 * 1024);
    });

    it("should handle invalid inputs", () => {
      expect(FileUtils.sizeToBytes("invalid", "MB")).toBe(0);
      expect(FileUtils.sizeToBytes(null as any, "MB")).toBe(0);
      expect(FileUtils.sizeToBytes(undefined as any, "MB")).toBe(0);
    });

    it("should handle unknown units", () => {
      expect(FileUtils.sizeToBytes(100, "UNKNOWN")).toBe(100);
    });
  });
});
