
import { Package, Filter } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InventoryFilterOptions } from "@/hooks/inventory";

interface InventoryFiltersProps {
  categories: string[];
  filterOptions: InventoryFilterOptions;
  updateFilterOptions: (options: Partial<InventoryFilterOptions>) => void;
}

export const InventoryFilters = ({ 
  categories, 
  filterOptions, 
  updateFilterOptions 
}: InventoryFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col gap-1.5 w-full sm:w-auto min-w-[200px]">
        <Label htmlFor="category-filter" className="text-sm font-medium flex items-center gap-1.5">
          <Package className="h-4 w-4" />
          Categoria
        </Label>
        <Select 
          value={filterOptions.category} 
          onValueChange={(value) => updateFilterOptions({ category: value })}
        >
          <SelectTrigger id="category-filter" className="h-9">
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

      <div className="flex flex-col gap-1.5 w-full sm:w-auto min-w-[180px]">
        <Label htmlFor="status-filter" className="text-sm font-medium flex items-center gap-1.5">
          <Filter className="h-4 w-4" />
          Status
        </Label>
        <Select 
          value={filterOptions.status} 
          onValueChange={(value) => updateFilterOptions({ status: value })}
        >
          <SelectTrigger id="status-filter" className="h-9">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="low">Estoque baixo</SelectItem>
            <SelectItem value="out">Sem estoque</SelectItem>
            <SelectItem value="in">Em estoque</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5 w-full sm:w-auto min-w-[180px]">
        <Label htmlFor="type-filter" className="text-sm font-medium flex items-center gap-1.5">
          <Package className="h-4 w-4" />
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
          <SelectTrigger id="type-filter" className="h-9">
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="product">Produtos</SelectItem>
            <SelectItem value="equipment">Equipamentos</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
