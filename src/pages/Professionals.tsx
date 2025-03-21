
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfessionalsLayout } from "@/components/professionals/ProfessionalsLayout";
import { useToast } from "@/components/ui/use-toast";
import { useProfessionalData } from "@/hooks/useProfessionalData";

const Professionals = () => {
  const [searchTerm, setSearchTerm] = useState("");
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

  return (
    <AppLayout title="Colaboradores">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-xl font-display font-medium">Gerenciamento de Colaboradores</h1>
      </div>
      
      <ProfessionalsLayout 
        professionals={professionals}
        filteredProfessionals={filteredProfessionals}
        filterOptions={filterOptions}
        updateFilterOptions={updateFilterOptions}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onDeleteProfessional={handleDeleteProfessional}
        onAddProfessional={handleAddProfessional}
      />
    </AppLayout>
  );
};

export default Professionals;
