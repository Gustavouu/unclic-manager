
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { ProfessionalCreateForm, Professional } from "@/hooks/professionals/types";
import { ProfessionalFormFields } from "./ProfessionalFormFields";
import { professionalSchema } from "../schemas/professionalFormSchema";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ProfessionalFormProps {
  onClose: () => void;
  professional?: Professional; // Adicionado para edição
  editMode?: boolean;
}

export const ProfessionalForm = ({ 
  onClose, 
  professional,
  editMode = false 
}: ProfessionalFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Obter dados dos profissionais e garantir que specialties é inicializado corretamente
  const { specialties = [], addProfessional, updateProfessional } = useProfessionals();
  
  // Garantir que temos valores de especialidades para exibir no formulário
  const [availableSpecialties, setAvailableSpecialties] = useState<string[]>([]);
  
  useEffect(() => {
    // Inicializar com valores padrão se não houver especialidades
    if (!specialties || specialties.length === 0) {
      setAvailableSpecialties([
        "Cabeleireiro", 
        "Manicure", 
        "Pedicure", 
        "Esteticista", 
        "Massagista", 
        "Barbeiro", 
        "Maquiador"
      ]);
    } else {
      setAvailableSpecialties(specialties);
    }
  }, [specialties]);
  
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
      // Garantir que specialties é sempre um array
      const formData = {
        ...data,
        specialties: Array.isArray(data.specialties) ? data.specialties : []
      };
      
      console.log("Enviando dados do formulário:", formData);
      
      if (editMode && professional) {
        await updateProfessional(professional.id, formData);
        toast({
          title: "Colaborador atualizado",
          description: "O colaborador foi atualizado com sucesso.",
        });
      } else {
        await addProfessional(formData);
        toast({
          title: "Colaborador adicionado",
          description: "O colaborador foi adicionado com sucesso.",
        });
        form.reset();
      }
      
      // Aguardar um tempo maior antes de fechar o diálogo
      // para garantir que o estado seja atualizado completamente
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Erro ao processar profissional:", error);
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
      <DialogDescription className="mb-5">
        {editMode 
          ? "Edite as informações do colaborador abaixo." 
          : "Preencha as informações do novo colaborador abaixo."
        }
      </DialogDescription>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ProfessionalFormFields 
          form={form} 
          specialties={availableSpecialties}
          editMode={editMode}
          initialPhotoUrl={professional?.photoUrl}
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
