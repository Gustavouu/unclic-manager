
import { ServiceHistoryItem } from "@/hooks/useClientHistory";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, DollarSign, User } from "lucide-react";

type ServiceHistoryTabProps = {
  serviceHistory: ServiceHistoryItem[];
};

export const ServiceHistoryTab = ({ serviceHistory }: ServiceHistoryTabProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  return (
    <div>
      {serviceHistory.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhum histórico de serviço disponível
        </div>
      ) : (
        <div className="space-y-4">
          {serviceHistory.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{service.serviceName}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(service.date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                    <div className="text-sm">{formatCurrency(service.price)}</div>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-500 mr-2" />
                    <div className="text-sm">{service.professional}</div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <div className="text-sm">{service.duration} min</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
