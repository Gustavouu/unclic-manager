
import { StaffData } from '@/contexts/onboarding/types';

export interface StaffCardProps {
  staff: StaffData;
  onEdit: () => void;
  onRemove?: () => void;
}
