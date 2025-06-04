
interface MetricData {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface PerformanceReport {
  summary: {
    avgResponseTime: number;
    p95ResponseTime: number;
    totalQueries: number;
    errorRate: number;
  };
  criticalMetrics: MetricData[];
  slowQueries: Array<{
    query: string;
    duration: number;
    timestamp: number;
  }>;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: MetricData[] = [];
  private maxMetrics = 100; // Limitar o número de métricas armazenadas

  private constructor() {}

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  trackMetric(name: string, value: number, metadata?: Record<string, any>): void {
    // Adicionar métrica
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
      metadata
    });

    // Manter apenas as métricas mais recentes
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${value}`, metadata);
    }
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      this.trackMetric(`${name}_duration`, duration);
      this.trackMetric(`${name}_success`, 1);
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.trackMetric(`${name}_duration`, duration);
      this.trackMetric(`${name}_error`, 1);
      throw error;
    }
  }

  trackQuery(tableName: string, duration: number, success: boolean, error?: string): void {
    this.trackMetric(`query_${tableName}_duration`, duration);
    this.trackMetric(`query_${tableName}_${success ? 'success' : 'error'}`, 1);
    
    if (error && process.env.NODE_ENV === 'development') {
      console.error(`[Query Error] ${tableName}:`, error);
    }
  }

  generateReport(): PerformanceReport {
    const now = Date.now();
    const recentMetrics = this.metrics.filter(m => now - m.timestamp < 5 * 60 * 1000); // Last 5 minutes

    // Calculate average response time
    const durationMetrics = recentMetrics.filter(m => m.name.includes('_duration'));
    const avgResponseTime = durationMetrics.length > 0 
      ? durationMetrics.reduce((sum, m) => sum + m.value, 0) / durationMetrics.length 
      : 0;

    // Calculate P95 response time
    const sortedDurations = durationMetrics.map(m => m.value).sort((a, b) => a - b);
    const p95Index = Math.floor(sortedDurations.length * 0.95);
    const p95ResponseTime = sortedDurations[p95Index] || 0;

    // Find critical metrics (> 1000ms)
    const criticalMetrics = durationMetrics.filter(m => m.value > 1000);

    // Find slow queries
    const slowQueries = durationMetrics
      .filter(m => m.value > 500 && m.name.includes('query_'))
      .map(m => ({
        query: m.name.replace('_duration', ''),
        duration: m.value,
        timestamp: m.timestamp
      }))
      .slice(0, 10);

    // Calculate error rate
    const successMetrics = recentMetrics.filter(m => m.name.includes('_success'));
    const errorMetrics = recentMetrics.filter(m => m.name.includes('_error'));
    const totalRequests = successMetrics.length + errorMetrics.length;
    const errorRate = totalRequests > 0 ? (errorMetrics.length / totalRequests) * 100 : 0;

    return {
      summary: {
        avgResponseTime,
        p95ResponseTime,
        totalQueries: durationMetrics.length,
        errorRate
      },
      criticalMetrics,
      slowQueries
    };
  }

  getMetrics(): MetricData[] {
    return [...this.metrics];
  }

  clearMetrics(): void {
    this.metrics = [];
  }
}
