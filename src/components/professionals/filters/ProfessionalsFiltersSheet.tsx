
import { FilterOptions } from "@/hooks/useProfessionalData";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { FilterSheetHeader } from "@/components/clients/filters/FilterSheetHeader";
import { FilterItem } from "@/components/clients/filters/FilterItem";
import { StatusFilter } from "./StatusFilter";
import { RoleFilter } from "./RoleFilter";
import { SpecialtyFilter } from "./SpecialtyFilter";

type ProfessionalsFiltersSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filterOptions: FilterOptions;
  updateFilterOptions: (newOptions: Partial<FilterOptions>) => void;
};

export const ProfessionalsFiltersSheet = ({
  open,
  onOpenChange,
  filterOptions,
  updateFilterOptions,
}: ProfessionalsFiltersSheetProps) => {
  const handleStatusToggle = (status: string) => {
    const newStatus = filterOptions.status.includes(status)
      ? filterOptions.status.filter(s => s !== status)
      : [...filterOptions.status, status];
    
    updateFilterOptions({ status: newStatus });
  };

  const handleRoleToggle = (role: string) => {
    const newRoles = filterOptions.role.includes(role)
      ? filterOptions.role.filter(r => r !== role)
      : [...filterOptions.role, role];
    
    updateFilterOptions({ role: newRoles });
  };

  const handleSpecialtyToggle = (specialty: string) => {
    const newSpecialties = filterOptions.specialty.includes(specialty)
      ? filterOptions.specialty.filter(s => s !== specialty)
      : [...filterOptions.specialty, specialty];
    
    updateFilterOptions({ specialty: newSpecialties });
  };

  const clearAllFilters = () => {
    updateFilterOptions({
      status: [],
      role: [],
      specialty: []
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <FilterSheetHeader onClearFilters={clearAllFilters} />

        <div className="space-y-6">
          <FilterItem>
            <StatusFilter 
              statuses={['active', 'inactive', 'vacation']}
              selectedStatuses={filterOptions.status}
              onToggle={handleStatusToggle}
            />
          </FilterItem>

          <FilterItem>
            <RoleFilter
              roles={['Cabeleireira', 'Barbeiro', 'Esteticista', 'Manicure']}
              selectedRoles={filterOptions.role}
              onToggle={handleRoleToggle}
            />
          </FilterItem>

          <FilterItem showSeparator={false}>
            <SpecialtyFilter
              specialties={['Coloração', 'Barba', 'Massagem', 'Unhas em Gel', 'Penteados']}
              selectedSpecialties={filterOptions.specialty}
              onToggle={handleSpecialtyToggle}
            />
          </FilterItem>
        </div>
      </SheetContent>
    </Sheet>
  );
};
