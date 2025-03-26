
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ServiceData } from "@/contexts/OnboardingContext";

const serviceSchema = z.object({
  name: z.string().min(1, "Nome do serviço é obrigatório"),
  duration: z.coerce.number().min(5, "A duração mínima é de 5 minutos"),
  price: z.coerce.number().min(0, "O preço deve ser maior ou igual a zero"),
  description: z.string().optional()
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ServiceFormValues) => void;
  service: ServiceData | null;
}

export const ServiceDialog: React.FC<ServiceDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  service
}) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      duration: 30,
      price: 0,
      description: ""
    }
  });
  
  // Resetar formulário quando o modal abrir ou o serviço mudar
  useEffect(() => {
    if (open) {
      if (service) {
        reset({
          name: service.name,
          duration: service.duration,
          price: service.price,
          description: service.description || ""
        });
      } else {
        reset({
          name: "",
          duration: 30,
          price: 0,
          description: ""
        });
      }
    }
  }, [open, service, reset]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {service ? "Editar Serviço" : "Adicionar Serviço"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Serviço</Label>
            <Input
              id="name"
              placeholder="Ex: Corte de Cabelo"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duração (minutos)</Label>
              <Input
                id="duration"
                type="number"
                min={5}
                step={5}
                {...register("duration")}
              />
              {errors.duration && (
                <p className="text-sm font-medium text-destructive">{errors.duration.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                min={0}
                step={0.01}
                {...register("price")}
              />
              {errors.price && (
                <p className="text-sm font-medium text-destructive">{errors.price.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Descreva o serviço..."
              className="resize-none"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm font-medium text-destructive">{errors.description.message}</p>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {service ? "Atualizar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
