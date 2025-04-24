
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { List, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfessionalsLayout } from "@/components/professionals/ProfessionalsLayout";
import { NewProfessionalDialog } from "@/components/professionals/NewProfessionalDialog";
import { Professional } from "@/hooks/professionals/types";
import { EditProfessionalDialog } from "@/components/professionals/EditProfessionalDialog";
import { DeleteProfessionalDialog } from "@/components/professionals/DeleteProfessionalDialog";
import { ProfessionalDetailsDialog } from "@/components/professionals/ProfessionalDetailsDialog";

const Professionals = () => {
  const [showNewProfessionalDialog, setShowNewProfessionalDialog] = useState(false);
  
  // States for managing dialogs
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const [professionalToEdit, setProfessionalToEdit] = useState<Professional | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  
  const [professionalToDelete, setProfessionalToDelete] = useState<Professional | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleOpenNewDialog = () => {
    setShowNewProfessionalDialog(true);
  };

  const handleCloseNewDialog = (open: boolean) => {
    setShowNewProfessionalDialog(open);
  };
  
  // Handlers for different dialogs
  const handleViewDetails = (id: string) => {
    setSelectedProfessionalId(id);
    setDetailsOpen(true);
  };
  
  const handleEditProfessional = (professional: Professional) => {
    setProfessionalToEdit(professional);
    setEditOpen(true);
  };
  
  const handleDeleteProfessional = (professional: Professional) => {
    setProfessionalToDelete(professional);
    setDeleteOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl font-display font-medium">Gerenciamento de Colaboradores</h1>
        
        <Button 
          onClick={handleOpenNewDialog}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <UserPlus size={16} />
          Novo Colaborador
        </Button>
      </div>

      <Card className="border shadow-sm overflow-hidden">
        <ProfessionalsLayout 
          view="list" 
          onViewDetails={handleViewDetails}
          onEditProfessional={handleEditProfessional}
          onDeleteProfessional={handleDeleteProfessional}
        />
      </Card>

      {/* Dialogs */}
      <NewProfessionalDialog 
        open={showNewProfessionalDialog}
        onOpenChange={handleCloseNewDialog}
      />
      
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
      
      {professionalToDelete && (
        <DeleteProfessionalDialog
          professional={professionalToDelete}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
        />
      )}
    </div>
  );
};

export default Professionals;
