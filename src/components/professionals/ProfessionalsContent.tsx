
import { Professional } from "@/hooks/professionals/types";
import { ProfessionalsTable, ProfessionalsTableProps } from "./ProfessionalsTable";
import React from "react";

interface ProfessionalsContentProps {
  view: "list";
  professionals: Professional[];
  onProfessionalClick: (id: string) => void;
  onEditClick: (professional: Professional, e: React.MouseEvent) => void;
  onDeleteClick: (professional: Professional, e: React.MouseEvent) => void;
}

export const ProfessionalsContent = ({
  professionals,
  onProfessionalClick,
  onEditClick,
  onDeleteClick
}: ProfessionalsContentProps) => {
  // Ensure professionals is always an array
  const safeProfessionals = Array.isArray(professionals) ? professionals : [];
  
  if (safeProfessionals.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum colaborador encontrado.
      </div>
    );
  }
  
  return (
    <ProfessionalsTable 
      professionals={safeProfessionals} 
      onProfessionalClick={onProfessionalClick}
      onEditClick={onEditClick}
      onDeleteClick={onDeleteClick}
    />
  );
};
