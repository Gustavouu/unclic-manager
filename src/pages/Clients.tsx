
import { useState } from "react";
import { ClientsLayout } from "@/components/clients/ClientsLayout";
import { ClientsHeader } from "@/components/clients/ClientsHeader";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientsFilters } from "@/components/clients/ClientsFilters";
import { ClientDetails } from "@/components/clients/ClientDetails";
import { useClientData } from "@/hooks/useClientData";

const Clients = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const { 
    filteredClients, 
    searchTerm, 
    setSearchTerm, 
    filterOptions, 
    updateFilterOptions,
    availableCities,
    availableCategories,
    deleteClient 
  } = useClientData();

  const handleShowDetails = (clientId: string) => {
    setSelectedClientId(clientId);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedClientId(null);
  };

  const handleDeleteClient = (clientId: string) => {
    deleteClient(clientId);
    if (selectedClientId === clientId) {
      setShowDetails(false);
      setSelectedClientId(null);
    }
  };

  return (
    <ClientsLayout>
      <ClientsHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 order-2 lg:order-1">
          <ClientsFilters 
            filterOptions={filterOptions} 
            updateFilterOptions={updateFilterOptions}
            availableCities={availableCities}
            availableCategories={availableCategories}
          />
        </div>
        <div className="lg:col-span-3 order-1 lg:order-2">
          <ClientsTable 
            clients={filteredClients} 
            onShowDetails={handleShowDetails} 
            onDeleteClient={handleDeleteClient}
          />
        </div>
      </div>
      {showDetails && selectedClientId && (
        <ClientDetails 
          clientId={selectedClientId} 
          onClose={handleCloseDetails} 
        />
      )}
    </ClientsLayout>
  );
};

export default Clients;
