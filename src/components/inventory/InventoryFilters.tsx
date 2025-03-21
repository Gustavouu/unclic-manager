
import { Search, Package, Filter, Tag, Layers3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InventoryFilterOptions } from "@/hooks/inventory";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface InventoryFiltersProps {
  categories: string[];
  filterOptions: InventoryFilterOptions;
  updateFilterOptions: (options: Partial<InventoryFilterOptions>) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const InventoryFilters = ({ 
  categories, 
  filterOptions, 
  updateFilterOptions,
  searchTerm,
  setSearchTerm
}: InventoryFiltersProps) => {
  return (
    <div className="space-y-5">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <Card className="border-none shadow-none bg-muted/30">
        <CardContent className="p-5">
          <div className="flex flex-wrap gap-5">
            <div className="flex flex-col gap-2 w-full sm:w-auto min-w-[180px]">
              <Label htmlFor="category-filter" className="text-sm font-medium flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Categorias
              </Label>
              <Select 
                value={filterOptions.category} 
                onValueChange={(value) => updateFilterOptions({ category: value })}
              >
                <SelectTrigger id="category-filter" className="h-10">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto min-w-[180px]">
              <Label htmlFor="status-filter" className="text-sm font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Status
              </Label>
              <Select 
                value={filterOptions.status} 
                onValueChange={(value) => updateFilterOptions({ status: value })}
              >
                <SelectTrigger id="status-filter" className="h-10">
                  <SelectValue placeholder="Todo o estoque" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo o estoque</SelectItem>
                  <SelectItem value="low">Estoque baixo</SelectItem>
                  <SelectItem value="out">Sem estoque</SelectItem>
                  <SelectItem value="in">Em estoque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto min-w-[180px]">
              <Label htmlFor="type-filter" className="text-sm font-medium flex items-center gap-2">
                <Layers3 className="h-4 w-4" />
                Tipo
              </Label>
              <Select 
                value={filterOptions.isEquipment === null ? "all" : filterOptions.isEquipment ? "equipment" : "product"}
                onValueChange={(value) => {
                  let isEquipment = null;
                  if (value === "equipment") isEquipment = true;
                  if (value === "product") isEquipment = false;
                  updateFilterOptions({ isEquipment });
                }}
              >
                <SelectTrigger id="type-filter" className="h-10">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="product">Produtos</SelectItem>
                  <SelectItem value="equipment">Equipamentos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end ml-auto">
              <Button variant="outline" size="default" className="h-10">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
