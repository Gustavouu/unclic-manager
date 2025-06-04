
interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface QueryPerformance {
  query: string;
  duration: number;
  timestamp: number;
  success: boolean;
  error?: string;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private queryMetrics: QueryPerformance[] = [];
  private readonly MAX_METRICS = 1000;

  private constructor() {}

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public trackMetric(name: string, value: number, metadata?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      metadata
    };

    this.metrics.push(metric);
    
    // Manter apenas as últimas métricas
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS);
    }

    // Log métricas críticas
    if (this.isCriticalMetric(name, value)) {
      console.warn(`Critical performance metric: ${name} = ${value}`, metadata);
    }
  }

  public trackQuery(query: string, duration: number, success: boolean, error?: string): void {
    const queryMetric: QueryPerformance = {
      query,
      duration,
      timestamp: Date.now(),
      success,
      error
    };

    this.queryMetrics.push(queryMetric);
    
    if (this.queryMetrics.length > this.MAX_METRICS) {
      this.queryMetrics = this.queryMetrics.slice(-this.MAX_METRICS);
    }

    // Alertar sobre queries lentas
    if (duration > 1000) {
      console.warn(`Slow query detected: ${duration}ms`, { query, error });
    }
  }

  public measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    
    return fn()
      .then(result => {
        const duration = performance.now() - startTime;
        this.trackMetric(`${name}_duration`, duration);
        this.trackMetric(`${name}_success`, 1);
        return result;
      })
      .catch(error => {
        const duration = performance.now() - startTime;
        this.trackMetric(`${name}_duration`, duration);
        this.trackMetric(`${name}_error`, 1);
        throw error;
      });
  }

  public getMetrics(name?: string, timeRange?: { start: number; end: number }): PerformanceMetric[] {
    let filtered = this.metrics;

    if (name) {
      filtered = filtered.filter(m => m.name === name);
    }

    if (timeRange) {
      filtered = filtered.filter(m => 
        m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
      );
    }

    return filtered;
  }

  public getQueryMetrics(timeRange?: { start: number; end: number }): QueryPerformance[] {
    let filtered = this.queryMetrics;

    if (timeRange) {
      filtered = filtered.filter(m => 
        m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
      );
    }

    return filtered;
  }

  public getAverageMetric(name: string, timeRange?: { start: number; end: number }): number {
    const metrics = this.getMetrics(name, timeRange);
    if (metrics.length === 0) return 0;
    
    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return sum / metrics.length;
  }

  public getPercentile(name: string, percentile: number, timeRange?: { start: number; end: number }): number {
    const metrics = this.getMetrics(name, timeRange);
    if (metrics.length === 0) return 0;

    const sorted = metrics.map(m => m.value).sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  private isCriticalMetric(name: string, value: number): boolean {
    const thresholds: Record<string, number> = {
      'memory_usage': 80, // 80% usage
      'cpu_usage': 90,    // 90% usage
      'error_rate': 5,    // 5% error rate
      'response_time': 2000, // 2 seconds
    };

    return thresholds[name] && value > thresholds[name];
  }

  public generateReport(): {
    summary: Record<string, any>;
    slowQueries: QueryPerformance[];
    criticalMetrics: PerformanceMetric[];
  } {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    const timeRange = { start: oneHourAgo, end: now };

    const avgResponseTime = this.getAverageMetric('response_time', timeRange);
    const p95ResponseTime = this.getPercentile('response_time', 95, timeRange);
    const errorRate = this.getAverageMetric('error_rate', timeRange);

    const slowQueries = this.queryMetrics
      .filter(q => q.duration > 500)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);

    const criticalMetrics = this.metrics.filter(m => 
      this.isCriticalMetric(m.name, m.value) && 
      m.timestamp >= oneHourAgo
    );

    return {
      summary: {
        avgResponseTime,
        p95ResponseTime,
        errorRate,
        totalQueries: this.queryMetrics.length,
        slowQueriesCount: slowQueries.length,
        criticalAlertsCount: criticalMetrics.length
      },
      slowQueries,
      criticalMetrics
    };
  }
}
