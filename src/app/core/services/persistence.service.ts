import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

/**
 * Configuration interface for storage operations.
 * @template T Type of data being stored
 */
interface StorageConfig<T> {
  storage?: Storage;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}

/**
 * Service for type-safe persistence operations with Storage (localStorage/sessionStorage).
 * Handles serialization, deserialization and error handling.
 */
@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private get defaultConfig(): StorageConfig<unknown> {
    return {
      storage: this.isBrowser ? localStorage : undefined,
      serialize: JSON.stringify,
      deserialize: JSON.parse,
    };
  }

  /**
   * Saves data to storage with type safety.
   * @template K Key type from storage schema
   * @template T Storage schema type
   * @param key Storage key
   * @param data Data to persist
   * @param config Optional storage configuration
   * @throws Error if persistence fails
   */
  save<K extends keyof T, T>(key: K, data: T[K], config?: Partial<StorageConfig<T[K]>>): void {
    if (!this.isBrowser) {
      console.warn('Storage operations are not available on the server');
      return;
    }

    try {
      const { storage, serialize } = { ...this.defaultConfig, ...config };

      if (!storage) {
        console.warn('Storage is not available');
        return;
      }

      const serializedData = serialize!(data);
      storage.setItem(String(key), serializedData);
    } catch (error) {
      console.error(`Error persisting data for key "${String(key)}":`, error);
      throw new Error(`Failed to persist data for key "${String(key)}"`);
    }
  }

  /**
   * Loads data from storage with type safety.
   * @template K Key type from storage schema
   * @template T Storage schema type
   * @param key Storage key
   * @param config Optional storage configuration
   * @returns Stored data or null if not found
   * @throws Error if loading fails
   */
  load<K extends keyof T, T>(key: K, config?: Partial<StorageConfig<T[K]>>): T[K] | null {
    if (!this.isBrowser) {
      return null;
    }

    try {
      const { storage, deserialize } = { ...this.defaultConfig, ...config };

      if (!storage) {
        return null;
      }

      const data = storage.getItem(key as string);
      return data ? (deserialize!(data) as T[K]) : null;
    } catch (error) {
      console.error(`Error loading data for key "${String(key)}":`, error);
      throw new Error(`Failed to load data for key "${String(key)}"`);
    }
  }

  /**
   * Removes data from storage.
   * @template K Key type from storage schema
   * @template T Storage schema type
   * @param key Storage key
   * @param config Optional storage configuration
   * @throws Error if removal fails
   */
  remove<K extends keyof T, T>(key: K, config?: Pick<StorageConfig<unknown>, 'storage'>): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      const { storage } = { ...this.defaultConfig, ...config };

      if (!storage) {
        return;
      }

      storage.removeItem(key as string);
    } catch (error) {
      console.error(`Error removing data for key "${String(key)}":`, error);
      throw new Error(`Failed to remove data for key "${String(key)}"`);
    }
  }

  /**
   * Checks if key exists in storage.
   * @template K Key type from storage schema
   * @template T Storage schema type
   * @param key Storage key
   * @param config Optional storage configuration
   * @returns true if key exists, false otherwise
   * @throws Error if check fails
   */
  has<K extends keyof T, T>(key: K, config?: Pick<StorageConfig<unknown>, 'storage'>): boolean {
    if (!this.isBrowser) {
      return false;
    }

    try {
      const { storage } = { ...this.defaultConfig, ...config };

      if (!storage) {
        return false;
      }

      return storage.getItem(key as string) !== null;
    } catch (error) {
      console.error(`Error checking data for key "${String(key)}":`, error);
      throw new Error(`Failed to check data for key "${String(key)}"`);
    }
  }
}
