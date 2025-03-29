
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Clock, DollarSign } from "lucide-react";
import { BookingData, ExtendedServiceData } from "../types";
import { cn } from "@/lib/utils";

interface StepServiceProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  nextStep: () => void;
  services: ExtendedServiceData[];
}

export function StepService({ 
  bookingData, 
  updateBookingData, 
  nextStep,
  services 
}: StepServiceProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState<string>(bookingData.serviceId || "");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Extract unique categories from services
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    
    services.forEach(service => {
      if (service.category) {
        uniqueCategories.add(service.category);
      }
    });
    
    return ["all", ...Array.from(uniqueCategories)];
  }, [services]);
  
  // Filter services by search term and category
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = searchTerm === "" || 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || 
        service.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, selectedCategory]);
  
  const handleServiceSelect = (service: ExtendedServiceData) => {
    setSelectedService(service.id);
    updateBookingData({
      serviceId: service.id,
      serviceName: service.name,
      servicePrice: service.price,
      serviceDuration: service.duration
    });
  };
  
  const handleContinue = () => {
    if (selectedService) {
      nextStep();
    }
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Escolha o serviço</CardTitle>
        <p className="text-muted-foreground mt-2">
          Selecione o serviço que deseja agendar
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar serviços..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="text-sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === "all" ? "Todos" : category}
              </Button>
            ))}
          </div>
        )}
        
        <div className="space-y-3">
          {filteredServices.length === 0 ? (
            <div className="text-center p-4 border border-dashed rounded-md">
              <p className="text-muted-foreground">
                Nenhum serviço encontrado para sua busca.
              </p>
            </div>
          ) : (
            filteredServices.map((service) => (
              <button
                key={service.id}
                className={cn(
                  "w-full text-left p-4 rounded-md border transition-all",
                  selectedService === service.id
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                )}
                onClick={() => handleServiceSelect(service)}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <h3 className="font-medium">{service.name}</h3>
                    {service.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {service.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1 mt-2 sm:mt-0">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{service.duration} min</span>
                    </div>
                    <div className="flex items-center font-medium">
                      <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>R$ {service.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          disabled={!selectedService}
          onClick={handleContinue}
        >
          Continuar
        </Button>
      </CardFooter>
    </Card>
  );
}
