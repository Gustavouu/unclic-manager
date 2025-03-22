
import { Button } from "@/components/ui/button";
import { ScissorsSquare } from "lucide-react";
import { TipsDialog } from "./TipsDialog";

export const ServicesHeader = () => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <h1 className="text-xl font-display font-medium">Gerenciamento de Serviços</h1>
      <div className="flex gap-2">
        <TipsDialog />
        <Button className="gap-2">
          <ScissorsSquare size={16} />
          Novo Serviço
        </Button>
      </div>
    </div>
  );
};
