
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ServiceForm } from "./ServiceForm";
import { ServiceData } from "./servicesData";
import { toast } from "sonner";

interface EditServiceDialogProps {
  service: ServiceData;
  onServiceUpdated: (service: ServiceData) => void;
}

export function EditServiceDialog({ service, onServiceUpdated }: EditServiceDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: ServiceData) => {
    onServiceUpdated(data);
    setOpen(false);
    toast.success("Serviço atualizado com sucesso!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        Editar
      </Button>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Editar Serviço</DialogTitle>
        </DialogHeader>
        <ServiceForm 
          service={service}
          onSubmit={handleSubmit} 
          onCancel={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}
