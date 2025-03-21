
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterOptions } from "@/hooks/useClientData";
import { Badge } from "@/components/ui/badge";
import { X, SlidersHorizontal } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
  
  // Count active filters
  const activeFiltersCount = 
    (filterOptions.onlyActive ? 1 : 0) +
    (filterOptions.gender ? 1 : 0) +
    filterOptions.cities.length +
    filterOptions.categories.length +
    ((filterOptions.spentRange[0] > 0 || filterOptions.spentRange[1] < 1000) ? 1 : 0);

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="md:hidden mb-4">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-between"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        >
          <span className="flex items-center">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filtros
          </span>
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 bg-primary">{activeFiltersCount}</Badge>
          )}
        </Button>
      </div>
      
      <Card className={`${mobileFiltersOpen ? 'block' : 'hidden'} md:block bg-white/80 backdrop-blur-sm shadow-sm transition-all`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <SlidersHorizontal className="h-4 w-4 mr-2 inline" /> 
              Filtros
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 bg-primary">{activeFiltersCount}</Badge>
              )}
            </CardTitle>
            <button 
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Limpar todos
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="activeClient" className="text-sm font-medium cursor-pointer">Cliente ativo</Label>
              <Checkbox 
                id="activeClient"
                checked={filterOptions.onlyActive}
                onCheckedChange={(checked) => 
                  updateFilterOptions({ onlyActive: checked as boolean })
                }
              />
            </div>
          </div>

          <Separator className="my-2" />

          <div className="space-y-3">
            <Label className="text-sm font-medium">Total gasto</Label>
            <Slider 
              defaultValue={[0, 1000]}
              value={[filterOptions.spentRange[0], filterOptions.spentRange[1]]}
              max={1000}
              step={50}
              onValueChange={handleSpentRangeChange}
              className="mt-4"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1 font-medium">
              <span>R$ {filterOptions.spentRange[0]}</span>
              <span>R$ {filterOptions.spentRange[1]}</span>
            </div>
          </div>

          <Separator className="my-2" />

          <div className="space-y-3">
            <Label className="text-sm font-medium">Gênero</Label>
            <RadioGroup 
              defaultValue="todos"
              value={filterOptions.gender || "todos"}
              onValueChange={handleGenderChange}
              className="flex flex-col space-y-2 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="todos" id="todos" />
                <Label htmlFor="todos" className="text-sm font-normal cursor-pointer">Todos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Masculino" id="masculino" />
                <Label htmlFor="masculino" className="text-sm font-normal cursor-pointer">Masculino</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Feminino" id="feminino" />
                <Label htmlFor="feminino" className="text-sm font-normal cursor-pointer">Feminino</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator className="my-2" />

          <div className="space-y-3">
            <Label className="text-sm font-medium">Categorias</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableCategories.map((category) => {
                const isSelected = filterOptions.categories.includes(category);
                let badgeVariant: "default" | "outline" = isSelected ? "default" : "outline";
                let badgeColor = "";
                
                if (isSelected) {
                  switch(category) {
                    case 'VIP':
                      badgeColor = "bg-purple-500 hover:bg-purple-600";
                      break;
                    case 'Premium':
                      badgeColor = "bg-amber-500 hover:bg-amber-600";
                      break;
                    case 'Regular':
                      badgeColor = "bg-blue-500 hover:bg-blue-600";
                      break;
                    case 'Novo':
                      badgeColor = "bg-green-500 hover:bg-green-600";
                      break;
                    default:
                      badgeColor = "";
                  }
                }
                
                return (
                  <Badge 
                    key={category}
                    variant={badgeVariant}
                    className={`cursor-pointer transition-colors ${badgeColor}`}
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                    {isSelected && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                );
              })}
            </div>
          </div>

          <Separator className="my-2" />

          <div className="space-y-3">
            <Label className="text-sm font-medium">Cidades</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableCities.map((city) => (
                <Badge 
                  key={city}
                  variant={filterOptions.cities.includes(city) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleCityToggle(city)}
                >
                  {city}
                  {filterOptions.cities.includes(city) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
