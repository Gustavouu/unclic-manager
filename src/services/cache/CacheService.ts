
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class CacheService {
  private static instance: CacheService;
  private cache = new Map<string, CacheItem<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes
  private isProduction = import.meta.env.PROD;

  private constructor() {
    // Clean expired items every minute
    setInterval(() => this.cleanExpired(), 60000);
    
    if (!this.isProduction) {
      console.log('💾 Cache Service initialized');
    }
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  public set<T>(key: string, data: T, ttl?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    };

    this.cache.set(key, item);

    if (!this.isProduction) {
      console.log(`💾 Cached: ${key} (TTL: ${item.ttl}ms)`);
    }
  }

  public get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    const now = Date.now();
    const isExpired = now - item.timestamp > item.ttl;

    if (isExpired) {
      this.cache.delete(key);
      if (!this.isProduction) {
        console.log(`💾 Cache expired: ${key}`);
      }
      return null;
    }

    if (!this.isProduction) {
      console.log(`💾 Cache hit: ${key}`);
    }

    return item.data;
  }

  public invalidate(key: string): boolean {
    const deleted = this.cache.delete(key);
    
    if (deleted && !this.isProduction) {
      console.log(`💾 Cache invalidated: ${key}`);
    }

    return deleted;
  }

  public invalidatePattern(pattern: string): number {
    let count = 0;
    const regex = new RegExp(pattern);

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }

    if (count > 0 && !this.isProduction) {
      console.log(`💾 Invalidated ${count} cache entries matching: ${pattern}`);
    }

    return count;
  }

  public clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    
    if (!this.isProduction) {
      console.log(`💾 Cache cleared: ${size} items removed`);
    }
  }

  public getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  private cleanExpired(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0 && !this.isProduction) {
      console.log(`💾 Cleaned ${cleaned} expired cache entries`);
    }
  }

  // Helper method for caching async operations
  public async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    
    if (cached !== null) {
      return cached;
    }

    const data = await factory();
    this.set(key, data, ttl);
    return data;
  }
}
