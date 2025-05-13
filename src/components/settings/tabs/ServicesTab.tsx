
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Cog, Trash2 } from "lucide-react";
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

export const ServicesTab = () => {
  const { services: dbServices, isLoading, error, createService, updateService, deleteService } = useServices();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // Transform database services to the format expected by components
  const services = dbServices.map(mapServiceToServiceData);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = services.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(services.length / itemsPerPage);

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
    } catch (error: any) {
      console.error("Error updating service:", error);
      toast.error("Erro ao atualizar serviço: " + (error.message || ""));
    }
  };

  const handleServiceDeleted = async (serviceId: string) => {
    try {
      await deleteService(serviceId);
      toast.success("Serviço removido com sucesso!");
    } catch (error: any) {
      console.error("Error deleting service:", error);
      toast.error("Erro ao remover serviço: " + (error.message || ""));
    }
  };

  // Function to format price to handle both string and number
  const formatPrice = (price: string | number) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numericPrice.toFixed(2);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-2">Carregando serviços...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-500">Erro ao carregar serviços: {error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

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
            <NewServiceDialog onServiceCreated={handleServiceCreated} />
          </div>
          
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
                            onServiceUpdated={handleServiceUpdated}
                          />
                          <DeleteServiceDialog
                            serviceId={service.id}
                            serviceName={service.name}
                            onServiceDeleted={handleServiceDeleted}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
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
        </div>
      </CardContent>
    </Card>
  );
};
