
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterOptions } from "@/hooks/useClientData";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Filtros</CardTitle>
          <button 
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Limpar todos
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Cliente ativo</Label>
            <Checkbox 
              checked={filterOptions.onlyActive}
              onCheckedChange={(checked) => 
                updateFilterOptions({ onlyActive: checked as boolean })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Total gasto (R$)</Label>
          <Slider 
            defaultValue={[0, 1000]}
            value={[filterOptions.spentRange[0], filterOptions.spentRange[1]]}
            max={1000}
            step={50}
            onValueChange={handleSpentRangeChange}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>R$ {filterOptions.spentRange[0]}</span>
            <span>R$ {filterOptions.spentRange[1]}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Gênero</Label>
          <RadioGroup 
            defaultValue="todos"
            value={filterOptions.gender || "todos"}
            onValueChange={handleGenderChange}
            className="flex flex-col space-y-1 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="todos" id="todos" />
              <Label htmlFor="todos" className="text-sm font-normal">Todos</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Masculino" id="masculino" />
              <Label htmlFor="masculino" className="text-sm font-normal">Masculino</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Feminino" id="feminino" />
              <Label htmlFor="feminino" className="text-sm font-normal">Feminino</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Categorias</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {availableCategories.map((category) => (
              <Badge 
                key={category}
                variant={filterOptions.categories.includes(category) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleCategoryToggle(category)}
              >
                {category}
                {filterOptions.categories.includes(category) && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
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
  );
};
