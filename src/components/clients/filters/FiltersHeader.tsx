
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal } from "lucide-react";
import { FilterOptions } from "@/hooks/clients";

type FiltersHeaderProps = {
  filterOptions: FilterOptions;
  onClearFilters: () => void;
};

export const FiltersHeader = ({ filterOptions, onClearFilters }: FiltersHeaderProps) => {
  // Count active filters
  const activeFiltersCount = 
    (filterOptions.onlyActive ? 1 : 0) +
    (filterOptions.gender ? 1 : 0) +
    filterOptions.cities.length +
    filterOptions.categories.length +
    ((filterOptions.spentRange[0] > 0 || filterOptions.spentRange[1] < 1000) ? 1 : 0);

  return (
    <div className="flex justify-between items-center">
      <div className="text-lg flex items-center">
        <SlidersHorizontal className="h-4 w-4 mr-2 inline" /> 
        Filtros
        {activeFiltersCount > 0 && (
          <Badge className="ml-2 bg-primary">{activeFiltersCount}</Badge>
        )}
      </div>
      <button 
        onClick={onClearFilters}
        className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
      >
        Limpar todos
      </button>
    </div>
  );
};
