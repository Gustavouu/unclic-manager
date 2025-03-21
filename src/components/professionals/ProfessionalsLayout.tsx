
import { useMemo, useState } from "react";
import { ProfessionalsGrid } from "./ProfessionalsGrid";
import { ProfessionalsTable } from "./ProfessionalsTable";
import { Input } from "@/components/ui/input";
import { ProfessionalFilters } from "./ProfessionalFilters";
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfessionalDetailsDialog } from "./ProfessionalDetailsDialog";

interface ProfessionalsLayoutProps {
  view: "grid" | "list";
}

export const ProfessionalsLayout = ({ view }: ProfessionalsLayoutProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  
  const { professionals, isLoading, specialties } = useProfessionals();
  
  const filteredProfessionals = useMemo(() => {
    if (!searchTerm.trim()) return professionals;
    
    const term = searchTerm.toLowerCase();
    return professionals.filter(
      professional => 
        professional.name.toLowerCase().includes(term) || 
        professional.specialties.some(s => s.toLowerCase().includes(term)) ||
        professional.email?.toLowerCase().includes(term)
    );
  }, [professionals, searchTerm]);

  const handleProfessionalClick = (id: string) => {
    setSelectedProfessionalId(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar colaboradores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          variant="outline" 
          className="flex gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} />
          Filtros
        </Button>
      </div>

      {showFilters && (
        <ProfessionalFilters specialties={specialties} />
      )}

      {isLoading ? (
        <div className="flex justify-center p-8">
          <p>Carregando colaboradores...</p>
        </div>
      ) : (
        <>
          {view === "grid" ? (
            <ProfessionalsGrid 
              professionals={filteredProfessionals} 
              onProfessionalClick={handleProfessionalClick}
            />
          ) : (
            <ProfessionalsTable 
              professionals={filteredProfessionals} 
              onProfessionalClick={handleProfessionalClick}
            />
          )}
        </>
      )}

      {selectedProfessionalId && (
        <ProfessionalDetailsDialog
          professionalId={selectedProfessionalId}
          open={!!selectedProfessionalId}
          onOpenChange={(open) => {
            if (!open) setSelectedProfessionalId(null);
          }}
        />
      )}
    </div>
  );
};
