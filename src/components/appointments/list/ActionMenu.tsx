
import { 
  Check, 
  Clock, 
  Pencil, 
  Trash2, 
  X 
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { AppointmentStatus } from "../types";

interface ActionMenuProps {
  appointmentId: string;
  currentStatus: AppointmentStatus;
}

export const ActionMenu = ({ appointmentId, currentStatus }: ActionMenuProps) => {
  // These handlers would be connected to actual functionality in a real app
  const handleEdit = () => {
    console.log(`Editing appointment ${appointmentId}`);
  };

  const handleComplete = () => {
    console.log(`Marking appointment ${appointmentId} as completed`);
  };

  const handleReschedule = () => {
    console.log(`Rescheduling appointment ${appointmentId}`);
  };

  const handleCancel = () => {
    console.log(`Cancelling appointment ${appointmentId}`);
  };

  const handleDelete = () => {
    console.log(`Deleting appointment ${appointmentId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="flex items-center gap-2" onClick={handleEdit}>
          <Pencil className="h-4 w-4" />
          Editar
        </DropdownMenuItem>
        
        {currentStatus !== "concluído" && (
          <DropdownMenuItem className="flex items-center gap-2" onClick={handleComplete}>
            <Check className="h-4 w-4" />
            Marcar como concluído
          </DropdownMenuItem>
        )}
        
        {currentStatus !== "cancelado" && (
          <>
            <DropdownMenuItem className="flex items-center gap-2" onClick={handleReschedule}>
              <Clock className="h-4 w-4" />
              Remarcar
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="flex items-center gap-2 text-red-600" 
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
              Cancelar
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuItem 
          className="flex items-center gap-2 text-red-600" 
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
