
import React from 'react';
import { DashboardMetricsUnified } from '@/components/dashboard/DashboardMetricsUnified';
import { DashboardChartsUnified } from '@/components/dashboard/DashboardChartsUnified';
import { useDashboardMetrics } from '@/hooks/dashboard/useDashboardMetrics';

export default function DashboardEnhanced() {
  const { metrics, revenueData, popularServices, isLoading, error } = useDashboardMetrics();

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Erro ao carregar dashboard</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Aprimorado</h1>
        <p className="text-gray-600">Visão completa das métricas do seu negócio</p>
      </div>

      <DashboardMetricsUnified />
      
      <DashboardChartsUnified />

      {isLoading && (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
}
