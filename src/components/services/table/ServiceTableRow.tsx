
import { ServiceData } from "../servicesData";
import { TableCell, TableRow } from "@/components/ui/table";
import { Clock, DollarSign, Star, TrendingUp } from "lucide-react";
import { ServiceIndicator } from "../ServiceIndicator";
import { ServiceCategoryBadge } from "./ServiceCategoryBadge";
import { ServiceActions } from "./ServiceActions";

interface ServiceTableRowProps {
  service: ServiceData;
  onServiceUpdated: (updatedService: ServiceData) => void;
  onServiceDeleted: (serviceId: string) => void;
}

export const ServiceTableRow = ({
  service,
  onServiceUpdated,
  onServiceDeleted
}: ServiceTableRowProps) => {
  // Format price to handle both string and number
  const formatPrice = (price: string | number) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numericPrice.toFixed(2);
  };

  return (
    <TableRow key={service.id}>
      <TableCell className="font-medium">
        <div className="flex items-center">
          {service.name}
          <div className="ml-2 flex">
            {service.isPopular && (
              <ServiceIndicator
                icon={TrendingUp}
                label="Serviço Popular"
                color="text-blue-500"
              />
            )}
            {service.isFeatured && (
              <ServiceIndicator
                icon={Star}
                label="Serviço Destacado"
                color="text-amber-500"
              />
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <ServiceCategoryBadge category={service.category} />
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Clock className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
          {service.duration} min
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <DollarSign className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
          R$ {formatPrice(service.price)}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end">
          <ServiceActions
            service={service}
            onServiceUpdated={onServiceUpdated}
            onServiceDeleted={onServiceDeleted}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};
