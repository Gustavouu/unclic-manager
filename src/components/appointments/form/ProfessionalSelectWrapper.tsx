
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { normalizeProfessionalData, tableExists } from "@/utils/databaseUtils";

export type ProfessionalSelectWrapperProps = {
  form: UseFormReturn<AppointmentFormValues>;
  serviceId?: string;
};

export default function ProfessionalSelectWrapper({ form, serviceId }: ProfessionalSelectWrapperProps) {
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { businessId } = useTenant();
  
  // Fetch professionals from the database
  useEffect(() => {
    const fetchProfessionals = async () => {
      if (!businessId) return;
      
      setLoading(true);
      try {
        console.log('Fetching professionals for business ID:', businessId);
        let professionalsData: any[] = [];
        
        // Primeiro tenta na tabela professionals
        const hasProfessionalsTable = await tableExists('professionals');
        
        if (hasProfessionalsTable) {
          console.log('Trying professionals table');
          const { data, error } = await supabase
            .from('professionals')
            .select('*')
            .eq('business_id', businessId);
            
          if (error) {
            console.error('Error fetching from professionals:', error);
          } else if (data && data.length > 0) {
            console.log('Found professionals in professionals table:', data.length);
            professionalsData = data.map(normalizeProfessionalData);
          }
        }
        
        // Se não encontrou, tenta na tabela employees
        if (professionalsData.length === 0) {
          const hasEmployeesTable = await tableExists('employees');
          if (hasEmployeesTable) {
            console.log('Trying employees table');
            const { data, error } = await supabase
              .from('employees')
              .select('*')
              .eq('business_id', businessId);
              
            if (error) {
              console.error('Error fetching from employees:', error);
            } else if (data && data.length > 0) {
              console.log('Found professionals in employees table:', data.length);
              professionalsData = data.map(normalizeProfessionalData);
            }
          }
        }
        
        // Por último, tenta na tabela funcionarios
        if (professionalsData.length === 0) {
          try {
            console.log('Trying funcionarios table');
            // Check if the table exists before querying
            const { data: existsData } = await supabase.rpc('table_exists', { table_name: 'funcionarios' });
            if (existsData) {
              const response = await supabase
                .from('funcionarios')
                .select('*')
                .eq('id_negocio', businessId);
                
              if (response.error) {
                console.error('Error fetching from funcionarios:', response.error);
              } else if (response.data && response.data.length > 0) {
                console.log('Found professionals in funcionarios table:', response.data.length);
                professionalsData = response.data.map(normalizeProfessionalData);
              }
            }
          } catch (error) {
            console.error('Error checking funcionarios table:', error);
          }
        }
        
        if (professionalsData.length > 0) {
          setProfessionals(professionalsData);
        } else {
          console.log('No professionals found in any table');
          setProfessionals([]);
        }
      } catch (error) {
        console.error('Error fetching professionals:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfessionals();
  }, [businessId]);
  
  // Filter professionals by service if a serviceId is provided
  const filteredProfessionals = serviceId 
    ? professionals.filter(p => !p.services || (Array.isArray(p.services) && p.services.some((s: any) => s.id === serviceId)))
    : professionals;
    
  return (
    <FormField
      control={form.control}
      name="professionalId"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Profissional</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "justify-between w-full font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                  onClick={() => setOpen(!open)}
                  disabled={loading}
                >
                  {field.value ? 
                    professionals.find(p => p.id === field.value)?.name || "Selecione um profissional" : 
                    "Selecione um profissional"
                  }
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full" style={{width: "var(--radix-popover-trigger-width)"}}>
              <Command>
                <CommandInput placeholder="Buscar profissional..." className="h-9" />
                <CommandEmpty>Nenhum profissional encontrado.</CommandEmpty>
                <CommandGroup className="max-h-[200px] overflow-y-auto">
                  {filteredProfessionals.map((professional) => (
                    <CommandItem
                      key={professional.id}
                      value={professional.name}
                      onSelect={() => {
                        form.setValue("professionalId", professional.id);
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={professional.photo_url || professional.foto_url} alt={professional.name} />
                          <AvatarFallback>{professional.name?.charAt(0) || 'P'}</AvatarFallback>
                        </Avatar>
                        <span>{professional.name}</span>
                      </div>
                      {field.value === professional.id && (
                        <Check className="h-4 w-4 ml-auto" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
