import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NetworkUtils } from "../NetworkUtils";

describe("NetworkUtils", () => {
  let originalFetch: typeof fetch;
  let originalLocalStorage: Storage;
  let originalNavigator: Navigator;
  let originalWindowAddEventListener: typeof window.addEventListener;
  let originalWindowRemoveEventListener: typeof window.removeEventListener;

  beforeEach(() => {
    // Mock fetch
    originalFetch = global.fetch;
    global.fetch = vi.fn();

    // Mock localStorage
    originalLocalStorage = global.localStorage;
    let store: Record<string, string> = {};
    global.localStorage = {
      getItem: vi.fn((key) => store[key] || null),
      setItem: vi.fn((key, value) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      key: vi.fn(),
      length: 0,
    } as any;

    // Mock navigator
    originalNavigator = global.navigator;
    global.navigator = {
      onLine: true,
      connection: { downlink: 42, effectiveType: "4g" },
    } as any;

    // Mock window event listeners
    originalWindowAddEventListener = window.addEventListener;
    originalWindowRemoveEventListener = window.removeEventListener;
    window.addEventListener = vi.fn();
    window.removeEventListener = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    global.localStorage = originalLocalStorage;
    global.navigator = originalNavigator;
    window.addEventListener = originalWindowAddEventListener;
    window.removeEventListener = originalWindowRemoveEventListener;
    vi.clearAllMocks();
  });

  it("addNetworkStatusListener should add and remove listeners", () => {
    const cb = vi.fn();
    const remove = NetworkUtils.addNetworkStatusListener(cb);
    expect(window.addEventListener).toHaveBeenCalledWith(
      "online",
      expect.any(Function)
    );
    expect(window.addEventListener).toHaveBeenCalledWith(
      "offline",
      expect.any(Function)
    );
    remove();
    expect(window.removeEventListener).toHaveBeenCalledWith(
      "online",
      expect.any(Function)
    );
    expect(window.removeEventListener).toHaveBeenCalledWith(
      "offline",
      expect.any(Function)
    );
  });

  it("fetchWithAuth should add Authorization header", async () => {
    (global.fetch as any).mockResolvedValue(new Response("ok"));
    await NetworkUtils.fetchWithAuth("/api", "token123");
    expect(global.fetch).toHaveBeenCalledWith(
      "/api",
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer token123" }),
      })
    );
  });

  it("fetchWithCache should return cached response if not expired", async () => {
    const now = Date.now();
    (global.localStorage.getItem as any).mockReturnValueOnce(
      JSON.stringify({ data: "cached", timestamp: now })
    );
    const res = await NetworkUtils.fetchWithCache("/api");
    expect(await res.text()).toBe("cached");
  });

  it("fetchWithCache should fetch and cache if expired or not cached", async () => {
    (global.localStorage.getItem as any).mockReturnValueOnce(null);
    (global.fetch as any).mockResolvedValueOnce(new Response("fresh"));
    const res = await NetworkUtils.fetchWithCache("/api");
    expect(await res.text()).toBe("fresh");
    expect(global.localStorage.setItem).toHaveBeenCalled();
  });

  it("fetchJson should parse JSON and throw on error", async () => {
    (global.fetch as any).mockResolvedValueOnce(
      new Response(JSON.stringify({ foo: 1 }), { status: 200 })
    );
    const data = await NetworkUtils.fetchJson<{ foo: number }>("/api");
    expect(data).toEqual({ foo: 1 });

    (global.fetch as any).mockResolvedValueOnce(
      new Response("fail", { status: 500 })
    );
    await expect(NetworkUtils.fetchJson("/api")).rejects.toThrow(
      "HTTP error! status: 500"
    );
  });

  it("fetchWithProgress should call onProgress", async () => {
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array([1, 2, 3]));
        controller.close();
      },
    });
    (global.fetch as any).mockResolvedValueOnce(
      new Response(body, {
        headers: { "content-length": "3" },
        status: 200,
      })
    );
    const onProgress = vi.fn();
    const res = await NetworkUtils.fetchWithProgress("/file", {}, onProgress);
    expect(res).toBeInstanceOf(Response);
    expect(onProgress).toHaveBeenCalledWith(100);
  });

  it("fetchWithRetry should retry on failure and eventually succeed", async () => {
    (global.fetch as any)
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValueOnce(new Response("ok"));
    const res = await NetworkUtils.fetchWithRetry("/api", {}, 2, 1);
    expect(res).toBeInstanceOf(Response);
    expect(await res.text()).toBe("ok");
  });

  it("fetchWithRetry should throw after all retries", async () => {
    (global.fetch as any).mockRejectedValue(new Error("fail"));
    await expect(NetworkUtils.fetchWithRetry("/api", {}, 2, 1)).rejects.toThrow(
      "fail"
    );
  });

  it("fetchWithTimeout should abort after timeout", async () => {
    const abortError = new Error("The operation was aborted");
    abortError.name = "AbortError";
    (global.fetch as any).mockImplementation(() => Promise.reject(abortError));
    await expect(NetworkUtils.fetchWithTimeout("/api", {}, 5)).rejects.toThrow(
      "Request timeout"
    );
  });

  it("getNetworkSpeed should return downlink Mbps", () => {
    expect(NetworkUtils.getNetworkSpeed()).toBe("42 Mbps");
    (global.navigator as any).connection = undefined;
    expect(NetworkUtils.getNetworkSpeed()).toBeNull();
  });

  it("getNetworkType should return effectiveType", () => {
    expect(NetworkUtils.getNetworkType()).toBe("4g");
    (global.navigator as any).connection = undefined;
    expect(NetworkUtils.getNetworkType()).toBeNull();
  });

  it("isOnline should reflect navigator.onLine", () => {
    (global.navigator as any).onLine = true;
    expect(NetworkUtils.isOnline()).toBe(true);
    (global.navigator as any).onLine = false;
    expect(NetworkUtils.isOnline()).toBe(false);
  });
});
