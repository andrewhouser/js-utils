/**
 * @module NetworkUtils
 * @description Utility functions for network operations in the browser, including fetch helpers with authentication, caching, progress, retry, and timeout; network status listeners; and network information utilities. Designed to simplify robust HTTP requests and network state management in web applications.
 * @example
 * ```typescript
 * import { NetworkUtils } from 'js-utils';
 *
 * // Add a network status listener
 * const remove = NetworkUtils.addNetworkStatusListener((online) => console.log('Online:', online));
 * // ...later
 * remove();
 *
 * // Fetch with authentication
 * const res = await NetworkUtils.fetchWithAuth('/api', 'token123');
 *
 * // Fetch with cache
 * const cachedRes = await NetworkUtils.fetchWithCache('/api/data');
 *
 * // Fetch JSON with error handling
 * const data = await NetworkUtils.fetchJson<{foo: string}>('/api/data');
 *
 * // Fetch with progress
 * await NetworkUtils.fetchWithProgress('/file', {}, (progress) => console.log('Progress:', progress));
 *
 * // Fetch with retry and timeout
 * const retryRes = await NetworkUtils.fetchWithRetry('/api', {}, 5, 500);
 * const timeoutRes = await NetworkUtils.fetchWithTimeout('/api', {}, 2000);
 *
 * // Get network speed and type
 * const speed = NetworkUtils.getNetworkSpeed();
 * const type = NetworkUtils.getNetworkType();
 *
 * // Check if online
 * if (NetworkUtils.isOnline()) {
 *   // Do something when online
 * }
 * ```
 */
export const NetworkUtils = {
  /**
   * Adds a listener for network status changes (online/offline).
   * @param callback - Callback invoked with `true` if online, `false` if offline.
   * @returns Function to remove the listener.
   * @example
   * ```typescript
   * const remove = NetworkUtils.addNetworkStatusListener((online) => console.log('Online:', online));
   * // ...later
   * remove();
   * ```
   */
  addNetworkStatusListener: (
    callback: (online: boolean) => void
  ): (() => void) => {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  },

  /**
   * Makes a fetch request with Bearer token authentication.
   * @param url - The URL to fetch.
   * @param token - The authentication token.
   * @param options - Additional fetch options.
   * @returns The fetch response.
   * @example
   * ```typescript
   * const res = await NetworkUtils.fetchWithAuth('/api', 'token123');
   * ```
   */
  fetchWithAuth: async (
    url: string,
    token: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /**
   * Makes a fetch request with caching in localStorage.
   * @param url - The URL to fetch.
   * @param options - Fetch options.
   * @param cacheTime - Cache time in milliseconds (default 5 minutes).
   * @returns The fetch response (from cache or network).
   * @example
   * ```typescript
   * const res = await NetworkUtils.fetchWithCache('/api/data');
   * ```
   */
  fetchWithCache: async (
    url: string,
    options: RequestInit = {},
    cacheTime = 5 * 60 * 1000 // 5 minutes
  ): Promise<Response> => {
    const cacheKey = `fetch-cache-${url}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < cacheTime) {
        return new Response(data);
      }
    }

    const response = await fetch(url, options);
    const data = await response.clone().text();

    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );

    return response;
  },

  /**
   * Makes a fetch request and parses the response as JSON, with error handling.
   * @template T
   * @param url - The URL to fetch.
   * @param options - Fetch options.
   * @returns The parsed response data.
   * @throws {Error} If the response is not OK.
   * @example
   * ```typescript
   * const data = await NetworkUtils.fetchJson<{foo: string}>('/api/data');
   * ```
   */
  fetchJson: async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Makes a fetch request and tracks download progress.
   * @param url - The URL to fetch.
   * @param options - Fetch options.
   * @param onProgress - Progress callback (0-100).
   * @returns The fetch response.
   * @example
   * ```typescript
   * await NetworkUtils.fetchWithProgress('/file', {}, (progress) => console.log('Progress:', progress));
   * ```
   */
  fetchWithProgress: async (
    url: string,
    options: RequestInit = {},
    onProgress?: (progress: number) => void
  ): Promise<Response> => {
    const response = await fetch(url, options);
    const contentLength = response.headers.get("content-length");
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    let loaded = 0;

    const reader = response.body?.getReader();
    if (!reader || !response.body) return response;

    const stream = new ReadableStream({
      start(controller) {
        function push() {
          reader!.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }

            loaded += value.length;
            if (total && onProgress) {
              onProgress((loaded / total) * 100);
            }

            controller.enqueue(value);
            push();
          });
        }

        push();
      },
    });

    return new Response(stream, {
      headers: response.headers,
      status: response.status,
      statusText: response.statusText,
    });
  },

  /**
   * Makes a fetch request with retry logic on failure.
   * @param url - The URL to fetch.
   * @param options - Fetch options.
   * @param retries - Number of retries (default 3).
   * @param delay - Delay between retries in milliseconds (default 1000).
   * @returns The fetch response.
   * @throws {Error} If all retries fail.
   * @example
   * ```typescript
   * const res = await NetworkUtils.fetchWithRetry('/api', {}, 5, 500);
   * ```
   */
  fetchWithRetry: async (
    url: string,
    options: RequestInit = {},
    retries = 3,
    delay = 1000
  ): Promise<Response> => {
    let lastError: Error;

    for (let i = 0; i < retries; i++) {
      try {
        return await fetch(url, options);
      } catch (error) {
        lastError = error as Error;
        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError!;
  },

  /**
   * Makes a fetch request with a timeout.
   * @param url - The URL to fetch.
   * @param options - Fetch options.
   * @param timeout - Request timeout in milliseconds (default 5000).
   * @returns The fetch response.
   * @throws {Error} If the request times out.
   * @example
   * ```typescript
   * const res = await NetworkUtils.fetchWithTimeout('/api', {}, 2000);
   * ```
   */
  fetchWithTimeout: async (
    url: string,
    options: RequestInit = {},
    timeout = 5000
  ): Promise<Response> => {
    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, { ...options, signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout");
      }
      throw error;
    }
  },

  /**
   * Gets the current network speed (downlink) in Mbps, if available.
   * @returns The network speed in Mbps, or null if not available.
   * @example
   * ```typescript
   * const speed = NetworkUtils.getNetworkSpeed();
   * console.log('Speed:', speed);
   * ```
   */
  getNetworkSpeed: (): string | null => {
    if (typeof navigator !== "undefined" && "connection" in navigator) {
      const connection = (navigator as any).connection;
      return connection ? connection.downlink + " Mbps" : null;
    }
    return null;
  },

  /**
   * Gets the current network type (e.g., 'wifi', '4g'), if available.
   * @returns The network type, or null if not available.
   * @example
   * ```typescript
   * const type = NetworkUtils.getNetworkType();
   * console.log('Type:', type);
   * ```
   */
  getNetworkType: (): string | null => {
    if (typeof navigator !== "undefined" && "connection" in navigator) {
      const connection = (navigator as any).connection;
      return connection ? connection.effectiveType : null;
    }
    return null;
  },

  /**
   * Checks if the network is currently online.
   * @returns True if the network is online, false otherwise.
   * @example
   * ```typescript
   * if (NetworkUtils.isOnline()) {
   *   // Do something when online
   * }
   * ```
   */
  isOnline: (): boolean => {
    return typeof navigator !== "undefined" && navigator.onLine;
  },
};
