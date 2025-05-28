
import { Button } from "@/components/ui/button";
import { UserPlus, Download, Filter } from "lucide-react";
import { NewClientDialog } from "./NewClientDialog";
import { useState } from "react";

interface ClientsHeaderProps {
  onExport?: () => void;
  onFilterToggle?: () => void;
  onClientCreated?: () => void;
}

export function ClientsHeader({ onExport, onFilterToggle, onClientCreated }: ClientsHeaderProps) {
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);

  const handleClientCreated = () => {
    setIsNewClientDialogOpen(false);
    onClientCreated?.();
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <p className="text-gray-600">Gerencie seus clientes e histórico</p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={onFilterToggle}>
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
        
        <Button variant="outline" onClick={onExport}>
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
        
        <Button onClick={() => setIsNewClientDialogOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <NewClientDialog 
        open={isNewClientDialogOpen}
        onOpenChange={setIsNewClientDialogOpen}
        onClientCreated={handleClientCreated}
      />
    </div>
  );
}
