
import { useState } from "react";
import { ClientsLayout } from "@/components/clients/ClientsLayout";
import { ClientsHeader } from "@/components/clients/ClientsHeader";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientDetails } from "@/components/clients/ClientDetails";
import { ClientStats } from "@/components/clients/ClientStats";
import { useClientData } from "@/hooks/clients";
import { Card } from "@/components/ui/card";
import { TablePagination } from "@/components/common/TablePagination";

const Clients = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
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

  const indexOfLastClient = currentPage * itemsPerPage;
  const indexOfFirstClient = indexOfLastClient - itemsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  return (
    <ClientsLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-2">
        <h1 className="text-xl font-display font-medium">Gerenciamento de Clientes</h1>
      </div>
      
      {/* Stats cards row */}
      <ClientStats />

      <ClientsHeader 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        filterOptions={filterOptions}
        updateFilterOptions={updateFilterOptions}
        availableCities={availableCities}
        availableCategories={availableCategories}
      />
      
      <Card className="border shadow-sm">
        <ClientsTable 
          clients={currentClients} 
          onShowDetails={handleShowDetails} 
          onDeleteClient={handleDeleteClient}
        />
        
        <TablePagination 
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredClients.length}
          indexOfFirstItem={indexOfFirstClient}
          indexOfLastItem={indexOfLastClient}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value);
            setCurrentPage(1); // Reset to first page when changing items per page
          }}
        />
      </Card>
      
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
