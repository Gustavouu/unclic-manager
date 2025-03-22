
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Professional } from "@/hooks/professionals/types";
import { ProfessionalsDialogs } from "./ProfessionalsDialogs";
import { ProfessionalsContent } from "./ProfessionalsContent";
import { ProfessionalsPagination } from "./ProfessionalsPagination";
import { usePagination } from "@/hooks/professionals/usePagination";

interface ProfessionalsLayoutProps {
  view: "grid" | "list";
}

export const ProfessionalsLayout = ({ view }: ProfessionalsLayoutProps) => {
  const { professionals, isLoading } = useProfessionals();
  
  // Force rerender when professionals change
  const [key, setKey] = useState(0);
  
  // Dialog state
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [professionalToEdit, setProfessionalToEdit] = useState<Professional | null>(null);
  const [professionalToDelete, setProfessionalToDelete] = useState<Professional | null>(null);
  
  // Items per page
  const itemsPerPage = 6;
  
  // Pagination hook
  const { 
    currentPage, 
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    setCurrentPage
  } = usePagination({
    totalItems: professionals?.length || 0,
    itemsPerPage
  });
  
  // Current professionals to display
  const currentProfessionals = Array.isArray(professionals) 
    ? professionals.slice(indexOfFirstItem, indexOfLastItem) 
    : [];
  
  useEffect(() => {
    // Increment key to force rerender when professionals change
    setKey(prev => prev + 1);
    console.log("Profissionais atualizados na interface:", professionals);
  }, [professionals]);
  
  // Handle professional click
  const handleProfessionalClick = (id: string) => {
    setSelectedProfessionalId(id);
    setDetailsOpen(true);
  };
  
  // Handle edit click
  const handleEditClick = (professional: Professional, e: React.MouseEvent) => {
    e.stopPropagation();
    setProfessionalToEdit(professional);
    setEditOpen(true);
  };
  
  // Handle delete click
  const handleDeleteClick = (professional: Professional, e: React.MouseEvent) => {
    e.stopPropagation();
    setProfessionalToDelete(professional);
    setDeleteOpen(true);
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
        <ProfessionalsContent 
          view={view}
          professionals={currentProfessionals}
          onProfessionalClick={handleProfessionalClick}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
        
        {totalPages > 1 && (
          <ProfessionalsPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
      
      <ProfessionalsDialogs 
        selectedProfessionalId={selectedProfessionalId}
        detailsOpen={detailsOpen}
        setDetailsOpen={setDetailsOpen}
        professionalToEdit={professionalToEdit}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        professionalToDelete={professionalToDelete}
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
      />
    </>
  );
};
