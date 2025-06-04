
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BarChart3, FileSpreadsheet } from 'lucide-react';
import { ClientStatsCard } from './ClientStatsCard';
import { ClientFilters, ClientFilterOptions } from './ClientFilters';
import { ClientsTable } from './ClientsTable';
import { ClientsImportExport } from './ClientsImportExport';
import { useClientsAdvanced, useClientAnalytics } from '@/hooks/clients';

interface ClientsManagerProps {
  onNewClient?: () => void;
  onEditClient?: (clientId: string) => void;
  onViewClient?: (clientId: string) => void;
  onDeleteClient?: (clientId: string) => void;
  onCreateAppointment?: (clientId: string) => void;
}

const defaultFilters: ClientFilterOptions = {
  search: '',
  status: '',
  city: '',
  gender: '',
  dateRange: '',
  spendingRange: '',
};

export const ClientsManager: React.FC<ClientsManagerProps> = ({
  onNewClient,
  onEditClient,
  onViewClient,
  onDeleteClient,
  onCreateAppointment,
}) => {
  const { clients, isLoading, searchClients } = useClientsAdvanced();
  const analytics = useClientAnalytics();
  const [filters, setFilters] = useState<ClientFilterOptions>(defaultFilters);

  // Get unique cities for filter options
  const cities = useMemo(() => {
    return Array.from(new Set(clients.map(client => client.city).filter(Boolean)));
  }, [clients]);

  // Filter clients based on current filters
  const filteredClients = useMemo(() => {
    let filtered = [...clients];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        client.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
        client.phone?.includes(filters.search)
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(client => client.status === filters.status);
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(client => client.city === filters.city);
    }

    // Gender filter
    if (filters.gender) {
      filtered = filtered.filter(client => client.gender === filters.gender);
    }

    // Date range filter
    if (filters.dateRange) {
      const now = new Date();
      let cutoffDate: Date;

      switch (filters.dateRange) {
        case 'last_week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'last_month':
          cutoffDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          break;
        case 'last_3_months':
          cutoffDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
          break;
        case 'last_6_months':
          cutoffDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
          break;
        case 'over_6_months':
          cutoffDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
          filtered = filtered.filter(client => {
            const lastVisit = client.last_visit ? new Date(client.last_visit) : null;
            return !lastVisit || lastVisit < cutoffDate;
          });
          break;
        default:
          break;
      }

      if (filters.dateRange !== 'over_6_months' && cutoffDate!) {
        filtered = filtered.filter(client => {
          const lastVisit = client.last_visit ? new Date(client.last_visit) : null;
          return lastVisit && lastVisit >= cutoffDate;
        });
      }
    }

    return filtered;
  }, [clients, filters]);

  const handleClearFilters = () => {
    setFilters(defaultFilters);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie sua base de {analytics.totalClients} clientes</p>
        </div>
        <Button onClick={onNewClient} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Stats Cards */}
      <ClientStatsCard />

      {/* Main Content Tabs */}
      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">Lista de Clientes</TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Análises
          </TabsTrigger>
          <TabsTrigger value="import-export">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Importar/Exportar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          {/* Filters */}
          <ClientFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={handleClearFilters}
            cities={cities}
          />

          {/* Clients Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                {filteredClients.length} cliente{filteredClients.length !== 1 ? 's' : ''} encontrado{filteredClients.length !== 1 ? 's' : ''}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ClientsTable
                clients={filteredClients}
                onEditClient={onEditClient || (() => {})}
                onViewClient={onViewClient || (() => {})}
                onDeleteClient={onDeleteClient || (() => {})}
                onCreateAppointment={onCreateAppointment}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topSpenders.map((client, index) => (
                    <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-gray-500">{client.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(client.total_spent || 0)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clientes que Precisam de Atenção</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.clientsNeedingAttention.slice(0, 5).map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-gray-500">
                          Última visita: {client.last_visit 
                            ? new Date(client.last_visit).toLocaleDateString('pt-BR')
                            : 'Nunca'
                          }
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onCreateAppointment?.(client.id)}
                      >
                        Agendar
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="import-export">
          <ClientsImportExport />
        </TabsContent>
      </Tabs>
    </div>
  );
};
