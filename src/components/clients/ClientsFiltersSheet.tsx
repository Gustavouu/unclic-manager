
import { FilterOptions } from "@/hooks/clients";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { ActiveClientFilter } from "./filters/ActiveClientFilter";
import { LastVisitFilter } from "./filters/LastVisitFilter";
import { SpentRangeFilter } from "./filters/SpentRangeFilter";
import { GenderFilter } from "./filters/GenderFilter";
import { CategoriesFilter } from "./filters/CategoriesFilter";
import { CitiesFilter } from "./filters/CitiesFilter";

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
              onClick={clearAllFilters}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Limpar todos
            </Button>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <ActiveClientFilter 
            checked={filterOptions.onlyActive}
            onCheckedChange={(checked) => updateFilterOptions({ onlyActive: checked })}
          />

          <Separator className="my-4" />

          <LastVisitFilter
            value={filterOptions.lastVisitRange}
            onChange={handleLastVisitRangeChange}
          />

          <Separator className="my-4" />

          <SpentRangeFilter
            value={filterOptions.spentRange}
            onChange={handleSpentRangeChange}
          />

          <Separator className="my-4" />

          <GenderFilter
            value={filterOptions.gender}
            onChange={handleGenderChange}
          />

          <Separator className="my-4" />

          <CategoriesFilter
            categories={availableCategories}
            selectedCategories={filterOptions.categories}
            onToggle={handleCategoryToggle}
          />

          <Separator className="my-4" />

          <CitiesFilter
            cities={availableCities}
            selectedCities={filterOptions.cities}
            onToggle={handleCityToggle}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
