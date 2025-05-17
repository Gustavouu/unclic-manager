
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicesTable } from "@/components/services/ServicesTable";
import { StatsCard } from "@/components/common/StatsCard";
import { services as initialServices, ServiceData } from "@/components/services/servicesData";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { LoadingState } from "@/hooks/use-loading-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scissors, Calendar, BadgeDollarSign, Bookmark } from "lucide-react";
import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid";
import { ServicesHeader } from "@/components/services/ServicesHeader";
import { toast } from "sonner";

const Services = () => {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceData[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>('all');
  const { userRoles, permissions, isAdmin } = useUserPermissions();

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
        toast.error("Não foi possível carregar os serviços. Tente novamente mais tarde.");
      }
    };
    
    fetchServices();
  }, []);

  const handleServiceCreated = (newService: ServiceData) => {
    const updatedServices = [...services, newService];
    setServices(updatedServices);
    setFilteredServices(applyFilters(updatedServices, searchQuery, activeTab));
    
    toast.success(`O serviço "${newService.name}" foi criado com sucesso.`);
  };

  const handleServiceUpdated = (updatedService: ServiceData) => {
    const updatedServices = services.map(service => 
      service.id === updatedService.id ? updatedService : service
    );
    
    setServices(updatedServices);
    setFilteredServices(applyFilters(updatedServices, searchQuery, activeTab));
    
    toast.success(`O serviço "${updatedService.name}" foi atualizado com sucesso.`);
  };

  const handleServiceDeleted = (serviceId: string) => {
    const serviceToDelete = services.find(service => service.id === serviceId);
    const updatedServices = services.filter(service => service.id !== serviceId);
    
    setServices(updatedServices);
    setFilteredServices(applyFilters(updatedServices, searchQuery, activeTab));
    
    toast.success(serviceToDelete 
      ? `O serviço "${serviceToDelete.name}" foi removido com sucesso.` 
      : "O serviço foi removido com sucesso."
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilteredServices(applyFilters(services, query, activeTab));
  };

  const applyFilters = (services: ServiceData[], query: string, tab: string = 'all') => {
    let filtered = services;
    
    // Apply tab filter
    if (tab !== 'all') {
      // Use isActive instead of status
      filtered = filtered.filter(service => 
        tab === 'active' ? service.isActive !== false : service.isActive === false
      );
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

  // Check if user can manage services
  const hasServicesManagePermission = () => {
    if (isAdmin) return true;
    return permissions.some(permission => permission.name === 'services.manage');
  };

  const canManageServices = hasServicesManagePermission();

  // Calculate statistics for the cards
  const totalServices = services.length;
  const activeServices = services.filter(service => service.isActive !== false).length;
  
  // Calculate average duration
  const totalDuration = services.reduce((sum, service) => sum + (service.duration || 0), 0);
  const averageDuration = services.length ? Math.round(totalDuration / services.length) : 0;
  
  // Calculate total estimated revenue - Fix the issue here
  const totalRevenue = services.reduce((sum, service) => {
    // Ensure price is a number
    let price = 0;
    if (typeof service.price === 'string') {
      price = parseFloat(service.price);
    } else if (typeof service.price === 'number') {
      price = service.price;
    }
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  return (
    <div className="space-y-6">
      <ServicesHeader 
        onServiceCreated={canManageServices ? handleServiceCreated : undefined}
        onSearch={handleSearch} 
      />
      
      <ResponsiveGrid columns={{ default: 1, sm: 4 }} gap="md" equalHeight>
        <StatsCard
          title="Total de Serviços"
          value={totalServices.toString()}
          icon={<Scissors size={18} />}
          iconColor="text-blue-600 bg-blue-50"
          borderColor="border-l-blue-600"
        />
        
        <StatsCard
          title="Serviços Ativos"
          value={activeServices.toString()}
          icon={<Bookmark size={18} />}
          iconColor="text-green-600 bg-green-50"
          borderColor="border-l-green-600"
          description={totalServices > 0 ? `${Math.round((activeServices / totalServices) * 100) || 0}% do total` : "0% do total"}
        />
        
        <StatsCard
          title="Duração Média"
          value={`${averageDuration} min`}
          icon={<Calendar size={18} />}
          iconColor="text-amber-600 bg-amber-50"
          borderColor="border-l-amber-600"
        />
        
        <StatsCard
          title="Receita Estimada"
          value={`R$ ${totalRevenue.toFixed(2)}`}
          icon={<BadgeDollarSign size={18} />}
          iconColor="text-purple-600 bg-purple-50"
          borderColor="border-l-purple-600"
        />
      </ResponsiveGrid>
      
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
