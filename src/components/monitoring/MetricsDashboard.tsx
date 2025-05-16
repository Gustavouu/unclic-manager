import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { metricsService, type Metric, type MetricType } from '@/services/monitoring/MetricsService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricSummary {
  type: MetricType;
  count: number;
  successRate: number;
  avgDuration?: number;
}

export const MetricsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [summary, setSummary] = useState<MetricSummary[]>([]);
  const [selectedType, setSelectedType] = useState<MetricType>('api_request');

  useEffect(() => {
    const fetchMetrics = () => {
      const currentMetrics = metricsService.getMetrics();
      setMetrics(currentMetrics);
      
      // Calcular resumo
      const summaryMap = new Map<MetricType, MetricSummary>();
      
      currentMetrics.forEach(metric => {
        if (!summaryMap.has(metric.type)) {
          summaryMap.set(metric.type, {
            type: metric.type,
            count: 0,
            successRate: 0,
            avgDuration: 0
          });
        }
        
        const summary = summaryMap.get(metric.type)!;
        summary.count++;
        
        if (metric.type === 'api_request' || metric.type === 'api_error') {
          const duration = metric.metadata?.duration || 0;
          summary.avgDuration = ((summary.avgDuration || 0) * (summary.count - 1) + duration) / summary.count;
        }
        
        if (metric.type === 'api_request') {
          summary.successRate = (summary.successRate * (summary.count - 1) + 1) / summary.count;
        } else if (metric.type === 'api_error') {
          summary.successRate = (summary.successRate * (summary.count - 1)) / summary.count;
        }
      });
      
      setSummary(Array.from(summaryMap.values()));
    };

    // Atualizar métricas a cada 5 segundos
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);

    return () => clearInterval(interval);
  }, []);

  const getChartData = () => {
    const filteredMetrics = metrics.filter(m => m.type === selectedType);
    const timeMap = new Map<number, number>();
    
    filteredMetrics.forEach(metric => {
      const time = Math.floor(metric.timestamp / 1000) * 1000; // Arredondar para o segundo mais próximo
      timeMap.set(time, (timeMap.get(time) || 0) + metric.value);
    });
    
    return Array.from(timeMap.entries())
      .map(([time, value]) => ({ time: new Date(time).toLocaleTimeString(), value }))
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dashboard de Métricas</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summary.map(item => (
          <Card key={item.type}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.type.replace('_', ' ').toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.count}</div>
              {item.avgDuration !== undefined && (
                <p className="text-xs text-muted-foreground">
                  Duração média: {item.avgDuration.toFixed(2)}ms
                </p>
              )}
              {item.successRate !== undefined && (
                <p className="text-xs text-muted-foreground">
                  Taxa de sucesso: {(item.successRate * 100).toFixed(1)}%
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gráfico de Métricas</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={selectedType} onValueChange={(value) => setSelectedType(value as MetricType)}>
            <TabsList>
              <TabsTrigger value="api_request">Requisições API</TabsTrigger>
              <TabsTrigger value="cache_hit">Cache Hits</TabsTrigger>
              <TabsTrigger value="cache_miss">Cache Misses</TabsTrigger>
              <TabsTrigger value="recovery_attempt">Tentativas de Recuperação</TabsTrigger>
            </TabsList>
            <TabsContent value={selectedType}>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}; 