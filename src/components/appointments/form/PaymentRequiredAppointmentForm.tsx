
import React from 'react';
import { Button } from "@/components/ui/button";

export interface PaymentRequiredAppointmentFormProps {
  clientId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess: () => void;
  availableServices: any[];
  availableStaff: any[];
}

const PaymentRequiredAppointmentForm: React.FC<PaymentRequiredAppointmentFormProps> = ({
  clientId,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  availableServices,
  availableStaff
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Formulário de Agendamento</h3>
      <div className="space-y-2">
        <p><strong>Cliente:</strong> {customerName}</p>
        {customerEmail && <p><strong>Email:</strong> {customerEmail}</p>}
        {customerPhone && <p><strong>Telefone:</strong> {customerPhone}</p>}
        {clientId && <p><strong>ID:</strong> {clientId}</p>}
      </div>
      <div className="space-y-2">
        <p><strong>Serviços disponíveis:</strong> {availableServices.length}</p>
        <p><strong>Profissionais disponíveis:</strong> {availableStaff.length}</p>
      </div>
      <Button onClick={onSuccess} className="w-full">
        Confirmar Agendamento
      </Button>
    </div>
  );
};

export default PaymentRequiredAppointmentForm;
