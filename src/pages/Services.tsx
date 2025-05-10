
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicesHeader } from "@/components/services/ServicesHeader";
import { ServicesTable } from "@/components/services/ServicesTable";
import { ServiceStats } from "@/components/services/ServiceStats";
import { services as initialServices, ServiceData } from "@/components/services/servicesData";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useUserPermissions } from "@/hooks/useUserPermissions";

const Services = () => {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { canAccess } = useUserPermissions();

  useEffect(() => {
    // Simular chamada à API
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        // Em produção, isso seria uma chamada à API real
        // const { data, error } = await supabase.from('services').select('*');
        
        // Simular atraso de rede
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setServices(initialServices);
        setFilteredServices(initialServices);
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os serviços. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, [toast]);

  const handleServiceCreated = (newService: ServiceData) => {
    const updatedServices = [...services, newService];
    setServices(updatedServices);
    setFilteredServices(applyFilters(updatedServices, searchQuery));
    
    toast({
      title: "Serviço criado",
      description: `O serviço "${newService.name}" foi criado com sucesso.`,
    });
  };

  const handleServiceUpdated = (updatedService: ServiceData) => {
    const updatedServices = services.map(service => 
      service.id === updatedService.id ? updatedService : service
    );
    
    setServices(updatedServices);
    setFilteredServices(applyFilters(updatedServices, searchQuery));
    
    toast({
      title: "Serviço atualizado",
      description: `O serviço "${updatedService.name}" foi atualizado com sucesso.`,
    });
  };

  const handleServiceDeleted = (serviceId: string) => {
    const serviceToDelete = services.find(service => service.id === serviceId);
    const updatedServices = services.filter(service => service.id !== serviceId);
    
    setServices(updatedServices);
    setFilteredServices(applyFilters(updatedServices, searchQuery));
    
    toast({
      title: "Serviço removido",
      description: serviceToDelete 
        ? `O serviço "${serviceToDelete.name}" foi removido com sucesso.` 
        : "O serviço foi removido com sucesso.",
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilteredServices(applyFilters(services, query));
  };

  const applyFilters = (services: ServiceData[], query: string) => {
    if (!query.trim()) return services;
    
    const lowercaseQuery = query.toLowerCase();
    return services.filter(service => 
      service.name.toLowerCase().includes(lowercaseQuery) ||
      (service.description && service.description.toLowerCase().includes(lowercaseQuery))
    );
  };

  const canManageServices = canAccess(['services.manage']);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div>
      <ServicesHeader 
        onServiceCreated={canManageServices ? handleServiceCreated : undefined}
        onSearch={handleSearch} 
      />
      
      <ServiceStats services={services} />
      
      <Card className="shadow-sm border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Lista de Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          <ServicesTable 
            services={filteredServices} 
            onServiceUpdated={canManageServices ? handleServiceUpdated : undefined}
            onServiceDeleted={canManageServices ? handleServiceDeleted : undefined}
            readonly={!canManageServices}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Services;
