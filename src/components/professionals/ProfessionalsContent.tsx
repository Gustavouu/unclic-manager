
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ProfessionalFilters } from "./ProfessionalFilters";
import { ProfessionalsTable } from "./ProfessionalsTable";
import { ProfessionalsPagination } from "./pagination/ProfessionalsPagination";
import { FilterOptions } from "@/hooks/useProfessionalData";
import { Professional } from "@/hooks/useProfessionalData";

interface ProfessionalsContentProps {
  professionals: Professional[];
  filteredProfessionals: Professional[];
  filterOptions: FilterOptions;
  updateFilterOptions: (newOptions: Partial<FilterOptions>) => void;
  onShowDetails: (id: string) => void;
  onDelete: (id: string) => void;
  selectedProfessionalId: string | null;
}

export const ProfessionalsContent = ({
  filteredProfessionals,
  filterOptions,
  updateFilterOptions,
  onShowDetails,
  onDelete,
  selectedProfessionalId
}: ProfessionalsContentProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const indexOfLastProfessional = currentPage * itemsPerPage;
  const indexOfFirstProfessional = indexOfLastProfessional - itemsPerPage;
  const currentProfessionals = filteredProfessionals.slice(indexOfFirstProfessional, indexOfLastProfessional);

  const handleRowClick = (id: string) => {
    onShowDetails(id);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
      <div className="lg:col-span-1">
        <ProfessionalFilters 
          filterOptions={filterOptions}
          updateFilterOptions={updateFilterOptions}
        />
      </div>
      
      <div className="lg:col-span-3">
        <Card className="border shadow-sm">
          <ProfessionalsTable 
            professionals={currentProfessionals} 
            onRowClick={handleRowClick} 
            onDelete={onDelete}
            selectedProfessionalId={selectedProfessionalId}
          />
          
          <ProfessionalsPagination
            totalItems={filteredProfessionals.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
        </Card>
      </div>
    </div>
  );
};
