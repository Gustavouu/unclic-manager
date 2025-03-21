
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfessionalsLayout } from "@/components/professionals/ProfessionalsLayout";
import { ProfessionalDetails } from "@/components/professionals/ProfessionalDetails";

const Professionals = () => {
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  
  return (
    <AppLayout title="Colaboradores">
      {selectedProfessionalId ? (
        <ProfessionalDetails
          professionalId={selectedProfessionalId}
          onBack={() => setSelectedProfessionalId(null)}
        />
      ) : (
        <ProfessionalsLayout onSelectProfessional={setSelectedProfessionalId} />
      )}
    </AppLayout>
  );
};

export default Professionals;
