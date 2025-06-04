
import { ServiceData } from "../servicesData";
import { EditServiceDialog } from "../EditServiceDialog";
import { DeleteServiceDialog } from "../DeleteServiceDialog";

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
  const handleServiceDeleted = () => {
    onServiceDeleted(service.id);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <EditServiceDialog 
        service={service} 
        onServiceUpdated={onServiceUpdated} 
      />
      <DeleteServiceDialog 
        serviceId={service.id}
        serviceName={service.name} 
        onServiceDeleted={handleServiceDeleted} 
      />
    </div>
  );
};
