
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
import { UserRoundPlus } from "lucide-react";
import { ProfessionalForm, ProfessionalFormData, ProfessionalFormErrors } from "./form/ProfessionalForm";
import { validateProfessionalForm, getEmptyProfessionalForm } from "./form/professionalFormValidation";

interface NewProfessionalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (newProfessional: any) => void;
}

export const NewProfessionalDialog = ({ isOpen, onOpenChange, onSubmit }: NewProfessionalDialogProps) => {
  const [newProfessional, setNewProfessional] = useState<ProfessionalFormData>(getEmptyProfessionalForm());
  const [errors, setErrors] = useState<ProfessionalFormErrors>({});

  const handleSubmit = () => {
    const validationErrors = validateProfessionalForm(newProfessional);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(newProfessional);
      setNewProfessional(getEmptyProfessionalForm());
    }
  };

  const handleChange = (field: string, value: string) => {
    setNewProfessional({ ...newProfessional, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserRoundPlus size={16} />
          Novo Colaborador
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[485px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Colaborador</DialogTitle>
          <DialogDescription>
            Preencha os dados do colaborador para adicionar ao sistema.
          </DialogDescription>
        </DialogHeader>
        
        <ProfessionalForm 
          professionalData={newProfessional} 
          errors={errors} 
          onChange={handleChange} 
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Adicionar Colaborador</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
