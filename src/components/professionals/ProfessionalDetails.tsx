
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CalendarRange, Edit, Mail, Phone, UserCircle } from "lucide-react";
import { ProfessionalInfoTab } from "./details/ProfessionalInfoTab";
import { ScheduleHistoryTab } from "./details/ScheduleHistoryTab";
import { professionals } from "./data/professionalsMockData";

interface ProfessionalDetailsProps {
  professionalId: string;
  onBack: () => void;
}

export const ProfessionalDetails = ({ professionalId, onBack }: ProfessionalDetailsProps) => {
  const professional = professionals.find(p => p.id === professionalId);
  
  if (!professional) {
    return (
      <div className="p-8 text-center">
        <p>Profissional não encontrado</p>
        <Button onClick={onBack} className="mt-4">Voltar</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Lista
      </Button>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-xl">
            {professional.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{professional.name}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                <span>{professional.phone}</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                <span>{professional.email}</span>
              </div>
            </div>
          </div>
        </div>
        
        <Button className="gap-2">
          <Edit className="h-4 w-4" />
          Editar Colaborador
        </Button>
      </div>
      
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="info" className="gap-2">
            <UserCircle className="h-4 w-4" />
            Informações
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <CalendarRange className="h-4 w-4" />
            Histórico de Agendamentos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="mt-6">
          <ProfessionalInfoTab professional={professional} />
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <ScheduleHistoryTab professionalId={professionalId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
