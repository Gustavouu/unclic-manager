
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfessionalsHeader } from "@/components/professionals/ProfessionalsHeader";
import { ProfessionalDetails } from "@/components/professionals/ProfessionalDetails";
import { useToast } from "@/components/ui/use-toast";
import { useProfessionalData } from "@/hooks/useProfessionalData";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ProfessionalsContent } from "@/components/professionals/ProfessionalsContent";

const Professionals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
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

  const handleShowDetails = (professionalId: string) => {
    setSelectedProfessionalId(professionalId);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedProfessionalId(null);
  };

  const breadcrumbItems = [
    { label: "Início" },
    { label: "Colaboradores", active: true }
  ];

  return (
    <AppLayout title="Colaboradores">
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <Breadcrumb items={breadcrumbItems} />
        
        <h1 className="text-2xl font-bold mb-6">Gerenciamento de Colaboradores</h1>
        
        <ProfessionalsHeader 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          filterOptions={filterOptions}
          updateFilterOptions={updateFilterOptions}
        />
        
        <ProfessionalsContent
          professionals={professionals}
          filteredProfessionals={filteredProfessionals}
          filterOptions={filterOptions}
          updateFilterOptions={updateFilterOptions}
          onShowDetails={handleShowDetails}
          onDelete={handleDeleteProfessional}
          selectedProfessionalId={selectedProfessionalId}
        />
        
        {showDetails && selectedProfessionalId && (
          <ProfessionalDetails 
            professionalId={selectedProfessionalId} 
            onClose={handleCloseDetails} 
          />
        )}
      </div>
    </AppLayout>
  );
};

export default Professionals;
