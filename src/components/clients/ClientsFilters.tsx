
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterOptions } from "@/hooks/clients";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { ActiveClientFilter } from "./filters/ActiveClientFilter";
import { SpentRangeFilter } from "./filters/SpentRangeFilter";
import { GenderFilter } from "./filters/GenderFilter";
import { CategoriesFilter } from "./filters/CategoriesFilter";
import { CitiesFilter } from "./filters/CitiesFilter";
import { FiltersHeader } from "./filters/FiltersHeader";
import { MobileFilterToggle } from "./filters/MobileFilterToggle";

type ClientsFiltersProps = {
  filterOptions: FilterOptions;
  updateFilterOptions: (newOptions: Partial<FilterOptions>) => void;
  availableCities: string[];
  availableCategories: string[];
};

export const ClientsFilters = ({ 
  filterOptions, 
  updateFilterOptions,
  availableCities,
  availableCategories
}: ClientsFiltersProps) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [initialMounted, setInitialMounted] = useState(false);
  
  useEffect(() => {
    setInitialMounted(true);
  }, []);
  
  const handleCityToggle = (city: string) => {
    const newCities = filterOptions.cities.includes(city)
      ? filterOptions.cities.filter(c => c !== city)
      : [...filterOptions.cities, city];
    
    updateFilterOptions({ cities: newCities });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filterOptions.categories.includes(category)
      ? filterOptions.categories.filter(c => c !== category)
      : [...filterOptions.categories, category];
    
    updateFilterOptions({ categories: newCategories });
  };

  const handleSpentRangeChange = (values: number[]) => {
    updateFilterOptions({ 
      spentRange: [values[0], values[1]] as [number, number] 
    });
  };

  const handleGenderChange = (value: string) => {
    updateFilterOptions({ gender: value === "todos" ? null : value });
  };

  const clearAllFilters = () => {
    updateFilterOptions({
      spentRange: [0, 1000],
      lastVisitRange: [null, null],
      onlyActive: false,
      cities: [],
      categories: [],
      gender: null
    });
  };

  return (
    <>
      <MobileFilterToggle 
        filterOptions={filterOptions}
        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        isOpen={mobileFiltersOpen}
      />
      
      <Card className={`${mobileFiltersOpen ? 'block' : 'hidden'} md:block bg-white/80 backdrop-blur-sm shadow-sm transition-all`}>
        <CardHeader className="pb-3">
          <CardTitle>
            <FiltersHeader 
              filterOptions={filterOptions} 
              onClearFilters={clearAllFilters} 
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <ActiveClientFilter 
            checked={filterOptions.onlyActive}
            onCheckedChange={(checked) => updateFilterOptions({ onlyActive: checked })}
          />

          <Separator className="my-2" />

          <SpentRangeFilter 
            value={filterOptions.spentRange}
            onChange={handleSpentRangeChange}
          />

          <Separator className="my-2" />

          <GenderFilter 
            value={filterOptions.gender}
            onChange={handleGenderChange}
          />

          <Separator className="my-2" />

          <CategoriesFilter 
            categories={availableCategories}
            selectedCategories={filterOptions.categories}
            onToggle={handleCategoryToggle}
          />

          <Separator className="my-2" />

          <CitiesFilter 
            cities={availableCities}
            selectedCities={filterOptions.cities}
            onToggle={handleCityToggle}
          />
        </CardContent>
      </Card>
    </>
  );
};
