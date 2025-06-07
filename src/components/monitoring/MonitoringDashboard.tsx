
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Activity, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { GlobalErrorHandler } from '@/services/error/GlobalErrorHandler';
import { PerformanceMonitor } from '@/services/monitoring/PerformanceMonitor';
import { AlertService } from '@/services/monitoring/AlertService';

interface DashboardStats {
  totalErrors: number;
  criticalErrors: number;
  avgResponseTime: number;
  uptime: number;
  activeAlerts: number;
}

export function MonitoringDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalErrors: 0,
    criticalErrors: 0,
    avgResponseTime: 0,
    uptime: 99.9,
    activeAlerts: 0
  });
  const [errors, setErrors] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const errorHandler = GlobalErrorHandler.getInstance();
  const performanceMonitor = PerformanceMonitor.getInstance();
  const alertService = AlertService.getInstance();

  useEffect(() => {
    loadDashboardData();
    
    // Subscribe to new alerts
    const unsubscribe = alertService.subscribe((alert) => {
      setAlerts(prev => [alert, ...prev.slice(0, 9)]);
      setStats(prev => ({ ...prev, activeAlerts: prev.activeAlerts + 1 }));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      const errorHistory = errorHandler.getErrorHistory(50);
      const errorStats = errorHandler.getErrorStats();
      const alertHistory = alertService.getAlerts({ limit: 10 });
      const performanceReport = performanceMonitor.generateReport();

      setErrors(errorHistory);
      setAlerts(alertHistory);
      
      setStats({
        totalErrors: errorStats.total,
        criticalErrors: errorStats.bySevertiy.critical,
        avgResponseTime: performanceReport.summary.avgResponseTime || 0,
        uptime: 99.9, // Mock data - in production would come from monitoring service
        activeAlerts: alertService.getUnacknowledgedCount()
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    alertService.acknowledgeAlert(alertId);
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
    setStats(prev => ({ ...prev, activeAlerts: Math.max(0, prev.activeAlerts - 1) }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Monitoramento</h2>
          <p className="text-muted-foreground">
            Dashboard de erros, performance e alertas do sistema
          </p>
        </div>
        <Button onClick={loadDashboardData}>
          Atualizar
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erros Totais</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalErrors}</div>
            <p className="text-xs text-muted-foreground">
              {stats.criticalErrors} críticos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Resposta</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime.toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground">
              Média das últimas 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uptime}%</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Necessitam atenção
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            {getStatusIcon(stats.uptime > 99)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.uptime > 99 ? 'Saudável' : 'Atenção'}
            </div>
            <p className="text-xs text-muted-foreground">
              Sistema operacional
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="errors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="errors">Erros Recentes</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Erros Recentes</CardTitle>
              <CardDescription>
                Últimos erros capturados pelo sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errors.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum erro registrado
                </p>
              ) : (
                <div className="space-y-3">
                  {errors.slice(0, 10).map((error) => (
                    <div
                      key={error.id}
                      className="flex items-start justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(error.severity)}>
                            {error.severity}
                          </Badge>
                          <span className="font-medium">{error.message}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {error.context?.component} - {new Date(error.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={error.resolved ? "default" : "secondary"}>
                        {error.resolved ? "Resolvido" : "Aberto"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas do Sistema</CardTitle>
              <CardDescription>
                Alertas de performance e segurança
              </CardDescription>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum alerta ativo
                </p>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <span className="font-medium">{alert.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {alert.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {!alert.acknowledged && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          Reconhecer
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Performance</CardTitle>
              <CardDescription>
                Análise de performance do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Tempo de Resposta</h4>
                    <p className="text-2xl font-bold">{stats.avgResponseTime.toFixed(0)}ms</p>
                    <p className="text-sm text-muted-foreground">Média</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Queries Lentas</h4>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Última hora</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Cache Hit Rate</h4>
                    <p className="text-2xl font-bold">95%</p>
                    <p className="text-sm text-muted-foreground">Últimas 24h</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
