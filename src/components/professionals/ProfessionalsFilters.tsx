
import { ActiveProfessionalFilter } from "./filters/ActiveProfessionalFilter";
import { SpecialtiesFilter } from "./filters/SpecialtiesFilter";
import { LastActivityFilter } from "./filters/LastActivityFilter";
import { FiltersHeader } from "@/components/clients/filters/FiltersHeader";
import { useState } from "react";

export const ProfessionalsFilters = () => {
  // Create a simple filter options state to match what FiltersHeader expects
  const [filterOptions, setFilterOptions] = useState({
    onlyActive: false,
    gender: "",
    cities: [],
    categories: [],
    spentRange: [0, 1000]
  });

  const handleClearFilters = () => {
    console.log("Limpar filtros");
  };

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <FiltersHeader filterOptions={filterOptions} onClearFilters={handleClearFilters} />
      
      <div className="space-y-4">
        <ActiveProfessionalFilter />
        <SpecialtiesFilter />
        <LastActivityFilter />
      </div>
    </div>
  );
};
