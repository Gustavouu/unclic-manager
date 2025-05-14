
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, SlidersHorizontal } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ProfessionalStatus } from "@/hooks/professionals/types";

interface ProfessionalFiltersProps {
  onOpenAddProfessional: () => void;
  onFilterChange: (filters: ProfessionalFiltersState) => void;
}

export interface ProfessionalFiltersState {
  search: string;
  status: ProfessionalStatus | 'ALL';
  specialty: string | null;
}

const initialFilters: ProfessionalFiltersState = {
  search: "",
  status: 'ALL' as const,
  specialty: null,
};

export const ProfessionalFilters = ({ 
  onOpenAddProfessional, 
  onFilterChange 
}: ProfessionalFiltersProps) => {
  const [filters, setFilters] = useState<ProfessionalFiltersState>(initialFilters);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStatusFilter = (status: ProfessionalStatus | 'ALL') => {
    const newFilters = { ...filters, status };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar profissional..."
          className="pl-10"
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>
      
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filtrar</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem 
                className={filters.status === 'ALL' ? "bg-accent" : ""}
                onClick={() => handleStatusFilter('ALL')}
              >
                Todos
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={filters.status === ProfessionalStatus.ACTIVE ? "bg-accent" : ""}
                onClick={() => handleStatusFilter(ProfessionalStatus.ACTIVE)}
              >
                Ativos
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={filters.status === ProfessionalStatus.ON_LEAVE ? "bg-accent" : ""}
                onClick={() => handleStatusFilter(ProfessionalStatus.ON_LEAVE)}
              >
                Ausentes
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={filters.status === ProfessionalStatus.INACTIVE ? "bg-accent" : ""}
                onClick={() => handleStatusFilter(ProfessionalStatus.INACTIVE)}
              >
                Inativos
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {/* More filters could be added here */}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          className="flex gap-2" 
          onClick={onOpenAddProfessional}
        >
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Novo Profissional</span>
        </Button>
      </div>
    </div>
  );
};
