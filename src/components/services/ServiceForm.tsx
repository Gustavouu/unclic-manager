
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const serviceFormSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  duration: z.coerce.number().min(5, { message: "Duração mínima de 5 minutos" }),
  price: z.coerce.number().min(0, { message: "Preço não pode ser negativo" }),
  isPopular: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  description: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do serviço</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Corte Degradê, Barba Completa, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-5">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <FormField
            control={form.control}
            name="isPopular"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-y-0">
                <div className="space-y-0.5 flex items-center">
                  <FormLabel className="text-sm mr-2">Serviço Popular</FormLabel>
                  <HoverCard>
                    <Popover>
                      <PopoverTrigger asChild>
                        <HoverCardTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 p-0 rounded-full">
                            <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                          </Button>
                        </HoverCardTrigger>
                      </PopoverTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">Serviço Popular</h4>
                          <p className="text-sm text-muted-foreground">
                            Serviços populares são destacados na página inicial e recebem prioridade nas recomendações aos clientes.
                          </p>
                        </div>
                      </HoverCardContent>
                      <PopoverContent className="w-80">
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">Serviço Popular</h4>
                          <p className="text-sm text-muted-foreground">
                            Serviços populares são destacados na página inicial e recebem prioridade nas recomendações aos clientes.
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </HoverCard>
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
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-y-0">
                <div className="space-y-0.5 flex items-center">
                  <FormLabel className="text-sm mr-2">Serviço Destacado</FormLabel>
                  <HoverCard>
                    <Popover>
                      <PopoverTrigger asChild>
                        <HoverCardTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 p-0 rounded-full">
                            <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                          </Button>
                        </HoverCardTrigger>
                      </PopoverTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">Serviço Destacado</h4>
                          <p className="text-sm text-muted-foreground">
                            Serviços destacados aparecem em promoções especiais e são apresentados com visual diferenciado no catálogo de serviços.
                          </p>
                        </div>
                      </HoverCardContent>
                      <PopoverContent className="w-80">
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">Serviço Destacado</h4>
                          <p className="text-sm text-muted-foreground">
                            Serviços destacados aparecem em promoções especiais e são apresentados com visual diferenciado no catálogo de serviços.
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </HoverCard>
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
        
        <div className="flex justify-end space-x-3 pt-6">
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
