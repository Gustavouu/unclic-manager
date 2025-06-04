
import { useMemo } from 'react';
import { useClientsData } from './useClientsData';
import type { Client } from '@/types/client';

interface ClientAnalytics {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  newClientsThisMonth: number;
  totalRevenue: number;
  averageSpending: number;
  topSpenders: Client[];
  clientsNeedingAttention: Client[];
  clientsByCity: Record<string, number>;
  clientsByGender: Record<string, number>;
  retentionMetrics: {
    visitedLastMonth: number;
    visitedLast3Months: number;
    visitedLast6Months: number;
  };
}

export const useClientAnalytics = (): ClientAnalytics => {
  const { clients } = useClientsData();

  return useMemo(() => {
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());

    const totalClients = clients.length;
    const activeClients = clients.filter(client => client.status === 'active').length;
    const inactiveClients = totalClients - activeClients;

    const newClientsThisMonth = clients.filter(client => {
      if (!client.created_at) return false;
      return new Date(client.created_at) >= oneMonthAgo;
    }).length;

    const totalRevenue = clients.reduce((sum, client) => sum + (client.total_spent || 0), 0);
    const averageSpending = totalClients > 0 ? totalRevenue / totalClients : 0;

    const topSpenders = [...clients]
      .sort((a, b) => (b.total_spent || 0) - (a.total_spent || 0))
      .slice(0, 5);

    const clientsNeedingAttention = clients.filter(client => {
      const lastVisit = client.last_visit ? new Date(client.last_visit) : null;
      return !lastVisit || lastVisit < threeMonthsAgo;
    });

    const clientsByCity = clients.reduce((acc, client) => {
      const city = client.city || 'Não informado';
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const clientsByGender = clients.reduce((acc, client) => {
      const gender = client.gender || 'Não informado';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const visitedLastMonth = clients.filter(client => {
      const lastVisit = client.last_visit ? new Date(client.last_visit) : null;
      return lastVisit && lastVisit >= oneMonthAgo;
    }).length;

    const visitedLast3Months = clients.filter(client => {
      const lastVisit = client.last_visit ? new Date(client.last_visit) : null;
      return lastVisit && lastVisit >= threeMonthsAgo;
    }).length;

    const visitedLast6Months = clients.filter(client => {
      const lastVisit = client.last_visit ? new Date(client.last_visit) : null;
      return lastVisit && lastVisit >= sixMonthsAgo;
    }).length;

    return {
      totalClients,
      activeClients,
      inactiveClients,
      newClientsThisMonth,
      totalRevenue,
      averageSpending,
      topSpenders,
      clientsNeedingAttention,
      clientsByCity,
      clientsByGender,
      retentionMetrics: {
        visitedLastMonth,
        visitedLast3Months,
        visitedLast6Months,
      },
    };
  }, [clients]);
};
