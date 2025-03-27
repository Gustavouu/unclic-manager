
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scissors, Clock } from "lucide-react";
import { ServiceData } from "@/contexts/onboarding/types";
import { toast } from "sonner";

interface ServicesSectionProps {
  services: ServiceData[];
  formatPrice: (price: number) => string;
  formatDuration: (minutes: number) => string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  services,
  formatPrice,
  formatDuration
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <Scissors className="h-5 w-5" />
          Nossos Serviços
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.slice(0, 6).map((service) => (
            <div 
              key={service.id} 
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{service.name}</h3>
                <Badge variant="outline" className="ml-2">
                  {formatPrice(service.price)}
                </Badge>
              </div>
              
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {formatDuration(service.duration)}
              </div>
              
              {service.description && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {service.description}
                </p>
              )}
            </div>
          ))}
        </div>
        
        {services.length > 6 && (
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => toast.info("Ver todos os serviços")}>
              Ver todos os serviços ({services.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
