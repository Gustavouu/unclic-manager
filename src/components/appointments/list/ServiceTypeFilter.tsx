
import { Scissors } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ServiceType } from "../types";

interface ServiceTypeFilterProps {
  serviceFilter: ServiceType;
  setServiceFilter: (value: ServiceType) => void;
}

export const ServiceTypeFilter = ({ serviceFilter, setServiceFilter }: ServiceTypeFilterProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Scissors size={16} className="text-muted-foreground" />
        Tipo de Serviço
      </div>
      <Select
        value={serviceFilter}
        onValueChange={(value) => setServiceFilter(value as ServiceType)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filtrar por serviço" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os serviços</SelectItem>
          <SelectItem value="haircut">Corte de Cabelo</SelectItem>
          <SelectItem value="barber">Barba</SelectItem>
          <SelectItem value="combo">Corte e Barba</SelectItem>
          <SelectItem value="treatment">Tratamentos</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
