
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";

interface Professional {
  id: string;
  name: string;
}

interface ProfessionalFilterProps {
  selectedProfessionalId: string | null;
  onSelectProfessional: (professionalId: string | null) => void;
}

export const ProfessionalFilter = ({ 
  selectedProfessionalId, 
  onSelectProfessional 
}: ProfessionalFilterProps) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { businessId } = useCurrentBusiness();
  
  useEffect(() => {
    const fetchProfessionals = async () => {
      if (!businessId) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('professionals')
          .select('id, name')
          .eq('business_id', businessId)
          .eq('isActive', true)
          .order('name');
          
        if (error) throw error;
        
        setProfessionals(data || []);
      } catch (error) {
        console.error("Erro ao buscar profissionais:", error);
        setProfessionals([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfessionals();
  }, [businessId]);
  
  const handleChange = (value: string) => {
    if (value === "all") {
      onSelectProfessional(null);
    } else {
      onSelectProfessional(value);
    }
  };
  
  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor="professionalFilter">Profissional</Label>
      <Select
        value={selectedProfessionalId || "all"}
        onValueChange={handleChange}
        disabled={isLoading}
      >
        <SelectTrigger id="professionalFilter" className="w-[180px]">
          <SelectValue placeholder="Todos os profissionais" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os profissionais</SelectItem>
          {professionals.map(professional => (
            <SelectItem key={professional.id} value={professional.id}>
              {professional.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
