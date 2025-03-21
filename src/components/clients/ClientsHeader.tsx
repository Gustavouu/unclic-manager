
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Filter, UserPlus } from "lucide-react";
import { NewClientDialog } from "@/components/clients/NewClientDialog";

interface ClientsHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setIsFiltersOpen: (isOpen: boolean) => void;
  isFiltersOpen: boolean;
  onAddClient: (newClient: any) => void;
}

export const ClientsHeader = ({ 
  searchTerm, 
  setSearchTerm, 
  setIsFiltersOpen, 
  isFiltersOpen,
  onAddClient
}: ClientsHeaderProps) => {
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);

  const handleAddClient = (newClient) => {
    onAddClient(newClient);
    setIsNewClientDialogOpen(false);
  };

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <input 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Buscar clientes por nome, email ou telefone" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        >
          <Filter size={16} />
          Filtros
        </Button>
        
        <Button 
          className="gap-2"
          onClick={() => setIsNewClientDialogOpen(true)}
        >
          <UserPlus size={16} />
          Novo Cliente
        </Button>
        
        <NewClientDialog 
          isOpen={isNewClientDialogOpen} 
          onOpenChange={setIsNewClientDialogOpen}
          onSubmit={handleAddClient}
        />
      </div>
    </div>
  );
};
