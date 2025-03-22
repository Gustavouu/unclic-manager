
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { ServiceData } from "./servicesData";
import { v4 as uuidv4 } from "uuid";
import { serviceFormSchema, ServiceFormValues } from "./form/formSchema";
import { ServiceNameField } from "./form/ServiceNameField";
import { ServiceDurationPriceFields } from "./form/ServiceDurationPriceFields";
import { ServiceDescriptionField } from "./form/ServiceDescriptionField";
import { ServiceToggleField } from "./form/ServiceToggleField";
import { FormActions } from "./form/FormActions";

interface ServiceFormProps {
  service?: ServiceData;
  onSubmit: (data: ServiceData) => void;
  onCancel: () => void;
}

export function ServiceForm({ service, onSubmit, onCancel }: ServiceFormProps) {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: service 
      ? { 
          name: service.name,
          duration: service.duration,
          price: service.price,
          isPopular: service.isPopular,
          isFeatured: service.isFeatured,
          description: service.description || "",
        }
      : {
          name: "",
          duration: 30,
          price: 0,
          isPopular: false,
          isFeatured: false,
          description: "",
        },
  });

  const handleSubmit = (data: ServiceFormValues) => {
    // Ensure all required fields are present by creating a complete ServiceData object
    const completeServiceData: ServiceData = {
      id: service?.id || uuidv4(),
      name: data.name,
      duration: data.duration,
      price: data.price,
      category: data.name, // Use name as category
      isPopular: data.isPopular,
      isFeatured: data.isFeatured,
      description: data.description,
    };
    
    onSubmit(completeServiceData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        <ServiceNameField control={form.control} />
        
        <ServiceDurationPriceFields control={form.control} />
        
        <ServiceDescriptionField control={form.control} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <ServiceToggleField
            control={form.control}
            name="isPopular"
            label="Serviço Popular"
            tooltipTitle="Serviço Popular"
            tooltipDescription="Serviços populares são destacados na página inicial e recebem prioridade nas recomendações aos clientes."
          />
          
          <ServiceToggleField
            control={form.control}
            name="isFeatured"
            label="Serviço Destacado"
            tooltipTitle="Serviço Destacado"
            tooltipDescription="Serviços destacados aparecem em promoções especiais e são apresentados com visual diferenciado no catálogo de serviços."
          />
        </div>
        
        <FormActions onCancel={onCancel} isEditing={!!service} />
      </form>
    </Form>
  );
}
