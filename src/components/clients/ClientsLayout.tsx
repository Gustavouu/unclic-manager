
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ClientsHeader } from "@/components/clients/ClientsHeader";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientFilters } from "@/components/clients/ClientFilters";
import { ClientDetails } from "@/components/clients/ClientDetails";
import { FilterOptions } from "@/hooks/useClientData";

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

  const handleClientClick = (id: string) => {
    setSelectedClientId(prevId => prevId === id ? null : id);
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className={`md:col-span-${selectedClientId ? '2' : '3'}`}>
        <Card className="shadow-sm">
          <div className="p-6">
            <ClientsHeader 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isFiltersOpen={isFiltersOpen}
              setIsFiltersOpen={setIsFiltersOpen}
              onAddClient={onAddClient}
            />
            
            {isFiltersOpen && (
              <ClientFilters 
                filterOptions={filterOptions}
                updateFilterOptions={updateFilterOptions}
              />
            )}
            
            <ClientsTable 
              clients={filteredClients} 
              onDelete={onDeleteClient} 
              onRowClick={handleClientClick}
              selectedClientId={selectedClientId}
            />
          </div>
        </Card>
      </div>
      
      {selectedClientId && (
        <div className="md:col-span-1">
          <ClientDetails 
            clientId={selectedClientId} 
            onClose={() => setSelectedClientId(null)} 
          />
        </div>
      )}
    </div>
  );
};
