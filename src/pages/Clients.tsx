
import { useState } from "react";
import { ClientsHeader } from "@/components/clients/ClientsHeader";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientStats } from "@/components/clients/ClientStats";
import { Card } from "@/components/ui/card";
import { useClients } from "@/hooks/useClients";
import { ClientsFiltersSheet } from "@/components/clients/ClientsFiltersSheet";
import { ClientsFilters } from "@/components/clients/ClientsFilters";

const Clients = () => {
  const { clients, isLoading } = useClients();
  const [showFilters, setShowFilters] = useState(false);
  const [filteredClients, setFilteredClients] = useState(clients);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="space-y-4">
      <ClientsHeader />
      
      <ClientStats clients={filteredClients} />
      
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="hidden lg:block w-64 shrink-0">
          <Card className="p-4 h-full">
            <h3 className="text-sm font-medium mb-4">Filtros</h3>
            <ClientsFilters 
              clients={clients} 
              onFilteredClientsChange={setFilteredClients} 
            />
          </Card>
        </div>
        
        <div className="flex-1">
          <ClientsTable 
            clients={filteredClients} 
            isLoading={isLoading} 
            showFiltersButton
            onToggleFilters={toggleFilters}
          />
        </div>
      </div>
      
      <ClientsFiltersSheet 
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        clients={clients}
        onFilteredClientsChange={setFilteredClients}
      />
    </div>
  );
};

export default Clients;
