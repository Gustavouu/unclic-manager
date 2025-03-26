
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { StaffData } from "@/contexts/OnboardingContext";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const staffSchema = z.object({
  name: z.string().min(1, "Nome do profissional é obrigatório"),
  role: z.string().min(1, "Cargo é obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

type StaffFormValues = z.infer<typeof staffSchema>;

interface StaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StaffFormValues & { specialties?: string[] }) => void;
  staff: StaffData | null;
}

export const StaffDialog: React.FC<StaffDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  staff
}) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: "",
      role: "",
      email: "",
      phone: ""
    }
  });
  
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState("");
  
  // Resetar formulário quando o modal abrir ou o funcionário mudar
  useEffect(() => {
    if (open) {
      if (staff) {
        reset({
          name: staff.name,
          role: staff.role,
          email: staff.email || "",
          phone: staff.phone || ""
        });
        setSpecialties(staff.specialties || []);
      } else {
        reset({
          name: "",
          role: "",
          email: "",
          phone: ""
        });
        setSpecialties([]);
      }
    }
  }, [open, staff, reset]);
  
  const handleAddSpecialty = () => {
    if (newSpecialty.trim() !== "" && !specialties.includes(newSpecialty)) {
      setSpecialties([...specialties, newSpecialty]);
      setNewSpecialty("");
    }
  };
  
  const handleRemoveSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter(s => s !== specialty));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSpecialty();
    }
  };
  
  const handleFormSubmit = (data: StaffFormValues) => {
    onSubmit({
      ...data,
      specialties: specialties.length > 0 ? specialties : undefined
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {staff ? "Editar Profissional" : "Adicionar Profissional"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Profissional</Label>
            <Input
              id="name"
              placeholder="Ex: João da Silva"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Cargo</Label>
            <Input
              id="role"
              placeholder="Ex: Cabeleireiro"
              {...register("role")}
            />
            {errors.role && (
              <p className="text-sm font-medium text-destructive">{errors.role.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email (opcional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ex: joao@exemplo.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone (opcional)</Label>
              <Input
                id="phone"
                placeholder="Ex: (11) 99999-9999"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm font-medium text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="specialties">Especialidades (opcional)</Label>
            <div className="flex gap-2">
              <Input
                id="specialties"
                placeholder="Ex: Corte Masculino"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button type="button" onClick={handleAddSpecialty}>
                Adicionar
              </Button>
            </div>
            
            {specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {specialty}
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialty(specialty)}
                      className="ml-1 rounded-full hover:bg-muted p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {staff ? "Atualizar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
