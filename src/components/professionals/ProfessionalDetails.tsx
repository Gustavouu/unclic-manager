
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
    <div className="space-y-8">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 -ml-2 hover:bg-muted/50"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Lista
      </Button>
      
      <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center bg-card border border-border/60 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-medium text-2xl border-2 border-blue-100">
            {professional.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{professional.name}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 text-muted-foreground mt-1.5">
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                <span>{professional.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                <span>{professional.email}</span>
              </div>
            </div>
          </div>
        </div>
        
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Edit className="h-4 w-4" />
          Editar Colaborador
        </Button>
      </div>
      
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 p-1 bg-muted/50">
          <TabsTrigger value="info" className="gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <UserCircle className="h-4 w-4" />
            Informações
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
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
