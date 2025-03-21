
import { FilterOptions } from "@/hooks/useProfessionalData";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useProfessionalData } from "@/hooks/useProfessionalData";

interface ProfessionalFiltersProps {
  filterOptions: FilterOptions;
  updateFilterOptions: (newOptions: Partial<FilterOptions>) => void;
}

export const ProfessionalFilters = ({ 
  filterOptions, 
  updateFilterOptions 
}: ProfessionalFiltersProps) => {
  // Usar o hook para obter as opções disponíveis para filtragem
  const { availableFilterOptions } = useProfessionalData();

  const handleStatusClick = (status: string) => {
    const newStatus = filterOptions.status.includes(status)
      ? filterOptions.status.filter(s => s !== status)
      : [...filterOptions.status, status];
    
    updateFilterOptions({ status: newStatus });
  };

  const handleRoleClick = (role: string) => {
    const newRoles = filterOptions.role.includes(role)
      ? filterOptions.role.filter(r => r !== role)
      : [...filterOptions.role, role];
    
    updateFilterOptions({ role: newRoles });
  };

  const handleSpecialtyClick = (specialty: string) => {
    const newSpecialties = filterOptions.specialty.includes(specialty)
      ? filterOptions.specialty.filter(s => s !== specialty)
      : [...filterOptions.specialty, specialty];
    
    updateFilterOptions({ specialty: newSpecialties });
  };

  const handleClearFilters = () => {
    updateFilterOptions({
      status: [],
      role: [],
      specialty: []
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'vacation': return 'Em férias';
      default: return status;
    }
  };

  const hasFilters = filterOptions.status.length > 0 || 
                    filterOptions.role.length > 0 || 
                    filterOptions.specialty.length > 0;

  return (
    <div className="mb-6 border rounded-md p-4 bg-muted/30">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Filtros</h3>
        {hasFilters && (
          <button 
            onClick={handleClearFilters}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Limpar filtros
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <h4 className="text-sm font-medium mb-2">Status</h4>
          <div className="flex flex-wrap gap-2">
            {availableFilterOptions.status.map(status => (
              <Badge 
                key={status} 
                variant={filterOptions.status.includes(status) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleStatusClick(status)}
              >
                {getStatusLabel(status)}
                {filterOptions.status.includes(status) && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Role Filter */}
        <div>
          <h4 className="text-sm font-medium mb-2">Função</h4>
          <div className="flex flex-wrap gap-2">
            {availableFilterOptions.role.map(role => (
              <Badge 
                key={role} 
                variant={filterOptions.role.includes(role) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleRoleClick(role)}
              >
                {role}
                {filterOptions.role.includes(role) && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Specialty Filter */}
        <div>
          <h4 className="text-sm font-medium mb-2">Especialidade</h4>
          <div className="flex flex-wrap gap-2">
            {availableFilterOptions.specialty.map(specialty => (
              <Badge 
                key={specialty} 
                variant={filterOptions.specialty.includes(specialty) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleSpecialtyClick(specialty)}
              >
                {specialty}
                {filterOptions.specialty.includes(specialty) && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
