
import React from 'react';
import { OnboardingRedirect } from '@/components/auth/OnboardingRedirect';
import { AdvancedReportsPage } from '@/components/reports/AdvancedReportsPage';

const Reports = () => {
  return (
    <OnboardingRedirect>
      <div className="container mx-auto py-6 px-4">
        <AdvancedReportsPage />
      </div>
    </OnboardingRedirect>
  );
};

export default Reports;
