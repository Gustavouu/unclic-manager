
import { useProfessionalsList } from "@/hooks/professionals/useProfessionalsList";
import { ProfessionalsContent } from "./ProfessionalsContent";
import { Professional } from "@/types/professional";
import React from "react";

interface ProfessionalsLayoutProps {
  view: "list";
  onViewDetails: (id: string) => void;
  onEditProfessional: (professional: Professional) => void;
  onDeleteProfessional: (professional: Professional) => void;
}

export const ProfessionalsLayout = ({ 
  onViewDetails,
  onEditProfessional,
  onDeleteProfessional
}: ProfessionalsLayoutProps) => {
  const { professionals, isLoading } = useProfessionalsList();
  
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

  // Adapter functions to match the expected interfaces in the sub-components
  const handleProfessionalClick = (id: string) => {
    onViewDetails(id);
  };

  const handleEditClick = (professional: Professional, e: React.MouseEvent) => {
    e.preventDefault();
    onEditProfessional(professional);
  };

  const handleDeleteClick = (professional: Professional, e: React.MouseEvent) => {
    e.preventDefault();
    onDeleteProfessional(professional);
  };

  return (
    <ProfessionalsContent
      view="list"
      professionals={professionals}
      onProfessionalClick={handleProfessionalClick}
      onEditClick={handleEditClick}
      onDeleteClick={handleDeleteClick}
    />
  );
};
