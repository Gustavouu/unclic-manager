
import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";

type FilterSheetHeaderProps = {
  onClearFilters: () => void;
};

export const FilterSheetHeader = ({ onClearFilters }: FilterSheetHeaderProps) => {
  return (
    <SheetHeader className="mb-6">
      <SheetTitle className="flex items-center">
        <SlidersHorizontal className="h-5 w-5 mr-2" />
        Filtros
      </SheetTitle>
      <SheetDescription className="flex justify-between items-center">
        <span>Filtrar clientes por diferentes critérios</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          Limpar todos
        </Button>
      </SheetDescription>
    </SheetHeader>
  );
};
