
import { Button } from "@/components/ui/button";
import { PlusCircle, Download, Users } from "lucide-react";
import { useState } from "react";
import { NewClientDialog } from "./NewClientDialog";

export function ClientsHeader() {
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie seus clientes e visualize suas informações.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            size="sm" 
            className="hidden md:flex items-center gap-1"
          >
            <Download size={16} className="mr-1" />
            Exportar
          </Button>
          <Button 
            onClick={() => setShowNewClientDialog(true)}
            className="flex items-center gap-1"
          >
            <PlusCircle size={16} className="mr-1" />
            Novo Cliente
          </Button>
        </div>
      </div>
      
      {showNewClientDialog && (
        <NewClientDialog 
          onClose={() => setShowNewClientDialog(false)}
          onClientCreated={() => {
            // Refresh clients list
          }}
        />
      )}
    </div>
  );
}
