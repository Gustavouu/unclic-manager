
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScissorsSquare } from "lucide-react";
import { ServiceForm } from "./ServiceForm";
import { ServiceData } from "./servicesData";
import { toast } from "sonner";

interface NewServiceDialogProps {
  onServiceCreated: (service: ServiceData) => void;
}

export function NewServiceDialog({ onServiceCreated }: NewServiceDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: ServiceData) => {
    onServiceCreated(data);
    setOpen(false);
    toast.success("Serviço criado com sucesso!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <ScissorsSquare size={16} />
          Novo Serviço
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Serviço</DialogTitle>
        </DialogHeader>
        <ServiceForm 
          onSubmit={handleSubmit} 
          onCancel={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}
