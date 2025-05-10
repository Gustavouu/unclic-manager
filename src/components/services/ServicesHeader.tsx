
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { ServiceData } from "./servicesData";

interface ServicesHeaderProps {
  onServiceCreated: (newService: ServiceData) => void;
  onSearch?: (query: string) => void;
}

export function ServicesHeader({ onServiceCreated, onSearch }: ServicesHeaderProps) {
  const [isNewServiceDialogOpen, setIsNewServiceDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
      <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Serviços</h1>
      <p className="text-sm text-muted-foreground">
        Gerencie os serviços oferecidos pelo seu negócio
      </p>
      
      <div className="flex w-full sm:w-auto space-x-2 mt-4 sm:mt-0">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar serviços..."
            className="pl-8 w-full sm:w-[200px] lg:w-[300px]"
            value={searchQuery}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
          />
        </div>
        
        <Button onClick={() => setIsNewServiceDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Serviço
        </Button>
        
        {/* Este dialog seria implementado como um componente separado */}
        {isNewServiceDialogOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Novo Serviço</h3>
              <p className="text-sm text-muted-foreground">
                Esta é apenas uma simulação. Um dialog completo seria implementado aqui.
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsNewServiceDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsNewServiceDialogOpen(false)}>
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
