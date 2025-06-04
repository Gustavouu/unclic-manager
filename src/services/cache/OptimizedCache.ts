
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class OptimizedCache {
  private static instance: OptimizedCache;
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize = 1000;

  private constructor() {}

  public static getInstance(): OptimizedCache {
    if (!OptimizedCache.instance) {
      OptimizedCache.instance = new OptimizedCache();
    }
    return OptimizedCache.instance;
  }

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // Check cache size and clear old entries if needed
    if (this.cache.size >= this.maxSize) {
      this.clearExpired();
      
      // If still over limit, remove oldest entries
      if (this.cache.size >= this.maxSize) {
        const entries = Array.from(this.cache.entries());
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
        const toRemove = entries.slice(0, Math.floor(this.maxSize / 4));
        toRemove.forEach(([key]) => this.cache.delete(key));
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  invalidate(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  private clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  getSize(): number {
    return this.cache.size;
  }
}

export const CacheKeys = {
  CLIENTS: (businessId: string) => `clients:${businessId}`,
  CLIENT: (clientId: string) => `client:${clientId}`,
  APPOINTMENTS: (businessId: string, date?: string) => `appointments:${businessId}${date ? `:${date}` : ''}`,
  SERVICES: (businessId: string) => `services:${businessId}`,
  EMPLOYEES: (businessId: string) => `employees:${businessId}`,
  DASHBOARD_METRICS: (businessId: string) => `dashboard:${businessId}`,
};
