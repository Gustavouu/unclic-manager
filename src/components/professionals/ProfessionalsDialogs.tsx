
import { Professional } from "@/hooks/professionals/types";
import { ProfessionalDetailsDialog } from "./ProfessionalDetailsDialog";
import { EditProfessionalDialog } from "./EditProfessionalDialog";
import { DeleteProfessionalDialog } from "./DeleteProfessionalDialog";

interface ProfessionalsDialogsProps {
  selectedProfessionalId: string | null;
  detailsOpen: boolean;
  setDetailsOpen: (open: boolean) => void;
  professionalToEdit: Professional | null;
  editOpen: boolean;
  setEditOpen: (open: boolean) => void;
  professionalToDelete: Professional | null;
  deleteOpen: boolean;
  setDeleteOpen: (open: boolean) => void;
}

export const ProfessionalsDialogs = ({
  selectedProfessionalId,
  detailsOpen,
  setDetailsOpen,
  professionalToEdit,
  editOpen,
  setEditOpen,
  professionalToDelete,
  deleteOpen,
  setDeleteOpen
}: ProfessionalsDialogsProps) => {
  return (
    <>
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
