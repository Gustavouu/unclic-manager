
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { Product } from '@/hooks/inventory/types';

interface InventoryActionsProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export const InventoryActions = ({ product, onEdit, onDelete }: InventoryActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 text-xs">
        <DropdownMenuItem 
          className="flex items-center cursor-pointer text-xs"
          onClick={() => onEdit?.(product)}
        >
          <Edit className="mr-2 h-3.5 w-3.5" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center cursor-pointer text-xs text-red-600"
          onClick={() => onDelete?.(product)}
        >
          <Trash2 className="mr-2 h-3.5 w-3.5" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
