
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { StandardizedAppointmentService } from '@/services/appointments/standardizedAppointmentService';
import { toast } from 'sonner';
import { Calendar, Plus, Trash2 } from 'lucide-react';

interface TestDataHelperProps {
  onDataCreated?: () => void;
}

export function TestDataHelper({ onDataCreated }: TestDataHelperProps) {
  const [isCreating, setIsCreating] = useState(false);
  const { businessId } = useCurrentBusiness();
  const appointmentService = StandardizedAppointmentService.getInstance();

  const createSampleAppointments = async () => {
    if (!businessId) {
      toast.error('Nenhum negócio selecionado');
      return;
    }

    setIsCreating(true);
    
    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      const sampleAppointments = [
        {
          business_id: businessId,
          client_id: 'sample-client-1',
          professional_id: 'sample-professional-1', 
          service_id: 'sample-service-1',
          date: today.toISOString().split('T')[0],
          start_time: '09:00',
          end_time: '10:00',
          duration: 60,
          price: 50,
          status: 'scheduled' as const,
          notes: 'Agendamento de teste - hoje',
          payment_method: 'cash'
        },
        {
          business_id: businessId,
          client_id: 'sample-client-2',
          professional_id: 'sample-professional-1',
          service_id: 'sample-service-2', 
          date: today.toISOString().split('T')[0],
          start_time: '14:00',
          end_time: '15:30',
          duration: 90,
          price: 80,
          status: 'confirmed' as const,
          notes: 'Agendamento confirmado - hoje',
          payment_method: 'card'
        },
        {
          business_id: businessId,
          client_id: 'sample-client-3',
          professional_id: 'sample-professional-2',
          service_id: 'sample-service-1',
          date: tomorrow.toISOString().split('T')[0],
          start_time: '10:00',
          end_time: '11:00', 
          duration: 60,
          price: 45,
          status: 'scheduled' as const,
          notes: 'Agendamento de teste - amanhã',
          payment_method: 'pix'
        }
      ];

      console.log('Creating sample appointments:', sampleAppointments);
      
      for (const appointment of sampleAppointments) {
        await appointmentService.create(appointment);
      }
      
      toast.success('Dados de teste criados com sucesso!');
      
      if (onDataCreated) {
        onDataCreated();
      }
    } catch (error) {
      console.error('Error creating sample appointments:', error);
      toast.error('Erro ao criar dados de teste: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar size={20} />
          Dados de Teste do Calendário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Use este helper para criar agendamentos de exemplo e testar os indicadores do calendário.
          </p>
          
          <div className="flex gap-2">
            <Button 
              onClick={createSampleAppointments}
              disabled={isCreating || !businessId}
              className="gap-2"
            >
              <Plus size={16} />
              {isCreating ? 'Criando...' : 'Criar Dados de Teste'}
            </Button>
            
            {!businessId && (
              <p className="text-sm text-red-600 mt-2">
                Aguardando carregamento do negócio...
              </p>
            )}
          </div>
          
          <div className="bg-blue-50 p-3 rounded-md text-sm">
            <strong>O que será criado:</strong>
            <ul className="mt-2 space-y-1 text-xs">
              <li>• 2 agendamentos para hoje (um agendado, um confirmado)</li>
              <li>• 1 agendamento para amanhã (agendado)</li>
              <li>• Status diferentes para testar as cores dos indicadores</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
