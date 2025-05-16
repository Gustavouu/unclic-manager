
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';

export interface ProfessionalMetric {
  totalAppointments: number;
  completedAppointments: number;
  canceledAppointments: number;
  totalRevenue: number;
  averageRating: number;
  appointmentsPerDay: Record<string, number>;
  revenuePerMonth: Record<string, number>;
}

export const useProfessionalMetrics = () => {
  const [metrics, setMetrics] = useState<Record<string, ProfessionalMetric>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { businessId } = useTenant();
  
  const calculateMetrics = async (professionalId?: string, startDate?: string, endDate?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('agendamentos')
        .select('*')
        .eq('id_negocio', businessId);
      
      if (professionalId) {
        query = query.eq('id_profissional', professionalId);
      }
      
      if (startDate) {
        query = query.gte('data', startDate);
      }
      
      if (endDate) {
        query = query.lte('data', endDate);
      }
      
      const { data: appointments, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Group appointments by professional
      const groupedAppointments = appointments?.reduce<Record<string, any[]>>((acc, appointment) => {
        const profId = appointment.id_profissional;
        if (!acc[profId]) {
          acc[profId] = [];
        }
        acc[profId].push(appointment);
        return acc;
      }, {}) || {};
      
      // Calculate metrics for each professional
      const calculatedMetrics: Record<string, ProfessionalMetric> = {};
      
      Object.entries(groupedAppointments).forEach(([profId, profAppointments]) => {
        const completed = profAppointments.filter(a => a.status === 'concluido').length;
        const canceled = profAppointments.filter(a => a.status === 'cancelado').length;
        const revenue = profAppointments.reduce((sum, a) => sum + (a.valor || 0), 0);
        
        // Ratings calculation (if available)
        const appointmentsWithRatings = profAppointments.filter(a => a.avaliacao);
        const averageRating = appointmentsWithRatings.length > 0 
          ? appointmentsWithRatings.reduce((sum, a) => sum + a.avaliacao, 0) / appointmentsWithRatings.length
          : 0;
        
        // Appointments per day
        const apptPerDay = profAppointments.reduce<Record<string, number>>((days, a) => {
          const day = a.data;
          days[day] = (days[day] || 0) + 1;
          return days;
        }, {});
        
        // Revenue per month
        const revPerMonth = profAppointments.reduce<Record<string, number>>((months, a) => {
          const date = new Date(a.data);
          const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          months[month] = (months[month] || 0) + (a.valor || 0);
          return months;
        }, {});
        
        calculatedMetrics[profId] = {
          totalAppointments: profAppointments.length,
          completedAppointments: completed,
          canceledAppointments: canceled,
          totalRevenue: revenue,
          averageRating: averageRating,
          appointmentsPerDay: apptPerDay,
          revenuePerMonth: revPerMonth
        };
      });
      
      setMetrics(calculatedMetrics);
      return calculatedMetrics;
    } catch (err) {
      console.error('Error calculating professional metrics:', err);
      setError(err instanceof Error ? err : new Error('Failed to calculate professional metrics'));
      return {};
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    metrics,
    isLoading,
    error,
    calculateMetrics
  };
};
