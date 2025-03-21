
import { User } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AppointmentStatus } from "../types";

interface StatusFilterProps {
  statusFilter: AppointmentStatus | "all";
  setStatusFilter: (value: AppointmentStatus | "all") => void;
}

export const StatusFilter = ({ statusFilter, setStatusFilter }: StatusFilterProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <User size={16} className="text-muted-foreground" />
        Status
      </div>
      <Select
        value={statusFilter}
        onValueChange={(value) => setStatusFilter(value as AppointmentStatus | "all")}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="agendado">Agendado</SelectItem>
          <SelectItem value="concluído">Concluído</SelectItem>
          <SelectItem value="cancelado">Cancelado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
