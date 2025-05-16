import { supabase } from '@/integrations/supabase/client';

// Tipos de métricas
export type MetricType = 
  | 'cache_hit'
  | 'cache_miss'
  | 'cache_error'
  | 'api_request'
  | 'api_error'
  | 'recovery_attempt'
  | 'recovery_success'
  | 'recovery_failure';

// Interface para métricas
export interface Metric {
  type: MetricType;
  timestamp: number;
  value: number;
  metadata?: Record<string, any>;
}

// Interface para métricas de performance
export interface PerformanceMetric extends Metric {
  duration: number;
  operation: string;
}

class MetricsService {
  private static instance: MetricsService;
  private metrics: Metric[] = [];
  private readonly MAX_METRICS = 1000;
  private readonly FLUSH_INTERVAL = 60000; // 1 minuto

  private constructor() {
    // Iniciar flush periódico
    setInterval(() => this.flushMetrics(), this.FLUSH_INTERVAL);
  }

  public static getInstance(): MetricsService {
    if (!MetricsService.instance) {
      MetricsService.instance = new MetricsService();
    }
    return MetricsService.instance;
  }

  // Registrar métrica de cache
  public recordCacheMetric(type: 'hit' | 'miss' | 'error', key: string): void {
    const metricType: MetricType = `cache_${type}` as MetricType;
    this.addMetric({
      type: metricType,
      timestamp: Date.now(),
      value: 1,
      metadata: { key }
    });
  }

  // Registrar métrica de API
  public recordApiMetric(success: boolean, endpoint: string, duration: number): void {
    const metricType: MetricType = success ? 'api_request' : 'api_error';
    this.addMetric({
      type: metricType,
      timestamp: Date.now(),
      value: 1,
      metadata: { endpoint, duration }
    });
  }

  // Registrar métrica de recuperação
  public recordRecoveryMetric(success: boolean, operation: string): void {
    const metricType: MetricType = success ? 'recovery_success' : 'recovery_failure';
    this.addMetric({
      type: metricType,
      timestamp: Date.now(),
      value: 1,
      metadata: { operation }
    });
  }

  // Registrar métrica de performance
  public recordPerformanceMetric(operation: string, duration: number): void {
    this.addMetric({
      type: 'api_request',
      timestamp: Date.now(),
      value: 1,
      metadata: { operation, duration }
    });
  }

  // Adicionar métrica à lista
  private addMetric(metric: Metric): void {
    this.metrics.push(metric);
    
    // Limitar tamanho da lista
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS);
    }
  }

  // Enviar métricas para o servidor
  private async flushMetrics(): Promise<void> {
    if (this.metrics.length === 0) return;

    try {
      const metricsToSend = [...this.metrics];
      this.metrics = [];

      // Agrupar métricas por tipo
      const groupedMetrics = metricsToSend.reduce((acc, metric) => {
        if (!acc[metric.type]) {
          acc[metric.type] = [];
        }
        acc[metric.type].push(metric);
        return acc;
      }, {} as Record<MetricType, Metric[]>);

      // Enviar métricas agrupadas
      for (const [type, metrics] of Object.entries(groupedMetrics)) {
        const { error } = await supabase
          .from('metricas')
          .insert(metrics.map(metric => ({
            tipo: metric.type,
            timestamp: new Date(metric.timestamp).toISOString(),
            valor: metric.value,
            metadata: metric.metadata
          })));

        if (error) {
          console.error('Erro ao enviar métricas:', error);
          // Restaurar métricas que falharam
          this.metrics = [...this.metrics, ...metrics];
        }
      }
    } catch (error) {
      console.error('Erro ao processar métricas:', error);
    }
  }

  // Obter métricas atuais
  public getMetrics(): Metric[] {
    return [...this.metrics];
  }

  // Obter métricas por tipo
  public getMetricsByType(type: MetricType): Metric[] {
    return this.metrics.filter(metric => metric.type === type);
  }

  // Obter métricas de performance
  public getPerformanceMetrics(): PerformanceMetric[] {
    return this.metrics
      .filter(metric => metric.type === 'api_request')
      .map(metric => ({
        ...metric,
        duration: metric.metadata?.duration || 0,
        operation: metric.metadata?.operation || 'unknown'
      }));
  }

  // Limpar métricas
  public clearMetrics(): void {
    this.metrics = [];
  }
}

export const metricsService = MetricsService.getInstance(); 