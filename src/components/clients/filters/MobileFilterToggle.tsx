
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal } from "lucide-react";
import { FilterOptions } from "@/hooks/clients";

type MobileFilterToggleProps = {
  filterOptions: FilterOptions;
  onClick: () => void;
  isOpen: boolean;
};

export const MobileFilterToggle = ({ 
  filterOptions, 
  onClick, 
  isOpen 
}: MobileFilterToggleProps) => {
  // Count active filters
  const activeFiltersCount = 
    (filterOptions.onlyActive ? 1 : 0) +
    (filterOptions.gender ? 1 : 0) +
    filterOptions.cities.length +
    filterOptions.categories.length +
    ((filterOptions.spentRange[0] > 0 || filterOptions.spentRange[1] < 1000) ? 1 : 0);

  return (
    <div className="md:hidden mb-4">
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-between"
        onClick={onClick}
      >
        <span className="flex items-center">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filtros
        </span>
        {activeFiltersCount > 0 && (
          <Badge className="ml-2 bg-primary">{activeFiltersCount}</Badge>
        )}
      </Button>
    </div>
  );
};
