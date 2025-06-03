
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ServiceSelectWrapperProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

export const ServiceSelectWrapper: React.FC<ServiceSelectWrapperProps> = ({
  value,
  onValueChange,
  placeholder = "Selecione um serviço"
}) => {
  // Temporary placeholder services until we implement proper service management
  const services = [
    { id: '1', name: 'Corte de Cabelo', price: 30 },
    { id: '2', name: 'Barba', price: 20 },
    { id: '3', name: 'Sobrancelha', price: 15 },
  ];

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {services.map((service) => (
          <SelectItem key={service.id} value={service.id}>
            {service.name} - R$ {service.price}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
