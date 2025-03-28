
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { ProfessionalsGrid } from "./ProfessionalsGrid";
import { ProfessionalsTable } from "./ProfessionalsTable";
import { Professional } from "@/hooks/professionals/types";

interface ProfessionalsLayoutProps {
  view: "grid" | "list";
  onViewDetails: (id: string) => void;
  onEditProfessional: (professional: Professional) => void;
  onDeleteProfessional: (professional: Professional) => void;
}

export const ProfessionalsLayout = ({ 
  view,
  onViewDetails,
  onEditProfessional,
  onDeleteProfessional
}: ProfessionalsLayoutProps) => {
  const { professionals, isLoading } = useProfessionals();
  
  if (isLoading) {
    return <div className="flex justify-center py-8">Carregando colaboradores...</div>;
  }

  if (!professionals || professionals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum colaborador encontrado. Adicione novos colaboradores para começar.
      </div>
    );
  }

  if (view === "grid") {
    return (
      <ProfessionalsGrid 
        professionals={professionals} 
        onViewDetails={onViewDetails}
        onEditProfessional={onEditProfessional}
        onDeleteProfessional={onDeleteProfessional}
      />
    );
  }

  return (
    <ProfessionalsTable 
      professionals={professionals} 
      onViewDetails={onViewDetails}
      onEditProfessional={onEditProfessional}
      onDeleteProfessional={onDeleteProfessional}
    />
  );
};
