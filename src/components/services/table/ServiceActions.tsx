
import { ServiceData } from "../servicesData";
import { EditServiceDialog } from "../EditServiceDialog";
import { DeleteServiceDialog } from "../DeleteServiceDialog";
import { useState } from "react";

interface ServiceActionsProps {
  service: ServiceData;
  onServiceUpdated: (updatedService: ServiceData) => void;
  onServiceDeleted: (serviceId: string) => void;
}

export const ServiceActions = ({
  service,
  onServiceUpdated,
  onServiceDeleted
}: ServiceActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleServiceDeleted = () => {
    onServiceDeleted(service.id);
    setShowDeleteDialog(false);
  };

  // Create a mock service object for the delete dialog
  const serviceForDialog = {
    id: service.id,
    nome: service.name,
    name: service.name,
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <EditServiceDialog 
        service={service} 
        onServiceUpdated={onServiceUpdated} 
      />
      <DeleteServiceDialog 
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        service={serviceForDialog}
        onServiceDeleted={handleServiceDeleted} 
      />
    </div>
  );
};
