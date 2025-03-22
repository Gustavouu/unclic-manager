
import { Professional } from "@/hooks/professionals/types";
import { ProfessionalsGrid } from "./ProfessionalsGrid";
import { ProfessionalsTable } from "./ProfessionalsTable";

interface ProfessionalsContentProps {
  view: "grid" | "list";
  professionals: Professional[];
  onProfessionalClick: (id: string) => void;
  onEditClick: (professional: Professional, e: React.MouseEvent) => void;
  onDeleteClick: (professional: Professional, e: React.MouseEvent) => void;
}

export const ProfessionalsContent = ({
  view,
  professionals,
  onProfessionalClick,
  onEditClick,
  onDeleteClick
}: ProfessionalsContentProps) => {
  if (professionals.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum colaborador encontrado.
      </div>
    );
  }
  
  return view === "grid" ? (
    <ProfessionalsGrid 
      professionals={professionals} 
      onProfessionalClick={onProfessionalClick}
      onEditClick={onEditClick}
      onDeleteClick={onDeleteClick}
    />
  ) : (
    <ProfessionalsTable 
      professionals={professionals} 
      onProfessionalClick={onProfessionalClick}
      onEditClick={onEditClick}
      onDeleteClick={onDeleteClick}
    />
  );
};
