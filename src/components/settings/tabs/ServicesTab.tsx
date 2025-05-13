
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Cog, Trash2, RefreshCw } from "lucide-react";
import { NewServiceDialog } from "@/components/services/NewServiceDialog";
import { EditServiceDialog } from "@/components/services/EditServiceDialog";
import { DeleteServiceDialog } from "@/components/services/DeleteServiceDialog";
import { TablePagination } from "@/components/common/TablePagination";
import { Clock, DollarSign } from "lucide-react";
import { ServiceCategoryBadge } from "@/components/services/table/ServiceCategoryBadge";
import { ServiceIndicator } from "@/components/services/ServiceIndicator";
import { Star, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useServices, Service } from "@/hooks/useServices";

// Map database service to frontend ServiceData format
const mapServiceToServiceData = (service: Service) => {
  return {
    id: service.id,
    name: service.name || service.nome,
    duration: service.duracao,
    price: service.preco,
    category: "Geral", // Default category
    isPopular: false,
    isFeatured: false,
    isActive: service.ativo,
    description: service.descricao
  };
};

// Extract ServiceList as a separate component to decrease the file size
const ServiceList = ({ 
  services, 
  currentPage, 
  itemsPerPage, 
  onServiceUpdated, 
  onServiceDeleted 
}: { 
  services: any[],
  currentPage: number, 
  itemsPerPage: number,
  onServiceUpdated: (service: any) => Promise<void>,
  onServiceDeleted: (id: string) => Promise<void>
}) => {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = services.slice(indexOfFirstItem, indexOfLastItem);
  
  // Function to format price to handle both string and number
  const formatPrice = (price: string | number) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numericPrice.toFixed(2);
  };
  
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Serviço</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Duração</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentServices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                Nenhum serviço encontrado
              </TableCell>
            </TableRow>
          ) : (
            currentServices.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {service.name}
                    <div className="ml-2 flex">
                      {service.isPopular && (
                        <ServiceIndicator
                          icon={TrendingUp}
                          label="Serviço Popular"
                          color="text-blue-500"
                        />
                      )}
                      {service.isFeatured && (
                        <ServiceIndicator
                          icon={Star}
                          label="Serviço Destacado"
                          color="text-amber-500"
                        />
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <ServiceCategoryBadge category={service.category} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                    {service.duration} min
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <DollarSign className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                    R$ {formatPrice(service.price)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <EditServiceDialog 
                      service={service}
                      onServiceUpdated={onServiceUpdated}
                    />
                    <DeleteServiceDialog
                      serviceId={service.id}
                      serviceName={service.name}
                      onServiceDeleted={onServiceDeleted}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// Loader component to show while loading services
const ServiceLoader = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
    <span className="ml-3">Carregando serviços...</span>
  </div>
);

// Error component to show when there's an error loading services
const ServiceError = ({ error, onRetry }: { error: string, onRetry: () => void }) => (
  <div className="text-center py-10">
    <p className="text-red-500 mb-4">{error}</p>
    <Button onClick={onRetry} variant="outline">
      <RefreshCw className="mr-2 h-4 w-4" /> Tentar novamente
    </Button>
  </div>
);

export const ServicesTab = () => {
  const { services: dbServices, isLoading, error, createService, updateService, deleteService, refreshServices } = useServices();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // Transform database services to the format expected by components
  const services = dbServices.map(mapServiceToServiceData);
  const totalPages = Math.ceil(services.length / itemsPerPage);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const handleServiceCreated = async (newService: any) => {
    try {
      // Format the service for the database
      const dbService = {
        name: newService.name, // Add name property required by Service interface
        nome: newService.name,
        descricao: newService.description,
        preco: parseFloat(newService.price),
        duracao: parseInt(newService.duration),
        ativo: true,
        imagem_url: newService.image
      };
      
      await createService(dbService);
      toast.success("Serviço adicionado com sucesso!");
      refreshServices();
    } catch (error: any) {
      console.error("Error creating service:", error);
      toast.error("Erro ao criar serviço: " + (error.message || ""));
    }
  };

  const handleServiceUpdated = async (updatedService: any) => {
    try {
      // Format the service for the database
      const dbService = {
        name: updatedService.name, // Add name property required by Service interface
        nome: updatedService.name,
        descricao: updatedService.description,
        preco: parseFloat(updatedService.price),
        duracao: parseInt(updatedService.duration),
        ativo: updatedService.isActive !== false
      };
      
      await updateService(updatedService.id, dbService);
      toast.success("Serviço atualizado com sucesso!");
      refreshServices();
    } catch (error: any) {
      console.error("Error updating service:", error);
      toast.error("Erro ao atualizar serviço: " + (error.message || ""));
    }
  };

  const handleServiceDeleted = async (serviceId: string) => {
    try {
      await deleteService(serviceId);
      toast.success("Serviço removido com sucesso!");
      refreshServices();
    } catch (error: any) {
      console.error("Error deleting service:", error);
      toast.error("Erro ao remover serviço: " + (error.message || ""));
    }
  };

  const handleRetry = () => {
    refreshServices();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços e Preços</CardTitle>
        <CardDescription>
          Gerencie os serviços oferecidos pelo seu negócio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Serviços Oferecidos</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
                className="flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Atualizar
              </Button>
              <NewServiceDialog onServiceCreated={handleServiceCreated} />
            </div>
          </div>
          
          {isLoading ? (
            <ServiceLoader />
          ) : error ? (
            <ServiceError error={error} onRetry={handleRetry} />
          ) : (
            <>
              <ServiceList 
                services={services} 
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onServiceUpdated={handleServiceUpdated}
                onServiceDeleted={handleServiceDeleted}
              />
              
              <TablePagination 
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={services.length}
                indexOfFirstItem={indexOfFirstItem}
                indexOfLastItem={indexOfLastItem}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(value) => {
                  setItemsPerPage(value);
                  setCurrentPage(1);
                }}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
