
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';

// Define proper types for reports
export interface FinancialTransaction {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  status: "PENDING" | "PAID" | "CANCELLED" | "PARTIAL";
  paymentMethod: "OTHER" | "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "BANK_TRANSFER" | "PIX" | "BOLETO" | "ONLINE";
  paymentDate: string;
  createdAt: string;
}

export interface ServicePerformance {
  serviceName: string;
  totalRevenue: number;
  totalBookings: number;
  averagePrice: number;
  popularityRank: number;
}

export interface ProfessionalPerformance {
  professionalName: string;
  totalRevenue: number;
  totalBookings: number;
  averageRating: number;
  commissionEarned: number;
}

export interface ClientAnalytics {
  totalClients: number;
  newClientsThisMonth: number;
  returningClients: number;
  averageLifetimeValue: number;
}

export interface ReportStatistics {
  totalRevenue: number;
  totalExpenses: number;
  totalAppointments: number;
  totalClients: number;
  newClientsCount: number;
  completedAppointments: number;
  retentionRate: number;
  averageDuration: number;
  averagePrice: number;
  occupancyRate: number;
  monthlyRevenue: Array<{ name: string; receita: number; despesa: number }>;
  paymentMethods: Array<{ name: string; valor: number }>;
  servicePopularity: Array<{ name: string; count: number }>;
  professionalProductivity: Array<{ name: string; count: number }>;
  professionalRevenue: Array<{ name: string; revenue: number }>;
}

export interface ReportsData {
  transactions: FinancialTransaction[];
  servicePerformance: ServicePerformance[];
  professionalPerformance: ProfessionalPerformance[];
  clientAnalytics: ClientAnalytics;
  isLoading: boolean;
  error: string | null;
}

export const useReportsData = (startDate?: Date, endDate?: Date) => {
  const [data, setData] = useState<ReportsData>({
    transactions: [],
    servicePerformance: [],
    professionalPerformance: [],
    clientAnalytics: {
      totalClients: 0,
      newClientsThisMonth: 0,
      returningClients: 0,
      averageLifetimeValue: 0,
    },
    isLoading: true,
    error: null,
  });

  const [stats, setStats] = useState<ReportStatistics>({
    totalRevenue: 0,
    totalExpenses: 0,
    totalAppointments: 0,
    totalClients: 0,
    newClientsCount: 0,
    completedAppointments: 0,
    retentionRate: 0,
    averageDuration: 45,
    averagePrice: 0,
    occupancyRate: 75,
    monthlyRevenue: [
      { name: 'Jan', receita: 4500, despesa: 2000 },
      { name: 'Fev', receita: 5200, despesa: 2100 },
      { name: 'Mar', receita: 4800, despesa: 1900 },
      { name: 'Abr', receita: 6100, despesa: 2300 },
      { name: 'Mai', receita: 5700, despesa: 2200 },
      { name: 'Jun', receita: 6800, despesa: 2400 },
    ],
    paymentMethods: [
      { name: 'Dinheiro', valor: 35 },
      { name: 'Cartão de Crédito', valor: 40 },
      { name: 'PIX', valor: 20 },
      { name: 'Cartão de Débito', valor: 5 },
    ],
    servicePopularity: [
      { name: 'Corte de Cabelo', count: 45 },
      { name: 'Barba', count: 32 },
      { name: 'Corte + Barba', count: 28 },
      { name: 'Coloração', count: 15 },
    ],
    professionalProductivity: [
      { name: 'João Silva', count: 42 },
      { name: 'Maria Santos', count: 38 },
      { name: 'Pedro Costa', count: 35 },
    ],
    professionalRevenue: [
      { name: 'João Silva', revenue: 3200 },
      { name: 'Maria Santos', revenue: 2800 },
      { name: 'Pedro Costa', revenue: 2400 },
    ],
  });
  
  const { businessId } = useTenant();

  useEffect(() => {
    const fetchReportsData = async () => {
      if (!businessId) {
        setData(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        setData(prev => ({ ...prev, isLoading: true, error: null }));

        // Mock data with calculated stats
        const mockTransactions: FinancialTransaction[] = [
          {
            id: '1',
            amount: 150.00,
            type: "INCOME",
            status: "PAID",
            paymentMethod: "CASH",
            paymentDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            amount: 250.00,
            type: "INCOME",
            status: "PAID",
            paymentMethod: "CREDIT_CARD",
            paymentDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          },
        ];

        const mockServicePerformance: ServicePerformance[] = [
          {
            serviceName: "Corte de Cabelo",
            totalRevenue: 1500,
            totalBookings: 20,
            averagePrice: 75,
            popularityRank: 1,
          },
          {
            serviceName: "Barba",
            totalRevenue: 800,
            totalBookings: 16,
            averagePrice: 50,
            popularityRank: 2,
          },
        ];

        const mockProfessionalPerformance: ProfessionalPerformance[] = [
          {
            professionalName: "João Silva",
            totalRevenue: 2000,
            totalBookings: 25,
            averageRating: 4.8,
            commissionEarned: 400,
          },
        ];

        const mockClientAnalytics: ClientAnalytics = {
          totalClients: 50,
          newClientsThisMonth: 12,
          returningClients: 38,
          averageLifetimeValue: 300,
        };

        // Update stats with calculated values
        setStats(prev => ({
          ...prev,
          totalRevenue: 32580,
          totalExpenses: 12450,
          totalAppointments: 120,
          totalClients: 50,
          newClientsCount: 12,
          completedAppointments: 110,
          retentionRate: 76,
          averagePrice: 85,
        }));

        setData({
          transactions: mockTransactions,
          servicePerformance: mockServicePerformance,
          professionalPerformance: mockProfessionalPerformance,
          clientAnalytics: mockClientAnalytics,
          isLoading: false,
          error: null,
        });

      } catch (error: any) {
        console.error('Error fetching reports data:', error);
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: error.message,
        }));
      }
    };

    fetchReportsData();
  }, [businessId, startDate, endDate]);

  return { ...data, stats };
};
