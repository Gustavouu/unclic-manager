
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { OptimizedUserSetupStatus } from './OptimizedUserSetupStatus';
import { useOptimizedTenant } from '@/contexts/OptimizedTenantContext';
import { usePermissions } from '@/hooks/security/usePermissions';
import { useOptimizedDashboard } from '@/hooks/data/useOptimizedDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Building
} from 'lucide-react';

export const OptimizedDashboard = () => {
  const { currentBusiness, isLoading: tenantLoading } = useOptimizedTenant();
  const { permissions, isAdmin, loading: permissionsLoading } = usePermissions();
  const { metrics, isLoading: metricsLoading } = useOptimizedDashboard();

  const isLoading = tenantLoading || permissionsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Carregando..."
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const hasBasicSetup = currentBusiness?.name && permissions.length > 0;
  const isFullySetup = hasBasicSetup && (metrics.totalClients > 0 || metrics.todayAppointments > 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Bem-vindo ${isAdmin ? 'Administrador' : 'ao sistema'}! ${currentBusiness?.name ? `Gerenciando: ${currentBusiness.name}` : ''}`}
      />

      {/* Status de Configuração */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OptimizedUserSetupStatus />
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5" />
              Status do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Negócio</span>
              {currentBusiness?.name ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">{currentBusiness.name}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-500">Não configurado</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tipo de Acesso</span>
              {isAdmin ? (
                <Badge className="bg-red-100 text-red-700">Administrador</Badge>
              ) : permissions.length > 0 ? (
                <Badge className="bg-green-100 text-green-700">Usuário Ativo</Badge>
              ) : (
                <Badge variant="secondary">Acesso Limitado</Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Permissões</span>
              <span className="text-sm font-medium">{permissions.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas do Dashboard */}
      {hasBasicSetup && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Agendamentos Hoje
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.todayAppointments}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.upcomingAppointments} próximos agendamentos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Clientes Ativos
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeClients}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.totalClients} clientes totais
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Receita Mensal
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {metrics.monthRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                {metrics.weekAppointments} agendamentos esta semana
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa de Conclusão
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.completionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Agendamentos concluídos
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Serviços Populares */}
      {hasBasicSetup && metrics.popularServices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Serviços Mais Populares</CardTitle>
            <CardDescription>
              Baseado nos agendamentos recentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.popularServices.map((service, index) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm">#{index + 1}</span>
                    <span className="text-sm">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{service.count}</span>
                    <span className="text-xs text-gray-500">agendamentos</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Próximos Passos para usuários que ainda não concluíram a configuração */}
      {!isFullySetup && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              Próximos Passos
            </CardTitle>
            <CardDescription>
              Complete a configuração para aproveitar todas as funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {!currentBusiness?.name && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Configure as informações do seu negócio</span>
                </div>
              )}
              {permissions.length === 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Configure permissões de acesso</span>
                </div>
              )}
              {metrics.totalClients === 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Adicione seus primeiros clientes</span>
                </div>
              )}
              {metrics.todayAppointments === 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Crie seu primeiro agendamento</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
