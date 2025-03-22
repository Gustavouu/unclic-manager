
import { ServiceData } from "./servicesData";
import { Table, TableBody } from "@/components/ui/table";
import { TablePagination } from "@/components/common/TablePagination";
import { useState } from "react";
import { ServiceTableHeader } from "./table/ServiceTableHeader";
import { ServiceTableRow } from "./table/ServiceTableRow";
import { Star, TrendingUp } from "lucide-react";

interface ServicesTableProps {
  services: ServiceData[];
  onServiceUpdated: (updatedService: ServiceData) => void;
  onServiceDeleted: (serviceId: string) => void;
}

export const ServicesTable = ({ 
  services, 
  onServiceUpdated, 
  onServiceDeleted 
}: ServicesTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = services.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(services.length / itemsPerPage);

  return (
    <>
      <Table>
        <ServiceTableHeader />
        <TableBody>
          {currentServices.map((service) => (
            <ServiceTableRow
              key={service.id}
              service={service}
              onServiceUpdated={onServiceUpdated}
              onServiceDeleted={onServiceDeleted}
            />
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
