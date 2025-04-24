
import { useState } from "react";
import { ClientsHeader } from "@/components/clients/ClientsHeader";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientStats } from "@/components/clients/ClientStats";
import { ClientsFilters } from "@/components/clients/ClientsFilters";
import { useClients } from "@/hooks/useClients";
import { ClientsFiltersSheet } from "@/components/clients/ClientsFiltersSheet";

const Clients = () => {
  const { clients, isLoading, error } = useClients();
  const [showFilters, setShowFilters] = useState(false);
  const [filteredClients, setFilteredClients] = useState(clients);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="flex flex-col gap-6">
      <ClientsHeader />
      
      <ClientStats clients={filteredClients} />
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="hidden lg:block w-full lg:w-64 shrink-0">
          <ClientsFilters 
            clients={clients} 
            onFilteredClientsChange={setFilteredClients} 
          />
        </div>
        
        <div className="w-full">
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
