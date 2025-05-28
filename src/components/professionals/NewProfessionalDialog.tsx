
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface NewProfessionalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewProfessionalDialog: React.FC<NewProfessionalDialogProps> = ({
  open,
  onOpenChange
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Profissional</DialogTitle>
          <DialogDescription>
            Adicione um novo profissional ao sistema.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <p>Componente em desenvolvimento.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
