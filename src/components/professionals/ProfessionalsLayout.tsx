
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ProfessionalsHeader } from "@/components/professionals/ProfessionalsHeader";
import { ProfessionalsTable } from "@/components/professionals/ProfessionalsTable";
import { ProfessionalFilters } from "@/components/professionals/ProfessionalFilters";
import { ProfessionalDetails } from "@/components/professionals/ProfessionalDetails";
import { FilterOptions } from "@/hooks/useProfessionalData";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProfessionalsLayoutProps {
  professionals: any[];
  filteredProfessionals: any[];
  filterOptions: FilterOptions;
  updateFilterOptions: (newOptions: Partial<FilterOptions>) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onDeleteProfessional: (id: string) => void;
  onAddProfessional: (newProfessional: any) => void;
}

export const ProfessionalsLayout = ({
  professionals,
  filteredProfessionals,
  filterOptions,
  updateFilterOptions,
  searchTerm,
  setSearchTerm,
  onDeleteProfessional,
  onAddProfessional
}: ProfessionalsLayoutProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleProfessionalClick = (id: string) => {
    setSelectedProfessionalId(id);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  return (
    <div className="w-full">
      <Card className="shadow-sm">
        <div className="p-6">
          <ProfessionalsHeader 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isFiltersOpen={isFiltersOpen}
            setIsFiltersOpen={setIsFiltersOpen}
            onAddProfessional={onAddProfessional}
          />
          
          {isFiltersOpen && (
            <ProfessionalFilters 
              filterOptions={filterOptions}
              updateFilterOptions={updateFilterOptions}
            />
          )}
          
          <ProfessionalsTable 
            professionals={filteredProfessionals} 
            onDelete={onDeleteProfessional} 
            onRowClick={handleProfessionalClick}
            selectedProfessionalId={selectedProfessionalId}
          />
        </div>
      </Card>
      
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {selectedProfessionalId && (
            <ProfessionalDetails 
              professionalId={selectedProfessionalId} 
              onClose={handleCloseDetails} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
