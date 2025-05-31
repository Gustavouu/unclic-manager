
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Professional {
  id: string;
  name: string;
  photo_url?: string;
}

interface ProfessionalSelectWrapperProps {
  form: any;
  serviceId?: string;
}

export default function ProfessionalSelectWrapper({ form, serviceId }: ProfessionalSelectWrapperProps) {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
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
        
        const { data: professionalsData, error } = await supabase
          .from('employees')
          .select('id, name, photo_url')
          .eq('business_id', businessId);
          
        if (!error && professionalsData?.length) {
          console.log('Found professionals:', professionalsData.length);
          setProfessionals(professionalsData);
        } else {
          console.log('No professionals found');
          setProfessionals([]);
        }
      } catch (error) {
        console.error('Error fetching professionals:', error);
        setProfessionals([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfessionals();
  }, [businessId]);
    
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
            <PopoverContent className="p-0 w-full" style={{width: "var(--radix-popover-trigger-width)", maxWidth: "100%"}}>
              <Command>
                <CommandInput placeholder="Buscar profissional..." className="h-9" />
                <CommandEmpty>Nenhum profissional encontrado.</CommandEmpty>
                <CommandGroup className="max-h-[200px] overflow-y-auto">
                  {professionals.map((professional) => (
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
                          <AvatarImage src={professional.photo_url || undefined} alt={professional.name} />
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
