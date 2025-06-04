
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PerformanceMonitor } from '@/services/monitoring/PerformanceMonitor';
import { CacheService } from '@/services/cache/CacheService';
import { Activity, Database, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

export const PerformanceMonitorWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [report, setReport] = useState<any>(null);

  const monitor = PerformanceMonitor.getInstance();
  const cache = CacheService.getInstance();

  useEffect(() => {
    if (!isOpen) return;

    const updateStats = () => {
      const performanceReport = monitor.generateReport();
      const cacheStatistics = cache.getStats();

      setReport(performanceReport);
      setCacheStats(cacheStatistics);

      // Métricas do navegador
      if ('memory' in performance) {
        const memoryInfo = (performance as any).memory;
        setMetrics({
          usedJSHeapSize: memoryInfo.usedJSHeapSize,
          totalJSHeapSize: memoryInfo.totalJSHeapSize,
          memoryUsage: (memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100
        });
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 2000);

    return () => clearInterval(interval);
  }, [isOpen, monitor, cache]);

  const formatBytes = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const formatMs = (ms: number) => {
    return ms.toFixed(0) + 'ms';
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="sm"
          variant="outline"
          className="rounded-full p-2"
        >
          <Activity className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Performance Monitor</CardTitle>
            <div className="flex gap-1">
              <Button
                onClick={() => {
                  setReport(monitor.generateReport());
                  setCacheStats(cache.getStats());
                }}
                size="sm"
                variant="ghost"
                className="p-1"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                size="sm"
                variant="ghost"
                className="p-1"
              >
                ×
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          {/* Performance Summary */}
          {report && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span className="font-medium">Response Times</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-xs text-gray-600">Avg</div>
                  <div className="font-mono">{formatMs(report.summary.avgResponseTime)}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-xs text-gray-600">P95</div>
                  <div className="font-mono">{formatMs(report.summary.p95ResponseTime)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Cache Stats */}
          {cacheStats && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Database className="h-3 w-3" />
                <span className="font-medium">Cache</span>
                <Badge variant="secondary" className="text-xs">
                  {cacheStats.hitRate.toFixed(1)}% hit rate
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-50 p-2 rounded">
                  <div className="text-xs text-green-600">Hits</div>
                  <div className="font-mono text-green-700">{cacheStats.totalHits}</div>
                </div>
                <div className="bg-red-50 p-2 rounded">
                  <div className="text-xs text-red-600">Misses</div>
                  <div className="font-mono text-red-700">{cacheStats.totalMisses}</div>
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-600">Memory</div>
                <div className="font-mono">{formatBytes(cacheStats.memoryUsage)}</div>
              </div>
            </div>
          )}

          {/* Memory Usage */}
          {metrics && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-3 w-3" />
                <span className="font-medium">Memory</span>
                <Badge 
                  variant={metrics.memoryUsage > 80 ? "destructive" : "secondary"} 
                  className="text-xs"
                >
                  {metrics.memoryUsage.toFixed(1)}%
                </Badge>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-600">JS Heap</div>
                <div className="font-mono">
                  {formatBytes(metrics.usedJSHeapSize)} / {formatBytes(metrics.totalJSHeapSize)}
                </div>
              </div>
            </div>
          )}

          {/* Alerts */}
          {report && report.criticalMetrics.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-3 w-3" />
                <span className="font-medium">Alerts</span>
                <Badge variant="destructive" className="text-xs">
                  {report.criticalMetrics.length}
                </Badge>
              </div>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {report.criticalMetrics.slice(0, 3).map((metric: any, index: number) => (
                  <div key={index} className="bg-red-50 p-1 rounded text-xs">
                    <span className="font-medium">{metric.name}:</span> {metric.value}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Slow Queries */}
          {report && report.slowQueries.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-orange-600">
                <Database className="h-3 w-3" />
                <span className="font-medium">Slow Queries</span>
                <Badge variant="outline" className="text-xs">
                  {report.slowQueries.length}
                </Badge>
              </div>
              <div className="space-y-1 max-h-16 overflow-y-auto">
                {report.slowQueries.slice(0, 2).map((query: any, index: number) => (
                  <div key={index} className="bg-orange-50 p-1 rounded text-xs">
                    <div className="font-mono">{formatMs(query.duration)}</div>
                    <div className="truncate opacity-60">{query.query}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 border-t text-xs text-gray-500 text-center">
            Updated every 2s
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
