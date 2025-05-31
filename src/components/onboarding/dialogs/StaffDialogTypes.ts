
import { StaffData } from '@/contexts/onboarding/types';

export interface StaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: {
    name: string;
    role: string;
    email?: string;
    phone?: string;
    specialties?: string[];
  }) => void;
  staff?: StaffData | null;
}
