
import { ActiveProfessionalFilter } from "./filters/ActiveProfessionalFilter";
import { SpecialtiesFilter } from "./filters/SpecialtiesFilter";
import { LastActivityFilter } from "./filters/LastActivityFilter";
import { FiltersHeader } from "@/components/clients/filters/FiltersHeader";
import { useState } from "react";
import { FilterOptions } from "@/hooks/clients/types";

export const ProfessionalsFilters = () => {
  // Create a filter options state to match what FiltersHeader expects
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
    <div className="space-y-5 rounded-xl border border-border/60 bg-card p-5 shadow-sm">
      <FiltersHeader filterOptions={filterOptions} onClearFilters={handleClearFilters} />
      
      <div className="space-y-5 pt-1">
        <ActiveProfessionalFilter />
        <SpecialtiesFilter />
        <LastActivityFilter />
      </div>
    </div>
  );
};
