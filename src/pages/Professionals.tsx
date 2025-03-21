import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfessionalsLayout } from "@/components/professionals/ProfessionalsLayout";
import { ProfessionalsHeader } from "@/components/professionals/ProfessionalsHeader";
import { ProfessionalsTable } from "@/components/professionals/ProfessionalsTable";
import { ProfessionalDetails } from "@/components/professionals/ProfessionalDetails";
import { ProfessionalFilters } from "@/components/professionals/ProfessionalFilters";
import { useToast } from "@/components/ui/use-toast";
import { useProfessionalData } from "@/hooks/useProfessionalData";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Professionals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { toast } = useToast();
  
  const { 
    professionals, 
    addProfessional, 
    deleteProfessional,
    filteredProfessionals,
    filterOptions,
    updateFilterOptions
  } = useProfessionalData(searchTerm);
  
  const handleAddProfessional = (newProfessional) => {
    addProfessional(newProfessional);
    
    toast({
      title: "Colaborador adicionado",
      description: `${newProfessional.name} foi adicionado com sucesso.`
    });
  };

  const handleDeleteProfessional = (id: string) => {
    deleteProfessional(id);
    
    toast({
      title: "Colaborador removido",
      description: `O colaborador foi removido com sucesso.`
    });
  };

  const handleShowDetails = (professionalId: string) => {
    setSelectedProfessionalId(professionalId);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedProfessionalId(null);
  };

  const indexOfLastProfessional = currentPage * itemsPerPage;
  const indexOfFirstProfessional = indexOfLastProfessional - itemsPerPage;
  const currentProfessionals = filteredProfessionals.slice(indexOfFirstProfessional, indexOfLastProfessional);
  const totalPages = Math.ceil(filteredProfessionals.length / itemsPerPage);

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
    <AppLayout title="Colaboradores">
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <span>Início</span>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="font-medium text-foreground">Colaboradores</span>
        </div>
        
        <h1 className="text-2xl font-bold mb-6">Gerenciamento de Colaboradores</h1>
        
        <ProfessionalsHeader 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          filterOptions={filterOptions}
          updateFilterOptions={updateFilterOptions}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-1">
            <ProfessionalFilters 
              filterOptions={filterOptions}
              updateFilterOptions={updateFilterOptions}
            />
          </div>
          
          <div className="lg:col-span-3">
            <Card className="border shadow-sm">
              <ProfessionalsTable 
                professionals={currentProfessionals} 
                onRowClick={handleShowDetails} 
                onDelete={handleDeleteProfessional}
                selectedProfessionalId={selectedProfessionalId}
              />
              
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Exibindo {indexOfFirstProfessional + 1} - {Math.min(indexOfLastProfessional, filteredProfessionals.length)} de {filteredProfessionals.length} registros
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
          </div>
        </div>
        
        {showDetails && selectedProfessionalId && (
          <ProfessionalDetails 
            professionalId={selectedProfessionalId} 
            onClose={handleCloseDetails} 
          />
        )}
      </div>
    </AppLayout>
  );
};

export default Professionals;
