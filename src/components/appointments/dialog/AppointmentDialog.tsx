import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppointmentStatus, AppointmentType } from "../types";
import { useState } from "react";
import { useAppointments } from "@/hooks/appointments/useAppointments";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  Clock, 
  DollarSign, 
  Edit, 
  Scissors, 
  Trash2, 
  User 
} from "lucide-react";
import { toast } from "sonner";

interface AppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  appointment: AppointmentType;
}

export function AppointmentDialog({ 
  open, 
  onClose, 
  appointment 
}: AppointmentDialogProps) {
  const [activeTab, setActiveTab] = useState<string>("details");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  
  const { updateAppointment, deleteAppointment } = useAppointments();
  
  const handleStatusChange = async (newStatus: AppointmentStatus) => {
    try {
      await updateAppointment(appointment.id, { status: newStatus });
      toast.success(`Status alterado para ${newStatus}`);
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };
  
  const handleDelete = async () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    
    try {
      await deleteAppointment(appointment.id);
      toast.success("Agendamento removido com sucesso");
      onClose();
    } catch (error) {
      toast.error("Erro ao remover agendamento");
    } finally {
      setConfirmingDelete(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "concluído":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Concluído</Badge>;
      case "cancelado":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelado</Badge>;
      case "confirmado":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Confirmado</Badge>;
      case "pendente":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Agendado</Badge>;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes do Agendamento</span>
            {appointment.status && getStatusBadge(appointment.status)}
          </DialogTitle>
          <DialogDescription>
            Informações do agendamento e opções de edição
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="actions">Ações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="flex items-start gap-2">
                <User className="mt-0.5 h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{appointment.clientName}</p>
                  <p className="text-sm text-gray-500">Cliente</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Scissors className="mt-0.5 h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{appointment.serviceName}</p>
                  <p className="text-sm text-gray-500">Serviço</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CalendarIcon className="mt-0.5 h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">
                    {format(appointment.date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                  <p className="text-sm text-gray-500">Data</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">
                    {format(appointment.date, "HH:mm")} - 
                    {format(new Date(appointment.date.getTime() + appointment.duration * 60000), "HH:mm")}
                    <span className="text-sm text-gray-500 ml-2">({appointment.duration} min)</span>
                  </p>
                  <p className="text-sm text-gray-500">Horário</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <DollarSign className="mt-0.5 h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">
                    R$ {appointment.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">Valor</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="actions" className="space-y-4 py-4">
            <div className="grid gap-3">
              <p className="text-sm text-gray-500">Alterar status:</p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleStatusChange("agendado")}
                  className={appointment.status === "agendado" ? "bg-blue-50" : ""}
                >
                  Agendado
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleStatusChange("confirmado")}
                  className={appointment.status === "confirmado" ? "bg-blue-50" : ""}
                >
                  Confirmado
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleStatusChange("concluído")}
                  className={appointment.status === "concluído" ? "bg-green-50" : ""}
                >
                  Concluído
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleStatusChange("cancelado")}
                  className={appointment.status === "cancelado" ? "bg-red-50" : ""}
                >
                  Cancelado
                </Button>
              </div>
              
              <div className="pt-2 mt-2 border-t">
                <p className="text-sm text-gray-500 mb-2">Outras ações:</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-1">
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex items-center gap-1"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                    {confirmingDelete ? "Confirmar" : "Remover"}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 