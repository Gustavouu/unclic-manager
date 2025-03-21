
import { FilterOptions } from "@/hooks/useClientData";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ClientFiltersProps {
  filterOptions: FilterOptions;
  updateFilterOptions: (newOptions: Partial<FilterOptions>) => void;
}

export const ClientFilters = ({ filterOptions, updateFilterOptions }: ClientFiltersProps) => {
  // Hard-coded available cities and categories from the sample data
  const availableCities = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba"];
  const availableCategories = ["VIP", "Premium", "Regular", "Novo"];
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className="mb-6 bg-muted/40 border-muted">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium mb-2 block">Valor Gasto</Label>
              <div className="px-2">
                <Slider
                  value={filterOptions.spentRange}
                  min={0}
                  max={1000}
                  step={10}
                  onValueChange={(value) => 
                    updateFilterOptions({ spentRange: value as [number, number] })
                  }
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <div>{formatCurrency(filterOptions.spentRange[0])}</div>
                  <div>{formatCurrency(filterOptions.spentRange[1])}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="onlyActive"
                checked={filterOptions.onlyActive}
                onCheckedChange={(checked) => 
                  updateFilterOptions({ onlyActive: checked })
                }
              />
              <Label htmlFor="onlyActive">Apenas clientes ativos</Label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium mb-2 block">Cidades</Label>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-2">
                {availableCities.map((city) => (
                  <div key={city} className="flex items-center space-x-2">
                    <Checkbox
                      id={`city-${city}`}
                      checked={filterOptions.cities.includes(city)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFilterOptions({ 
                            cities: [...filterOptions.cities, city] 
                          });
                        } else {
                          updateFilterOptions({ 
                            cities: filterOptions.cities.filter(c => c !== city) 
                          });
                        }
                      }}
                    />
                    <Label htmlFor={`city-${city}`}>{city}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium mb-2 block">Categorias</Label>
              <div className="space-y-2">
                {availableCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filterOptions.categories.includes(category)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFilterOptions({ 
                            categories: [...filterOptions.categories, category] 
                          });
                        } else {
                          updateFilterOptions({ 
                            categories: filterOptions.categories.filter(c => c !== category) 
                          });
                        }
                      }}
                    />
                    <Label htmlFor={`category-${category}`}>{category}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-2 block">Gênero</Label>
              <Select
                value={filterOptions.gender || ''}
                onValueChange={(value) => 
                  updateFilterOptions({ gender: value || null })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos os gêneros" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Feminino">Feminino</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
