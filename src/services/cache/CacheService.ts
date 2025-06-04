
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

interface CacheStats {
  totalEntries: number;
  totalHits: number;
  totalMisses: number;
  hitRate: number;
  memoryUsage: number;
}

export class CacheService {
  private static instance: CacheService;
  private cache = new Map<string, CacheEntry<any>>();
  private stats = {
    hits: 0,
    misses: 0
  };

  private constructor() {
    // Limpar cache expirado a cada 5 minutos
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  public set<T>(key: string, data: T, ttl: number = 300000): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      hits: 0
    };

    this.cache.set(key, entry);
  }

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Verificar se expirou
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    entry.hits++;
    this.stats.hits++;
    return entry.data as T;
  }

  public has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) return false;
    
    // Verificar se expirou
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
    this.stats.hits = 0;
    this.stats.misses = 0;
  }

  public invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  public getOrSet<T>(
    key: string, 
    factory: () => Promise<T>, 
    ttl: number = 300000
  ): Promise<T> {
    const cached = this.get<T>(key);
    
    if (cached !== null) {
      return Promise.resolve(cached);
    }

    return factory().then(data => {
      this.set(key, data, ttl);
      return data;
    });
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

  public getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;
    
    // Estimar uso de memória (aproximado)
    const memoryUsage = JSON.stringify([...this.cache.entries()]).length;

    return {
      totalEntries: this.cache.size,
      totalHits: this.stats.hits,
      totalMisses: this.stats.misses,
      hitRate: Math.round(hitRate * 100) / 100,
      memoryUsage
    };
  }

  public getTopEntries(limit: number = 10): Array<{key: string; hits: number; age: number}> {
    const entries: Array<{key: string; hits: number; age: number}> = [];
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      entries.push({
        key,
        hits: entry.hits,
        age: now - entry.timestamp
      });
    }

    return entries
      .sort((a, b) => b.hits - a.hits)
      .slice(0, limit);
  }
}

// Cache keys helper
export const CacheKeys = {
  DASHBOARD_METRICS: (businessId: string) => `dashboard:metrics:${businessId}`,
  CLIENT_LIST: (businessId: string, filters: string) => `clients:list:${businessId}:${filters}`,
  CLIENT_DETAILS: (clientId: string) => `clients:details:${clientId}`,
  APPOINTMENTS_TODAY: (businessId: string) => `appointments:today:${businessId}`,
  BUSINESS_SETTINGS: (businessId: string) => `business:settings:${businessId}`,
  REVENUE_DATA: (businessId: string, period: string) => `revenue:${businessId}:${period}`,
} as const;
