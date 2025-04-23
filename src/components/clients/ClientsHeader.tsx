import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, SlidersHorizontal, Plus } from "lucide-react";
import { useState } from "react";
import { NewClientDialog } from "./NewClientDialog";
import { ClientsFiltersSheet } from "./ClientsFiltersSheet";
import { FilterOptions } from "@/hooks/clients";
import { Skeleton } from "@/components/ui/skeleton";

type ClientsHeaderProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterOptions: FilterOptions;
  updateFilterOptions: (newOptions: Partial<FilterOptions>) => void;
  availableCities: string[];
  availableCategories: string[];
  loading?: boolean;
};

export const ClientsHeader = ({ 
  searchTerm, 
  setSearchTerm, 
  filterOptions,
  updateFilterOptions,
  availableCities,
  availableCategories,
  loading = false
}: ClientsHeaderProps) => {
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);

  // Count active filters
  const activeFiltersCount = 
    (filterOptions.onlyActive ? 1 : 0) +
    (filterOptions.gender ? 1 : 0) +
    filterOptions.cities.length +
    filterOptions.categories.length +
    ((filterOptions.spentRange[0] > 0 || filterOptions.spentRange[1] < 1000) ? 1 : 0) +
    (filterOptions.lastVisitRange[0] || filterOptions.lastVisitRange[1] ? 1 : 0);

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <Skeleton className="h-10 w-full md:w-96" />
        <div className="flex gap-2 w-full md:w-auto">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Buscar cliente por nome, email ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 bg-white"
        />
      </div>
      <div className="flex gap-2 w-full md:w-auto">
        <Button 
          onClick={() => setShowFiltersSheet(true)}
          variant="outline"
          className="w-full md:w-auto relative"
        >
          <SlidersHorizontal size={18} className="mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
        <Button 
          onClick={() => setShowNewClientDialog(true)}
          className="w-full md:w-auto bg-primary"
        >
          <Plus size={18} className="mr-2" />
          Novo Cliente
        </Button>
      </div>
      
      {showNewClientDialog && (
        <NewClientDialog onClose={() => setShowNewClientDialog(false)} />
      )}

      {showFiltersSheet && (
        <ClientsFiltersSheet 
          open={showFiltersSheet}
          onOpenChange={setShowFiltersSheet}
          filterOptions={filterOptions}
          updateFilterOptions={updateFilterOptions}
          availableCities={availableCities}
          availableCategories={availableCategories}
        />
      )}
    </div>
  );
};
