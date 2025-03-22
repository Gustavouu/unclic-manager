
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicesHeader } from "@/components/services/ServicesHeader";
import { ServicesTable } from "@/components/services/ServicesTable";
import { ServiceStats } from "@/components/services/ServiceStats";
import { services as initialServices, ServiceData } from "@/components/services/servicesData";

const Services = () => {
  const [services, setServices] = useState<ServiceData[]>(initialServices);

  const handleServiceCreated = (newService: ServiceData) => {
    setServices(prev => [...prev, newService]);
  };

  const handleServiceUpdated = (updatedService: ServiceData) => {
    setServices(prev => 
      prev.map(service => 
        service.id === updatedService.id ? updatedService : service
      )
    );
  };

  const handleServiceDeleted = (serviceId: string) => {
    setServices(prev => prev.filter(service => service.id !== serviceId));
  };

  return (
    <div>
      <ServicesHeader onServiceCreated={handleServiceCreated} />
      
      <ServiceStats services={services} />
      
      <Card className="shadow-sm border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Lista de Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          <ServicesTable 
            services={services} 
            onServiceUpdated={handleServiceUpdated}
            onServiceDeleted={handleServiceDeleted}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Services;
