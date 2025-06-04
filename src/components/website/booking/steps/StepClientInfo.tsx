
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useClientsDashboard } from '@/hooks/clients/useClientsDashboard';

interface StepClientInfoProps {
  onNext: (clientData: any) => void;
  onBack: () => void;
  initialData?: any;
  bookingData?: any;
  onUpdateBookingData?: (data: any) => void;
}

export const StepClientInfo: React.FC<StepClientInfoProps> = ({
  onNext,
  onBack,
  initialData = {},
  bookingData,
  onUpdateBookingData
}) => {
  const { findClientByEmail } = useClientsDashboard();
  const [formData, setFormData] = useState({
    name: bookingData?.clientName || initialData.name || '',
    email: bookingData?.clientEmail || initialData.email || '',
    phone: bookingData?.clientPhone || initialData.phone || '',
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Check if client exists
      const existingClient = await findClientByEmail(formData.email);
      
      // Update booking data if handler is available
      if (onUpdateBookingData) {
        onUpdateBookingData({
          clientName: formData.name,
          clientEmail: formData.email,
          clientPhone: formData.phone,
          clientId: existingClient?.id
        });
      }
      
      onNext({
        ...formData,
        existingClientId: existingClient?.id
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Suas Informações</h2>
        <p className="text-gray-600">Preencha seus dados para o agendamento</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Seu nome completo"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="seu@email.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="(11) 99999-9999"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button type="submit">
            Continuar
          </Button>
        </div>
      </form>
    </div>
  );
};
