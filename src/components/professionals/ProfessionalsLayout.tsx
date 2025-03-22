
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { ProfessionalsGrid } from "./ProfessionalsGrid";
import { ProfessionalsTable } from "./ProfessionalsTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ProfessionalDetailsDialog } from "./ProfessionalDetailsDialog";
import { Professional } from "@/hooks/professionals/types";
import { EditProfessionalDialog } from "./EditProfessionalDialog";
import { DeleteProfessionalDialog } from "./DeleteProfessionalDialog";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink,
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";

interface ProfessionalsLayoutProps {
  view: "grid" | "list";
}

export const ProfessionalsLayout = ({ view }: ProfessionalsLayoutProps) => {
  const { professionals, isLoading } = useProfessionals();
  
  // Forçar uma atualização quando os profissionais mudarem
  const [key, setKey] = useState(0);
  
  // Estado para controlar dialogs
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [professionalToEdit, setProfessionalToEdit] = useState<Professional | null>(null);
  const [professionalToDelete, setProfessionalToDelete] = useState<Professional | null>(null);
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Quantidade de itens por página
  
  useEffect(() => {
    // Incrementar a key para forçar a renderização quando professionals mudar
    setKey(prev => prev + 1);
    console.log("Profissionais atualizados na interface:", professionals);
  }, [professionals]);
  
  // Função para lidar com o clique em um profissional
  const handleProfessionalClick = (id: string) => {
    setSelectedProfessionalId(id);
    setDetailsOpen(true);
  };
  
  // Função para lidar com o clique em editar
  const handleEditClick = (professional: Professional, e: React.MouseEvent) => {
    e.stopPropagation();
    setProfessionalToEdit(professional);
    setEditOpen(true);
  };
  
  // Função para lidar com o clique em excluir
  const handleDeleteClick = (professional: Professional, e: React.MouseEvent) => {
    e.stopPropagation();
    setProfessionalToDelete(professional);
    setDeleteOpen(true);
  };
  
  // Paginação - calcular índices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProfessionals = Array.isArray(professionals) 
    ? professionals.slice(indexOfFirstItem, indexOfLastItem) 
    : [];
  
  // Total de páginas
  const totalPages = Math.ceil((professionals?.length || 0) / itemsPerPage);
  
  // Função para gerar os números de página
  const generatePaginationItems = () => {
    let items = [];
    
    // Define quantos números exibir antes e depois da página atual
    const maxPagesDisplayed = 5;
    const sidePages = Math.floor(maxPagesDisplayed / 2);
    
    let startPage = Math.max(1, currentPage - sidePages);
    let endPage = Math.min(totalPages, startPage + maxPagesDisplayed - 1);
    
    // Ajustar startPage se estivermos próximos ao final
    if (endPage - startPage + 1 < maxPagesDisplayed) {
      startPage = Math.max(1, endPage - maxPagesDisplayed + 1);
    }
    
    // Primeira página e ellipsis se necessário
    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => setCurrentPage(1)} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      if (startPage > 2) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }
    
    // Páginas intermediárias
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Última página e ellipsis se necessário
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => setCurrentPage(totalPages)} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (!professionals || professionals.length === 0) {
    return (
      <Alert variant="destructive" className="border-orange-400 bg-orange-50 text-orange-800">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Nenhum colaborador encontrado</AlertTitle>
        <AlertDescription>
          Adicione colaboradores clicando no botão "Novo Colaborador".
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <>
      <div key={key} className="space-y-6">
        {view === "grid" ? (
          <ProfessionalsGrid 
            professionals={currentProfessionals} 
            onProfessionalClick={handleProfessionalClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        ) : (
          <ProfessionalsTable 
            professionals={currentProfessionals} 
            onProfessionalClick={handleProfessionalClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        )}
        
        {totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                  className={currentPage === 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {generatePaginationItems()}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
      
      {selectedProfessionalId && (
        <ProfessionalDetailsDialog
          professionalId={selectedProfessionalId}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />
      )}
      
      {professionalToEdit && (
        <EditProfessionalDialog
          professional={professionalToEdit}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
      
      <DeleteProfessionalDialog
        professional={professionalToDelete}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
};
