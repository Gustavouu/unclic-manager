
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { ProfessionalCreateForm } from "@/hooks/professionals/types";
import { ProfessionalFormFields } from "./ProfessionalFormFields";
import { professionalSchema } from "../schemas/professionalFormSchema";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ProfessionalFormProps {
  onClose: () => void;
}

export const ProfessionalForm = ({ onClose }: ProfessionalFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Obter dados dos profissionais com especialidades inicializadas com segurança
  const { specialties = [], addProfessional } = useProfessionals();
  
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
    try {
      setIsSubmitting(true);
      // Garantir que specialties é sempre um array
      const formData = {
        ...data,
        specialties: Array.isArray(data.specialties) ? data.specialties : []
      };
      
      await addProfessional(formData);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Erro ao adicionar profissional:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Garantir que specialties é sempre um array
  const safeSpecialties = Array.isArray(specialties) ? specialties : [];

  return (
    <Form {...form}>
      <DialogDescription className="mb-5">
        Preencha as informações do novo colaborador abaixo.
      </DialogDescription>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ProfessionalFormFields 
          form={form} 
          specialties={safeSpecialties} 
        />
        
        <DialogFooter className="pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adicionando...
              </>
            ) : (
              "Adicionar Colaborador"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
