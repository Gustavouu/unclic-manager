
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
  return (
    <>
      <EditServiceDialog 
        service={service} 
        onServiceUpdated={onServiceUpdated} 
      />
      <DeleteServiceDialog 
        serviceName={service.name} 
        onConfirm={() => onServiceDeleted(service.id)} 
      />
    </>
  );
};
