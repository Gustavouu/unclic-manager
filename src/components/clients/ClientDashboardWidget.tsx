
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useClientAnalytics } from '@/hooks/clients/useClientAnalytics';
import { useClientSearch } from '@/hooks/clients/useClientSearch';
import { 
  Users, 
  UserPlus, 
  DollarSign, 
  Calendar,
  TrendingUp,
  Eye
} from 'lucide-react';

interface ClientDashboardWidgetProps {
  onViewAllClients?: () => void;
  onViewClient?: (clientId: string) => void;
  onNewClient?: () => void;
}

export const ClientDashboardWidget: React.FC<ClientDashboardWidgetProps> = ({
  onViewAllClients,
  onViewClient,
  onNewClient,
}) => {
  const analytics = useClientAnalytics();
  const { getRecentClients, getTopSpendingClients } = useClientSearch();

  const recentClients = getRecentClients(3);
  const topSpenders = getTopSpendingClients(3);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{analytics.totalClients}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Novos este Mês</p>
                <p className="text-2xl font-bold">{analytics.newClientsThisMonth}</p>
              </div>
              <UserPlus className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Receita Total</p>
                <p className="text-xl font-bold">{formatCurrency(analytics.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Precisam Atenção</p>
                <p className="text-2xl font-bold">{analytics.clientsNeedingAttention.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Top Spenders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Clientes Recentes
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onViewAllClients}>
              <Eye className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentClients.length > 0 ? (
              recentClients.map((client) => (
                <div 
                  key={client.id} 
                  className="flex items-center justify-between p-2 hover:bg-muted rounded-lg cursor-pointer"
                  onClick={() => onViewClient?.(client.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{client.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {client.last_visit 
                          ? new Date(client.last_visit).toLocaleDateString('pt-BR')
                          : 'Primeira visita'
                        }
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {client.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum cliente encontrado
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Top Gastadores
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            {topSpenders.length > 0 ? (
              topSpenders.map((client, index) => (
                <div 
                  key={client.id} 
                  className="flex items-center justify-between p-2 hover:bg-muted rounded-lg cursor-pointer"
                  onClick={() => onViewClient?.(client.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 font-medium text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{client.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(client.total_spent || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum dado disponível
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={onNewClient}>
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
            <Button variant="outline" size="sm" onClick={onViewAllClients}>
              <Users className="h-4 w-4 mr-2" />
              Ver Todos
            </Button>
            {analytics.clientsNeedingAttention.length > 0 && (
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Clientes Inativos ({analytics.clientsNeedingAttention.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
