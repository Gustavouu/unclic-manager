
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { tableExists, safeDataExtract, safeSingleExtract } from "@/utils/databaseUtils";

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
        let hasData = false;
        let profsData: Professional[] = [];
        
        try {
          const response = await supabase
            .from('professionals')
            .select('id, name, position, specialties');
          
          const newData = safeDataExtract(response);
          
          if (newData && newData.length > 0) {
            // Map new data to expected format
            profsData = newData.map(prof => ({
              id: prof.id,
              name: prof.name,
              position: prof.position,
              specialties: prof.specialties
            }));
            setProfessionals(profsData);
            hasData = true;
          }
        } catch (err) {
          console.error("Error fetching from professionals table:", err);
        }
        
        // Try employees table if no data yet
        if (!hasData) {
          try {
            const response = await supabase
              .from('employees')
              .select('id, name, position, specialties');
              
            const employeesData = safeDataExtract(response);
              
            if (employeesData && employeesData.length > 0) {
              // Map employee data to expected format
              profsData = employeesData.map(emp => ({
                id: emp.id,
                name: emp.name,
                position: emp.position,
                specialties: emp.specialties
              }));
              setProfessionals(profsData);
              hasData = true;
            }
          } catch (err) {
            console.error("Error fetching from employees table:", err);
          }
        }
        
        // Try legacy table if still no data
        if (!hasData) {
          try {
            // Check if the table exists
            const funcionariosExists = await tableExists('funcionarios');
              
            if (funcionariosExists) {
              // Table exists, try to query it
              const response = await supabase
                .from('funcionarios')
                .select('id, nome, cargo, especializacoes');
                
              const legacyData = safeDataExtract(response);
                
              if (legacyData && legacyData.length > 0) {
                // Map legacy data to expected format
                profsData = legacyData.map(prof => ({
                  id: prof.id,
                  nome: prof.nome,
                  cargo: prof.cargo,
                  especializacoes: prof.especializacoes
                }));
                setProfessionals(profsData);
                hasData = true;
              }
            }
          } catch (err) {
            console.error("Error checking legacy tables:", err);
          }
        }
        
        // If we get here and still no data, set empty array
        if (!hasData) {
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
        let hasData = false;
        
        try {
          const response = await supabase
            .from('services')
            .select('name')
            .eq('id', serviceId)
            .single();

          const data = safeSingleExtract(response);
          
          if (data) {
            serviceName = data.name;
            filterProfessionalsByService(serviceName);
            hasData = true;
            return;
          }
        } catch (err) {
          console.error("Error fetching from services:", err);
        }
        
        if (!hasData) {
          try {
            const response = await supabase
              .from('servicos')
              .select('nome')
              .eq('id', serviceId)
              .single();
              
            const legacyData = safeSingleExtract(response);
              
            if (legacyData) {
              serviceName = legacyData.nome;
              filterProfessionalsByService(serviceName);
              hasData = true;
              return;
            }
          } catch (err) {
            console.error("Error fetching from legacy services:", err);
          }
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
                {filteredProfessionals.length > 0 ? (
                  filteredProfessionals.map((professional) => (
                    <SelectItem key={professional.id} value={professional.id}>
                      {professional.name || professional.nome || "Unknown"} {(professional.position || professional.cargo) ? 
                        `(${professional.position || professional.cargo})` : ''}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no_professionals" disabled>
                    {loading ? "Carregando profissionais..." : "Nenhum profissional disponível"}
                  </SelectItem>
                )}
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
