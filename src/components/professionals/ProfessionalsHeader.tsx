
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, UserPlus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileFilterToggle } from "@/components/clients/filters/MobileFilterToggle";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { useState } from "react";
import { FilterOptions } from "@/hooks/clients/types";

interface ProfessionalsHeaderProps {
  onNewProfessional: () => void;
  onToggleFilters: () => void;
}

export const ProfessionalsHeader = ({ onNewProfessional, onToggleFilters }: ProfessionalsHeaderProps) => {
  const isMobile = useIsMobile();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterOptions: FilterOptions = {
    onlyActive: false,
    gender: "",
    cities: [],
    categories: [],
    spentRange: [0, 1000],
    lastVisitRange: [null, null]
  };
  
  return (
    <div className="space-y-5">
      <Breadcrumb items={[
        { label: "Home", active: false },
        { label: "Colaboradores", active: true },
      ]} />
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h1 className="text-2xl font-display font-semibold text-foreground/90">Colaboradores</h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar colaborador..." 
              className="pl-9 h-10 border-muted bg-background/50"
            />
          </div>
          
          {!isMobile && (
            <Button 
              variant="outline" 
              size="icon"
              onClick={onToggleFilters} 
              className="h-10 w-10 shrink-0 border-muted"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          )}
          
          <Button 
            onClick={onNewProfessional}
            className="h-10 gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <UserPlus className="h-4 w-4" />
            {isMobile ? "" : "Novo Colaborador"}
          </Button>
          
          {isMobile && (
            <MobileFilterToggle 
              onClick={onToggleFilters} 
              filterOptions={filterOptions}
              isOpen={isFilterOpen}
            />
          )}
        </div>
      </div>
    </div>
  );
};
