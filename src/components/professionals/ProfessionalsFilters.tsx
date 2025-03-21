
import { ActiveProfessionalFilter } from "./filters/ActiveProfessionalFilter";
import { SpecialtiesFilter } from "./filters/SpecialtiesFilter";
import { LastActivityFilter } from "./filters/LastActivityFilter";
import { FiltersHeader } from "@/components/clients/filters/FiltersHeader";

export const ProfessionalsFilters = () => {
  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <FiltersHeader title="Filtros" onClear={() => console.log("Limpar filtros")} />
      
      <div className="space-y-4">
        <ActiveProfessionalFilter />
        <SpecialtiesFilter />
        <LastActivityFilter />
      </div>
    </div>
  );
};
