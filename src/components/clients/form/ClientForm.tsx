
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { clientSchema, ClientFormValues, ClientSubmitValues } from "./ClientFormSchema";
import { toast } from "sonner";

type ClientFormProps = {
  onSubmit: (data: ClientSubmitValues) => void;
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
    // Ensure we meet the required fields for ClientSubmitValues
    const clientData: ClientSubmitValues = {
      name: data.name,
      email: data.email || "", // Always provide a string value for email
      phone: data.phone || "", // Always provide a string value for phone
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
