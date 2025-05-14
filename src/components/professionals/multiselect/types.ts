
import { Professional } from "@/hooks/professionals/types";

export interface Option {
  value: string;
  label: string;
}

export interface ProfessionalsMultiSelectProps {
  selectedProfessionals?: Professional[];
  onSelectProfessional?: (professional: Professional) => void;
  onRemoveProfessional?: (professionalId: string) => void;
  disabled?: boolean;
  className?: string;
}
