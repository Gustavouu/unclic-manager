
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { Professional, ProfessionalFormData } from "@/hooks/professionals/types";
import { ProfessionalFormFields } from "./ProfessionalFormFields";
import { professionalFormSchema } from "../schemas/professionalFormSchema";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export interface ProfessionalFormProps {
  onClose: () => void;
  onSubmit: (data: ProfessionalFormData) => Promise<void>;
  professional?: Professional; // For editing
  editMode?: boolean;
  isSubmitting?: boolean;
  initialPhotoUrl?: string;
}

export const ProfessionalForm = ({ 
  onClose, 
  onSubmit,
  professional,
  editMode = false,
  isSubmitting = false
}: ProfessionalFormProps) => {
  // Get professionals data and ensure specialties is properly initialized
  const { specialties = [] } = useProfessionals();
  
  const form = useForm<ProfessionalFormData>({
    resolver: zodResolver(professionalFormSchema),
    defaultValues: {
      name: professional?.name || "",
      email: professional?.email || "",
      phone: professional?.phone || "",
      position: professional?.position || "",
      specialties: professional?.specialties || [] as string[],
      commission_percentage: professional?.commission_percentage || 0,
      photo_url: professional?.photo_url || ""
    },
  });

  const handleSubmit = async (data: ProfessionalFormData) => {
    if (isSubmitting) return;
    
    try {
      // Create a clean copy of the form data
      const formData = {
        ...data,
        specialties: Array.isArray(data.specialties) ? data.specialties as string[] : []
      };
      
      console.log("Submitting professional form data:", formData);
      
      await onSubmit(formData);
    } catch (error) {
      console.error("Error processing professional:", error);
      toast(`Ocorreu um erro ao ${editMode ? 'atualizar' : 'adicionar'} o colaborador.`);
    }
  };

  return (
    <Form {...form}>
      <DialogDescription className="mb-5 text-slate-600">
        {editMode 
          ? "Edite as informações do colaborador abaixo." 
          : "Preencha as informações do novo colaborador abaixo."
        }
      </DialogDescription>
      
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <ProfessionalFormFields 
          form={form} 
          specialties={specialties}
          editMode={editMode}
          initialPhotoUrl={professional?.photo_url}
        />
        
        <DialogFooter className="pt-6">
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
            className="bg-primary"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {editMode ? "Atualizando..." : "Adicionando..."}
              </>
            ) : (
              editMode ? "Atualizar Colaborador" : "Adicionar Colaborador"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
