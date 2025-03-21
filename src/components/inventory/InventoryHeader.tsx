
import { Search, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InventoryHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const InventoryHeader = ({ searchTerm, setSearchTerm }: InventoryHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar produtos por nome, código, fornecedor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
      <Button onClick={() => document.getElementById("new-inventory-trigger")?.click()}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Novo Item
      </Button>
    </div>
  );
};
