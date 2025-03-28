
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { ServiceData } from "./servicesData";
import { v4 as uuidv4 } from "uuid";
import { serviceFormSchema, ServiceFormValues } from "./form/formSchema";
import { ServiceDurationPriceFields } from "./form/ServiceDurationPriceFields";
import { ServiceDescriptionField } from "./form/ServiceDescriptionField";
import { ServiceToggleField } from "./form/ServiceToggleField";
import { FormActions } from "./form/FormActions";
import { ServiceTemplateSelect } from "./form/ServiceTemplateSelect";
import { barberServiceTemplates } from "./barberServiceTemplates";
import { useEffect } from "react";

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
          template: "custom",
        }
      : {
          name: "",
          duration: 30,
          price: 0,
          isPopular: false,
          isFeatured: false,
          description: "",
          template: "custom",
        },
  });

  useEffect(() => {
    if (service) {
      form.setValue("template", "custom");
    }
  }, [service, form]);

  const handleSubmit = (data: ServiceFormValues) => {
    // Ensure all required fields are present by creating a complete ServiceData object
    const completeServiceData: ServiceData = {
      id: service?.id || uuidv4(),
      name: data.name,
      duration: data.duration,
      price: data.price,
      category: service?.category || data.name, // Use existing category or name as category
      isPopular: data.isPopular,
      isFeatured: data.isFeatured,
      description: data.description,
    };
    
    onSubmit(completeServiceData);
  };

  const handleTemplateSelect = (templateId: string) => {
    if (templateId === "custom") {
      // Se selecionar "Personalizado", limpa os campos mas mantém o template
      form.setValue("name", "");
      form.setValue("duration", 30);
      form.setValue("price", 0);
      form.setValue("description", "");
      return;
    }

    const selectedTemplate = barberServiceTemplates.find(template => template.id === templateId);
    if (selectedTemplate) {
      form.setValue("name", selectedTemplate.name);
      form.setValue("duration", selectedTemplate.duration);
      form.setValue("price", selectedTemplate.price);
      form.setValue("description", selectedTemplate.description);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        <ServiceTemplateSelect control={form.control} onTemplateSelect={handleTemplateSelect} />
        
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

        <input type="hidden" {...form.register("name")} />
      </form>
    </Form>
  );
}
