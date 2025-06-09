
interface CacheMetrics {
  hitRate: number;
  totalHits: number;
  totalMisses: number;
  memoryUsage: number;
  evictions: number;
}

// Cache configuration for different data types
export const CacheKeys = {
  BUSINESS_METRICS: 'business_metrics',
  USER_PERMISSIONS: 'user_permissions',
  DASHBOARD_DATA: 'dashboard_data',
  CLIENTS_LIST: 'clients_list',
  SERVICES_LIST: 'services_list',
  DASHBOARD_METRICS: (businessId: string) => ({ key: `dashboard_metrics_${businessId}`, ttl: 5 * 60 * 1000 }),
  CLIENT_LIST: (businessId: string, filters: string) => ({ key: `client_list_${businessId}_${filters}`, ttl: 2 * 60 * 1000 }),
} as const;

export class RedisService {
  private static instance: RedisService;
  private hits = 0;
  private misses = 0;
  private evictions = 0;
  private memoryUsage = 0;
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  private constructor() {
    // In a real implementation, this would connect to Redis
    console.log('🔴 Redis Service initialized (mock)');
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  public async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    
    if (!item) {
      this.recordMiss();
      return null;
    }

    const now = Date.now();
    const isExpired = now - item.timestamp > item.ttl;

    if (isExpired) {
      this.cache.delete(key);
      this.recordMiss();
      this.recordEviction();
      return null;
    }

    this.recordHit();
    return item.data;
  }

  public async set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): Promise<void> {
    const item = {
      data,
      timestamp: Date.now(),
      ttl
    };

    this.cache.set(key, item);
    this.updateMemoryUsage(this.cache.size * 1024); // Rough estimate
  }

  public getMetrics(): CacheMetrics {
    const total = this.hits + this.misses;
    return {
      hitRate: total > 0 ? (this.hits / total) * 100 : 0,
      totalHits: this.hits,
      totalMisses: this.misses,
      memoryUsage: this.memoryUsage,
      evictions: this.evictions
    };
  }

  public recordHit(): void {
    this.hits++;
  }

  public recordMiss(): void {
    this.misses++;
  }

  public recordEviction(): void {
    this.evictions++;
  }

  public updateMemoryUsage(bytes: number): void {
    this.memoryUsage = bytes;
  }
}
