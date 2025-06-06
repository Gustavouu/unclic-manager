
import React from 'react';
import { ProfessionalFormDialog } from './ProfessionalFormDialog';
import { Professional } from '@/hooks/professionals/types';

interface EditProfessionalDialogProps {
  professional: Professional;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditProfessionalDialog: React.FC<EditProfessionalDialogProps> = ({
  professional,
  open,
  onOpenChange
}) => {
  return (
    <ProfessionalFormDialog
      open={open}
      onOpenChange={onOpenChange}
      professional={professional}
      onProfessionalSaved={() => {
        onOpenChange(false);
        // The form dialog will handle the actual saving and refetching
      }}
    />
  );
};
