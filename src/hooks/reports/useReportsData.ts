
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAppointments } from "@/hooks/appointments/useAppointments";
import { format, startOfMonth, endOfMonth, subMonths, isSameMonth, isBefore, isAfter } from "date-fns";

export interface ReportStatistics {
  totalAppointments: number;
  completedAppointments: number;
  canceledAppointments: number;
  averagePrice: number;
  totalRevenue: number;
  averageDuration: number;
  occupancyRate: number;
  totalClients: number;
  newClientsCount: number;
  returningClientsCount: number;
  retentionRate: number;
  servicePopularity: Array<{ name: string; count: number }>;
  professionalProductivity: Array<{ name: string; count: number }>;
  professionalRevenue: Array<{ name: string; revenue: number }>;
  paymentMethods: Array<{ name: string; valor: number }>;
  monthlyRevenue: Array<{ name: string; receita: number; despesa: number }>;
}

export function useReportsData(dateRange: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ReportStatistics>({
    totalAppointments: 0,
    completedAppointments: 0,
    canceledAppointments: 0,
    averagePrice: 0,
    totalRevenue: 0,
    averageDuration: 0,
    occupancyRate: 0,
    totalClients: 0,
    newClientsCount: 0,
    returningClientsCount: 0,
    retentionRate: 0,
    servicePopularity: [],
    professionalProductivity: [],
    professionalRevenue: [],
    paymentMethods: [],
    monthlyRevenue: []
  });

  const { appointments, isLoading: appointmentsLoading } = useAppointments();

  useEffect(() => {
    async function fetchReportData() {
      if (appointmentsLoading) return;
      
      setIsLoading(true);
      try {
        // Get date range for filtering
        const today = new Date();
        let startDate: Date, endDate: Date;
        
        switch (dateRange) {
          case 'last7days':
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 7);
            endDate = today;
            break;
          case 'last30days':
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 30);
            endDate = today;
            break;
          case 'last90days':
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 90);
            endDate = today;
            break;
          case 'lastMonth':
            startDate = startOfMonth(subMonths(today, 1));
            endDate = endOfMonth(subMonths(today, 1));
            break;
          case 'currentMonth':
          default:
            startDate = startOfMonth(today);
            endDate = endOfMonth(today);
            break;
        }
        
        // Filter appointments based on date range
        const filteredAppointments = appointments.filter(app => {
          const appDate = new Date(app.date);
          return isAfter(appDate, startDate) && isBefore(appDate, endDate);
        });
        
        // Calculate service statistics
        const totalAppointments = filteredAppointments.length;
        const completedAppointments = filteredAppointments.filter(app => app.status === "concluído").length;
        const canceledAppointments = filteredAppointments.filter(app => app.status === "cancelado").length;
        
        const prices = filteredAppointments.map(app => app.price);
        const totalRevenue = prices.reduce((sum, price) => sum + price, 0);
        const averagePrice = totalAppointments > 0 ? totalRevenue / totalAppointments : 0;
        
        const durations = filteredAppointments.map(app => app.duration);
        const averageDuration = totalAppointments > 0 ? 
          durations.reduce((sum, duration) => sum + duration, 0) / totalAppointments : 0;
        
        // Calculate occupancy rate (simplified estimation)
        const occupancyRate = Math.min(85, Math.round((totalAppointments / (30 * 8)) * 100)); // Simplified calculation
        
        // Calculate client statistics
        const clientIds = new Set(filteredAppointments.map(app => app.clientId));
        const totalClients = clientIds.size;
        
        // Fetch additional client data for "new clients" calculation
        let clientsWithDates: { id: string, createdAt: string }[] = [];
        if (totalClients > 0) {
          const { data: clientData } = await supabase
            .from('clientes')
            .select('id, criado_em')
            .in('id', Array.from(clientIds));
          
          if (clientData) {
            clientsWithDates = clientData;
          }
        }
        
        // Calculate new clients in this period
        const newClientsCount = clientsWithDates.filter(client => 
          isAfter(new Date(client.createdAt), startDate) && 
          isBefore(new Date(client.createdAt), endDate)
        ).length;
        
        const returningClientsCount = totalClients - newClientsCount;
        const retentionRate = totalClients > 0 ? (returningClientsCount / totalClients) * 100 : 0;
        
        // Calculate service popularity
        const serviceCount: Record<string, number> = {};
        filteredAppointments.forEach(app => {
          serviceCount[app.serviceName] = (serviceCount[app.serviceName] || 0) + 1;
        });
        
        const servicePopularity = Object.entries(serviceCount)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        // Calculate professional statistics
        const professionalData: Record<string, { count: number, revenue: number }> = {};
        
        for (const app of filteredAppointments) {
          if (!app.professionalId) continue;
          
          // Fetch professional name if not available in appointment
          let profName = "Profissional";
          if (app.professionalId) {
            const { data } = await supabase
              .from('funcionarios')
              .select('nome')
              .eq('id', app.professionalId)
              .single();
            
            if (data) {
              profName = data.nome;
            }
          }
          
          if (!professionalData[profName]) {
            professionalData[profName] = { count: 0, revenue: 0 };
          }
          
          professionalData[profName].count += 1;
          professionalData[profName].revenue += app.price;
        }
        
        const professionalProductivity = Object.entries(professionalData)
          .map(([name, data]) => ({ name, count: data.count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        const professionalRevenue = Object.entries(professionalData)
          .map(([name, data]) => ({ name, revenue: data.revenue }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);
        
        // Calculate payment methods distribution
        const paymentMethods: Record<string, number> = {
          'Cartão de Crédito': 0, 
          'Cartão de Débito': 0, 
          'Dinheiro': 0, 
          'Pix': 0, 
          'Outros': 0
        };
        
        filteredAppointments.forEach(app => {
          const method = app.paymentMethod || 'Outros';
          
          if (method.toLowerCase().includes('crédito')) {
            paymentMethods['Cartão de Crédito'] += 1;
          } else if (method.toLowerCase().includes('débito')) {
            paymentMethods['Cartão de Débito'] += 1;
          } else if (method.toLowerCase().includes('dinheiro')) {
            paymentMethods['Dinheiro'] += 1;
          } else if (method.toLowerCase().includes('pix')) {
            paymentMethods['Pix'] += 1;
          } else {
            paymentMethods['Outros'] += 1;
          }
        });
        
        const totalPayments = Object.values(paymentMethods).reduce((sum, count) => sum + count, 0);
        
        const paymentMethodsData = Object.entries(paymentMethods)
          .map(([name, count]) => ({ 
            name, 
            valor: totalPayments > 0 ? Math.round((count / totalPayments) * 100) : 0 
          }));
        
        // Calculate monthly revenue (simplified)
        // For a real implementation, we would fetch transaction data from the database
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
        const monthlyRevenue = monthNames.map(name => {
          // Simplified calculation - in real app we would query transactions table
          const monthIndex = monthNames.indexOf(name);
          const monthDate = new Date(today.getFullYear(), monthIndex, 1);
          
          const monthRevenue = filteredAppointments
            .filter(app => isSameMonth(new Date(app.date), monthDate))
            .reduce((sum, app) => sum + app.price, 0);
          
          // Generate random expenses that are about 40-60% of revenue for demo
          const randomFactor = 0.4 + Math.random() * 0.2;
          const monthExpense = Math.round(monthRevenue * randomFactor);
          
          return {
            name,
            receita: monthRevenue,
            despesa: monthExpense
          };
        });
        
        // Update state with calculated statistics
        setStats({
          totalAppointments,
          completedAppointments,
          canceledAppointments,
          averagePrice,
          totalRevenue,
          averageDuration,
          occupancyRate,
          totalClients,
          newClientsCount,
          returningClientsCount,
          retentionRate,
          servicePopularity,
          professionalProductivity,
          professionalRevenue,
          paymentMethods: paymentMethodsData,
          monthlyRevenue
        });
      } catch (err) {
        console.error("Error calculating report statistics:", err);
        setError("Não foi possível calcular as estatísticas");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchReportData();
  }, [appointments, appointmentsLoading, dateRange]);
  
  return { stats, isLoading, error };
}
