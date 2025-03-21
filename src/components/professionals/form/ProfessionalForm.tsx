
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { ProfessionalCreateForm } from "@/hooks/professionals/types";
import { ProfessionalFormFields } from "./ProfessionalFormFields";
import { professionalSchema } from "../schemas/professionalFormSchema";

interface ProfessionalFormProps {
  onClose: () => void;
}

export const ProfessionalForm = ({ onClose }: ProfessionalFormProps) => {
  const { specialties, addProfessional } = useProfessionals();
  
  const form = useForm<ProfessionalCreateForm>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "",
      bio: "",
      specialties: [],
      commissionPercentage: 0,
    },
  });

  const onSubmit = async (data: ProfessionalCreateForm) => {
    await addProfessional(data);
    form.reset();
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ProfessionalFormFields form={form} specialties={specialties} />
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button type="submit">Adicionar Colaborador</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
