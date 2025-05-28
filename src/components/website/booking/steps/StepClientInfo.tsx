
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ClientFormData } from '@/types/client';
import { useClients } from '@/hooks/useClients';

const clientSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }).optional(),
  phone: z.string().optional(),
});

interface StepClientInfoProps {
  onNext: (data: any) => void; 
  onBack?: () => void;
  bookingData: any;
  onUpdateBookingData: (data: any) => void;
}

export const StepClientInfo: React.FC<StepClientInfoProps> = ({ 
  onNext, 
  onBack,
  bookingData,
  onUpdateBookingData 
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });
  const { findClientByEmail } = useClients();
  const [existingClient, setExistingClient] = useState<ClientFormData | null>(null);

  const onSubmit = async (data: ClientFormData) => {
    if (data.email) {
      try {
        const client = await findClientByEmail(data.email);
        if (client) {
          setExistingClient(client);
        }
      } catch (error) {
        console.error("Error finding client:", error);
      }
    }
    
    // Update booking data
    onUpdateBookingData({
      clientName: data.name,
      clientEmail: data.email,
      clientPhone: data.phone
    });
    
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome completo</Label>
        <Input id="name" type="text" {...register('name')} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="phone">Telefone</Label>
        <Input id="phone" type="tel" {...register('phone')} />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
      </div>
      
      <div className="flex justify-between pt-4">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            Voltar
          </Button>
        )}
        <Button type="submit" className={onBack ? "" : "w-full"}>
          Próximo
        </Button>
      </div>
    </form>
  );
};
