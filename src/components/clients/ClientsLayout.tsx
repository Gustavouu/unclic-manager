
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ClientsHeader } from "@/components/clients/ClientsHeader";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientFilters } from "@/components/clients/ClientFilters";
import { ClientDetails } from "@/components/clients/ClientDetails";
import { FilterOptions } from "@/hooks/useClientData";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ClientsLayoutProps {
  clients: any[];
  filteredClients: any[];
  filterOptions: FilterOptions;
  updateFilterOptions: (newOptions: Partial<FilterOptions>) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onDeleteClient: (id: string) => void;
  onAddClient: (newClient: any) => void;
}

export const ClientsLayout = ({
  clients,
  filteredClients,
  filterOptions,
  updateFilterOptions,
  searchTerm,
  setSearchTerm,
  onDeleteClient,
  onAddClient
}: ClientsLayoutProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isClientDetailsOpen, setIsClientDetailsOpen] = useState(false);

  const handleClientClick = (id: string) => {
    setSelectedClientId(id);
    setIsClientDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsClientDetailsOpen(false);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Gerenciamento de Clientes</h1>
        <p className="text-muted-foreground">Visualize e gerencie seus clientes cadastrados.</p>
      </div>

      <Card className="shadow-sm">
        <div className="p-6 border-b bg-gray-50">
          <ClientsHeader 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isFiltersOpen={isFiltersOpen}
            setIsFiltersOpen={setIsFiltersOpen}
            onAddClient={onAddClient}
          />
        </div>
        
        {isFiltersOpen && (
          <div className="px-6 pt-6">
            <ClientFilters 
              filterOptions={filterOptions}
              updateFilterOptions={updateFilterOptions}
            />
          </div>
        )}
        
        <div className="p-6">
          <ClientsTable 
            clients={filteredClients} 
            onDelete={onDeleteClient} 
            onRowClick={handleClientClick}
            selectedClientId={selectedClientId}
          />
        </div>
      </Card>
      
      <Dialog open={isClientDetailsOpen} onOpenChange={setIsClientDetailsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {selectedClientId && (
            <ClientDetails 
              clientId={selectedClientId} 
              onClose={handleCloseDetails} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
