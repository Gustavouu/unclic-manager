
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BarChart3, FileSpreadsheet } from 'lucide-react';
import { ClientStatsCard } from './ClientStatsCard';
import { ClientFilters } from './ClientFilters';
import { ClientFormModal } from './ClientFormModal';
import { ClientsImportExport } from './ClientsImportExport';
import { ClientsList } from './ClientsList';
import { ClientsAnalytics } from './analytics/ClientsAnalytics';
import { useClientsList } from '@/hooks/clients/useClientsList';
import { useClientAnalytics } from '@/hooks/clients/useClientAnalytics';
import type { Client } from '@/types/client';

interface ClientsManagerProps {
  onViewClient?: (clientId: string) => void;
  onEditClient?: (clientId: string) => void;
  onDeleteClient?: (clientId: string, clientName: string) => void;
  onCreateAppointment?: (clientId: string) => void;
  onNewClient?: () => void;
}

export const ClientsManager: React.FC<ClientsManagerProps> = ({
  onViewClient,
  onEditClient,
  onCreateAppointment,
  onNewClient,
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
    onNewClient?.();
  };

  const handleEditClient = (clientId: string) => {
    const client = allClients.find(c => c.id === clientId);
    setSelectedClient(client);
    setIsFormModalOpen(true);
    onEditClient?.(clientId);
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

          {/* Clients List */}
          <ClientsList
            clients={clients}
            totalClients={pagination.total}
            currentPage={pagination.page}
            totalPages={totalPages}
            pageSize={pagination.pageSize}
            onEditClient={handleEditClient}
            onViewClient={onViewClient || (() => {})}
            onDeleteClient={handleDeleteClient}
            onCreateAppointment={onCreateAppointment}
            onPageChange={(page) => updatePagination({ page })}
            onPageSizeChange={(pageSize) => updatePagination({ pageSize, page: 1 })}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <ClientsAnalytics
            analytics={analytics}
            onCreateAppointment={onCreateAppointment}
          />
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
