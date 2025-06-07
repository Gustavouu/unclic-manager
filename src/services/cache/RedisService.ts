
interface CacheConfig {
  defaultTTL: number;
  maxMemoryUsage: number;
  compressionEnabled: boolean;
}

interface CacheMetrics {
  hits: number;
  misses: number;
  evictions: number;
  memoryUsage: number;
  hitRate: number;
  totalHits: number;
  totalMisses: number;
}

export class RedisService {
  private static instance: RedisService;
  private cache = new Map<string, { data: any; expiry: number; size: number }>();
  private metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    evictions: 0,
    memoryUsage: 0,
    hitRate: 0,
    totalHits: 0,
    totalMisses: 0
  };
  
  private config: CacheConfig = {
    defaultTTL: 300000, // 5 minutes
    maxMemoryUsage: 50 * 1024 * 1024, // 50MB
    compressionEnabled: true
  };

  private constructor() {
    // Cleanup expired keys every minute
    setInterval(() => this.cleanup(), 60000);
    
    // Memory pressure check every 30 seconds
    setInterval(() => this.checkMemoryPressure(), 30000);
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  public async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const expiry = Date.now() + (ttl || this.config.defaultTTL);
    const serialized = this.serialize(value);
    const size = this.calculateSize(serialized);

    // Check memory pressure before adding
    if (this.metrics.memoryUsage + size > this.config.maxMemoryUsage) {
      await this.evictLRU();
    }

    this.cache.set(key, { data: serialized, expiry, size });
    this.metrics.memoryUsage += size;
  }

  public async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.metrics.misses++;
      this.metrics.totalMisses++;
      this.updateHitRate();
      return null;
    }

    if (Date.now() > entry.expiry) {
      this.delete(key);
      this.metrics.misses++;
      this.metrics.totalMisses++;
      this.updateHitRate();
      return null;
    }

    this.metrics.hits++;
    this.metrics.totalHits++;
    this.updateHitRate();
    return this.deserialize<T>(entry.data);
  }

  public async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = await this.get<T>(key);
    
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }

  public async mget<T>(keys: string[]): Promise<Array<T | null>> {
    return Promise.all(keys.map(key => this.get<T>(key)));
  }

  public async mset<T>(entries: Array<{ key: string; value: T; ttl?: number }>): Promise<void> {
    await Promise.all(entries.map(({ key, value, ttl }) => this.set(key, value, ttl)));
  }

  public delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.metrics.memoryUsage -= entry.size;
      return this.cache.delete(key);
    }
    return false;
  }

  public async flush(): Promise<void> {
    this.cache.clear();
    this.metrics.memoryUsage = 0;
    this.metrics.evictions = 0;
  }

  public async keys(pattern?: string): Promise<string[]> {
    const allKeys = Array.from(this.cache.keys());
    
    if (!pattern) {
      return allKeys;
    }

    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return allKeys.filter(key => regex.test(key));
  }

  public getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  private serialize(value: any): string {
    const json = JSON.stringify(value);
    
    if (this.config.compressionEnabled && json.length > 1000) {
      // Simulate compression (in production, use actual compression)
      return `COMPRESSED:${json}`;
    }
    
    return json;
  }

  private deserialize<T>(data: string): T {
    if (data.startsWith('COMPRESSED:')) {
      // Simulate decompression
      data = data.slice(11);
    }
    
    return JSON.parse(data);
  }

  private calculateSize(data: string): number {
    return new Blob([data]).size;
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => {
      const entry = this.cache.get(key);
      if (entry) {
        this.metrics.memoryUsage -= entry.size;
        this.cache.delete(key);
      }
    });
  }

  private async evictLRU(): Promise<void> {
    // Simple LRU: remove oldest entries until we're under memory limit
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].expiry - b[1].expiry);

    let freedMemory = 0;
    const targetMemory = this.config.maxMemoryUsage * 0.8; // Free to 80% capacity

    for (const [key, entry] of entries) {
      this.cache.delete(key);
      freedMemory += entry.size;
      this.metrics.memoryUsage -= entry.size;
      this.metrics.evictions++;

      if (this.metrics.memoryUsage <= targetMemory) {
        break;
      }
    }
  }

  private checkMemoryPressure(): void {
    const usagePercent = (this.metrics.memoryUsage / this.config.maxMemoryUsage) * 100;
    
    if (usagePercent > 90) {
      console.warn(`Cache memory usage high: ${usagePercent.toFixed(1)}%`);
      this.evictLRU();
    }
  }

  private updateHitRate(): void {
    const total = this.metrics.hits + this.metrics.misses;
    this.metrics.hitRate = total > 0 ? (this.metrics.hits / total) * 100 : 0;
  }
}

// Cache key builders with TTL suggestions
export const CacheKeys = {
  // Dashboard data (5 minutes)
  DASHBOARD_METRICS: (businessId: string) => ({
    key: `dashboard:metrics:${businessId}`,
    ttl: 5 * 60 * 1000
  }),
  
  // User sessions (1 hour)
  USER_SESSION: (userId: string) => ({
    key: `session:${userId}`,
    ttl: 60 * 60 * 1000
  }),
  
  // Business settings (30 minutes)
  BUSINESS_SETTINGS: (businessId: string) => ({
    key: `business:settings:${businessId}`,
    ttl: 30 * 60 * 1000
  }),
  
  // Appointments today (2 minutes - frequent updates)
  APPOINTMENTS_TODAY: (businessId: string) => ({
    key: `appointments:today:${businessId}`,
    ttl: 2 * 60 * 1000
  }),
  
  // Client list with filters (10 minutes)
  CLIENT_LIST: (businessId: string, filters: string) => ({
    key: `clients:list:${businessId}:${btoa(filters)}`,
    ttl: 10 * 60 * 1000
  }),
  
  // Revenue reports (15 minutes)
  REVENUE_REPORT: (businessId: string, period: string) => ({
    key: `revenue:${businessId}:${period}`,
    ttl: 15 * 60 * 1000
  })
} as const;
