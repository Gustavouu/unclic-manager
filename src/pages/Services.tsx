
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { CardContainer } from "@/components/ui/card-container";
import { ServicesHeader } from "@/components/services/ServicesHeader";
import { ServicesTable } from "@/components/services/ServicesTable";
import { ServiceStats } from "@/components/services/ServiceStats";
import { services as initialServices, ServiceData } from "@/components/services/servicesData";
import { useToast } from "@/hooks/use-toast";
import { useUserPermissions } from "@/components/hooks/useUserPermissions";
import { LoadingState } from "@/hooks/use-loading-state";

const Services = () => {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceData[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { canAccess } = useUserPermissions();

  useEffect(() => {
    // Simular chamada à API
    const fetchServices = async () => {
      setLoadingState('loading');
      try {
        // Em produção, isso seria uma chamada à API real
        // const { data, error } = await supabase.from('services').select('*');
        
        // Simular atraso de rede
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setServices(initialServices);
        setFilteredServices(initialServices);
        setLoadingState('success');
      } catch (error: any) {
        console.error("Erro ao buscar serviços:", error);
        setError(error.message || "Erro ao carregar os serviços");
        setLoadingState('error');
        toast({
          title: "Erro",
          description: "Não foi possível carregar os serviços. Tente novamente mais tarde.",
          variant: "destructive",
        });
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

  return (
    <div>
      <PageHeader 
        title="Serviços"
        description="Gerencie os serviços oferecidos pelo seu negócio"
        breadcrumb={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Serviços" }
        ]}
        actions={
          <ServicesHeader 
            onServiceCreated={canManageServices ? handleServiceCreated : undefined}
            onSearch={handleSearch} 
          />
        }
      />
      
      <ServiceStats services={services} />
      
      <CardContainer
        title="Lista de Serviços"
        state={loadingState}
        errorText="Erro ao carregar serviços"
        error={error || undefined}
        variant="elevated"
      >
        <ServicesTable 
          services={filteredServices} 
          onServiceUpdated={canManageServices ? handleServiceUpdated : undefined}
          onServiceDeleted={canManageServices ? handleServiceDeleted : undefined}
          readonly={!canManageServices}
        />
      </CardContainer>
    </div>
  );
};

export default Services;
