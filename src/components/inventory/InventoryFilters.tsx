
import React, { useState } from 'react';
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
import { Filter, Search, Check } from "lucide-react";

export const InventoryFilters = () => {
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  
  const categories = [
    "Todos", "Shampoo", "Condicionador", "Máscaras", "Tintura", "Finalizadores", "Acessórios"
  ];
  
  const toggleFilter = (category: string) => {
    if (category === "Todos") {
      setSelectedFilters([]);
      return;
    }
    
    if (selectedFilters.includes(category)) {
      setSelectedFilters(selectedFilters.filter(c => c !== category));
    } else {
      setSelectedFilters([...selectedFilters, category]);
    }
  };
  
  const isSelected = (category: string) => {
    if (category === "Todos") return selectedFilters.length === 0;
    return selectedFilters.includes(category);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Buscar produto..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 h-8 pl-8 text-xs"
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1 h-8 text-xs">
            <Filter className="h-3.5 w-3.5" />
            Filtros
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel className="text-xs">Categorias</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {categories.map((category) => (
              <DropdownMenuItem 
                key={category}
                onClick={() => toggleFilter(category)} 
                className="gap-2 text-xs cursor-pointer"
              >
                <div className="w-3.5 h-3.5 flex items-center justify-center">
                  {isSelected(category) && <Check className="h-3 w-3" />}
                </div>
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel className="text-xs">Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
              <div className="w-3.5 h-3.5 flex items-center justify-center">
                <Check className="h-3 w-3" />
              </div>
              Em estoque
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
              <div className="w-3.5 h-3.5 flex items-center justify-center"></div>
              Estoque baixo
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
              <div className="w-3.5 h-3.5 flex items-center justify-center"></div>
              Sem estoque
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
