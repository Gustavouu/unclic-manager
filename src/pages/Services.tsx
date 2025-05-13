
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicesTable } from "@/components/services/ServicesTable";
import { StatsCard } from "@/components/common/StatsCard";
import { useToast } from "@/hooks/use-toast";
import { useUserPermissions } from "@/components/hooks/useUserPermissions";
import { LoadingState } from "@/hooks/use-loading-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scissors, Calendar, BadgeDollarSign, Bookmark } from "lucide-react";
import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid";
import { ServicesHeader } from "@/components/services/ServicesHeader";
import { useServices, Service } from "@/hooks/useServices";

// Map database service to front-end ServiceData format
const mapServiceToServiceData = (service: Service) => {
  return {
    id: service.id,
    name: service.name || service.nome, // Use name or nome based on what's available
    duration: service.duracao,
    price: service.preco,
    category: "Geral", // Default category, can be enhanced with actual categories
    isPopular: false, // These could be dynamically set based on appointments data
    isFeatured: false,
    isActive: service.ativo,
    description: service.descricao
  };
};

const Services = () => {
  const { services: dbServices, isLoading, error, createService, updateService, deleteService } = useServices();
  const [filteredServices, setFilteredServices] = useState<any[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>('all');
  const { toast } = useToast();
  const { canAccess } = useUserPermissions();

  // Transform database services to the format expected by components
  const services = dbServices.map(mapServiceToServiceData);
  
  // Update loading state based on useServices hook
  useEffect(() => {
    if (isLoading) {
      setLoadingState('loading');
    } else if (error) {
      setLoadingState('error');
    } else {
      setLoadingState('success');
      setFilteredServices(applyFilters(services, searchQuery, activeTab));
    }
  }, [isLoading, error, services, searchQuery, activeTab]);

  const handleServiceCreated = async (newService: any) => {
    try {
      // Format the service for the database
      const dbService = {
        nome: newService.name,
        descricao: newService.description,
        preco: parseFloat(newService.price),
        duracao: parseInt(newService.duration),
        ativo: true,
        imagem_url: newService.image
      };
      
      await createService(dbService);
      
      toast({
        title: "Serviço criado",
        description: `O serviço "${newService.name}" foi criado com sucesso.`,
      });
    } catch (error: any) {
      console.error("Error creating service:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o serviço. " + (error.message || ""),
        variant: "destructive",
      });
    }
  };

  const handleServiceUpdated = async (updatedService: any) => {
    try {
      // Format the service for the database
      const dbService = {
        nome: updatedService.name,
        descricao: updatedService.description,
        preco: parseFloat(updatedService.price),
        duracao: parseInt(updatedService.duration),
        ativo: updatedService.isActive !== false
      };
      
      await updateService(updatedService.id, dbService);
      
      toast({
        title: "Serviço atualizado",
        description: `O serviço "${updatedService.name}" foi atualizado com sucesso.`,
      });
    } catch (error: any) {
      console.error("Error updating service:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o serviço. " + (error.message || ""),
        variant: "destructive",
      });
    }
  };

  const handleServiceDeleted = async (serviceId: string) => {
    try {
      const serviceToDelete = services.find(service => service.id === serviceId);
      
      await deleteService(serviceId);
      
      toast({
        title: "Serviço removido",
        description: serviceToDelete 
          ? `O serviço "${serviceToDelete.name}" foi removido com sucesso.` 
          : "O serviço foi removido com sucesso.",
      });
    } catch (error: any) {
      console.error("Error deleting service:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o serviço. " + (error.message || ""),
        variant: "destructive",
      });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilteredServices(applyFilters(services, query, activeTab));
  };

  const applyFilters = (services: any[], query: string, tab: string = 'all') => {
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

  const canManageServices = canAccess(['services.manage']);

  // Calculate statistics for the cards
  const totalServices = services.length;
  const activeServices = services.filter(service => service.isActive !== false).length;
  
  // Calculate average duration
  const totalDuration = services.reduce((sum, service) => sum + (service.duration || 0), 0);
  const averageDuration = services.length ? Math.round(totalDuration / services.length) : 0;
  
  // Calculate total estimated revenue
  const totalRevenue = services.reduce((sum, service) => {
    let price = typeof service.price === 'string' ? parseFloat(service.price) : service.price;
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
          description={`${Math.round((activeServices / totalServices) * 100) || 0}% do total`}
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
