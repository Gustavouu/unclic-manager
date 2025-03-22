
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const InventoryFilters = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar produtos..."
          className="pl-8 w-full"
        />
      </div>
      
      <Select defaultValue="all">
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          <SelectItem value="hair">Cabelo</SelectItem>
          <SelectItem value="makeup">Maquiagem</SelectItem>
          <SelectItem value="skincare">Cuidados com a pele</SelectItem>
          <SelectItem value="nail">Unhas</SelectItem>
        </SelectContent>
      </Select>
      
      <Select defaultValue="all">
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="in-stock">Em estoque</SelectItem>
          <SelectItem value="low-stock">Estoque baixo</SelectItem>
          <SelectItem value="out-of-stock">Sem estoque</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
