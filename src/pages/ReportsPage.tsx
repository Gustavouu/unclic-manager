
import React from 'react';
import { OnboardingRedirect } from '@/components/auth/OnboardingRedirect';
import { RealTimeReportsPage } from '@/components/reports/RealTimeReportsPage';

const ReportsPage: React.FC = () => {
  return (
    <OnboardingRedirect>
      <RealTimeReportsPage />
    </OnboardingRedirect>
  );
};

export default ReportsPage;
