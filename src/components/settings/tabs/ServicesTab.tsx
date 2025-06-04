
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Cog, Trash2 } from "lucide-react";
import { ServiceData, services as initialServices } from "@/components/services/servicesData";
import { NewServiceDialog } from "@/components/services/NewServiceDialog";
import { EditServiceDialog } from "@/components/services/EditServiceDialog";
import { DeleteServiceDialog } from "@/components/services/DeleteServiceDialog";
import { TablePagination } from "@/components/common/TablePagination";
import { Clock, DollarSign } from "lucide-react";
import { ServiceCategoryBadge } from "@/components/services/table/ServiceCategoryBadge";
import { ServiceIndicator } from "@/components/services/ServiceIndicator";
import { Star, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export const ServicesTab = () => {
  const [services, setServices] = useState<ServiceData[]>(initialServices);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showNewServiceDialog, setShowNewServiceDialog] = useState(false);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = services.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(services.length / itemsPerPage);

  const handleServiceCreated = (newService: ServiceData) => {
    setServices(prev => [...prev, newService]);
    toast.success("Serviço adicionado com sucesso!");
  };

  const handleServiceUpdated = (updatedService: ServiceData) => {
    setServices(prev => 
      prev.map(service => 
        service.id === updatedService.id ? updatedService : service
      )
    );
    toast.success("Serviço atualizado com sucesso!");
  };

  const handleServiceDeleted = (serviceId: string) => {
    setServices(prev => prev.filter(service => service.id !== serviceId));
    toast.success("Serviço removido com sucesso!");
  };

  // Function to format price to handle both string and number
  const formatPrice = (price: string | number) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numericPrice.toFixed(2);
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
            <Button onClick={() => setShowNewServiceDialog(true)}>
              Adicionar Serviço
            </Button>
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
                {currentServices.map((service) => (
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
                ))}
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
      
      <NewServiceDialog
        open={showNewServiceDialog}
        onOpenChange={setShowNewServiceDialog}
        onServiceCreated={handleServiceCreated}
      />
    </Card>
  );
};
