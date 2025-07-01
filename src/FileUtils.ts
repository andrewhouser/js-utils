/**
 * @module FileUtils
 * @description A collection of utility functions for file operations, validation, and manipulation.
 * @example
 * ```typescript
 * import { FileUtils } from 'houser-js-utils';
 *
 * // Get file extension
 * const ext = FileUtils.getFileExtension('document.pdf'); // 'pdf'
 *
 * // Validate file type
 * const isImage = FileUtils.isImageFile(file);
 *
 * // Format file size
 * const size = FileUtils.formatFileSize(file.size);
 * ```
 */

// Type declarations for IE-specific navigator methods
declare global {
  interface Navigator {
    msSaveOrOpenBlob?: (blob: Blob, filename: string) => void;
  }
}

/**
 * Basic file types supported by the utility functions.
 */
type FileType = "image" | "video" | "audio" | "document";

/**
 * Interface representing file data with optional media ID and metadata.
 */
export interface FileData {
  /** Optional media identifier */
  mediaId?: string;
  /** File name */
  name: string;
  /** File MIME type */
  type: string;
  /** Optional file metadata */
  data?: {
    /** Optional media identifier */
    mediaId?: string;
    /** File name */
    name: string;
  };
}

/**
 * Mappings of basic file types to their MIME type patterns.
 */
const fileTypeMappings: Record<string, string> = {
  image: "image.*",
  video: "video.*",
  audio: "audio.*",
};

/**
 * Utility object containing file handling functions.
 */
export const FileUtils = {
  /**
   * Converts bytes to a human-readable size string.
   *
   * @param bytes - Number of bytes to convert
   * @returns Formatted size string (e.g., "1.5 MB")
   *
   * @example
   * ```typescript
   * const size = FileUtils.bytesToSize(1500000); // "1.5 MB"
   * ```
   */
  bytesToSize(bytes: number): string {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / 1024 ** i)} ${sizes[i]}`;
  },

  /**
   * Downloads a blob as a file.
   * Supports both modern browsers and IE.
   *
   * @param blob - Blob to download
   * @param filename - Name of the file to save as
   *
   * @example
   * ```typescript
   * const blob = new Blob(['Hello World'], { type: 'text/plain' });
   * FileUtils.downloadBlob(blob, 'hello.txt');
   * ```
   */
  downloadBlob(blob: Blob, filename: string): void {
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      const objectUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.style.display = "none";
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(objectUrl);
      document.body.removeChild(a);
    }
  },

  /**
   * Extracts base64 data from a local URL.
   *
   * @param url - URL containing base64 data
   * @returns Base64 string or original URL if no base64 data found
   *
   * @example
   * ```typescript
   * const base64 = FileUtils.extractBase64FromLocalUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...');
   * ```
   */
  extractBase64FromLocalUrl(url: string): string {
    if (!url?.length) return url;

    const urlDataIdx = url.indexOf("base64,");
    if (urlDataIdx === -1) return url;

    return url.substring(urlDataIdx + 7);
  },

  /**
   * Checks if a file is already attached to a list of files.
   *
   * @param file - File to check
   * @param files - List of files to check against
   * @returns The matching file if found, undefined otherwise
   *
   * @example
   * ```typescript
   * const isDuplicate = FileUtils.fileIsAlreadyAttached(newFile, existingFiles);
   * ```
   */
  fileIsAlreadyAttached(
    file: FileData,
    files: FileData[]
  ): FileData | undefined {
    return files.find((f) => {
      const { mediaId, name } = f.data || {};
      const { mediaId: fileMediaId, name: fileName } = file.data || {};
      return fileMediaId ? mediaId === fileMediaId : name === fileName;
    });
  },

  /**
   * Gets the basic file type (image, video, audio, or document).
   *
   * @param file - File to check
   * @returns Basic file type
   *
   * @example
   * ```typescript
   * const type = FileUtils.getBasicFileType(imageFile); // "image"
   * ```
   */
  getBasicFileType(file: File): FileType {
    for (const type of Object.keys(fileTypeMappings)) {
      if (file.type.match(fileTypeMappings[type])) {
        return type as FileType;
      }
    }

    return "document";
  },

  /**
   * Gets a base64 preview of an image file.
   *
   * @param file - Image file to preview
   * @returns Promise resolving to base64 string of the image
   * @throws Error if file is not an image or fails to load
   *
   * @example
   * ```typescript
   * const preview = await FileUtils.getImagePreview(imageFile);
   * ```
   */
  async getImagePreview(file: File): Promise<string> {
    if (!file?.type.startsWith("image/")) {
      return "";
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = document.createElement("img");
        img.onload = () => resolve(e.target?.result as string);
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  },

  /**
   * Gets a local URL for a file.
   *
   * @param file - File to get URL for
   * @param callback - Callback function to receive the URL
   *
   * @example
   * ```typescript
   * FileUtils.getLocalUrl(file, (url) => {
   *   console.log('File URL:', url);
   * });
   * ```
   */
  getLocalUrl(file: File, callback: (url: string) => void): void {
    const reader = new FileReader();
    reader.onload = (e) => callback(e.target?.result as string);
    reader.onerror = (error) => console.error(error);
    reader.readAsDataURL(file);
  },

  /**
   * Checks if a value is a valid file extension.
   *
   * @param extension - File extension to validate
   * @returns True if valid, false otherwise
   *
   * @example
   * ```typescript
   * const isValid = FileUtils.isFileExtension('jpg'); // true
   * ```
   */
  isFileExtension(extension: string): boolean {
    const extensionRegex = /^[a-zA-Z0-9]+$/;
    return extensionRegex.test(extension);
  },

  /**
   * Converts a size with units to bytes.
   *
   * @param size - Size to convert
   * @param units - Units of the size (B, KB, MB, GB, TB)
   * @returns Size in bytes
   *
   * @example
   * ```typescript
   * const bytes = FileUtils.sizeToBytes(1.5, 'MB'); // 1572864
   * ```
   */
  sizeToBytes(size: string | number, units: string): number {
    if (!size) return 0;

    const sizeNum = parseFloat(String(size));
    if (Number.isNaN(sizeNum)) return 0;

    switch (units.toUpperCase()) {
      case "KB":
        return sizeNum * 1024;
      case "MB":
        return sizeNum * 1024 * 1024;
      case "GB":
        return sizeNum * 1024 * 1024 * 1024;
      case "TB":
        return sizeNum * 1024 * 1024 * 1024 * 1024;
      default:
        return sizeNum;
    }
  },
};
