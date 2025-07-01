import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MediaUtils } from "../MediaUtils";

describe("MediaUtils", () => {
  // Mock MediaRecorder and related APIs
  const mockMediaRecorder = {
    isTypeSupported: vi.fn(),
  };

  const mockMediaDevices = {
    enumerateDevices: vi.fn(),
    getUserMedia: vi.fn(),
    getDisplayMedia: vi.fn(),
  };

  const mockURL = {
    createObjectURL: vi.fn(),
    revokeObjectURL: vi.fn(),
  };

  beforeEach(() => {
    // Setup global mocks
    const mockBlobEvent = (type: string, eventInitDict: BlobEventInit) => ({
      type,
      data: eventInitDict.data,
    });

    class MockEventTarget {
      addEventListener = vi.fn();
      removeEventListener = vi.fn();
      dispatchEvent = vi.fn();
    }

    class MockMediaRecorder extends MockEventTarget implements MediaRecorder {
      static isTypeSupported = mockMediaRecorder.isTypeSupported;
      readonly mimeType: string;
      readonly state: RecordingState;
      readonly stream: MediaStream;
      readonly audioBitsPerSecond: number;
      readonly videoBitsPerSecond: number;
      ondataavailable: ((event: BlobEvent) => void) | null = null;
      onerror: ((event: Event) => void) | null = null;
      onpause: (() => void) | null = null;
      onresume: (() => void) | null = null;
      onstart: (() => void) | null = null;
      onstop: ((event?: Event) => void) | null = null;

      constructor(stream: MediaStream, options?: MediaRecorderOptions) {
        super();
        this.stream = stream;
        this.mimeType = options?.mimeType || "video/webm";
        this.state = "inactive";
        this.audioBitsPerSecond = options?.audioBitsPerSecond || 0;
        this.videoBitsPerSecond = options?.videoBitsPerSecond || 0;
      }

      start = vi.fn();
      stop = vi.fn();
      pause = vi.fn();
      resume = vi.fn();
      requestData = vi.fn();
    }

    Object.defineProperty(global, "MediaRecorder", {
      value: MockMediaRecorder,
      writable: true,
      configurable: true,
    });

    class MockBlobEvent {
      readonly type: string;
      readonly data: Blob;
      constructor(type: string, eventInitDict: BlobEventInit) {
        this.type = type;
        this.data = eventInitDict.data;
      }
    }

    Object.defineProperty(global, "BlobEvent", {
      value: MockBlobEvent,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(global.navigator, "mediaDevices", {
      value: mockMediaDevices,
      writable: true,
      configurable: true,
    });

    global.URL = mockURL as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Media Type Support", () => {
    it("should check if media type is supported", () => {
      mockMediaRecorder.isTypeSupported.mockReturnValue(true);
      expect(MediaUtils.isMediaTypeSupported("video/mp4")).toBe(true);
      expect(mockMediaRecorder.isTypeSupported).toHaveBeenCalledWith(
        "video/mp4"
      );
    });

    it("should get supported media types", () => {
      mockMediaRecorder.isTypeSupported.mockImplementation(
        (type) => type === "video/webm" || type === "audio/webm"
      );
      const supportedTypes = MediaUtils.getSupportedMediaTypes();
      expect(supportedTypes).toEqual(["video/webm", "audio/webm"]);
    });
  });

  describe("Device Management", () => {
    const mockDevices = [
      { kind: "videoinput", deviceId: "1" },
      { kind: "audioinput", deviceId: "2" },
      { kind: "audiooutput", deviceId: "3" },
    ];

    beforeEach(() => {
      mockMediaDevices.enumerateDevices.mockResolvedValue(mockDevices);
    });

    it("should get all media devices", async () => {
      const devices = await MediaUtils.getMediaDevices();
      expect(devices).toEqual(mockDevices);
      expect(mockMediaDevices.enumerateDevices).toHaveBeenCalled();
    });

    it("should get camera devices", async () => {
      const cameras = await MediaUtils.getCameras();
      expect(cameras).toEqual([mockDevices[0]]);
    });

    it("should get microphone devices", async () => {
      const microphones = await MediaUtils.getMicrophones();
      expect(microphones).toEqual([mockDevices[1]]);
    });

    it("should get speaker devices", async () => {
      const speakers = await MediaUtils.getSpeakers();
      expect(speakers).toEqual([mockDevices[2]]);
    });
  });

  describe("Media Access", () => {
    const mockTracks = [{ stop: vi.fn() }, { stop: vi.fn() }];

    const mockStream = {
      getTracks: () => mockTracks,
    };

    beforeEach(() => {
      mockMediaDevices.getUserMedia.mockResolvedValue(mockStream);
      mockMediaDevices.getDisplayMedia.mockResolvedValue(mockStream);
    });

    it("should request camera access", async () => {
      const stream = await MediaUtils.requestCameraAccess();
      expect(stream).toBe(mockStream);
      expect(mockMediaDevices.getUserMedia).toHaveBeenCalledWith({
        video: true,
      });
    });

    it("should request microphone access", async () => {
      const stream = await MediaUtils.requestMicrophoneAccess();
      expect(stream).toBe(mockStream);
      expect(mockMediaDevices.getUserMedia).toHaveBeenCalledWith({
        audio: true,
      });
    });

    it("should request screen access", async () => {
      const stream = await MediaUtils.requestScreenAccess();
      expect(stream).toBe(mockStream);
      expect(mockMediaDevices.getDisplayMedia).toHaveBeenCalledWith({
        video: true,
      });
    });

    it("should stop media stream", () => {
      MediaUtils.stopMediaStream(mockStream as any);
      mockTracks.forEach((track) => {
        expect(track.stop).toHaveBeenCalled();
      });
    });
  });

  describe("Media Recording", () => {
    const mockStream = {} as MediaStream;
    const mockBlob = new Blob(["test"], { type: "video/webm" });
    const mockChunks = [new Blob(["chunk1"]), new Blob(["chunk2"])];

    it("should create media recorder", () => {
      const recorder = MediaUtils.createMediaRecorder(mockStream);
      expect(recorder).toBeInstanceOf(MediaRecorder);
    });

    it("should record media stream", async () => {
      // Create a controllable mock instance
      let recorderInstance: any;
      const MockMediaRecorder = vi
        .fn()
        .mockImplementation(function (this: any, ...args) {
          recorderInstance = this;
          this.stream = args[0];
          this.mimeType = args[1]?.mimeType || "video/webm";
          this.state = "inactive";
          this.audioBitsPerSecond = args[1]?.audioBitsPerSecond || 0;
          this.videoBitsPerSecond = args[1]?.videoBitsPerSecond || 0;
          this.ondataavailable = null;
          this.onerror = null;
          this.onpause = null;
          this.onresume = null;
          this.onstart = null;
          this.onstop = null;
          this.start = vi.fn();
          this.stop = vi.fn();
          this.pause = vi.fn();
          this.resume = vi.fn();
          this.requestData = vi.fn();
        });
      (MockMediaRecorder as any).isTypeSupported =
        mockMediaRecorder.isTypeSupported;
      Object.defineProperty(global, "MediaRecorder", {
        value: MockMediaRecorder,
        writable: true,
        configurable: true,
      });

      const recordPromise = MediaUtils.recordMediaStream(mockStream);

      // Simulate data available
      const blobEvent1 = new BlobEvent("dataavailable", {
        data: mockChunks[0],
      });
      const blobEvent2 = new BlobEvent("dataavailable", {
        data: mockChunks[1],
      });
      recorderInstance.ondataavailable?.(blobEvent1);
      recorderInstance.ondataavailable?.(blobEvent2);

      // Simulate recording stop
      if (recorderInstance.onstop)
        recorderInstance.onstop({ type: "stop" } as Event);

      const result = await recordPromise;
      expect(result).toBeInstanceOf(Blob);
    });
  });

  describe("Image Processing", () => {
    const mockImage = {
      width: 1000,
      height: 800,
      onload: vi.fn(),
      onerror: vi.fn(),
    };

    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue({
        drawImage: vi.fn(),
      }),
      toBlob: vi.fn((callback) => callback(new Blob(["test"]))),
    };

    beforeEach(() => {
      vi.spyOn(global, "Image").mockImplementation(() => mockImage as any);
      vi.spyOn(document, "createElement").mockImplementation(
        () => mockCanvas as any
      );
      mockURL.createObjectURL.mockReturnValue("blob:test");
    });

    it("should take screenshot of video", async () => {
      const mockVideo = {
        videoWidth: 1920,
        videoHeight: 1080,
      } as HTMLVideoElement;

      const screenshotPromise = MediaUtils.takeScreenshot(mockVideo);

      // Simulate image load
      mockImage.onload();

      const result = await screenshotPromise;
      expect(result).toBeInstanceOf(Blob);
      expect(mockCanvas.width).toBe(1920);
      expect(mockCanvas.height).toBe(1080);
    });

    it("should resize image", async () => {
      const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

      const resizePromise = MediaUtils.resizeImage(mockFile, 500, 400);

      // Simulate image load
      mockImage.onload();

      const result = await resizePromise;
      expect(result).toBeInstanceOf(Blob);
      expect(mockCanvas.width).toBe(500);
      expect(mockCanvas.height).toBe(400);
    });

    it("should compress image", async () => {
      const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

      const compressPromise = MediaUtils.compressImage(mockFile, 0.8);

      // Simulate image load
      mockImage.onload();

      const result = await compressPromise;
      expect(result).toBeInstanceOf(Blob);
      expect(mockCanvas.toBlob).toHaveBeenCalledWith(
        expect.any(Function),
        "image/jpeg",
        0.8
      );
    });
  });

  describe("File Utilities", () => {
    it("should convert blob to base64", async () => {
      const mockBlob = new Blob(["test"]);
      const mockBase64 = "dGVzdA==";

      const mockFileReader = {
        readAsDataURL: vi.fn(),
        result: `data:application/octet-stream;base64,${mockBase64}`,
        onloadend: vi.fn(),
      };

      vi.spyOn(global, "FileReader").mockImplementation(
        () => mockFileReader as any
      );

      const convertPromise = MediaUtils.blobToBase64(mockBlob);

      // Simulate FileReader load
      mockFileReader.onloadend();

      const result = await convertPromise;
      expect(result).toBe(mockBase64);
    });

    it("should convert base64 to blob", () => {
      const base64 = "dGVzdA==";
      const type = "image/jpeg";

      const result = MediaUtils.base64ToBlob(base64, type);
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe(type);
    });

    it("should download blob", () => {
      const mockBlob = new Blob(["test"]);
      const filename = "test.txt";

      const mockAnchor = {
        href: "",
        download: "",
        click: vi.fn(),
      };

      vi.spyOn(document, "createElement").mockImplementation(
        () => mockAnchor as any
      );
      mockURL.createObjectURL.mockReturnValue("blob:test");

      MediaUtils.downloadBlob(mockBlob, filename);

      expect(mockURL.createObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(mockAnchor.download).toBe(filename);
      expect(mockAnchor.click).toHaveBeenCalled();
      expect(mockURL.revokeObjectURL).toHaveBeenCalledWith("blob:test");
    });
  });
});
