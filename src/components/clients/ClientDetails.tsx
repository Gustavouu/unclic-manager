
import { Client } from "@/hooks/useClients";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Phone, Mail, CalendarClock, CreditCard } from "lucide-react";
import { ClientAppointmentsTab } from "./details/ClientAppointmentsTab";
import { ClientHistoryTab } from "./details/ClientHistoryTab";
import { ClientNotesTab } from "./details/ClientNotesTab";
import { useState } from "react";
import { CreateAppointmentDialog } from "@/components/appointments/dialog/CreateAppointmentDialog";

interface ClientDetailsProps {
  client: Client;
  onClose: () => void;
}

export function ClientDetails({ client, onClose }: ClientDetailsProps) {
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString('pt-BR');
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleScheduleClick = () => {
    setIsAppointmentDialogOpen(true);
  };

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col lg:flex-row gap-4 py-4">
            <div className="lg:w-1/3">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-medium uppercase">
                    {client.nome.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{client.nome}</h3>
                    <p className="text-sm text-muted-foreground">
                      Cliente desde {formatDate(client.criado_em)}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {client.telefone && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-muted-foreground" />
                      <span className="text-sm">{client.telefone}</span>
                    </div>
                  )}
                  
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-muted-foreground" />
                      <span className="text-sm">{client.email}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <CalendarClock size={16} className="text-muted-foreground" />
                    <span className="text-sm">
                      Última visita: {formatDate(client.ultima_visita)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-muted-foreground" />
                    <span className="text-sm">
                      Total gasto: {formatCurrency(client.valor_total_gasto || 0)}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 mt-2">
                  <Button onClick={handleScheduleClick}>Agendar</Button>
                  <Button variant="outline">Enviar mensagem</Button>
                  <Button variant="outline">Editar cliente</Button>
                </div>
              </div>
            </div>
            
            <div className="lg:w-2/3">
              <Tabs defaultValue="appointments">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
                  <TabsTrigger value="history">Histórico</TabsTrigger>
                  <TabsTrigger value="notes">Notas</TabsTrigger>
                </TabsList>
                <TabsContent value="appointments" className="mt-4">
                  <ClientAppointmentsTab 
                    clientId={client.id} 
                    onScheduleClick={handleScheduleClick} 
                  />
                </TabsContent>
                <TabsContent value="history" className="mt-4">
                  <ClientHistoryTab clientId={client.id} />
                </TabsContent>
                <TabsContent value="notes" className="mt-4">
                  <ClientNotesTab clientId={client.id} clientNotes={client.notas} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {isAppointmentDialogOpen && (
        <CreateAppointmentDialog 
          open={isAppointmentDialogOpen} 
          onClose={() => setIsAppointmentDialogOpen(false)} 
          preselectedClientId={client.id}
          preselectedClientName={client.nome}
        />
      )}
    </>
  );
}
