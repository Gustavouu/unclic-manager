import React from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { DashboardInsights } from '@/components/dashboard/DashboardInsights';
import { MainLayout } from '@/components/layout/MainLayout';

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <DashboardHeader />
        <DashboardOverview />
        <DashboardInsights stats={null} /> {/* Passe os dados reais se disponíveis */}
      </div>
    </MainLayout>
  );
}
