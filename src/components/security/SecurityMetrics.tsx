
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePermissions } from '@/hooks/security/usePermissions';
import { useRoles } from '@/hooks/security/useRoles';
import { useAuditLog } from '@/hooks/security/useAuditLog';
import { Shield, Users, Activity, AlertCircle, CheckCircle } from 'lucide-react';

export const SecurityMetrics = () => {
  const { permissions, loading: permissionsLoading, isAdmin } = usePermissions();
  const { roles, loading: rolesLoading } = useRoles();
  const { logs, loading: logsLoading } = useAuditLog(50);

  // Calculate security metrics
  const totalPermissions = permissions.length;
  const hasAdminAccess = permissions.includes('admin.full_access');
  const recentLogs = logs.filter(log => {
    const logDate = new Date(log.created_at);
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return logDate > dayAgo;
  });

  const successfulActions = logs.filter(log => log.success).length;
  const failedActions = logs.filter(log => !log.success).length;
  const successRate = logs.length > 0 ? (successfulActions / logs.length) * 100 : 100;

  const metrics = [
    {
      title: "Permissões Ativas",
      value: totalPermissions,
      description: "Total de permissões concedidas",
      icon: Shield,
      color: hasAdminAccess ? "text-red-600" : "text-blue-600",
      loading: permissionsLoading
    },
    {
      title: "Funções Configuradas",
      value: roles.length,
      description: "Funções disponíveis no sistema",
      icon: Users,
      color: "text-green-600",
      loading: rolesLoading
    },
    {
      title: "Atividades Recentes",
      value: recentLogs.length,
      description: "Ações nas últimas 24 horas",
      icon: Activity,
      color: "text-orange-600",
      loading: logsLoading
    },
    {
      title: "Taxa de Sucesso",
      value: `${Math.round(successRate)}%`,
      description: "Ações executadas com sucesso",
      icon: successRate > 95 ? CheckCircle : AlertCircle,
      color: successRate > 95 ? "text-green-600" : "text-yellow-600",
      loading: logsLoading
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metric.loading ? '...' : metric.value}
            </div>
            <p className="text-xs text-muted-foreground">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
