
import React, { useState } from 'react';
import { ServicesManager } from '@/components/services/ServicesManager';
import { NewServiceDialog } from '@/components/services/NewServiceDialog';
import { OnboardingRedirect } from '@/components/auth/OnboardingRedirect';

const Services = () => {
  const [showNewServiceDialog, setShowNewServiceDialog] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [viewingServiceId, setViewingServiceId] = useState<string | null>(null);

  const handleNewService = () => {
    setShowNewServiceDialog(true);
  };

  const handleEditService = (serviceId: string) => {
    setEditingServiceId(serviceId);
  };

  const handleViewService = (serviceId: string) => {
    setViewingServiceId(serviceId);
  };

  const handleServiceCreated = () => {
    // The ServicesManager will automatically refresh the list
    setShowNewServiceDialog(false);
  };

  return (
    <OnboardingRedirect>
      <div className="container mx-auto py-6 px-4">
        <ServicesManager
          onNewService={handleNewService}
          onEditService={handleEditService}
          onViewService={handleViewService}
        />
        
        <NewServiceDialog
          open={showNewServiceDialog}
          onOpenChange={setShowNewServiceDialog}
          onServiceCreated={handleServiceCreated}
        />
        
        {/* TODO: Add dialogs for edit/view service */}
        {/* These will be implemented in the next phases */}
      </div>
    </OnboardingRedirect>
  );
};

export default Services;
