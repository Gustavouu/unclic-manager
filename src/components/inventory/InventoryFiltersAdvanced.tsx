
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, X, ArrowUpDown, Download } from "lucide-react";
import { PRODUCT_CATEGORIES } from './form/productFormSchema';
import { InventoryFilters } from '@/hooks/inventory/useInventoryFilters';

interface InventoryFiltersAdvancedProps {
  filters: InventoryFilters;
  onFilterChange: (key: keyof InventoryFilters, value: any) => void;
  onClearFilters: () => void;
  onExport?: () => void;
  totalProducts: number;
  filteredCount: number;
}

export const InventoryFiltersAdvanced = ({
  filters,
  onFilterChange,
  onClearFilters,
  onExport,
  totalProducts,
  filteredCount,
}: InventoryFiltersAdvancedProps) => {
  const activeFiltersCount = [
    filters.search,
    filters.category !== 'all' ? filters.category : null,
    filters.status !== 'all' ? filters.status : null,
  ].filter(Boolean).length;

  const statusOptions = [
    { value: 'all', label: 'Todos', count: totalProducts },
    { value: 'normal', label: 'Estoque Normal' },
    { value: 'low', label: 'Estoque Baixo' },
    { value: 'out', label: 'Sem Estoque' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Nome' },
    { value: 'category', label: 'Categoria' },
    { value: 'price', label: 'Preço' },
    { value: 'quantity', label: 'Quantidade' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Buscar produto, fornecedor..." 
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full h-8 pl-8 text-xs"
          />
        </div>
        
        {/* Category Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1 h-8 text-xs">
              <Filter className="h-3.5 w-3.5" />
              Categoria
              {filters.category !== 'all' && (
                <Badge variant="secondary" className="h-4 px-1 text-xs">
                  1
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel className="text-xs">Categorias</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem 
                onClick={() => onFilterChange('category', 'all')} 
                className="text-xs cursor-pointer"
              >
                <div className="w-3.5 h-3.5 flex items-center justify-center">
                  {filters.category === 'all' && <div className="w-2 h-2 bg-primary rounded-full" />}
                </div>
                Todas
              </DropdownMenuItem>
              {PRODUCT_CATEGORIES.map((category) => (
                <DropdownMenuItem 
                  key={category.value}
                  onClick={() => onFilterChange('category', category.value)} 
                  className="text-xs cursor-pointer"
                >
                  <div className="w-3.5 h-3.5 flex items-center justify-center">
                    {filters.category === category.value && <div className="w-2 h-2 bg-primary rounded-full" />}
                  </div>
                  {category.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1 h-8 text-xs">
              Status
              {filters.status !== 'all' && (
                <Badge variant="secondary" className="h-4 px-1 text-xs">
                  1
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel className="text-xs">Status do Estoque</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {statusOptions.map((status) => (
                <DropdownMenuItem 
                  key={status.value}
                  onClick={() => onFilterChange('status', status.value)} 
                  className="text-xs cursor-pointer"
                >
                  <div className="w-3.5 h-3.5 flex items-center justify-center">
                    {filters.status === status.value && <div className="w-2 h-2 bg-primary rounded-full" />}
                  </div>
                  {status.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1 h-8 text-xs">
              <ArrowUpDown className="h-3.5 w-3.5" />
              Ordenar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel className="text-xs">Ordenar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {sortOptions.map((sort) => (
                <DropdownMenuItem 
                  key={sort.value}
                  onClick={() => onFilterChange('sortBy', sort.value)} 
                  className="text-xs cursor-pointer"
                >
                  <div className="w-3.5 h-3.5 flex items-center justify-center">
                    {filters.sortBy === sort.value && <div className="w-2 h-2 bg-primary rounded-full" />}
                  </div>
                  {sort.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')} 
              className="text-xs cursor-pointer"
            >
              {filters.sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Export */}
        {onExport && (
          <Button variant="outline" size="sm" onClick={onExport} className="gap-1 h-8 text-xs">
            <Download className="h-3.5 w-3.5" />
            Exportar
          </Button>
        )}

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters} 
            className="gap-1 h-8 text-xs text-muted-foreground"
          >
            <X className="h-3.5 w-3.5" />
            Limpar
          </Button>
        )}
      </div>

      {/* Active Filters & Results Count */}
      <div className="flex flex-wrap gap-2 items-center">
        {filters.search && (
          <Badge variant="secondary" className="gap-1">
            Busca: "{filters.search}"
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => onFilterChange('search', '')}
            />
          </Badge>
        )}
        {filters.category !== 'all' && (
          <Badge variant="secondary" className="gap-1">
            {PRODUCT_CATEGORIES.find(c => c.value === filters.category)?.label}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => onFilterChange('category', 'all')}
            />
          </Badge>
        )}
        {filters.status !== 'all' && (
          <Badge variant="secondary" className="gap-1">
            {statusOptions.find(s => s.value === filters.status)?.label}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => onFilterChange('status', 'all')}
            />
          </Badge>
        )}
        
        <span className="text-xs text-muted-foreground ml-auto">
          {filteredCount} de {totalProducts} produtos
        </span>
      </div>
    </div>
  );
};
