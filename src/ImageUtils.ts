/**
 * @module ImageUtils
 * @description A comprehensive collection of utility functions for image manipulation, processing, and analysis.
 * Supports image format conversion, resizing, cropping, compression, metadata extraction, and various image effects.
 * @example
 * ```typescript
 * import { ImageUtils } from 'js-utils';
 *
 * // Convert base64 to file
 * const file = await ImageUtils.convertBase64ToFile(base64String, 'image.jpg');
 *
 * // Resize image with quality settings
 * const resized = await ImageUtils.resizeImage(file, { maxWidth: 800, quality: 0.8 });
 *
 * // Get image metadata
 * const metadata = await ImageUtils.getImageMetadata(file);
 * ```
 */

/**
 * Regular expression for validating base64 image data URLs
 * Matches data URLs for PNG, JPG, JPEG, GIF, SVG, and WebP images
 */
const base64RegEx = /^data:image\/(png|jpg|jpeg|gif|svg|webp);base64,/;

/**
 * Supported image formats for conversion and processing
 */
type ImageFormat = "jpeg" | "png" | "webp" | "gif";

/**
 * Options for image resizing operations
 */
interface ImageResizeOptions {
  /** Maximum width of the resized image */
  maxWidth?: number;
  /** Maximum height of the resized image */
  maxHeight?: number;
  /** Quality of the output image (0-1) */
  quality?: number;
  /** Output format of the resized image */
  format?: ImageFormat;
}

/**
 * Metadata about an image file
 */
interface ImageMetadata {
  /** Width of the image in pixels */
  width: number;
  /** Height of the image in pixels */
  height: number;
  /** MIME type of the image */
  type: string;
  /** Size of the image file in bytes */
  size: number;
}

/**
 * Dimensions for a scaled image
 */
interface ScaledDimensions {
  /** Scaled width in pixels */
  width: number;
  /** Scaled height in pixels */
  height: number;
}

