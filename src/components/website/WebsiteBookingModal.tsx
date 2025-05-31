
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BusinessData, SimpleService, SimpleStaff } from '@/hooks/useBusinessWebsite';

export interface WebsiteBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessData;
  services: SimpleService[];
  staff: SimpleStaff[];
}

export function WebsiteBookingModal({ isOpen, onClose, business, services, staff }: WebsiteBookingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Agendar Horário</DialogTitle>
          <DialogDescription>
            Complete o formulário abaixo para agendar seu horário com {business.name}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-center text-gray-500 mb-4">
            Funcionalidade em desenvolvimento. Em breve você poderá fazer seu agendamento por aqui!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
