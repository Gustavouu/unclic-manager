
import { FilterOptions } from "@/hooks/clients";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { ActiveClientFilter } from "./filters/ActiveClientFilter";
import { LastVisitFilter } from "./filters/LastVisitFilter";
import { SpentRangeFilter } from "./filters/SpentRangeFilter";
import { GenderFilter } from "./filters/GenderFilter";
import { CategoriesFilter } from "./filters/CategoriesFilter";
import { CitiesFilter } from "./filters/CitiesFilter";
import { FilterSheetHeader } from "./filters/FilterSheetHeader";
import { FilterItem } from "./filters/FilterItem";

type ClientsFiltersSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filterOptions: FilterOptions;
  updateFilterOptions: (newOptions: Partial<FilterOptions>) => void;
  availableCities: string[];
  availableCategories: string[];
};

export const ClientsFiltersSheet = ({
  open,
  onOpenChange,
  filterOptions,
  updateFilterOptions,
  availableCities,
  availableCategories,
}: ClientsFiltersSheetProps) => {
  const handleCityToggle = (city: string) => {
    const newCities = filterOptions.cities.includes(city)
      ? filterOptions.cities.filter((c) => c !== city)
      : [...filterOptions.cities, city];

    updateFilterOptions({ cities: newCities });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filterOptions.categories.includes(category)
      ? filterOptions.categories.filter((c) => c !== category)
      : [...filterOptions.categories, category];

    updateFilterOptions({ categories: newCategories });
  };

  const handleSpentRangeChange = (values: number[]) => {
    updateFilterOptions({
      spentRange: [values[0], values[1]] as [number, number],
    });
  };

  const handleGenderChange = (value: string) => {
    updateFilterOptions({ gender: value === "todos" ? null : value });
  };

  const handleLastVisitRangeChange = (value: [string | null, string | null]) => {
    updateFilterOptions({ lastVisitRange: value });
  };

  const clearAllFilters = () => {
    updateFilterOptions({
      spentRange: [0, 1000],
      lastVisitRange: [null, null],
      onlyActive: false,
      cities: [],
      categories: [],
      gender: null,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <FilterSheetHeader onClearFilters={clearAllFilters} />

        <div className="space-y-6">
          <FilterItem>
            <ActiveClientFilter 
              checked={filterOptions.onlyActive}
              onCheckedChange={(checked) => updateFilterOptions({ onlyActive: checked })}
            />
          </FilterItem>

          <FilterItem>
            <LastVisitFilter
              value={filterOptions.lastVisitRange}
              onChange={handleLastVisitRangeChange}
            />
          </FilterItem>

          <FilterItem>
            <SpentRangeFilter
              value={filterOptions.spentRange}
              onChange={handleSpentRangeChange}
            />
          </FilterItem>

          <FilterItem>
            <GenderFilter
              value={filterOptions.gender}
              onChange={handleGenderChange}
            />
          </FilterItem>

          <FilterItem>
            <CategoriesFilter
              categories={availableCategories}
              selectedCategories={filterOptions.categories}
              onToggle={handleCategoryToggle}
            />
          </FilterItem>

          <FilterItem showSeparator={false}>
            <CitiesFilter
              cities={availableCities}
              selectedCities={filterOptions.cities}
              onToggle={handleCityToggle}
            />
          </FilterItem>
        </div>
      </SheetContent>
    </Sheet>
  );
};
