
import React, { useState } from 'react';
import { ClientsManager } from '@/components/clients/ClientsManager';
import { NewClientDialog } from '@/components/clients/NewClientDialog';
import { EditClientDialog } from '@/components/clients/EditClientDialog';
import { ViewClientDialog } from '@/components/clients/ViewClientDialog';
import { DeleteClientDialog } from '@/components/clients/DeleteClientDialog';
import { OnboardingRedirect } from '@/components/auth/OnboardingRedirect';
import { useClients } from '@/hooks/useClients';

const Clients = () => {
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [viewingClientId, setViewingClientId] = useState<string | null>(null);
  const [deletingClient, setDeletingClient] = useState<{ id: string; name: string } | null>(null);
  
  const { clients, refetch } = useClients();

  const handleViewClient = (clientId: string) => {
    setViewingClientId(clientId);
  };

  const handleCreateAppointment = (clientId: string) => {
    // This would navigate to appointment creation with pre-selected client
    console.log('Creating appointment for client:', clientId);
  };

  const handleClientCreated = () => {
    setShowNewClientDialog(false);
    refetch();
  };

  const handleClientUpdated = () => {
    setEditingClientId(null);
    refetch();
  };

  const handleClientDeleted = () => {
    setDeletingClient(null);
    refetch();
  };

  return (
    <OnboardingRedirect>
      <div className="container mx-auto py-6 px-4">
        <ClientsManager
          onViewClient={handleViewClient}
          onCreateAppointment={handleCreateAppointment}
        />
        
        <NewClientDialog
          open={showNewClientDialog}
          onOpenChange={setShowNewClientDialog}
          onClientCreated={handleClientCreated}
        />
        
        <EditClientDialog
          open={!!editingClientId}
          onOpenChange={(open) => !open && setEditingClientId(null)}
          clientId={editingClientId}
          onClientUpdated={handleClientUpdated}
        />
        
        <ViewClientDialog
          open={!!viewingClientId}
          onOpenChange={(open) => !open && setViewingClientId(null)}
          clientId={viewingClientId}
        />
        
        <DeleteClientDialog
          open={!!deletingClient}
          onOpenChange={(open) => !open && setDeletingClient(null)}
          clientId={deletingClient?.id || null}
          clientName={deletingClient?.name || ''}
          onClientDeleted={handleClientDeleted}
        />
      </div>
    </OnboardingRedirect>
  );
};

export default Clients;
