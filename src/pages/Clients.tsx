
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ClientsTable } from '@/components/clients/ClientsTable';
import { NewClientDialog } from '@/components/clients/NewClientDialog';
import { DeleteClientDialog } from '@/components/clients/DeleteClientDialog';
import { ClientValidationAlert } from '@/components/clients/ClientValidationAlert';
import { useClientsDashboard } from '@/hooks/clients/useClientsDashboard';
import { Plus, Search, Users, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { OnboardingRedirect } from '@/components/auth/OnboardingRedirect';

export default function Clients() {
  const {
    clients,
    isLoading,
    error,
    loadClients,
    createClient,
    updateClient,
    deleteClient,
    applyFilters,
    filters
  } = useClientsDashboard();

  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedClientName, setSelectedClientName] = useState('');

  const handleSearch = (value: string) => {
    applyFilters({ search: value });
  };

  const handleEditClient = (clientId: string) => {
    console.log('Edit client:', clientId);
    // TODO: Implement edit functionality
  };

  const handleViewClient = (clientId: string) => {
    console.log('View client:', clientId);
    // TODO: Implement view functionality
  };

  const handleDeleteClient = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClientId(clientId);
      setSelectedClientName(client.name);
      setShowDeleteDialog(true);
    }
  };

  const handleCreateAppointment = (clientId: string) => {
    console.log('Create appointment for client:', clientId);
    // TODO: Implement appointment creation
  };

  const onClientCreated = () => {
    loadClients();
  };

  const onClientDeleted = () => {
    loadClients();
    setSelectedClientId(null);
    setSelectedClientName('');
  };

  return (
    <OnboardingRedirect>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
              <p className="text-muted-foreground">
                Gerencie seus clientes e informações de contato
              </p>
            </div>
          </div>
          <Button onClick={() => setShowNewClientDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>

        <ClientValidationAlert />

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600">Erro ao carregar clientes: {error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadClients}
                className="mt-2"
              >
                Tentar novamente
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Clientes</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar clientes..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <ClientsTable
                clients={clients}
                onEditClient={handleEditClient}
                onViewClient={handleViewClient}
                onDeleteClient={handleDeleteClient}
                onCreateAppointment={handleCreateAppointment}
              />
            )}
          </CardContent>
        </Card>

        <NewClientDialog
          open={showNewClientDialog}
          onOpenChange={setShowNewClientDialog}
          onClientCreated={onClientCreated}
        />

        <DeleteClientDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          clientId={selectedClientId}
          clientName={selectedClientName}
          onClientDeleted={onClientDeleted}
        />
      </div>
    </OnboardingRedirect>
  );
}
