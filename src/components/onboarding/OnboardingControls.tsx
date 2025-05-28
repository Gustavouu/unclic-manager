
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useOnboarding } from '@/contexts/onboarding/OnboardingContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface OnboardingControlsProps {
  currentStep?: string;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function OnboardingControls({ currentStep, onNext, onPrevious }: OnboardingControlsProps) {
  const { businessData, services, staffMembers: staff, businessHours } = useOnboarding();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCompleting, setIsCompleting] = useState(false);

  const calculateProgress = () => {
    let completed = 0;
    let total = 4;

    if (businessData.name) completed++;
    if (services.length > 0) completed++;
    if (staff.length > 0) completed++;
    if (Object.values(businessHours).some(day => day.open)) completed++;

    return (completed / total) * 100;
  };

  const completeOnboarding = async () => {
    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsCompleting(true);

    try {
      // Create business first - using the existing businesses table
      const businessId = crypto.randomUUID();
      
      const { error: businessError } = await supabase
        .from('businesses')
        .upsert({
          id: businessId,
          name: businessData.name,
          slug: businessData.name.toLowerCase().replace(/\s+/g, '-'),
          admin_email: user.email || '',
          description: businessData.description,
          phone: businessData.phone,
          address: businessData.address,
          city: businessData.city,
          state: businessData.state,
          zip_code: businessData.zipCode,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (businessError) {
        console.error('Error creating business:', businessError);
        toast.error('Erro ao criar negócio');
        return;
      }

      // Create categories for services
      if (services.length > 0) {
        const categoryId = crypto.randomUUID();
        const { error: categoriesError } = await supabase
          .from('categories')
          .insert({
            id: categoryId,
            business_id: businessId,
            name: 'Serviços Gerais',
            description: 'Categoria padrão para serviços',
            type: 'service',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (categoriesError) {
          console.error('Error creating categories:', categoriesError);
        }

        // Create services - using the services table structure from the database
        const serviceRecords = services.map(service => ({
          id: crypto.randomUUID(),
          business_id: businessId,
          name: service.name,
          description: service.description,
          duration: service.duration,
          price: service.price,
          category_id: categoryId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        // Use the correct table name that exists in the database
        const { error: servicesError } = await supabase
          .from('services_v2')
          .insert(serviceRecords);

        if (servicesError) {
          console.error('Error creating services:', servicesError);
          // Fallback to services table if services_v2 doesn't exist
          const { error: fallbackError } = await supabase
            .from('services')
            .insert(serviceRecords);
          
          if (fallbackError) {
            console.error('Error creating services (fallback):', fallbackError);
          }
        }
      }

      // Create staff members - using the employees table
      if (staff.length > 0) {
        const staffRecords = staff.map(member => ({
          id: crypto.randomUUID(),
          business_id: businessId,
          name: member.name,
          email: member.email,
          phone: member.phone,
          position: member.position,
          specialties: member.specialties,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        const { error: staffError } = await supabase
          .from('employees')
          .insert(staffRecords);

        if (staffError) {
          console.error('Error creating staff:', staffError);
        }
      }

      // Create business settings
      const { error: settingsError } = await supabase
        .from('business_settings')
        .insert({
          id: crypto.randomUUID(),
          business_id: businessId,
          allow_online_booking: true,
          minimum_notice_time: 30,
          maximum_days_in_advance: 30,
          require_advance_payment: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (settingsError) {
        console.error('Error creating settings:', settingsError);
      }

      toast.success('Configuração inicial concluída com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Erro ao finalizar configuração');
    } finally {
      setIsCompleting(false);
    }
  };

  const progress = calculateProgress();
  const isComplete = progress === 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progresso da Configuração</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Progresso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="space-y-2 text-sm">
          <div className={`flex items-center gap-2 ${businessData.name ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${businessData.name ? 'bg-green-600' : 'bg-gray-300'}`} />
            Informações do negócio
          </div>
          <div className={`flex items-center gap-2 ${services.length > 0 ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${services.length > 0 ? 'bg-green-600' : 'bg-gray-300'}`} />
            Serviços ({services.length})
          </div>
          <div className={`flex items-center gap-2 ${staff.length > 0 ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${staff.length > 0 ? 'bg-green-600' : 'bg-gray-300'}`} />
            Funcionários ({staff.length})
          </div>
          <div className={`flex items-center gap-2 ${Object.values(businessHours).some(day => day.open) ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${Object.values(businessHours).some(day => day.open) ? 'bg-green-600' : 'bg-gray-300'}`} />
            Horários de funcionamento
          </div>
        </div>

        <div className="flex gap-2">
          {onPrevious && (
            <Button variant="outline" onClick={onPrevious} className="flex-1">
              Anterior
            </Button>
          )}
          
          {onNext && !isComplete && (
            <Button onClick={onNext} className="flex-1">
              Próximo
            </Button>
          )}

          {isComplete && (
            <Button 
              onClick={completeOnboarding} 
              className="flex-1"
              disabled={isCompleting}
            >
              {isCompleting ? 'Finalizando...' : 'Finalizar Configuração'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
