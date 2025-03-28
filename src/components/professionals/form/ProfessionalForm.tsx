
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { ProfessionalCreateForm, Professional } from "@/hooks/professionals/types";
import { ProfessionalFormFields } from "./ProfessionalFormFields";
import { professionalSchema } from "../schemas/professionalFormSchema";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ProfessionalFormProps {
  onClose: () => void;
  professional?: Professional; // For editing
  editMode?: boolean;
}

export const ProfessionalForm = ({ 
  onClose, 
  professional,
  editMode = false 
}: ProfessionalFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Get professionals data and ensure specialties is properly initialized
  const { specialties = [], addProfessional, updateProfessional } = useProfessionals();
  
  const form = useForm<ProfessionalCreateForm>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      name: professional?.name || "",
      email: professional?.email || "",
      phone: professional?.phone || "",
      role: professional?.role || "",
      bio: professional?.bio || "",
      specialties: professional?.specialties || [],
      commissionPercentage: professional?.commissionPercentage || 0,
      photoUrl: professional?.photoUrl || ""
    },
  });

  const onSubmit = async (data: ProfessionalCreateForm) => {
    try {
      setIsSubmitting(true);
      
      // Create a clean copy of the form data
      const formData = {
        ...data,
        specialties: Array.isArray(data.specialties) ? data.specialties : []
      };
      
      console.log("Submitting professional form data:", formData);
      
      if (editMode && professional) {
        await updateProfessional(professional.id, formData);
        toast({
          title: "Colaborador atualizado",
          description: "As informações do colaborador foram atualizadas com sucesso.",
        });
      } else {
        await addProfessional(formData);
        toast({
          title: "Colaborador adicionado",
          description: "O novo colaborador foi adicionado com sucesso.",
        });
        form.reset();
      }
      
      // Close the dialog after successful submission
      onClose();
    } catch (error) {
      console.error("Error processing professional:", error);
      toast({
        title: "Erro",
        description: `Ocorreu um erro ao ${editMode ? 'atualizar' : 'adicionar'} o colaborador.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ProfessionalFormFields 
          form={form} 
          specialties={specialties}
          editMode={editMode}
          initialPhotoUrl={professional?.photoUrl}
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
