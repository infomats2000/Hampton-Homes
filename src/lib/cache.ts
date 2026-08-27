/**
 * High-Performance In-Memory Cache with TTL and Key-Based Invalidation
 * Used to eliminate repetitive database roundtrips for subscription tiers,
 * feature flags, quotas, and public agency settings.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();

  /**
   * Retrieves an item from cache if it exists and hasn't expired.
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Sets an item in cache with a Time-To-Live (TTL) in milliseconds.
   */
  set<T>(key: string, value: T, ttlMs: number = 30000): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Fetches from cache or executes fallback query and caches the result.
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs: number = 30000
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const fresh = await fetcher();
    this.set(key, fresh, ttlMs);
    return fresh;
  }

  /**
   * Invalidates a specific key or keys matching a prefix.
   */
  invalidate(keyOrPrefix: string): void {
    if (this.store.has(keyOrPrefix)) {
      this.store.delete(keyOrPrefix);
      return;
    }

    for (const key of this.store.keys()) {
      if (key.startsWith(keyOrPrefix)) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Clears the entire cache store.
   */
  clear(): void {
    this.store.clear();
  }
}

const globalForCache = globalThis as unknown as { appCache?: MemoryCache };

export const cache = globalForCache.appCache ?? new MemoryCache();

if (!globalForCache.appCache) {
  globalForCache.appCache = cache;
}

export default cache;
