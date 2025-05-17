
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { tableExists } from "@/utils/databaseUtils";

export interface Professional {
  id: string;
  nome?: string;
  name?: string;
  cargo?: string;
  position?: string;
  especializacoes?: string[];
  specialties?: string[];
}

interface ProfessionalSelectWrapperProps {
  form: UseFormReturn<AppointmentFormValues>;
  serviceId?: string;
  availableStaff?: Professional[];
}

const ProfessionalSelectWrapper = ({ 
  form, 
  serviceId,
  availableStaff 
}: ProfessionalSelectWrapperProps) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(false);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);

  // Use provided staff or fetch from the database
  useEffect(() => {
    if (availableStaff && availableStaff.length > 0) {
      setProfessionals(availableStaff);
      return;
    }

    const fetchProfessionals = async () => {
      setLoading(true);
      try {
        // First try professionals table (new schema)
        try {
          const { data: newData, error: newError } = await supabase
            .from('professionals')
            .select('id, name, position, specialties')
            .eq('isActive', true);
          
          if (!newError && newData && newData.length > 0) {
            // Map new data to expected format
            const mappedData: Professional[] = newData.map(prof => ({
              id: prof.id,
              name: prof.name,
              position: prof.position,
              specialties: prof.specialties
            }));
            setProfessionals(mappedData);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error("Error fetching from professionals table:", err);
        }
        
        // Try employees table
        try {
          const { data: employeesData, error: employeesError } = await supabase
            .from('employees')
            .select('id, name, position, specialties')
            .eq('status', 'active');
            
          if (!employeesError && employeesData && employeesData.length > 0) {
            // Map employee data to expected format
            const mappedData: Professional[] = employeesData.map(emp => ({
              id: emp.id,
              name: emp.name,
              position: emp.position,
              specialties: emp.specialties
            }));
            setProfessionals(mappedData);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error("Error fetching from employees table:", err);
        }
        
        // Try legacy table
        try {
          // Check if the table exists by trying to query it
          const funcionariosExists = await tableExists('funcionarios');
            
          if (funcionariosExists) {
            // Table might exist, try to query it
            const { data: legacyData, error: legacyError } = await supabase
              .from('funcionarios')
              .select('id, nome, cargo, especializacoes')
              .eq('status', 'ativo');
              
            if (!legacyError && legacyData && legacyData.length > 0) {
              // Map legacy data to expected format
              const mappedData: Professional[] = legacyData.map(prof => ({
                id: prof.id,
                nome: prof.nome,
                cargo: prof.cargo,
                especializacoes: prof.especializacoes
              }));
              setProfessionals(mappedData);
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          console.error("Error checking legacy tables:", err);
        }
        
        // If we get here, no data was found
        setProfessionals([]);
        
      } catch (error) {
        console.error('Error fetching professionals:', error);
        setProfessionals([]);
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
        // Try new services table
        let serviceName = "";
        
        try {
          const { data, error } = await supabase
            .from('services')
            .select('name')
            .eq('id', serviceId)
            .single();

          if (!error && data) {
            serviceName = data.name;
            filterProfessionalsByService(serviceName);
            return;
          }
        } catch (err) {
          console.error("Error fetching from services:", err);
        }
        
        try {
          const { data: legacyData, error: legacyError } = await supabase
            .from('servicos')
            .select('nome')
            .eq('id', serviceId)
            .single();
            
          if (!legacyError && legacyData) {
            serviceName = legacyData.nome;
            filterProfessionalsByService(serviceName);
            return;
          }
        } catch (err) {
          console.error("Error fetching from legacy services:", err);
        }
        
        // If we get here, we couldn't find the service
        setFilteredProfessionals(professionals);
      } catch (error) {
        console.error('Error getting service:', error);
        setFilteredProfessionals(professionals);
      }
    };

    const filterProfessionalsByService = (serviceName: string) => {
      // Filter professionals who can provide this service
      const filtered = professionals.filter(prof => {
        const specializations = prof.specialties || prof.especializacoes;
        return (
          !specializations || 
          specializations.length === 0 || 
          specializations.includes(serviceName)
        );
      });
      setFilteredProfessionals(filtered);
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
                    {professional.name || professional.nome || "Unknown"} {(professional.position || professional.cargo) ? 
                      `(${professional.position || professional.cargo})` : ''}
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
