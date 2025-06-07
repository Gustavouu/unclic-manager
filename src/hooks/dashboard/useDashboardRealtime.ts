
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';

interface DashboardRealtimeData {
  totalAppointments: number;
  totalRevenue: number;
  newClientsCount: number;
  isLoading: boolean;
  error: string | null;
}

export const useDashboardRealtime = () => {
  const [data, setData] = useState<DashboardRealtimeData>({
    totalAppointments: 0,
    totalRevenue: 0,
    newClientsCount: 0,
    isLoading: true,
    error: null
  });
  const { businessId } = useTenant();

  useEffect(() => {
    if (!businessId) {
      setData(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const fetchData = async () => {
      try {
        console.log('Fetching dashboard data for business:', businessId);

        // Use the existing bookings table for appointments with improved error handling
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('business_id', businessId);

        if (bookingsError) {
          console.warn('Error fetching bookings:', bookingsError);
        }

        // Use the existing clients table for client count with improved error handling
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('*')
          .eq('business_id', businessId);

        if (clientsError) {
          console.warn('Error fetching clients:', clientsError);
        }

        const appointments = bookingsData || [];
        const clients = clientsData || [];

        const totalAppointments = appointments.length;
        const totalRevenue = appointments.reduce((sum, app) => sum + (app.price || 0), 0);

        // Calculate new clients (created in the last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newClientsCount = clients.filter(client => 
          new Date(client.created_at) >= thirtyDaysAgo
        ).length;

        setData({
          totalAppointments,
          totalRevenue,
          newClientsCount,
          isLoading: false,
          error: null
        });

        console.log('Dashboard data loaded successfully:', {
          totalAppointments,
          totalRevenue,
          newClientsCount
        });

      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: err.message
        }));
      }
    };

    fetchData();

    // Set up real-time subscription for bookings
    const bookingsChannel = supabase
      .channel('bookings-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookings',
          filter: `business_id=eq.${businessId}`
        }, 
        () => {
          console.log('Bookings data changed, refetching dashboard data');
          fetchData();
        }
      )
      .subscribe();

    // Set up real-time subscription for clients
    const clientsChannel = supabase
      .channel('clients-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'clients',
          filter: `business_id=eq.${businessId}`
        }, 
        () => {
          console.log('Clients data changed, refetching dashboard data');
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(bookingsChannel);
      supabase.removeChannel(clientsChannel);
    };
  }, [businessId]);

  return data;
};
