
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { UserSetupStatus } from '@/components/layout/UserSetupStatus';
import { SetupGuide } from '@/components/dashboard/SetupGuide';
import { usePermissions } from '@/hooks/security/usePermissions';
import { useTenant } from '@/contexts/TenantContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Building, 
  Shield,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const { permissions, isAdmin, loading } = usePermissions();
  const { currentBusiness } = useTenant();

  if (loading) {
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Bem-vindo ${isAdmin ? 'Administrador' : 'ao sistema'}! ${currentBusiness?.name ? `Gerenciando: ${currentBusiness.name}` : ''}`}
      />

      {/* Status de Configuração */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserSetupStatus />
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Seu Acesso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              {isAdmin ? (
                <Badge className="bg-red-100 text-red-700">Administrador</Badge>
              ) : permissions.length > 0 ? (
                <Badge className="bg-green-100 text-green-700">Ativo</Badge>
              ) : (
                <Badge variant="secondary">Limitado</Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Permissões</span>
              <span className="text-sm font-medium">{permissions.length}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Negócio</span>
              {currentBusiness?.name ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-orange-500" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guia de Configuração */}
      {!hasBasicSetup && (
        <SetupGuide />
      )}

      {/* Métricas Rápidas (apenas se tiver configuração básica) */}
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
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Configure agendamentos para ver dados
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
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Adicione clientes para começar
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
              <div className="text-2xl font-bold">R$ 0</div>
              <p className="text-xs text-muted-foreground">
                Dados aparecerão com transações
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Crescimento
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+0%</div>
              <p className="text-xs text-muted-foreground">
                Comparado ao mês anterior
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Informações do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Status do Sistema
          </CardTitle>
          <CardDescription>
            Informações sobre seu acesso e configuração atual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Negócio:</strong> {currentBusiness?.name || 'Não configurado'}
            </div>
            <div>
              <strong>Seu Papel:</strong> {isAdmin ? 'Administrador' : 'Usuário'}
            </div>
            <div>
              <strong>Permissões:</strong> {permissions.length} ativas
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
