
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ServiceData } from "./servicesData";
import { v4 as uuidv4 } from "uuid";
import { InfoIcon, PlusCircle } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

const serviceFormSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  duration: z.coerce.number().min(5, { message: "Duração mínima de 5 minutos" }),
  price: z.coerce.number().min(0, { message: "Preço não pode ser negativo" }),
  category: z.string().min(1, { message: "Categoria é obrigatória" }),
  isPopular: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  description: z.string().optional(),
  newCategory: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

interface ServiceFormProps {
  service?: ServiceData;
  onSubmit: (data: ServiceData) => void;
  onCancel: () => void;
}

const DEFAULT_CATEGORIES = [
  "Corte de Cabelo", 
  "Barba", 
  "Combo (Cabelo + Barba)", 
  "Acabamento", 
  "Pigmentação", 
  "Tratamento Capilar", 
  "Coloração",
  "Sobrancelha"
];

export function ServiceForm({ service, onSubmit, onCancel }: ServiceFormProps) {
  const [showNewCategory, setShowNewCategory] = useState(false);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: service 
      ? { ...service, newCategory: "" } 
      : {
          name: "",
          duration: 30,
          price: 0,
          category: "",
          isPopular: false,
          isFeatured: false,
          description: "",
          newCategory: "",
        },
  });

  const handleSubmit = (data: ServiceFormValues) => {
    // Determine the final category (either selected or new)
    const finalCategory = showNewCategory && data.newCategory ? data.newCategory : data.category;

    // Ensure all required fields are present by creating a complete ServiceData object
    const completeServiceData: ServiceData = {
      id: service?.id || uuidv4(),
      name: data.name,
      duration: data.duration,
      price: data.price,
      category: finalCategory,
      isPopular: data.isPopular,
      isFeatured: data.isFeatured,
      description: data.description,
    };
    
    onSubmit(completeServiceData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do serviço</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Corte Degradê" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duração (minutos)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {!showNewCategory ? (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <FormLabel>Categoria</FormLabel>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs"
                onClick={() => setShowNewCategory(true)}
              >
                <PlusCircle className="h-3.5 w-3.5 mr-1" />
                Nova Categoria
              </Button>
            </div>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DEFAULT_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <FormLabel>Nova Categoria</FormLabel>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs"
                onClick={() => setShowNewCategory(false)}
              >
                Usar categorias existentes
              </Button>
            </div>
            <FormField
              control={form.control}
              name="newCategory"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Ex: Design de Barba" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Descreva o serviço..." {...field} className="resize-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="isPopular"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 space-y-0">
                <div className="space-y-0.5 flex items-center">
                  <FormLabel className="text-sm mr-2">Serviço Popular</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-56">Serviços populares são destacados na página inicial e recebem prioridade nas recomendações aos clientes.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 space-y-0">
                <div className="space-y-0.5 flex items-center">
                  <FormLabel className="text-sm mr-2">Serviço Destacado</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-56">Serviços destacados aparecem em promoções especiais e são apresentados com visual diferenciado no catálogo de serviços.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {service ? "Atualizar Serviço" : "Criar Serviço"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
