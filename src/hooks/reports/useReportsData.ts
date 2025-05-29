
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
  
  const { businessId } = useTenant();

  useEffect(() => {
    const fetchReportsData = async () => {
      if (!businessId) {
        setData(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        setData(prev => ({ ...prev, isLoading: true, error: null }));

        // For now, we'll return mock data since the financial_transactions table might not have proper data
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

  return data;
};
