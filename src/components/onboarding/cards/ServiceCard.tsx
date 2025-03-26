
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, Edit, Trash2 } from "lucide-react";
import { ServiceData } from "@/contexts/OnboardingContext";

interface ServiceCardProps {
  service: ServiceData;
  onEdit: () => void;
  onRemove: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onEdit, onRemove }) => {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return hours === 1 ? "1 hora" : `${hours} horas`;
    }
    
    return `${hours}h${remainingMinutes}min`;
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex-grow">
        <h3 className="font-medium text-lg mb-2">{service.name}</h3>
        
        <div className="space-y-2">
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>{formatDuration(service.duration)}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>{formatPrice(service.price)}</span>
          </div>
        </div>
        
        {service.description && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
            {service.description}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
