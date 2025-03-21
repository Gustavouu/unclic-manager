
import { useState } from "react";
import { ClientsLayout } from "@/components/clients/ClientsLayout";
import { ClientsHeader } from "@/components/clients/ClientsHeader";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientDetails } from "@/components/clients/ClientDetails";
import { useClientData } from "@/hooks/useClientData";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

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

  // Pagination logic
  const indexOfLastClient = currentPage * itemsPerPage;
  const indexOfFirstClient = indexOfLastClient - itemsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  // Generate page numbers
  const pageNumbers = [];
  const maxPagesToShow = 5;
  
  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push("ellipsis");
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis");
      }
      pageNumbers.push(totalPages);
    }
  }

  return (
    <ClientsLayout>
      <div className="flex items-center text-sm text-muted-foreground mb-4">
        <span>Início</span>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="font-medium text-foreground">Clientes</span>
      </div>
      
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
        
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Exibindo {indexOfFirstClient + 1} - {Math.min(indexOfLastClient, filteredClients.length)} de {filteredClients.length} registros
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Itens por página</span>
              <Select
                value={String(itemsPerPage)}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {pageNumbers.map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "ellipsis" ? (
                      <span className="flex h-9 w-9 items-center justify-center">...</span>
                    ) : (
                      <PaginationLink
                        onClick={() => setCurrentPage(page as number)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
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
