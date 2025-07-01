/**
 * @module StorageUtils
 * @description Utility functions for managing browser storage (localStorage, sessionStorage, cookies) with support for encryption, expiration, and type-safe operations. Includes methods for getting, setting, and removing values, as well as managing storage quotas and handling storage availability.
 * @example
 * ```typescript
 * import { StorageUtils } from 'js-utils';
 *
 * // Set and get values from localStorage
 * StorageUtils.setLocal('user', { id: 1, name: 'John' });
 * const user = StorageUtils.getLocal<{ id: number; name: string }>('user');
 *
 * // Set and get values from sessionStorage with encryption
 * StorageUtils.setSession('token', 'secret-token', { encrypt: true });
 * const token = StorageUtils.getSession<string>('token', { decrypt: true });
 *
 * // Set and get cookies with options
 * StorageUtils.setCookie('theme', 'dark', { expires: 86400000, secure: true });
 * const theme = StorageUtils.getCookie('theme');
 *
 * // Check storage availability
 * if (StorageUtils.isStorageAvailable('localStorage')) {
 *   // Use localStorage
 * }
 * ```
 */
export const StorageUtils = {
  /**
   * Clears all cookies.
   * @param options - Clear options
   * @param options.exclude - Cookie names to exclude from clearing
   * @param options.path - Cookie path
   * @param options.domain - Cookie domain
   * @example
   * ```typescript
   * // Clear all cookies
   * StorageUtils.clearCookies();
   *
   * // Clear cookies except 'session'
   * StorageUtils.clearCookies({ exclude: ['session'] });
   * ```
   */
  clearCookies(
    options: {
      exclude?: string[];
      path?: string;
      domain?: string;
    } = {}
  ): void {
    try {
      const { exclude = [], path = "/", domain } = options;
      const cookies = this.getAllCookies();
      Object.keys(cookies).forEach((name) => {
        if (!exclude.includes(name)) {
          this.removeCookie(name, { path, domain });
        }
      });
    } catch (error) {
      console.error("Error clearing cookies:", error);
    }
  },

  /**
   * Clears all values from localStorage.
   * @param options - Clear options
   * @param options.exclude - Keys to exclude from clearing
   * @example
   * ```typescript
   * // Clear all localStorage
   * StorageUtils.clearLocal();
   *
   * // Clear localStorage except 'settings'
   * StorageUtils.clearLocal({ exclude: ['settings'] });
   * ```
   */
  clearLocal(
    options: {
      exclude?: string[];
    } = {}
  ): void {
    try {
      const { exclude = [] } = options;
      if (exclude.length === 0) {
        localStorage.clear();
      } else {
        Object.keys(localStorage).forEach((key) => {
          if (!exclude.includes(key)) {
            localStorage.removeItem(key);
          }
        });
      }
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },

  /**
   * Clears all values from sessionStorage.
   * @param options - Clear options
   * @param options.exclude - Keys to exclude from clearing
   * @example
   * ```typescript
   * // Clear all sessionStorage
   * StorageUtils.clearSession();
   *
   * // Clear sessionStorage except 'temp'
   * StorageUtils.clearSession({ exclude: ['temp'] });
   * ```
   */
  clearSession(
    options: {
      exclude?: string[];
    } = {}
  ): void {
    try {
      const { exclude = [] } = options;
      if (exclude.length === 0) {
        sessionStorage.clear();
      } else {
        Object.keys(sessionStorage).forEach((key) => {
          if (!exclude.includes(key)) {
            sessionStorage.removeItem(key);
          }
        });
      }
    } catch (error) {
      console.error("Error clearing sessionStorage:", error);
    }
  },

  /**
   * Decrypts an encrypted string value.
   * @param value - Value to decrypt
   * @param key - Optional encryption key (defaults to a secure key)
   * @returns Promise resolving to decrypted value
   * @throws Error if decryption fails
   * @example
   * ```typescript
   * const decrypted = await StorageUtils.decrypt(encryptedValue);
   * ```
   */
  async decrypt(value: string, key?: string): Promise<string> {
    try {
      const encryptedData = JSON.parse(atob(value));
      const { iv, data } = encryptedData;

      const cryptoKey = await this.getCryptoKey(key);

      const encryptedBuffer = new Uint8Array(data.split(",").map(Number));
      const ivBuffer = new Uint8Array(iv.split(",").map(Number));

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: ivBuffer,
        },
        cryptoKey,
        encryptedBuffer
      );

      return new TextDecoder().decode(decryptedBuffer);
    } catch (error) {
      console.error("Error decrypting value:", error);
      throw new Error("Failed to decrypt value");
    }
  },

  /**
   * Encrypts a string value.
   * @param value - Value to encrypt
   * @param key - Optional encryption key (defaults to a secure key)
   * @returns Promise resolving to encrypted value
   * @throws Error if encryption fails
   * @example
   * ```typescript
   * const encrypted = await StorageUtils.encrypt('sensitive-data');
   * ```
   */
  async encrypt(value: string, key?: string): Promise<string> {
    try {
      const cryptoKey = await this.getCryptoKey(key);
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const dataBuffer = new TextEncoder().encode(value);

      const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv,
        },
        cryptoKey,
        dataBuffer
      );

      const encryptedData = {
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(encryptedBuffer)),
      };

      return btoa(JSON.stringify(encryptedData));
    } catch (error) {
      console.error("Error encrypting value:", error);
      throw new Error("Failed to encrypt value");
    }
  },

  /**
   * Gets all cookies.
   * @param options - Cookie options
   * @param options.decrypt - Whether to decrypt the values
   * @returns Object containing all cookies
   * @example
   * ```typescript
   * // Get all cookies
   * const cookies = StorageUtils.getAllCookies();
   *
   * // Get all cookies with decryption
   * const decryptedCookies = await StorageUtils.getAllCookies({ decrypt: true });
   * ```
   */
  async getAllCookies(
    options: {
      decrypt?: boolean;
    } = {}
  ): Promise<Record<string, string>> {
    try {
      const { decrypt = false } = options;
      const cookies: Record<string, string> = {};
      const cookiePromises = document.cookie.split(";").map(async (cookie) => {
        const [name, value] = cookie.trim().split("=");
        const decodedName = decodeURIComponent(name);
        const decodedValue = decodeURIComponent(value);
        cookies[decodedName] = decrypt
          ? await this.decrypt(decodedValue)
          : decodedValue;
      });
      await Promise.all(cookiePromises);
      return cookies;
    } catch (error) {
      console.error("Error getting all cookies:", error);
      return {};
    }
  },

  /**
   * Gets a cookie value.
   * @param name - Cookie name
   * @param options - Cookie options
   * @param options.decrypt - Whether to decrypt the value
   * @returns Cookie value or null if not found
   * @example
   * ```typescript
   * // Get a cookie
   * const value = StorageUtils.getCookie('theme');
   *
   * // Get and decrypt a cookie
   * const decryptedValue = await StorageUtils.getCookie('token', { decrypt: true });
   * ```
   */
  async getCookie(
    name: string,
    options: {
      decrypt?: boolean;
    } = {}
  ): Promise<string | null> {
    try {
      const { decrypt = false } = options;
      const cookies = document.cookie.split(";");
      const cookie = cookies.find((c) => c.trim().startsWith(`${name}=`));

      if (!cookie) return null;

      const value = decodeURIComponent(cookie.split("=")[1]);
      return decrypt ? await this.decrypt(value) : value;
    } catch (error) {
      console.error("Error getting cookie:", error);
      return null;
    }
  },

  /**
   * Gets or generates a crypto key for encryption/decryption.
   * @param key - Optional encryption key
   * @returns Promise resolving to CryptoKey
   * @private
   */
  async getCryptoKey(key?: string): Promise<CryptoKey> {
    try {
      const keyMaterial = key
        ? await window.crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(key),
            { name: "PBKDF2" },
            false,
            ["deriveBits", "deriveKey"]
          )
        : await window.crypto.subtle.generateKey(
            {
              name: "AES-GCM",
              length: 256,
            },
            true,
            ["encrypt", "decrypt"]
          );

      if (key) {
        return window.crypto.subtle.deriveKey(
          {
            name: "PBKDF2",
            salt: new TextEncoder().encode("storage-salt"),
            iterations: 100000,
            hash: "SHA-256",
          },
          keyMaterial,
          { name: "AES-GCM", length: 256 },
          false,
          ["encrypt", "decrypt"]
        );
      }

      return keyMaterial as CryptoKey;
    } catch (error) {
      console.error("Error getting crypto key:", error);
      throw new Error("Failed to get encryption key");
    }
  },

  /**
   * Gets a value from localStorage.
   * @template T
   * @param key - Storage key
   * @param options - Storage options
   * @param options.decrypt - Whether to decrypt the value
   * @param options.defaultValue - Default value if not found/expired
   * @returns Stored value or null if not found/expired
   * @example
   * ```typescript
   * // Get a value
   * const value = StorageUtils.getLocal<string>('name');
   *
   * // Get and decrypt a value with default
   * const decryptedValue = await StorageUtils.getLocal<string>('token', {
   *   decrypt: true,
   *   defaultValue: 'default-token'
   * });
   * ```
   */
  async getLocal<T>(
    key: string,
    options: {
      decrypt?: boolean;
      defaultValue?: T;
    } = {}
  ): Promise<T | null> {
    try {
      const { decrypt = false, defaultValue = null } = options;
      const item = localStorage.getItem(key);

      if (!item) return defaultValue;

      const serialized = decrypt ? await this.decrypt(item) : item;
      const data = JSON.parse(serialized);

      if (data.expires && Date.now() > data.expires) {
        localStorage.removeItem(key);
        return defaultValue;
      }

      return data.value as T;
    } catch (error) {
      console.error("Error getting localStorage item:", error);
      return options.defaultValue ?? null;
    }
  },

  /**
   * Gets a value from sessionStorage.
   * @template T
   * @param key - Storage key
   * @param options - Storage options
   * @param options.decrypt - Whether to decrypt the value
   * @param options.defaultValue - Default value if not found/expired
   * @returns Stored value or null if not found/expired
   * @example
   * ```typescript
   * // Get a value
   * const value = StorageUtils.getSession<string>('temp');
   *
   * // Get and decrypt a value with default
   * const decryptedValue = await StorageUtils.getSession<string>('token', {
   *   decrypt: true,
   *   defaultValue: 'default-token'
   * });
   * ```
   */
  async getSession<T>(
    key: string,
    options: {
      decrypt?: boolean;
      defaultValue?: T;
    } = {}
  ): Promise<T | null> {
    try {
      const { decrypt = false, defaultValue = null } = options;
      const item = sessionStorage.getItem(key);

      if (!item) return defaultValue;

      const serialized = decrypt ? await this.decrypt(item) : item;
      const data = JSON.parse(serialized);

      if (data.expires && Date.now() > data.expires) {
        sessionStorage.removeItem(key);
        return defaultValue;
      }

      return data.value as T;
    } catch (error) {
      console.error("Error getting sessionStorage item:", error);
      return options.defaultValue ?? null;
    }
  },

  /**
   * Gets the storage quota and usage.
   * @returns Promise resolving to object containing quota and usage information
   * @example
   * ```typescript
   * const quota = await StorageUtils.getStorageQuota();
   * console.log(`Usage: ${quota?.usage} / ${quota?.quota}`);
   * ```
   */
  async getStorageQuota(): Promise<{
    quota: number;
    usage: number;
    remaining: number;
  } | null> {
    try {
      if ("storage" in navigator && "estimate" in navigator.storage) {
        const { quota, usage } = await navigator.storage.estimate();
        return {
          quota: quota ?? 0,
          usage: usage ?? 0,
          remaining: (quota ?? 0) - (usage ?? 0),
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting storage quota:", error);
      return null;
    }
  },

  /**
   * Gets the size of a stored value.
   * @param value - Value to measure
   * @returns Size in bytes
   * @example
   * ```typescript
   * const size = StorageUtils.getStorageSize({ data: 'large' });
   * console.log(`Size: ${size} bytes`);
   * ```
   */
  getStorageSize(value: unknown): number {
    try {
      const serialized = JSON.stringify(value);
      return new Blob([serialized]).size;
    } catch (error) {
      console.error("Error getting storage size:", error);
      return 0;
    }
  },

  /**
   * Gets the total size of all stored values.
   * @param type - Storage type ('localStorage' or 'sessionStorage')
   * @returns Total size in bytes
   * @example
   * ```typescript
   * const totalSize = StorageUtils.getTotalStorageSize('localStorage');
   * console.log(`Total size: ${totalSize} bytes`);
   * ```
   */
  getTotalStorageSize(type: "localStorage" | "sessionStorage"): number {
    try {
      const storage = type === "localStorage" ? localStorage : sessionStorage;
      let total = 0;
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key) {
          const value = storage.getItem(key);
          if (value) {
            total += this.getStorageSize(value);
          }
        }
      }
      return total;
    } catch (error) {
      console.error("Error getting total storage size:", error);
      return 0;
    }
  },

  /**
   * Checks if storage is available.
   * @param type - Storage type ('localStorage', 'sessionStorage', or 'cookie')
   * @returns True if storage is available
   * @example
   * ```typescript
   * if (StorageUtils.isStorageAvailable('localStorage')) {
   *   // Use localStorage
   * }
   * ```
   */
  isStorageAvailable(
    type: "localStorage" | "sessionStorage" | "cookie"
  ): boolean {
    try {
      switch (type) {
        case "localStorage":
          localStorage.setItem("test", "test");
          localStorage.removeItem("test");
          return true;
        case "sessionStorage":
          sessionStorage.setItem("test", "test");
          sessionStorage.removeItem("test");
          return true;
        case "cookie":
          document.cookie = "test=test";
          document.cookie = "test=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          return true;
        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  },

  /**
   * Removes a cookie.
   * @param name - Cookie name
   * @param options - Cookie options
   * @param options.path - Cookie path
   * @param options.domain - Cookie domain
   * @example
   * ```typescript
   * StorageUtils.removeCookie('session');
   * ```
   */
  removeCookie(
    name: string,
    options: {
      path?: string;
      domain?: string;
    } = {}
  ): void {
    try {
      const { path = "/", domain } = options;
      this.setCookie(name, "", {
        expires: new Date(0),
        path,
        domain,
      });
    } catch (error) {
      console.error("Error removing cookie:", error);
    }
  },

  /**
   * Removes a value from localStorage.
   * @param key - Storage key
   * @example
   * ```typescript
   * StorageUtils.removeLocal('user');
   * ```
   */
  removeLocal(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing localStorage item:", error);
    }
  },

  /**
   * Removes a value from sessionStorage.
   * @param key - Storage key
   * @example
   * ```typescript
   * StorageUtils.removeSession('temp');
   * ```
   */
  removeSession(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing sessionStorage item:", error);
    }
  },

  /**
   * Sets a cookie.
   * @param name - Cookie name
   * @param value - Cookie value
   * @param options - Cookie options
   * @param options.expires - Expiration time in milliseconds or Date
   * @param options.path - Cookie path
   * @param options.domain - Cookie domain
   * @param options.secure - Whether the cookie requires HTTPS
   * @param options.sameSite - SameSite attribute
   * @param options.encrypt - Whether to encrypt the value
   * @example
   * ```typescript
   * // Set a basic cookie
   * StorageUtils.setCookie('theme', 'dark');
   *
   * // Set a secure cookie with expiration
   * StorageUtils.setCookie('token', 'secret', {
   *   expires: 86400000,
   *   secure: true,
   *   sameSite: 'Strict'
   * });
   * ```
   */
  async setCookie(
    name: string,
    value: string,
    options: {
      expires?: number | Date;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: "Strict" | "Lax" | "None";
      encrypt?: boolean;
    } = {}
  ): Promise<void> {
    try {
      const {
        expires,
        path = "/",
        domain,
        secure = false,
        sameSite = "Lax",
        encrypt = false,
      } = options;

      const finalValue = encrypt ? await this.encrypt(value) : value;
      let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
        finalValue
      )}`;

      if (expires) {
        const date =
          expires instanceof Date ? expires : new Date(Date.now() + expires);
        cookie += `; expires=${date.toUTCString()}`;
      }

      if (path) cookie += `; path=${path}`;
      if (domain) cookie += `; domain=${domain}`;
      if (secure) cookie += "; secure";
      if (sameSite) cookie += `; samesite=${sameSite}`;

      document.cookie = cookie;
    } catch (error) {
      console.error("Error setting cookie:", error);
    }
  },

  /**
   * Sets a value in localStorage.
   * @param key - Storage key
   * @param value - Value to store
   * @param options - Storage options
   * @param options.expires - Expiration time in milliseconds
   * @param options.encrypt - Whether to encrypt the value
   * @example
   * ```typescript
   * // Set a basic value
   * StorageUtils.setLocal('user', { id: 1, name: 'John' });
   *
   * // Set an encrypted value with expiration
   * StorageUtils.setLocal('token', 'secret', {
   *   expires: 3600000,
   *   encrypt: true
   * });
   * ```
   */
  async setLocal(
    key: string,
    value: unknown,
    options: {
      expires?: number;
      encrypt?: boolean;
    } = {}
  ): Promise<void> {
    try {
      const { expires, encrypt = false } = options;
      const data = {
        value,
        timestamp: Date.now(),
        expires: expires ? Date.now() + expires : undefined,
      };

      const serialized = JSON.stringify(data);
      const finalValue = encrypt ? await this.encrypt(serialized) : serialized;
      localStorage.setItem(key, finalValue);
    } catch (error) {
      console.error("Error setting localStorage item:", error);
    }
  },

  /**
   * Sets a value in sessionStorage.
   * @param key - Storage key
   * @param value - Value to store
   * @param options - Storage options
   * @param options.expires - Expiration time in milliseconds
   * @param options.encrypt - Whether to encrypt the value
   * @example
   * ```typescript
   * // Set a basic value
   * StorageUtils.setSession('temp', { id: 1 });
   *
   * // Set an encrypted value with expiration
   * StorageUtils.setSession('token', 'secret', {
   *   expires: 3600000,
   *   encrypt: true
   * });
   * ```
   */
  async setSession(
    key: string,
    value: unknown,
    options: {
      expires?: number;
      encrypt?: boolean;
    } = {}
  ): Promise<void> {
    try {
      const { expires, encrypt = false } = options;
      const data = {
        value,
        timestamp: Date.now(),
        expires: expires ? Date.now() + expires : undefined,
      };

      const serialized = JSON.stringify(data);
      const finalValue = encrypt ? await this.encrypt(serialized) : serialized;
      sessionStorage.setItem(key, finalValue);
    } catch (error) {
      console.error("Error setting sessionStorage item:", error);
    }
  },
};
