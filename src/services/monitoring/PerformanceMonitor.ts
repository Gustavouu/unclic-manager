
interface MetricData {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
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

  getMetrics(): MetricData[] {
    return [...this.metrics];
  }

  clearMetrics(): void {
    this.metrics = [];
  }
}
