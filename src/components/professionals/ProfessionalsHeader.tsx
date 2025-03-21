
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { FilterOptions } from "@/hooks/useProfessionalData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProfessionalsFiltersSheet } from "./filters/ProfessionalsFiltersSheet";

export type ProfessionalsHeaderProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterOptions: FilterOptions;
  updateFilterOptions: (newOptions: Partial<FilterOptions>) => void;
  isFiltersOpen?: boolean;
  setIsFiltersOpen?: (open: boolean) => void;
  onAddProfessional?: (newProfessional: any) => void;
};

export const ProfessionalsHeader = ({
  searchTerm,
  setSearchTerm,
  filterOptions,
  updateFilterOptions,
  isFiltersOpen,
  setIsFiltersOpen
}: ProfessionalsHeaderProps) => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Use the props if provided, otherwise use local state
  const isOpen = isFiltersOpen !== undefined ? isFiltersOpen : filtersOpen;
  const setOpen = setIsFiltersOpen || setFiltersOpen;

  // Count active filters
  const activeFiltersCount = 
    filterOptions.status.length +
    filterOptions.role.length +
    filterOptions.specialty.length;

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar colaboradores..."
          className="w-full pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setOpen(true)}
          className="relative"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs font-medium flex items-center justify-center text-primary-foreground">
              {activeFiltersCount}
            </span>
          )}
        </Button>
        
        <Button size="sm">
          Adicionar Colaborador
        </Button>
      </div>

      <ProfessionalsFiltersSheet
        open={isOpen}
        onOpenChange={setOpen}
        filterOptions={filterOptions}
        updateFilterOptions={updateFilterOptions}
      />
    </div>
  );
};
