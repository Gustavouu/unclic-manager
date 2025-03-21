
import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { Professional } from "@/hooks/useProfessionalData";
import { EmptyState } from "./table/EmptyState";
import { ProfessionalTableRow } from "./table/ProfessionalTableRow";
import { DeleteConfirmationDialog } from "./table/DeleteConfirmationDialog";
import { ProfessionalsTableHeader } from "./table/ProfessionalsTableHeader";

export interface ProfessionalsTableProps {
  professionals: Professional[];
  onDelete: (id: string) => void;
  onRowClick: (id: string) => void;
  selectedProfessionalId: string | null;
  onShowDetails?: (professionalId: string) => void;
}

export const ProfessionalsTable = ({ 
  professionals, 
  onDelete, 
  onRowClick, 
  selectedProfessionalId,
  onShowDetails
}: ProfessionalsTableProps) => {
  const [professionalToDelete, setProfessionalToDelete] = useState<string | null>(null);

  // Handler for row click that respects both callbacks
  const handleRowClick = (id: string) => {
    onRowClick(id);
    if (onShowDetails) {
      onShowDetails(id);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setProfessionalToDelete(id);
  };

  const confirmDelete = () => {
    if (professionalToDelete) {
      onDelete(professionalToDelete);
      setProfessionalToDelete(null);
    }
  };

  if (professionals.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <ProfessionalsTableHeader />
          <TableBody>
            {professionals.map((professional) => (
              <ProfessionalTableRow 
                key={professional.id}
                professional={professional}
                onRowClick={handleRowClick}
                isSelected={selectedProfessionalId === professional.id}
                onDelete={handleDeleteClick}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteConfirmationDialog 
        isOpen={!!professionalToDelete}
        onOpenChange={(open) => !open && setProfessionalToDelete(null)}
        onConfirmDelete={confirmDelete}
      />
    </>
  );
};
