
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
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Services = () => {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceData[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>('all');
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
    setFilteredServices(applyFilters(updatedServices, searchQuery, activeTab));
    
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
    setFilteredServices(applyFilters(updatedServices, searchQuery, activeTab));
    
    toast({
      title: "Serviço atualizado",
      description: `O serviço "${updatedService.name}" foi atualizado com sucesso.`,
    });
  };

  const handleServiceDeleted = (serviceId: string) => {
    const serviceToDelete = services.find(service => service.id === serviceId);
    const updatedServices = services.filter(service => service.id !== serviceId);
    
    setServices(updatedServices);
    setFilteredServices(applyFilters(updatedServices, searchQuery, activeTab));
    
    toast({
      title: "Serviço removido",
      description: serviceToDelete 
        ? `O serviço "${serviceToDelete.name}" foi removido com sucesso.` 
        : "O serviço foi removido com sucesso.",
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilteredServices(applyFilters(services, query, activeTab));
  };

  const applyFilters = (services: ServiceData[], query: string, tab: string = 'all') => {
    let filtered = services;
    
    // Apply tab filter
    if (tab !== 'all') {
      filtered = filtered.filter(service => service.status === tab);
    }
    
    // Apply search filter
    if (query.trim()) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(lowercaseQuery) ||
        (service.description && service.description.toLowerCase().includes(lowercaseQuery))
      );
    }
    
    return filtered;
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFilteredServices(applyFilters(services, searchQuery, value));
  };

  const canManageServices = canAccess(['services.manage']);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Serviços</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os serviços oferecidos pelo seu negócio
          </p>
        </div>
        
        <ServicesHeader 
          onServiceCreated={canManageServices ? handleServiceCreated : undefined}
          onSearch={handleSearch} 
        />
      </div>
      
      <ServiceStats services={services} />
      
      <Card className="border shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b bg-white">
          <CardTitle className="text-lg">Lista de Serviços</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
            <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
              <TabsList className="bg-slate-100">
                <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="active" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Ativos
                </TabsTrigger>
                <TabsTrigger value="inactive" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Inativos
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-0">
              <ServicesTable 
                services={filteredServices} 
                onServiceUpdated={canManageServices ? handleServiceUpdated : undefined}
                onServiceDeleted={canManageServices ? handleServiceDeleted : undefined}
                readonly={!canManageServices}
                state={loadingState}
                error={error || undefined}
              />
            </TabsContent>
            
            <TabsContent value="active" className="mt-0">
              <ServicesTable 
                services={filteredServices} 
                onServiceUpdated={canManageServices ? handleServiceUpdated : undefined}
                onServiceDeleted={canManageServices ? handleServiceDeleted : undefined}
                readonly={!canManageServices}
                state={loadingState}
                error={error || undefined}
              />
            </TabsContent>
            
            <TabsContent value="inactive" className="mt-0">
              <ServicesTable 
                services={filteredServices} 
                onServiceUpdated={canManageServices ? handleServiceUpdated : undefined}
                onServiceDeleted={canManageServices ? handleServiceDeleted : undefined}
                readonly={!canManageServices}
                state={loadingState}
                error={error || undefined}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Services;