export const ImageUtils = {
  /**
   * Applies a grayscale filter to an image by converting all pixels to their average RGB value.
   * @param file - The image file to convert to grayscale
   * @returns Promise resolving to the grayscale image as a Blob
   * @example
   * ```typescript
   * const grayscaleImage = await ImageUtils.applyGrayscale(imageFile);
   * // Use the grayscale blob as needed
   * ```
   */
  async applyGrayscale(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg; // red
          data[i + 1] = avg; // green
          data[i + 2] = avg; // blue
        }

        ctx.putImageData(imageData, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to create blob"));
        }, file.type);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  },

  /**
   * Calculates the aspect ratio of an image from its dimensions.
   * @param width - The width of the image in pixels
   * @param height - The height of the image in pixels
   * @returns The aspect ratio as a decimal number (width/height)
   * @example
   * ```typescript
   * const ratio = ImageUtils.calculateAspectRatio(1920, 1080); // Returns 1.777...
   * const isWidescreen = ratio > 1.5; // true for 16:9 ratio
   * ```
   */
  calculateAspectRatio(width: number, height: number): number {
    return width / height;
  },

  /**
   * Converts a base64 string to a Blob object.
   * @param base64 - The base64 string to convert (without data URL prefix)
   * @param type - The MIME type of the image (default: "image/jpeg")
   * @returns Promise resolving to a Blob object
   * @example
   * ```typescript
   * const blob = await ImageUtils.base64ToBlob(base64String, 'image/png');
   * const url = URL.createObjectURL(blob);
   * ```
   */
  async base64ToBlob(
    base64: string,
    type: string = "image/jpeg"
  ): Promise<Blob> {
    const response = await fetch(`data:${type};base64,${base64}`);
    return response.blob();
  },

  /**
   * Converts a Blob to a base64 string (without data URL prefix).
   * @param blob - The Blob to convert
   * @returns Promise resolving to base64 string
   * @example
   * ```typescript
   * const base64 = await ImageUtils.blobToBase64(imageBlob);
   * console.log('data:image/jpeg;base64,' + base64); // Full data URL
   * ```
   */
  async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  },

  /**
   * Compresses an image file by reducing its quality while maintaining dimensions.
   * @param file - The image file to compress
   * @param quality - Compression quality from 0 (lowest) to 1 (highest, default: 0.7)
   * @returns Promise resolving to the compressed image as a Blob
   * @example
   * ```typescript
   * const compressed = await ImageUtils.compressImage(largeImage, 0.5);
   * console.log(`Original: ${largeImage.size} bytes, Compressed: ${compressed.size} bytes`);
   * ```
   */
  async compressImage(file: File, quality: number = 0.7): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Failed to create blob"));
          },
          file.type,
          quality
        );
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  },

  /**
   * Converts a base64 data URL string to a File object.
   * @param base64 - The base64 data URL string (must include data:image/... prefix)
   * @param filename - The name for the resulting file
   * @returns Promise resolving to File object, or null if base64 is invalid
   * @example
   * ```typescript
   * const file = await ImageUtils.convertBase64ToFile(
   *   'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
   *   'pixel.png'
   * );
   * ```
   */
  convertBase64ToFile(base64: string, filename: string): Promise<File> | null {
    if (!base64RegEx.test(base64)) return null;
    return this.base64ToBlob(base64).then((blob) => new File([blob], filename));
  },

  /**
   * Creates a thumbnail image with specified maximum dimensions.
   * @param file - The image file to create a thumbnail from
   * @param maxSize - Maximum size in pixels for the longest dimension (default: 200)
   * @returns Promise resolving to thumbnail as base64 data URL string
   * @example
   * ```typescript
   * const thumbnail = await ImageUtils.createThumbnail(imageFile, 150);
   * document.getElementById('preview').src = thumbnail;
   * ```
   */
  async createThumbnail(file: File, maxSize: number = 200): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  },

  /**
   * Crops an image to specified rectangular dimensions.
   * @param file - The image file to crop
   * @param x - Starting x coordinate for the crop (pixels from left)
   * @param y - Starting y coordinate for the crop (pixels from top)
   * @param width - Width of the crop area in pixels
   * @param height - Height of the crop area in pixels
   * @returns Promise resolving to the cropped image as a Blob
   * @example
   * ```typescript
   * // Crop a 200x200 square from the center of the image
   * const cropped = await ImageUtils.cropImage(imageFile, 100, 100, 200, 200);
   * ```
   */
  async cropImage(
    file: File,
    x: number,
    y: number,
    width: number,
    height: number
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to create blob"));
        }, file.type);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  },

  /**
   * Extracts metadata information from an image file.
   * @param file - The image file to analyze
   * @returns Promise resolving to object containing width, height, type, and size
   * @example
   * ```typescript
   * const metadata = await ImageUtils.getImageMetadata(imageFile);
   * console.log(`Image: ${metadata.width}x${metadata.height}, ${metadata.type}, ${metadata.size} bytes`);
   * ```
   */
  async getImageMetadata(file: File): Promise<ImageMetadata> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          type: file.type,
          size: file.size,
        });
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  },

  /**
   * Analyzes an image to determine its most dominant color.
   * @param file - The image file to analyze
   * @returns Promise resolving to the dominant color as a hex string
   * @example
   * ```typescript
   * const dominantColor = await ImageUtils.getDominantColor(imageFile);
   * console.log(`Dominant color: ${dominantColor}`); // e.g., "#ff5733"
   * document.body.style.backgroundColor = dominantColor;
   * ```
   */
  async getDominantColor(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Scale down image for faster processing
        const scale = Math.min(1, 100 / Math.max(img.width, img.height));
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const colorCounts: { [key: string]: number } = {};

        // Sample pixels and count colors
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const color = `#${r.toString(16).padStart(2, "0")}${g
            .toString(16)
            .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
          colorCounts[color] = (colorCounts[color] || 0) + 1;
        }

        // Find most frequent color
        let maxCount = 0;
        let dominantColor = "#000000";
        for (const color in colorCounts) {
          if (colorCounts[color] > maxCount) {
            maxCount = colorCounts[color];
            dominantColor = color;
          }
        }

        resolve(dominantColor);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  },

  /**
   * Calculates scaled dimensions for an image while maintaining aspect ratio.
   * @param img - The HTML image element to scale
   * @param maxWidth - Optional maximum width constraint
   * @param maxHeight - Optional maximum height constraint
   * @returns Object containing the calculated scaled width and height
   * @example
   * ```typescript
   * const scaled = ImageUtils.getScaledDimensions(imageElement, 800, 600);
   * console.log(`Scaled dimensions: ${scaled.width}x${scaled.height}`);
   * ```
   */
  getScaledDimensions(
    img: HTMLImageElement,
    maxWidth?: number,
    maxHeight?: number
  ): ScaledDimensions {
    const originalWidth = img.width;
    const originalHeight = img.height;
    let newWidth = originalWidth;
    let newHeight = originalHeight;

    if (maxWidth && maxHeight) {
      const aspectRatio = originalWidth / originalHeight;
      if (originalWidth > maxWidth || originalHeight > maxHeight) {
        if (aspectRatio > 1) {
          newWidth = maxWidth;
          newHeight = maxWidth / aspectRatio;
        } else {
          newHeight = maxHeight;
          newWidth = maxHeight * aspectRatio;
        }
      }
    } else if (maxWidth) {
      const aspectRatio = originalWidth / originalHeight;
      if (originalWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = maxWidth / aspectRatio;
      }
    } else if (maxHeight) {
      const aspectRatio = originalWidth / originalHeight;
      if (originalHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = maxHeight * aspectRatio;
      }
    }

    return {
      width: Math.round(newWidth),
      height: Math.round(newHeight),
    };
  },

  /**
   * Checks if an image exists and is accessible at the given URL.
   * @param url - The URL to check for image availability
   * @returns Promise resolving to true if the image exists and is accessible
   * @example
   * ```typescript
   * const exists = await ImageUtils.imageExists('https://example.com/image.jpg');
   * if (exists) {
   *   console.log('Image is available');
   * }
   * ```
   */
  async imageExists(url: string): Promise<boolean> {
    try {
      const response = await fetch(url);
      return response.ok;
    } catch (e) {
      return false;
    }
  },

  /**
   * Validates whether a file is an image based on its MIME type.
   * @param file - The file to check
   * @returns True if the file is an image, false otherwise
   * @example
   * ```typescript
   * const isImage = ImageUtils.isImageFile(selectedFile);
   * if (!isImage) {
   *   alert('Please select an image file');
   * }
   * ```
   */
  isImageFile(file: File): boolean {
    return file.type.startsWith("image/");
  },

  /**
   * Loads an image from a URL and returns the HTMLImageElement.
   * @param url - The URL of the image to load
   * @returns Promise resolving to HTMLImageElement when image loads successfully
   * @throws {Error} If the image fails to load
   * @example
   * ```typescript
   * try {
   *   const img = await ImageUtils.loadImage('https://example.com/image.jpg');
   *   console.log(`Loaded image: ${img.width}x${img.height}`);
   * } catch (error) {
   *   console.error('Failed to load image:', error);
   * }
   * ```
   */
  loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  },

  /**
   * Loads and decodes an image from a URL with error handling.
   * @param url - The URL of the image to load
   * @returns Promise resolving to HTMLImageElement or null if loading fails
   * @example
   * ```typescript
   * const img = await ImageUtils.loadImageElement('https://example.com/image.jpg');
   * if (img) {
   *   document.body.appendChild(img);
   * } else {
   *   console.log('Failed to load image');
   * }
   * ```
   */
  async loadImageElement(url: string): Promise<HTMLImageElement | null> {
    const img = new Image();
    img.src = url;

    try {
      await img.decode();
    } catch (e) {
      console.error(e);
      return null;
    }

    return img;
  },

  /**
   * Resizes an image file to fit within specified dimensions while maintaining aspect ratio.
   * @param file - The image file to resize
   * @param options - Resize options including max dimensions, quality, and output format
   * @returns Promise resolving to the resized image as a Blob
   * @example
   * ```typescript
   * const resized = await ImageUtils.resizeImage(originalFile, {
   *   maxWidth: 800,
   *   maxHeight: 600,
   *   quality: 0.9,
   *   format: 'jpeg'
   * });
   * ```
   */
  async resizeImage(
    file: File,
    options: ImageResizeOptions = {}
  ): Promise<Blob> {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = "jpeg",
    } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob"));
            }
          },
          `image/${format}`,
          quality
        );
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  },

  /**
   * Rotates an image by the specified number of degrees around its center.
   * @param file - The image file to rotate
   * @param degrees - Degrees to rotate (0-360, positive for clockwise)
   * @returns Promise resolving to the rotated image as a Blob
   * @example
   * ```typescript
   * const rotated90 = await ImageUtils.rotateImage(imageFile, 90);
   * const rotatedMinus45 = await ImageUtils.rotateImage(imageFile, -45);
   * ```
   */
  async rotateImage(file: File, degrees: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Calculate new canvas dimensions
        const rad = (degrees * Math.PI) / 180;
        const sin = Math.abs(Math.sin(rad));
        const cos = Math.abs(Math.cos(rad));
        const newWidth = img.width * cos + img.height * sin;
        const newHeight = img.width * sin + img.height * cos;

        canvas.width = newWidth;
        canvas.height = newHeight;

        // Rotate and draw
        ctx.translate(newWidth / 2, newHeight / 2);
        ctx.rotate(rad);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to create blob"));
        }, file.type);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  },

  /**
   * Converts a URL to a File object by downloading the content.
   * @param url - The URL to convert to a file
   * @param filename - The name for the resulting file
   * @param mimeType - The MIME type for the file
   * @returns Promise resolving to a File object
   * @example
   * ```typescript
   * const file = await ImageUtils.urlToFile(
   *   'https://example.com/image.jpg',
   *   'downloaded-image.jpg',
   *   'image/jpeg'
   * );
   * ```
   */
  async urlToFile(
    url: string,
    filename: string,
    mimeType: string
  ): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  },

  /**
   * Validates that image dimensions are within specified limits.
   * @param width - The width to validate
   * @param height - The height to validate
   * @param maxWidth - The maximum allowed width
   * @param maxHeight - The maximum allowed height
   * @returns True if dimensions are within limits, false otherwise
   * @example
   * ```typescript
   * const isValid = ImageUtils.validateImageDimensions(1920, 1080, 2000, 2000);
   * if (!isValid) {
   *   console.log('Image is too large');
   * }
   * ```
   */
  validateImageDimensions(
    width: number,
    height: number,
    maxWidth: number,
    maxHeight: number
  ): boolean {
    return width <= maxWidth && height <= maxHeight;
  },
};
