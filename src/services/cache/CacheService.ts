
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheStats {
  totalHits: number;
  totalMisses: number;
  hitRate: number;
  memoryUsage: number;
  totalEntries: number;
}

export class CacheService {
  private static instance: CacheService;
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize = 500; // Reduzido para evitar problemas de memória
  private hits = 0;
  private misses = 0;

  private constructor() {}

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // Limpar entradas expiradas primeiro
    this.clearExpired();
    
    // Se ainda estiver no limite, remover entradas mais antigas
    if (this.cache.size >= this.maxSize) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const toRemove = entries.slice(0, Math.floor(this.maxSize / 4));
      toRemove.forEach(([key]) => this.cache.delete(key));
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.misses++;
      return null;
    }
    
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }
    
    this.hits++;
    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  getStats(): CacheStats {
    const totalRequests = this.hits + this.misses;
    const hitRate = totalRequests > 0 ? (this.hits / totalRequests) * 100 : 0;
    
    // Estimate memory usage (rough calculation)
    const memoryUsage = JSON.stringify(Array.from(this.cache.entries())).length;
    
    return {
      totalHits: this.hits,
      totalMisses: this.misses,
      hitRate,
      memoryUsage,
      totalEntries: this.cache.size
    };
  }

  private clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const CacheKeys = {
  DASHBOARD_METRICS: (businessId: string) => `dashboard_metrics:${businessId}`,
  CLIENT: (clientId: string) => `client:${clientId}`,
  APPOINTMENTS: (businessId: string, date?: string) => `appointments:${businessId}${date ? `:${date}` : ''}`,
  SERVICES: (businessId: string) => `services:${businessId}`,
};
