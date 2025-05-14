
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { StaffData } from "@/contexts/onboarding/types";
import { MultiSelect } from "@/components/professionals/multiselect/ProfessionalsMultiSelect";
import { Option } from "@/components/professionals/multiselect/types";

const staffFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  role: z.string().min(1, "Cargo é obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  specialties: z.array(z.string()).optional(),
});

type StaffFormData = z.infer<typeof staffFormSchema>;

interface StaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StaffFormData) => void;
  staff: StaffData | null;
}

export const StaffDialog: React.FC<StaffDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  staff,
}) => {
  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: "",
      role: "",
      email: "",
      phone: "",
      specialties: [],
    },
  });

  // Reset form when dialog opens/closes or staff changes
  useEffect(() => {
    if (staff) {
      form.reset({
        name: staff.name,
        role: staff.role,
        email: staff.email || "",
        phone: staff.phone || "",
        specialties: staff.specialties || [],
      });
    } else if (!open) {
      form.reset({
        name: "",
        role: "",
        email: "",
        phone: "",
        specialties: [],
      });
    }
  }, [staff, open, form]);

  const handleSubmit = (data: StaffFormData) => {
    onSubmit(data);
  };

  // Common specialty options
  const specialtyOptions: Option[] = [
    { label: "Corte", value: "Corte" },
    { label: "Coloração", value: "Coloração" },
    { label: "Manicure", value: "Manicure" },
    { label: "Pedicure", value: "Pedicure" },
    { label: "Depilação", value: "Depilação" },
    { label: "Massagem", value: "Massagem" },
    { label: "Maquiagem", value: "Maquiagem" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {staff ? "Editar Profissional" : "Adicionar Profissional"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do profissional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Cabeleireiro, Barbeiro, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (opcional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email do profissional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Telefone do profissional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="specialties"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especialidades (opcional)</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={specialtyOptions}
                        selectedValues={field.value || []}
                        onChange={field.onChange}
                        placeholder="Selecione especialidades"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {staff ? "Atualizar" : "Adicionar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
