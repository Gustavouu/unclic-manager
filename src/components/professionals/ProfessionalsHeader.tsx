
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Filter, UserRoundPlus } from "lucide-react";
import { NewProfessionalDialog } from "@/components/professionals/NewProfessionalDialog";

interface ProfessionalsHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setIsFiltersOpen: (isOpen: boolean) => void;
  isFiltersOpen: boolean;
  onAddProfessional: (newProfessional: any) => void;
}

export const ProfessionalsHeader = ({ 
  searchTerm, 
  setSearchTerm, 
  setIsFiltersOpen, 
  isFiltersOpen,
  onAddProfessional
}: ProfessionalsHeaderProps) => {
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

  const handleAddProfessional = (newProfessional) => {
    onAddProfessional(newProfessional);
    setIsNewDialogOpen(false);
  };

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <input 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          placeholder="Buscar colaboradores por nome, email ou telefone" 
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
        
        <NewProfessionalDialog 
          isOpen={isNewDialogOpen} 
          onOpenChange={setIsNewDialogOpen}
          onSubmit={handleAddProfessional}
        />
      </div>
    </div>
  );
};
