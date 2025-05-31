import React, { useState } from 'react';
import { ClientsManager } from '@/components/clients/ClientsManager';
import { OnboardingRedirect } from '@/components/auth/OnboardingRedirect';

const Clients = () => {
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [viewingClientId, setViewingClientId] = useState<string | null>(null);

  const handleNewClient = () => {
    setShowNewClientDialog(true);
  };

  const handleEditClient = (clientId: string) => {
    setEditingClientId(clientId);
  };

  const handleViewClient = (clientId: string) => {
    setViewingClientId(clientId);
  };

  return (
    <OnboardingRedirect>
      <div className="container mx-auto py-6 px-4">
        <ClientsManager
          onNewClient={handleNewClient}
          onEditClient={handleEditClient}
          onViewClient={handleViewClient}
        />
        
        {/* TODO: Add dialogs for new/edit/view client */}
        {/* These will be implemented in the next phases */}
      </div>
    </OnboardingRedirect>
  );
};

export default Clients;
