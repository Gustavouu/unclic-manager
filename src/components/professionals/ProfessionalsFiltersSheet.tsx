
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FilterSheetHeader } from "@/components/clients/filters/FilterSheetHeader";
import { ActiveProfessionalFilter } from "./filters/ActiveProfessionalFilter";
import { SpecialtiesFilter } from "./filters/SpecialtiesFilter";
import { LastActivityFilter } from "./filters/LastActivityFilter";
import { useState } from "react";
import { FilterOptions } from "@/hooks/clients/types";

interface ProfessionalsFiltersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfessionalsFiltersSheet = ({
  open,
  onOpenChange,
}: ProfessionalsFiltersSheetProps) => {
  // Create filter options state to match what FilterSheetHeader expects
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    onlyActive: false,
    gender: "",
    cities: [],
    categories: [],
    spentRange: [0, 1000],
    lastVisitRange: [null, null]
  });

  const handleClearFilters = () => {
    console.log("Limpar filtros");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="space-y-0">
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>
        
        <FilterSheetHeader onClearFilters={handleClearFilters} />
        
        <div className="mt-4 space-y-5 px-1">
          <ActiveProfessionalFilter />
          <SpecialtiesFilter />
          <LastActivityFilter />
        </div>
      </SheetContent>
    </Sheet>
  );
};
