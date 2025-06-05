
import React from 'react';
import { OnboardingRedirect } from '@/components/auth/OnboardingRedirect';
import { AdvancedReportsPage } from '@/components/reports/AdvancedReportsPage';

const ReportsPage: React.FC = () => {
  return (
    <OnboardingRedirect>
      <AdvancedReportsPage />
    </OnboardingRedirect>
  );
};

export default ReportsPage;
