
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProfessionalSelectWrapperProps {
  form: UseFormReturn<AppointmentFormValues>;
  serviceId?: string;
  availableStaff?: any[];
}

const ProfessionalSelectWrapper = ({ 
  form, 
  serviceId,
  availableStaff 
}: ProfessionalSelectWrapperProps) => {
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filteredProfessionals, setFilteredProfessionals] = useState<any[]>([]);

  // Use provided staff or fetch from the database
  useEffect(() => {
    if (availableStaff && availableStaff.length > 0) {
      setProfessionals(availableStaff);
      return;
    }

    const fetchProfessionals = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('funcionarios')
          .select('id, nome, cargo, especializacoes')
          .eq('status', 'ativo');
        
        if (error) throw error;
        setProfessionals(data || []);
      } catch (error) {
        console.error('Error fetching professionals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [availableStaff]);

  // Filter professionals by service if serviceId is provided
  useEffect(() => {
    if (!serviceId) {
      setFilteredProfessionals(professionals);
      return;
    }

    // Get service name to match with specializations
    const getServiceName = async () => {
      try {
        const { data } = await supabase
          .from('servicos')
          .select('nome')
          .eq('id', serviceId)
          .single();

        if (data) {
          // Filter professionals who can provide this service
          const filtered = professionals.filter(prof => 
            !prof.especializacoes || 
            prof.especializacoes.length === 0 || 
            prof.especializacoes.includes(data.nome)
          );
          setFilteredProfessionals(filtered);
        } else {
          setFilteredProfessionals(professionals);
        }
      } catch (error) {
        console.error('Error getting service:', error);
        setFilteredProfessionals(professionals);
      }
    };

    // Only run if we have a serviceId and professionals
    if (serviceId && professionals.length > 0) {
      getServiceName();
    } else {
      setFilteredProfessionals(professionals);
    }
  }, [serviceId, professionals]);

  return (
    <FormField
      control={form.control}
      name="professionalId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Profissional</FormLabel>
          <FormControl>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={loading || filteredProfessionals.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Carregando..." : "Selecione um profissional"} />
              </SelectTrigger>
              <SelectContent>
                {filteredProfessionals.map((professional) => (
                  <SelectItem key={professional.id} value={professional.id}>
                    {professional.nome} {professional.cargo ? `(${professional.cargo})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProfessionalSelectWrapper;
