
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { clientSchema, ClientFormValues } from "./ClientFormSchema";
import { toast } from "sonner";

type ClientFormProps = {
  onSubmit: (data: Omit<ClientFormValues, "id" | "lastVisit" | "totalSpent">) => void;
  onCancel: () => void;
  availableCities: string[];
};

export const ClientForm = ({ onSubmit, onCancel, availableCities }: ClientFormProps) => {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      gender: "Feminino",
      city: "",
      category: "Regular",
    },
  });

  const handleSubmit = (data: ClientFormValues) => {
    // Garantir que o nome é uma string não vazia, mesmo que isso já seja validado pelo schema
    const clientData = {
      name: data.name, // Esta propriedade é obrigatória
      email: data.email || "",
      phone: data.phone || "",
      gender: data.gender,
      city: data.city,
      category: data.category
    };
    
    onSubmit(clientData);
    toast.success("Cliente adicionado com sucesso!");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <PersonalInfoFields form={form} availableCities={availableCities} />
        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit">Salvar</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
