
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

  return (
    <div className="flex items-center justify-end gap-2">
      <EditServiceDialog 
        service={service} 
        onServiceUpdated={onServiceUpdated} 
      />
      <DeleteServiceDialog 
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        service={service}
        onServiceDeleted={handleServiceDeleted} 
      />
    </div>
  );
};
