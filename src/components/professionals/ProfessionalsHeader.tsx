
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, UserPlus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileFilterToggle } from "@/components/clients/filters/MobileFilterToggle";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

interface ProfessionalsHeaderProps {
  onNewProfessional: () => void;
  onToggleFilters: () => void;
}

export const ProfessionalsHeader = ({ onNewProfessional, onToggleFilters }: ProfessionalsHeaderProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4">
      <Breadcrumb items={[
        { label: "Home", active: false },
        { label: "Colaboradores", active: true },
      ]} />
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h1 className="text-xl font-display font-medium">Colaboradores</h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar colaborador..." 
              className="pl-8"
            />
          </div>
          
          {!isMobile && (
            <Button variant="outline" size="icon" className="shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          )}
          
          <Button 
            onClick={onNewProfessional}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4" />
            {isMobile ? "" : "Novo Colaborador"}
          </Button>
          
          {isMobile && (
            <MobileFilterToggle onClick={onToggleFilters} />
          )}
        </div>
      </div>
    </div>
  );
};
