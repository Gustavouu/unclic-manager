
import { QueryClient } from '@tanstack/react-query';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccess: number;
}

export class OptimizedCache {
  private static instance: OptimizedCache;
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize = 1000;
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    // Cleanup every 2 minutes
    setInterval(() => this.cleanup(), 2 * 60 * 1000);
  }

  public static getInstance(): OptimizedCache {
    if (!OptimizedCache.instance) {
      OptimizedCache.instance = new OptimizedCache();
    }
    return OptimizedCache.instance;
  }

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      accessCount: 0,
      lastAccess: Date.now()
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update access info
    entry.accessCount++;
    entry.lastAccess = Date.now();

    return entry.data as T;
  }

  invalidate(pattern: string): void {
    const regex = new RegExp(pattern);
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  private evictLRU(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccess < oldestTime) {
        oldestTime = entry.lastAccess;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        accessCount: entry.accessCount,
        age: Date.now() - entry.timestamp
      }))
    };
  }
}

// Cache keys para queries específicas
export const CacheKeys = {
  CLIENTS: (businessId: string) => `clients:${businessId}`,
  CLIENT: (clientId: string) => `client:${clientId}`,
  APPOINTMENTS: (businessId: string, date?: string) => 
    `appointments:${businessId}${date ? `:${date}` : ''}`,
  SERVICES: (businessId: string) => `services:${businessId}`,
  EMPLOYEES: (businessId: string) => `employees:${businessId}`,
  DASHBOARD_METRICS: (businessId: string) => `dashboard:${businessId}`,
} as const;
