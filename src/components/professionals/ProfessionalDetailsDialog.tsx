
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { ProfessionalInfoTab } from "./details/ProfessionalInfoTab";
import { ProfessionalPerformanceTab } from "./details/ProfessionalPerformanceTab";
import { ProfessionalScheduleTab } from "./details/ProfessionalScheduleTab";
import { Professional } from "@/hooks/professionals/types";

interface ProfessionalDetailsDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  professionalId: string;
}

export const ProfessionalDetailsDialog = ({ 
  open: controlledOpen, 
  onOpenChange: setControlledOpen,
  professionalId
}: ProfessionalDetailsDialogProps) => {
  const [open, setOpen] = useState(false);
  const { professionals } = useProfessionals();
  const [professional, setProfessional] = useState<Professional | null>(null);
  
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = isControlled ? setControlledOpen : setOpen;
  
  useEffect(() => {
    if (professionalId && isOpen) {
      // Find the professional in the list
      const found = professionals.find(p => p.id === professionalId);
      setProfessional(found || null);
    }
  }, [professionalId, isOpen, professionals]);
  
  if (!professional) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{professional.name}</DialogTitle>
          <DialogDescription>
            {professional.position}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="info" className="mt-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="performance">Desempenho</TabsTrigger>
            <TabsTrigger value="schedule">Agenda</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="py-4">
            <ProfessionalInfoTab professional={professional} />
          </TabsContent>
          
          <TabsContent value="performance" className="py-4">
            <ProfessionalPerformanceTab professionalId={professional.id} />
          </TabsContent>
          
          <TabsContent value="schedule" className="py-4">
            <ProfessionalScheduleTab professionalId={professional.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
