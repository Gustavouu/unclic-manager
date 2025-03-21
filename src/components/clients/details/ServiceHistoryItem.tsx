
import { CalendarDays, Clock } from "lucide-react";

export type ServiceHistoryItem = {
  id: string;
  date: string;
  serviceName: string;
  price: number;
  professional: string;
  duration: number;
};

interface ServiceHistoryItemProps {
  service: ServiceHistoryItem;
}

export const ServiceHistoryItemCard = ({ service }: ServiceHistoryItemProps) => {
  // Format date to display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="p-3 bg-muted/20 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium">{service.serviceName}</h4>
        <span className="text-sm font-medium text-primary">
          {formatCurrency(service.price)}
        </span>
      </div>
      <div className="text-sm text-muted-foreground mb-1">
        {service.professional}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <CalendarDays className="h-3 w-3" />
          <span>{formatDate(service.date)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{service.duration} min</span>
        </div>
      </div>
    </div>
  );
};
