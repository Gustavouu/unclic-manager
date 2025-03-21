
import { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { ProfessionalInfoTab } from "./details/ProfessionalInfoTab";
import { ProfessionalScheduleTab } from "./details/ProfessionalScheduleTab";
import { ProfessionalPerformanceTab } from "./details/ProfessionalPerformanceTab";

interface ProfessionalDetailsDialogProps {
  professionalId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfessionalDetailsDialog = ({ 
  professionalId, 
  open, 
  onOpenChange 
}: ProfessionalDetailsDialogProps) => {
  const { getProfessionalById } = useProfessionals();
  const [professional, setProfessional] = useState(getProfessionalById(professionalId));
  
  useEffect(() => {
    if (open && professionalId) {
      setProfessional(getProfessionalById(professionalId));
    }
  }, [professionalId, open, getProfessionalById]);

  if (!professional) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes do Colaborador</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="info" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="w-full justify-start mb-4 bg-gray-100 p-1">
            <TabsTrigger value="info" className="data-[state=active]:bg-white">
              Informações
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-white">
              Agenda
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-white">
              Desempenho
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-y-auto px-1">
            <TabsContent value="info" className="m-0">
              <ProfessionalInfoTab professional={professional} />
            </TabsContent>
            
            <TabsContent value="schedule" className="m-0">
              <ProfessionalScheduleTab professionalId={professional.id} />
            </TabsContent>
            
            <TabsContent value="performance" className="m-0">
              <ProfessionalPerformanceTab professionalId={professional.id} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
