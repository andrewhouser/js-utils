/**
 * @module MediaUtils
 * @description Utility functions for handling audio, video, and image operations in the browser. Provides methods for checking media type support, accessing user media devices, recording and manipulating media streams, converting between formats, and extracting metadata from media files. Includes helpers for screenshots, resizing, compression, and file downloads.
 * @example
 * ```typescript
 * import { MediaUtils } from 'houser-js-utils';
 *
 * // Check if a media type is supported
 * const isSupported = MediaUtils.isMediaTypeSupported('video/mp4');
 *
 * // Get all available cameras
 * const cameras = await MediaUtils.getCameras();
 *
 * // Request camera access
 * const stream = await MediaUtils.requestCameraAccess();
 *
 * // Take a screenshot from a video element
 * const screenshot = await MediaUtils.takeScreenshot(videoElement);
 *
 * // Resize an image file
 * const resized = await MediaUtils.resizeImage(imageFile, 800, 600);
 * ```
 */
export const MediaUtils = {
  /**
   * Checks if the browser supports a specific media type.
   * @param type - Media type to check (e.g., 'video/mp4')
   * @returns True if the media type is supported
   * @example
   * ```typescript
   * MediaUtils.isMediaTypeSupported('video/mp4'); // true or false
   * MediaUtils.isMediaTypeSupported('audio/ogg'); // true or false
   * ```
   */
  isMediaTypeSupported(type: string): boolean {
    return MediaRecorder.isTypeSupported(type);
  },

  /**
   * Gets the supported media types for the current browser.
   * @returns Array of supported media types
   * @example
   * ```typescript
   * const supported = MediaUtils.getSupportedMediaTypes();
   * console.log(supported);
   * ```
   */
  getSupportedMediaTypes(): string[] {
    const types = [
      "video/webm",
      "video/mp4",
      "video/ogg",
      "audio/webm",
      "audio/mp4",
      "audio/ogg",
    ];
    return types.filter((type) => MediaRecorder.isTypeSupported(type));
  },

  /**
   * Gets the user's media devices (cameras, microphones, speakers).
   * @returns Promise that resolves with an array of media devices
   * @example
   * ```typescript
   * const devices = await MediaUtils.getMediaDevices();
   * devices.forEach(device => console.log(device.kind, device.label));
   * ```
   */
  async getMediaDevices(): Promise<MediaDeviceInfo[]> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices;
  },

  /**
   * Gets the user's camera devices.
   * @returns Promise that resolves with an array of camera devices
   * @example
   * ```typescript
   * const cameras = await MediaUtils.getCameras();
   * cameras.forEach(cam => console.log(cam.label));
   * ```
   */
  async getCameras(): Promise<MediaDeviceInfo[]> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === "videoinput");
  },

  /**
   * Gets the user's microphone devices.
   * @returns Promise that resolves with an array of microphone devices
   * @example
   * ```typescript
   * const microphones = await MediaUtils.getMicrophones();
   * microphones.forEach(mic => console.log(mic.label));
   * ```
   */
  async getMicrophones(): Promise<MediaDeviceInfo[]> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === "audioinput");
  },

  /**
   * Gets the user's speaker devices.
   * @returns Promise that resolves with an array of speaker devices
   * @example
   * ```typescript
   * const speakers = await MediaUtils.getSpeakers();
   * speakers.forEach(spk => console.log(spk.label));
   * ```
   */
  async getSpeakers(): Promise<MediaDeviceInfo[]> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === "audiooutput");
  },

  /**
   * Requests access to the user's camera.
   * @param constraints - Media constraints (default: { video: true })
   * @returns Promise that resolves with a MediaStream
   * @example
   * ```typescript
   * const stream = await MediaUtils.requestCameraAccess();
   * // Attach to video element
   * videoElement.srcObject = stream;
   * ```
   */
  async requestCameraAccess(
    constraints: MediaStreamConstraints = { video: true }
  ): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia(constraints);
  },

  /**
   * Requests access to the user's microphone.
   * @param constraints - Media constraints (default: { audio: true })
   * @returns Promise that resolves with a MediaStream
   * @example
   * ```typescript
   * const stream = await MediaUtils.requestMicrophoneAccess();
   * // Attach to audio element
   * audioElement.srcObject = stream;
   * ```
   */
  async requestMicrophoneAccess(
    constraints: MediaStreamConstraints = { audio: true }
  ): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia(constraints);
  },

  /**
   * Requests access to the user's screen (screen sharing).
   * @param constraints - Media constraints (default: { video: true })
   * @returns Promise that resolves with a MediaStream
   * @example
   * ```typescript
   * const stream = await MediaUtils.requestScreenAccess();
   * // Attach to video element
   * videoElement.srcObject = stream;
   * ```
   */
  async requestScreenAccess(
    constraints: MediaStreamConstraints = { video: true }
  ): Promise<MediaStream> {
    return navigator.mediaDevices.getDisplayMedia(constraints);
  },

  /**
   * Stops all tracks in a MediaStream.
   * @param stream - MediaStream to stop
   * @example
   * ```typescript
   * MediaUtils.stopMediaStream(stream);
   * ```
   */
  stopMediaStream(stream: MediaStream): void {
    stream.getTracks().forEach((track) => track.stop());
  },

  /**
   * Creates a MediaRecorder instance for recording a MediaStream.
   * @param stream - MediaStream to record
   * @param options - MediaRecorder options
   * @returns MediaRecorder instance
   * @example
   * ```typescript
   * const recorder = MediaUtils.createMediaRecorder(stream);
   * recorder.start();
   * ```
   */
  createMediaRecorder(
    stream: MediaStream,
    options: MediaRecorderOptions = {}
  ): MediaRecorder {
    return new MediaRecorder(stream, options);
  },

  /**
   * Records a MediaStream to a Blob.
   * @param stream - MediaStream to record
   * @param options - MediaRecorder options
   * @returns Promise that resolves with the recorded Blob
   * @example
   * ```typescript
   * const blob = await MediaUtils.recordMediaStream(stream);
   * // Download the recording
   * MediaUtils.downloadBlob(blob, 'recording.webm');
   * ```
   */
  recordMediaStream(
    stream: MediaStream,
    options: MediaRecorderOptions = {}
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const recorder = new MediaRecorder(stream, options);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: options.mimeType });
        resolve(blob);
      };

      recorder.onerror = (error) => {
        reject(error);
      };

      recorder.start();
    });
  },

  /**
   * Takes a screenshot of a video element and returns it as a PNG Blob.
   * @param video - Video element to capture
   * @returns Promise that resolves with the screenshot as a Blob
   * @throws {Error} If the canvas context cannot be obtained
   * @example
   * ```typescript
   * const screenshot = await MediaUtils.takeScreenshot(videoElement);
   * MediaUtils.downloadBlob(screenshot, 'screenshot.png');
   * ```
   */
  async takeScreenshot(video: HTMLVideoElement): Promise<Blob> {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }
    ctx.drawImage(video, 0, 0);
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        }
      }, "image/png");
    });
  },

  /**
   * Converts a Blob to a base64 string.
   * @param blob - Blob to convert
   * @returns Promise that resolves with the base64 string (without the data URL prefix)
   * @example
   * ```typescript
   * const base64 = await MediaUtils.blobToBase64(blob);
   * console.log(base64);
   * ```
   */
  async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  },

  /**
   * Converts a base64 string to a Blob.
   * @param base64 - Base64 string to convert
   * @param type - MIME type of the Blob
   * @returns The converted Blob
   * @example
   * ```typescript
   * const blob = MediaUtils.base64ToBlob(base64String, 'image/jpeg');
   * ```
   */
  base64ToBlob(base64: string, type: string): Blob {
    const byteString = atob(base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type });
  },

  /**
   * Downloads a Blob as a file in the browser.
   * @param blob - Blob to download
   * @param filename - Name of the file
   * @example
   * ```typescript
   * MediaUtils.downloadBlob(blob, 'recording.webm');
   * ```
   */
  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },

  /**
   * Gets the duration of a video file in seconds.
   * @param file - Video file
   * @returns Promise that resolves with the duration in seconds
   * @example
   * ```typescript
   * const duration = await MediaUtils.getVideoDuration(videoFile);
   * console.log(`Duration: ${duration} seconds`);
   * ```
   */
  async getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error("Error loading video"));
      };
      video.src = URL.createObjectURL(file);
    });
  },

  /**
   * Gets the dimensions of a video file.
   * @param file - Video file
   * @returns Promise that resolves with the video dimensions
   * @example
   * ```typescript
   * const { width, height } = await MediaUtils.getVideoDimensions(videoFile);
   * console.log(`Width: ${width}, Height: ${height}`);
   * ```
   */
  async getVideoDimensions(
    file: File
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve({
          width: video.videoWidth,
          height: video.videoHeight,
        });
      };
      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error("Error loading video"));
      };
      video.src = URL.createObjectURL(file);
    });
  },

  /**
   * Gets the duration of an audio file in seconds.
   * @param file - Audio file
   * @returns Promise that resolves with the duration in seconds
   * @example
   * ```typescript
   * const duration = await MediaUtils.getAudioDuration(audioFile);
   * console.log(`Audio duration: ${duration} seconds`);
   * ```
   */
  async getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.preload = "metadata";
      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(audio.src);
        resolve(audio.duration);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(audio.src);
        reject(new Error("Error loading audio"));
      };
      audio.src = URL.createObjectURL(file);
    });
  },

  /**
   * Gets the dimensions of an image file.
   * @param file - Image file
   * @returns Promise that resolves with the image dimensions
   * @example
   * ```typescript
   * const { width, height } = await MediaUtils.getImageDimensions(imageFile);
   * console.log(`Image: ${width}x${height}`);
   * ```
   */
  async getImageDimensions(
    file: File
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve({
          width: img.width,
          height: img.height,
        });
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error("Error loading image"));
      };
      img.src = URL.createObjectURL(file);
    });
  },

  /**
   * Resizes an image file to fit within the specified maximum width and height.
   * @param file - Image file to resize
   * @param maxWidth - Maximum width
   * @param maxHeight - Maximum height
   * @returns Promise that resolves with the resized image as a Blob
   * @example
   * ```typescript
   * const resizedImage = await MediaUtils.resizeImage(imageFile, 800, 600);
   * MediaUtils.downloadBlob(resizedImage, 'resized.jpg');
   * ```
   */
  async resizeImage(
    file: File,
    maxWidth: number,
    maxHeight: number
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Could not resize image"));
          }
        }, file.type);
      };
      img.onerror = () => reject(new Error("Could not load image"));
      img.src = URL.createObjectURL(file);
    });
  },

  /**
   * Compresses an image file to reduce its size.
   * @param file - Image file to compress
   * @param quality - Compression quality (0-1, default: 0.8)
   * @returns Promise that resolves with the compressed image as a Blob
   * @example
   * ```typescript
   * const compressedImage = await MediaUtils.compressImage(imageFile, 0.7);
   * MediaUtils.downloadBlob(compressedImage, 'compressed.jpg');
   * ```
   */
  async compressImage(file: File, quality = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Could not compress image"));
            }
          },
          file.type,
          quality
        );
      };
      img.onerror = () => reject(new Error("Could not load image"));
      img.src = URL.createObjectURL(file);
    });
  },
};
