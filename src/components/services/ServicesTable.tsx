
import { ServiceIndicator } from "./ServiceIndicator";
import { ServiceData } from "./servicesData";
import { Clock, DollarSign, TrendingUp, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/common/TablePagination";
import { useState } from "react";

interface ServicesTableProps {
  services: ServiceData[];
}

export const ServicesTable = ({ services }: ServicesTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = services.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(services.length / itemsPerPage);

  return (
    <>
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
                <Badge variant="outline" className="bg-primary/10">
                  {service.category}
                </Badge>
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
                  R$ {service.price.toFixed(2)}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="mt-2">
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
    </>
  );
};
