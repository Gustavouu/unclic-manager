
import { Button } from "@/components/ui/button";
import { TipsDialog } from "./TipsDialog";
import { NewServiceDialog } from "./NewServiceDialog";
import { ServiceData } from "./servicesData";

interface ServicesHeaderProps {
  onServiceCreated: (service: ServiceData) => void;
}

export const ServicesHeader = ({ onServiceCreated }: ServicesHeaderProps) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <h1 className="text-xl font-display font-medium">Gerenciamento de Serviços</h1>
      <div className="flex gap-2">
        <TipsDialog />
        <NewServiceDialog onServiceCreated={onServiceCreated} />
      </div>
    </div>
  );
};
