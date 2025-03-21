
import { FilterOptions } from "@/hooks/useClientData";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, SlidersHorizontal, CalendarRange } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
  const [startDate, setStartDate] = useState<Date | undefined>(
    filterOptions.lastVisitRange[0] ? new Date(filterOptions.lastVisitRange[0]) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    filterOptions.lastVisitRange[1] ? new Date(filterOptions.lastVisitRange[1]) : undefined
  );

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

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    updateFilterOptions({
      lastVisitRange: [
        date ? date.toISOString().split('T')[0] : null,
        filterOptions.lastVisitRange[1],
      ],
    });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    updateFilterOptions({
      lastVisitRange: [
        filterOptions.lastVisitRange[0],
        date ? date.toISOString().split('T')[0] : null,
      ],
    });
  };

  const clearAllFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
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
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="activeClient" className="text-sm font-medium cursor-pointer">
                Cliente ativo
              </Label>
              <Checkbox
                id="activeClient"
                checked={filterOptions.onlyActive}
                onCheckedChange={(checked) =>
                  updateFilterOptions({ onlyActive: checked as boolean })
                }
              />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <Label className="text-sm font-medium">Data da última visita</Label>
            <div className="flex flex-col gap-3 mt-2">
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Data inicial</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarRange className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={handleStartDateChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Data final</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarRange className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={handleEndDateChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

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

          <Separator className="my-4" />

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
                <Label htmlFor="todos" className="text-sm font-normal cursor-pointer">
                  Todos
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Masculino" id="masculino" />
                <Label htmlFor="masculino" className="text-sm font-normal cursor-pointer">
                  Masculino
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Feminino" id="feminino" />
                <Label htmlFor="feminino" className="text-sm font-normal cursor-pointer">
                  Feminino
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <Label className="text-sm font-medium">Categorias</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableCategories.map((category) => {
                const isSelected = filterOptions.categories.includes(category);
                let badgeVariant: "default" | "outline" = isSelected ? "default" : "outline";
                let badgeColor = "";

                if (isSelected) {
                  switch (category) {
                    case "VIP":
                      badgeColor = "bg-purple-500 hover:bg-purple-600";
                      break;
                    case "Premium":
                      badgeColor = "bg-amber-500 hover:bg-amber-600";
                      break;
                    case "Regular":
                      badgeColor = "bg-blue-500 hover:bg-blue-600";
                      break;
                    case "Novo":
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
                    {isSelected && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                );
              })}
            </div>
          </div>

          <Separator className="my-4" />

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
                  {filterOptions.cities.includes(city) && <X className="ml-1 h-3 w-3" />}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
