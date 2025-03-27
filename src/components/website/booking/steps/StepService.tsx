
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceData } from "@/contexts/onboarding/types";
import { BookingData } from "../WebsiteBookingFlow";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatPrice, formatDuration } from "@/components/website/WebsiteUtils";

interface StepServiceProps {
  services: ServiceData[];
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  nextStep: () => void;
}

export function StepService({ 
  services, 
  bookingData, 
  updateBookingData, 
  nextStep 
}: StepServiceProps) {
  const [selectedService, setSelectedService] = useState<string | null>(bookingData.serviceId || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredServices, setFilteredServices] = useState<ServiceData[]>(services);

  useEffect(() => {
    if (searchQuery) {
      const filtered = services.filter(service => 
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices(services);
    }
  }, [searchQuery, services]);

  const handleServiceSelect = (service: ServiceData) => {
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
        <CardTitle className="text-2xl">Escolha um Serviço</CardTitle>
        <p className="text-muted-foreground mt-2">
          Selecione o serviço que você deseja agendar
        </p>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar serviços..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        {filteredServices.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum serviço encontrado.</p>
          </div>
        ) : (
          filteredServices.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceSelect(service)}
              className={`
                p-4 border rounded-lg transition-all cursor-pointer
                ${selectedService === service.id 
                  ? 'border-primary bg-primary/5' 
                  : 'hover:bg-accent/50'
                }
              `}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{service.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {formatDuration(service.duration)}
                    </span>
                  </div>
                  {service.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  )}
                </div>
                <span className="font-semibold text-lg">
                  {formatPrice(service.price)}
                </span>
              </div>
            </div>
          ))
        )}
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
