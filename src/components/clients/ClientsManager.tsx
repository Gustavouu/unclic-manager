
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BarChart3, FileSpreadsheet } from 'lucide-react';
import { ClientStatsCard } from './ClientStatsCard';
import { ClientFilters } from './ClientFilters';
import { ClientsTable } from './ClientsTable';
import { ClientFormModal } from './ClientFormModal';
import { ClientsPagination } from './ClientsPagination';
import { ClientsImportExport } from './ClientsImportExport';
import { useClientsList } from '@/hooks/clients/useClientsList';
import { useClientAnalytics } from '@/hooks/clients/useClientAnalytics';
import type { Client } from '@/types/client';

interface ClientsManagerProps {
  onViewClient?: (clientId: string) => void;
  onCreateAppointment?: (clientId: string) => void;
}

export const ClientsManager: React.FC<ClientsManagerProps> = ({
  onViewClient,
  onCreateAppointment,
}) => {
  const {
    clients,
    allClients,
    filters,
    pagination,
    availableFilters,
    isLoading,
    updateFilters,
    updatePagination,
    clearFilters,
    refetch,
  } = useClientsList();
  
  const analytics = useClientAnalytics();
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  const handleNewClient = () => {
    setSelectedClient(undefined);
    setIsFormModalOpen(true);
  };

  const handleEditClient = (clientId: string) => {
    const client = allClients.find(c => c.id === clientId);
    setSelectedClient(client);
    setIsFormModalOpen(true);
  };

  const handleFormSuccess = () => {
    refetch();
  };

  const handleDeleteClient = async (clientId: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      // This would be handled by the ClientsTable component
      // through the useClientOperations hook
    }
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
          <p className="text-gray-600">
            Gerencie sua base de {analytics.totalClients} clientes
          </p>
        </div>
        <Button onClick={handleNewClient} className="flex items-center gap-2">
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
            onFiltersChange={updateFilters}
            onClearFilters={clearFilters}
            cities={availableFilters.cities}
          />

          {/* Clients Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                {pagination.total} cliente{pagination.total !== 1 ? 's' : ''} encontrado{pagination.total !== 1 ? 's' : ''}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ClientsTable
                clients={clients}
                onEditClient={handleEditClient}
                onViewClient={onViewClient || (() => {})}
                onDeleteClient={handleDeleteClient}
                onCreateAppointment={onCreateAppointment}
              />
              
              {pagination.total > 0 && (
                <ClientsPagination
                  currentPage={pagination.page}
                  totalPages={totalPages}
                  pageSize={pagination.pageSize}
                  totalItems={pagination.total}
                  onPageChange={(page) => updatePagination({ page })}
                  onPageSizeChange={(pageSize) => updatePagination({ pageSize, page: 1 })}
                />
              )}
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

      {/* Form Modal */}
      <ClientFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        client={selectedClient}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};
