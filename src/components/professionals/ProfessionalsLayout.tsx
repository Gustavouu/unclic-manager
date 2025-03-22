
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { ProfessionalsGrid } from "./ProfessionalsGrid";
import { ProfessionalsTable } from "./ProfessionalsTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ProfessionalsLayoutProps {
  view: "grid" | "list";
}

export const ProfessionalsLayout = ({ view }: ProfessionalsLayoutProps) => {
  const { professionals, isLoading } = useProfessionals();
  
  // Forçar uma atualização quando os profissionais mudarem
  const [key, setKey] = useState(0);
  
  useEffect(() => {
    // Incrementar a key para forçar a renderização quando professionals mudar
    setKey(prev => prev + 1);
  }, [professionals]);
  
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
    <div key={key}>
      {view === "grid" ? (
        <ProfessionalsGrid professionals={professionals} />
      ) : (
        <ProfessionalsTable professionals={professionals} />
      )}
    </div>
  );
};
