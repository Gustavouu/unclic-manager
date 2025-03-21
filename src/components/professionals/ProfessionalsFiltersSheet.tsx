
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

interface ProfessionalsFiltersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfessionalsFiltersSheet = ({
  open,
  onOpenChange,
}: ProfessionalsFiltersSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="space-y-0">
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>
        
        <FilterSheetHeader onClear={() => console.log("Limpar filtros")} />
        
        <div className="mt-4 space-y-5 px-1">
          <ActiveProfessionalFilter />
          <SpecialtiesFilter />
          <LastActivityFilter />
        </div>
      </SheetContent>
    </Sheet>
  );
};
