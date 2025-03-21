
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useClientData } from "@/hooks/useClientData";
import { ClientForm } from "./form/ClientForm";
import { ClientFormValues } from "./form/ClientFormSchema";

type NewClientDialogProps = {
  onClose: () => void;
};

export const NewClientDialog = ({ onClose }: NewClientDialogProps) => {
  const { addClient, availableCities } = useClientData();

  const handleSubmit = (data: Omit<ClientFormValues, "id" | "lastVisit" | "totalSpent">) => {
    addClient(data);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
          <DialogDescription>
            Cadastre um novo cliente em sua base de dados.
          </DialogDescription>
        </DialogHeader>
        <ClientForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          availableCities={availableCities}
        />
      </DialogContent>
    </Dialog>
  );
};
