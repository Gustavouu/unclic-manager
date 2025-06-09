export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 1000;
  private isProduction = import.meta.env.PROD;

  private constructor() {
    if (!this.isProduction) {
      console.log('🔍 Performance Monitor initialized');
    }
  }

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
      timestamp: new Date(),
      metadata
    };

    this.metrics.push(metric);

    // Keep metrics array size manageable
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log in development, send to monitoring service in production
    if (this.isProduction) {
      this.sendToMonitoringService(metric);
    } else {
      console.log(`📊 Metric: ${name} = ${value}`, metadata);
    }
  }

  public getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter(m => m.name === name);
    }
    return [...this.metrics];
  }

  public getAverageMetric(name: string, timeWindowMs: number = 300000): number {
    const cutoff = new Date(Date.now() - timeWindowMs);
    const relevantMetrics = this.metrics.filter(
      m => m.name === name && m.timestamp >= cutoff
    );

    if (relevantMetrics.length === 0) return 0;

    const sum = relevantMetrics.reduce((acc, m) => acc + m.value, 0);
    return sum / relevantMetrics.length;
  }

  public clearMetrics(): void {
    this.metrics = [];
  }

  private sendToMonitoringService(metric: PerformanceMetric): void {
    // In production, this would send to a real monitoring service
    // For now, we'll just log it
    console.log('📈 Production Metric:', metric);
  }

  public trackPageLoad(pageName: string): void {
    const loadTime = performance.timing?.loadEventEnd - performance.timing?.navigationStart;
    if (loadTime > 0) {
      this.trackMetric('page_load_time', loadTime, { page: pageName });
    }
  }

  public trackApiCall(endpoint: string, duration: number, success: boolean): void {
    this.trackMetric('api_call_duration', duration, { 
      endpoint, 
      success,
      status: success ? 'success' : 'error'
    });
  }

  public trackUserAction(action: string, duration?: number): void {
    this.trackMetric('user_action', duration || 1, { action });
  }
}
