
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { ClientForm, ClientFormData, ClientFormErrors } from "./form/ClientForm";
import { validateClientForm, getEmptyClientForm } from "./form/clientFormValidation";

interface NewClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (newClient: any) => void;
}

export const NewClientDialog = ({ isOpen, onOpenChange, onSubmit }: NewClientDialogProps) => {
  const [newClient, setNewClient] = useState<ClientFormData>(getEmptyClientForm());
  const [errors, setErrors] = useState<ClientFormErrors>({});

  const handleSubmit = () => {
    const validationErrors = validateClientForm(newClient);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(newClient);
      setNewClient(getEmptyClientForm());
    }
  };

  const handleChange = (field: string, value: string) => {
    setNewClient({ ...newClient, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus size={16} />
          Novo Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[485px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Cliente</DialogTitle>
          <DialogDescription>
            Preencha os dados do cliente para adicionar ao sistema.
          </DialogDescription>
        </DialogHeader>
        
        <ClientForm 
          clientData={newClient} 
          errors={errors} 
          onChange={handleChange} 
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Adicionar Cliente</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
