
import { useState } from "react";
import { Card } from "@/components/ui/card";
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
    <div className="mb-6">
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
  );
};
