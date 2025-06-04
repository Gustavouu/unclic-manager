
import React, { useState, useEffect } from 'react';
import { ClientsManager } from '@/components/clients/ClientsManager';
import { NewClientDialog } from '@/components/clients/NewClientDialog';
import { EditClientDialog } from '@/components/clients/EditClientDialog';
import { ViewClientDialog } from '@/components/clients/ViewClientDialog';
import { DeleteClientDialog } from '@/components/clients/DeleteClientDialog';
import { OnboardingRedirect } from '@/components/auth/OnboardingRedirect';
import { useClients } from '@/hooks/useClients';
import { useSearchParams } from 'react-router-dom';

const Clients = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [viewingClientId, setViewingClientId] = useState<string | null>(null);
  const [deletingClient, setDeletingClient] = useState<{ id: string; name: string } | null>(null);
  
  const { clients, refetch } = useClients();

  // Handle URL parameters for opening dialogs
  useEffect(() => {
    const action = searchParams.get('action');
    const clientId = searchParams.get('clientId');

    if (action === 'new') {
      setShowNewClientDialog(true);
    } else if (action === 'edit' && clientId) {
      setEditingClientId(clientId);
    } else if (action === 'view' && clientId) {
      setViewingClientId(clientId);
    }
  }, [searchParams]);

  const handleViewClient = (clientId: string) => {
    setViewingClientId(clientId);
    setSearchParams({ action: 'view', clientId });
  };

  const handleEditClient = (clientId: string) => {
    setEditingClientId(clientId);
    setSearchParams({ action: 'edit', clientId });
  };

  const handleDeleteClient = (clientId: string, clientName: string) => {
    setDeletingClient({ id: clientId, name: clientName });
  };

  const handleCreateAppointment = (clientId: string) => {
    // This would navigate to appointment creation with pre-selected client
    console.log('Creating appointment for client:', clientId);
  };

  const handleClientCreated = () => {
    setShowNewClientDialog(false);
    setSearchParams({});
    refetch();
  };

  const handleClientUpdated = () => {
    setEditingClientId(null);
    setSearchParams({});
    refetch();
  };

  const handleClientDeleted = () => {
    setDeletingClient(null);
    refetch();
  };

  const handleDialogClose = () => {
    setShowNewClientDialog(false);
    setEditingClientId(null);
    setViewingClientId(null);
    setSearchParams({});
  };

  return (
    <OnboardingRedirect>
      <div className="container mx-auto py-6 px-4">
        <ClientsManager
          onViewClient={handleViewClient}
          onEditClient={handleEditClient}
          onDeleteClient={handleDeleteClient}
          onCreateAppointment={handleCreateAppointment}
          onNewClient={() => {
            setShowNewClientDialog(true);
            setSearchParams({ action: 'new' });
          }}
        />
        
        <NewClientDialog
          open={showNewClientDialog}
          onOpenChange={(open) => {
            setShowNewClientDialog(open);
            if (!open) handleDialogClose();
          }}
          onClientCreated={handleClientCreated}
        />
        
        <EditClientDialog
          open={!!editingClientId}
          onOpenChange={(open) => {
            if (!open) {
              setEditingClientId(null);
              handleDialogClose();
            }
          }}
          clientId={editingClientId}
          onClientUpdated={handleClientUpdated}
        />
        
        <ViewClientDialog
          open={!!viewingClientId}
          onOpenChange={(open) => {
            if (!open) {
              setViewingClientId(null);
              handleDialogClose();
            }
          }}
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
