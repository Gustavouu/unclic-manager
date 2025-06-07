
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Activity, Database, Zap, RefreshCw, TrendingUp, Clock } from 'lucide-react';
import { RedisService } from '@/services/cache/RedisService';
import { PerformanceMonitor } from '@/services/monitoring/PerformanceMonitor';

interface PerformanceStats {
  cacheMetrics: {
    hitRate: number;
    totalHits: number;
    totalMisses: number;
    memoryUsage: number;
    evictions: number;
  };
  performanceMetrics: {
    avgResponseTime: number;
    p95ResponseTime: number;
    slowQueries: number;
    errorRate: number;
  };
  systemHealth: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkLatency: number;
  };
}

export const PerformanceWidget: React.FC = () => {
  const [stats, setStats] = useState<PerformanceStats>({
    cacheMetrics: {
      hitRate: 0,
      totalHits: 0,
      totalMisses: 0,
      memoryUsage: 0,
      evictions: 0
    },
    performanceMetrics: {
      avgResponseTime: 0,
      p95ResponseTime: 0,
      slowQueries: 0,
      errorRate: 0
    },
    systemHealth: {
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
      networkLatency: 0
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const redis = RedisService.getInstance();
  const monitor = PerformanceMonitor.getInstance();

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const cacheMetrics = redis.getMetrics();
      const performanceReport = monitor.generateReport();

      // Simulate system health metrics (in production, get from actual monitoring)
      const systemHealth = {
        cpuUsage: Math.random() * 30 + 10, // 10-40%
        memoryUsage: Math.random() * 40 + 30, // 30-70%
        diskUsage: Math.random() * 20 + 20, // 20-40%
        networkLatency: Math.random() * 50 + 10 // 10-60ms
      };

      setStats({
        cacheMetrics: {
          hitRate: cacheMetrics.hitRate,
          totalHits: cacheMetrics.totalHits,
          totalMisses: cacheMetrics.totalMisses,
          memoryUsage: cacheMetrics.memoryUsage,
          evictions: cacheMetrics.evictions
        },
        performanceMetrics: {
          avgResponseTime: performanceReport.summary.avgResponseTime || 0,
          p95ResponseTime: performanceReport.summary.p95ResponseTime || 0,
          slowQueries: performanceReport.slowQueries.length,
          errorRate: performanceReport.summary.errorRate || 0
        },
        systemHealth
      });
    } catch (error) {
      console.error('Error loading performance stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'bg-green-500';
    if (value <= thresholds.warning) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Monitor
          </CardTitle>
          <CardDescription>
            Sistema de cache e métricas de performance em tempo real
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadStats}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="cache" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cache">Cache</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
          </TabsList>

          <TabsContent value="cache" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Hit Rate</span>
                </div>
                <div className="text-2xl font-bold">
                  {stats.cacheMetrics.hitRate.toFixed(1)}%
                </div>
                <Progress 
                  value={stats.cacheMetrics.hitRate} 
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Cache Hits</span>
                </div>
                <div className="text-2xl font-bold">
                  {stats.cacheMetrics.totalHits.toLocaleString()}
                </div>
                <Badge variant="secondary">
                  {stats.cacheMetrics.totalMisses} misses
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Memória</span>
                </div>
                <div className="text-2xl font-bold">
                  {formatBytes(stats.cacheMetrics.memoryUsage)}
                </div>
                <Badge variant="outline">
                  {stats.cacheMetrics.evictions} evictions
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <Badge 
                  variant={stats.cacheMetrics.hitRate > 80 ? "default" : "secondary"}
                  className="text-sm"
                >
                  {stats.cacheMetrics.hitRate > 80 ? 'Excelente' : 
                   stats.cacheMetrics.hitRate > 60 ? 'Bom' : 'Baixo'}
                </Badge>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Tempo Médio</span>
                </div>
                <div className="text-2xl font-bold">
                  {stats.performanceMetrics.avgResponseTime.toFixed(0)}ms
                </div>
                <Badge 
                  variant={stats.performanceMetrics.avgResponseTime < 500 ? "default" : "destructive"}
                >
                  {stats.performanceMetrics.avgResponseTime < 500 ? 'Rápido' : 'Lento'}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">P95</span>
                </div>
                <div className="text-2xl font-bold">
                  {stats.performanceMetrics.p95ResponseTime.toFixed(0)}ms
                </div>
                <span className="text-xs text-muted-foreground">
                  95% das requests
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Queries Lentas</span>
                </div>
                <div className="text-2xl font-bold">
                  {stats.performanceMetrics.slowQueries}
                </div>
                <Badge variant="outline">
                  Última hora
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Taxa de Erro</span>
                </div>
                <div className="text-2xl font-bold">
                  {stats.performanceMetrics.errorRate.toFixed(2)}%
                </div>
                <Badge 
                  variant={stats.performanceMetrics.errorRate < 1 ? "default" : "destructive"}
                >
                  {stats.performanceMetrics.errorRate < 1 ? 'Saudável' : 'Atenção'}
                </Badge>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">CPU Usage</span>
                  <span className="text-sm">{stats.systemHealth.cpuUsage.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={stats.systemHealth.cpuUsage}
                  className={`h-2 ${getHealthColor(stats.systemHealth.cpuUsage, { good: 50, warning: 80 })}`}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Memory Usage</span>
                  <span className="text-sm">{stats.systemHealth.memoryUsage.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={stats.systemHealth.memoryUsage}
                  className={`h-2 ${getHealthColor(stats.systemHealth.memoryUsage, { good: 60, warning: 85 })}`}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Disk Usage</span>
                  <span className="text-sm">{stats.systemHealth.diskUsage.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={stats.systemHealth.diskUsage}
                  className={`h-2 ${getHealthColor(stats.systemHealth.diskUsage, { good: 70, warning: 90 })}`}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Network Latency</span>
                  <span className="text-sm">{stats.systemHealth.networkLatency.toFixed(0)}ms</span>
                </div>
                <Progress 
                  value={(stats.systemHealth.networkLatency / 100) * 100}
                  className={`h-2 ${getHealthColor(stats.systemHealth.networkLatency, { good: 30, warning: 100 })}`}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
