
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatPrice, formatDuration } from "@/components/website/WebsiteUtils";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookingData, ExtendedServiceData } from "../types";

interface StepServiceProps {
  services: ExtendedServiceData[];
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
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [durationFilter, setDurationFilter] = useState<string>("all");
  const [filteredServices, setFilteredServices] = useState<ExtendedServiceData[]>(services);
  
  // Extract unique service categories
  const categories = [...new Set(services.map(service => 
    service.category || "Sem categoria"
  ))];

  // Filter services based on search query and filters
  useEffect(() => {
    let filtered = services;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply price filter
    if (priceFilter !== "all") {
      if (priceFilter === "low") {
        filtered = filtered.filter(service => service.price <= 50);
      } else if (priceFilter === "medium") {
        filtered = filtered.filter(service => service.price > 50 && service.price <= 100);
      } else if (priceFilter === "high") {
        filtered = filtered.filter(service => service.price > 100);
      }
    }
    
    // Apply duration filter
    if (durationFilter !== "all") {
      if (durationFilter === "short") {
        filtered = filtered.filter(service => service.duration <= 30);
      } else if (durationFilter === "medium") {
        filtered = filtered.filter(service => service.duration > 30 && service.duration <= 60);
      } else if (durationFilter === "long") {
        filtered = filtered.filter(service => service.duration > 60);
      }
    }
    
    setFilteredServices(filtered);
  }, [searchQuery, priceFilter, durationFilter, services]);

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
        <CardTitle className="text-2xl">Escolha um Serviço</CardTitle>
        <p className="text-muted-foreground mt-2">
          Selecione o serviço que você deseja agendar
        </p>

        <div className="space-y-4 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar serviços..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="w-full sm:w-auto">
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Preço" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os preços</SelectItem>
                  <SelectItem value="low">Até R$ 50</SelectItem>
                  <SelectItem value="medium">R$ 50 a R$ 100</SelectItem>
                  <SelectItem value="high">Acima de R$ 100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-auto">
              <Select value={durationFilter} onValueChange={setDurationFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Duração" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Qualquer duração</SelectItem>
                  <SelectItem value="short">Até 30 min</SelectItem>
                  <SelectItem value="medium">30 a 60 min</SelectItem>
                  <SelectItem value="long">Mais de 60 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2 sm:mt-0">
                {categories.map((category) => (
                  <Badge 
                    key={category} 
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => setSearchQuery(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            )}
          </div>
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
                    {service.category && (
                      <Badge variant="outline" className="text-xs">
                        {service.category}
                      </Badge>
                    )}
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
