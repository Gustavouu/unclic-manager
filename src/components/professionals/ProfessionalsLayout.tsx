
import { useState } from "react";
import { ProfessionalsHeader } from "./ProfessionalsHeader";
import { ProfessionalsTable } from "./ProfessionalsTable";
import { ProfessionalsFilters } from "./ProfessionalsFilters";
import { ProfessionalsFiltersSheet } from "./ProfessionalsFiltersSheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { NewProfessionalDialog } from "./NewProfessionalDialog";

interface ProfessionalsLayoutProps {
  onSelectProfessional: (id: string) => void;
}

export const ProfessionalsLayout = ({ onSelectProfessional }: ProfessionalsLayoutProps) => {
  const isMobile = useIsMobile();
  const [showNewProfessionalDialog, setShowNewProfessionalDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  return (
    <div className="space-y-4">
      <ProfessionalsHeader 
        onNewProfessional={() => setShowNewProfessionalDialog(true)}
        onToggleFilters={() => setShowFilters(true)}
      />
      
      <div className="flex gap-4">
        {!isMobile && (
          <div className="hidden md:block w-64 shrink-0">
            <ProfessionalsFilters />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <ProfessionalsTable onSelectProfessional={onSelectProfessional} />
        </div>
      </div>
      
      {isMobile && (
        <ProfessionalsFiltersSheet 
          open={showFilters} 
          onOpenChange={setShowFilters}
        />
      )}
      
      <NewProfessionalDialog 
        open={showNewProfessionalDialog}
        onOpenChange={setShowNewProfessionalDialog}
      />
    </div>
  );
};
