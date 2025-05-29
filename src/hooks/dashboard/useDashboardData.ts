
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";

export interface DashboardMetrics {
  totalAppointments: number;
  totalRevenue: number;
  newClients: number;
  completionRate: number;
  popularServices: Array<{ name: string; count: number }>;
  peakHours: Array<{ hour: number; count: number }>;
}

export const useDashboardData = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalAppointments: 0,
    totalRevenue: 0,
    newClients: 0,
    completionRate: 0,
    popularServices: [],
    peakHours: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!businessId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Use the bookings table for appointments
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('business_id', businessId);

        if (bookingsError) {
          console.warn('Error fetching from bookings:', bookingsError);
        }

        // Use the clients table for new clients
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('*')
          .eq('business_id', businessId);

        if (clientsError) {
          console.warn('Error fetching from clients:', clientsError);
        }

        // Calculate metrics from available data
        const appointments = bookingsData || [];
        const clients = clientsData || [];

        const totalAppointments = appointments.length;
        const completedAppointments = appointments.filter(app => app.status === 'completed').length;
        const totalRevenue = appointments.reduce((sum, app) => sum + (app.price || 0), 0);
        const completionRate = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0;

        // Calculate new clients (clients created in the last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newClients = clients.filter(client => 
          new Date(client.created_at || client.criado_em) >= thirtyDaysAgo
        ).length;

        setMetrics({
          totalAppointments,
          totalRevenue,
          newClients,
          completionRate,
          popularServices: [], // Will be populated when services data is available
          peakHours: [] // Will be populated when we have more appointment data
        });

      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [businessId]);

  return {
    metrics,
    isLoading,
    error,
    refreshData: () => {
      if (businessId) {
        // Re-trigger the effect
        setIsLoading(true);
      }
    }
  };
};
