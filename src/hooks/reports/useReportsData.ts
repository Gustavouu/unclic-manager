import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentBusiness } from "../useCurrentBusiness";

export interface ReportStatistics {
  totalRevenue: number;
  appointmentsCount: number;
  clientsCount: number;
  completionRate: number;
}

export const useReportsData = (dateRange: string) => {
  const [stats, setStats] = useState<ReportStatistics>({
    totalRevenue: 0,
    appointmentsCount: 0,
    clientsCount: 0,
    completionRate: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useCurrentBusiness();

  useEffect(() => {
    const fetchReportsData = async () => {
      setIsLoading(true);
      setError(null);

      if (!businessId) {
        setError("Business ID is not available.");
        setIsLoading(false);
        return;
      }

      const today = new Date();
      let startDate: Date;

      switch (dateRange) {
        case "last7days":
          startDate = new Date(today.setDate(today.getDate() - 7));
          break;
        case "last30days":
          startDate = new Date(today.setDate(today.getDate() - 30));
          break;
        case "last90days":
          startDate = new Date(today.setDate(today.getDate() - 90));
          break;
        case "thisYear":
          startDate = new Date(today.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(today.setDate(today.getDate() - 30));
      }

      try {
        // Fetch total revenue
        const { data: revenueData, error: revenueError } = await supabase
          .from('appointments')
          .select('price')
          .eq('businessId', businessId)
          .gte('date', startDate.toISOString());

        if (revenueError) throw revenueError;

        const totalRevenue = revenueData?.reduce((acc, curr) => acc + curr.price, 0) || 0;

        // Fetch appointments count
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select('id')
          .eq('businessId', businessId)
          .gte('date', startDate.toISOString());

        if (appointmentsError) throw appointmentsError;

        const appointmentsCount = appointmentsData?.length || 0;

         // Fetch completed appointments count
         const { data: completedAppointmentsData, error: completedAppointmentsError } = await supabase
         .from('appointments')
         .select('id')
         .eq('businessId', businessId)
         .eq('status', 'concluido')
         .gte('date', startDate.toISOString());

       if (completedAppointmentsError) throw completedAppointmentsError;

       const completedAppointments = completedAppointmentsData?.length || 0;

        // Fetch clients count (unique clients)
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('id')
          .eq('business_id', businessId)
          .gte('criado_em', startDate.toISOString());

        if (clientsError) throw clientsError;

        const clientsCount = clientsData?.length || 0;

        const completionRate = appointmentsCount > 0 ? (completedAppointments / appointmentsCount) * 100 : 0;

        setStats({
          totalRevenue,
          appointmentsCount,
          clientsCount,
          completionRate,
        });
      } catch (err: any) {
        setError(err.message || "Failed to fetch reports data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportsData();
  }, [dateRange, businessId]);

  return { stats, isLoading, error };
};
