
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { useMultiTenant } from '@/contexts/MultiTenantContext';
import { BusinessSelector } from '@/components/business/BusinessSelector';
import { Loader2, AlertCircle, Users, Calendar, DollarSign, TrendingUp, Building2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Dashboard = () => {
  const { businessId, isLoading, error } = useCurrentBusiness();
  const { currentBusiness, hasMultipleBusinesses } = useMultiTenant();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!businessId) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Nenhum negócio selecionado. Por favor, selecione um negócio para continuar.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com informações do negócio */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao painel de controle{currentBusiness ? ` - ${currentBusiness.name}` : ''}.
          </p>
        </div>
        
        {/* Business Selector - only show in header if user has multiple businesses */}
        {hasMultipleBusinesses && (
          <div className="flex flex-col items-end space-y-2">
            <label className="text-xs text-muted-foreground">Negócio Atual:</label>
            <BusinessSelector variant="compact" />
          </div>
        )}
      </div>

      {/* Business Info Card - show current business details */}
      {currentBusiness && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Negócio Ativo</span>
            </CardTitle>
            <CardDescription>
              Informações do negócio atualmente selecionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{currentBusiness.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-muted-foreground">
                    Função: {currentBusiness.role}
                  </span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    Status: {currentBusiness.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  ID: {currentBusiness.id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Carregando dados...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Carregando dados...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita do Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ -</div>
            <p className="text-xs text-muted-foreground">
              Carregando dados...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Crescimento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-%</div>
            <p className="text-xs text-muted-foreground">
              Carregando dados...
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Agendamentos Recentes</CardTitle>
            <CardDescription>
              Últimos agendamentos do negócio selecionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Carregando agendamentos...
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clientes Recentes</CardTitle>
            <CardDescription>
              Novos clientes cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Carregando clientes...
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Sistema multi-tenant ativo. Business ID: {businessId}
          {hasMultipleBusinesses && (
            <span className="block mt-1 text-xs">
              Você tem acesso a múltiplos negócios. Use o seletor no topo para alternar.
            </span>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default Dashboard;
