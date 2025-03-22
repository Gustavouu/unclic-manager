
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { ProfessionalsGrid } from "./ProfessionalsGrid";
import { ProfessionalsTable } from "./ProfessionalsTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ProfessionalDetailsDialog } from "./ProfessionalDetailsDialog";

interface ProfessionalsLayoutProps {
  view: "grid" | "list";
}

export const ProfessionalsLayout = ({ view }: ProfessionalsLayoutProps) => {
  const { professionals, isLoading } = useProfessionals();
  
  // Forçar uma atualização quando os profissionais mudarem
  const [key, setKey] = useState(0);
  // Estado para controlar a abertura do diálogo de detalhes
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  useEffect(() => {
    // Incrementar a key para forçar a renderização quando professionals mudar
    setKey(prev => prev + 1);
  }, [professionals]);
  
  // Função para lidar com o clique em um profissional
  const handleProfessionalClick = (id: string) => {
    setSelectedProfessionalId(id);
    setDetailsOpen(true);
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
      <div key={key}>
        {view === "grid" ? (
          <ProfessionalsGrid 
            professionals={professionals} 
            onProfessionalClick={handleProfessionalClick} 
          />
        ) : (
          <ProfessionalsTable 
            professionals={professionals} 
            onProfessionalClick={handleProfessionalClick} 
          />
        )}
      </div>
      
      {selectedProfessionalId && (
        <ProfessionalDetailsDialog
          professionalId={selectedProfessionalId}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />
      )}
    </>
  );
};
